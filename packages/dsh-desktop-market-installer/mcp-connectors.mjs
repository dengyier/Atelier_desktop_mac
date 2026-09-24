import { lstat, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import YAML from 'yaml'

export const MCP_CONNECTOR_PATH = '/dsh-desktop/mcp-connectors'

export const CONNECTOR_IDS = new Set([
  'openMuseum', 'blender', 'travelArt', 'photopea', 'metMuseum', 'build123d',
  'figwright', 'brandkit', 'excalidraw', 'motionlint', 'flowzap', 'saglitz'
])

export const RECIPES = {
  openMuseum: { transport: 'stdio', command: 'npx', args: ['-y', 'open-museum-mcp'] },
  travelArt: { transport: 'streamable-http', url: 'https://mcp.travel.art/' },
  metMuseum: { transport: 'stdio', command: 'npx', args: ['-y', 'metmuseum-mcp'] }
}

export function presetPath(home) {
  return join(home, '.agent-presets', 'atelier', 'agent.cordis.yml')
}

function serverName(id) {
  return id.replace(/[A-Z]/gu, (letter) => `-${letter.toLowerCase()}`)
}

function readDocument(source) {
  const document = YAML.parseDocument(source, {
    customTags: [{ tag: 'tag:yaml.org,2002:js', resolve: (value) => value }]
  })
  if (document.errors.length || !YAML.isSeq(document.contents)) {
    throw new Error('The Atelier preset has an invalid composition; no connector was changed.')
  }
  return document
}

function entries(document) {
  return document.toJS().filter((entry) => entry && typeof entry === 'object')
}

export function connectorState(source) {
  const rows = entries(readDocument(source))
  return Object.fromEntries([...CONNECTOR_IDS].map((id) => [id, rows.some((row) =>
    row.name === '@deepseek-ai/dsh-mcp-client' && row.config?.serverName === serverName(id)
  )]))
}

export function validateConnector(input) {
  if (!input || !CONNECTOR_IDS.has(input.id)) throw new Error('Unknown MCP connector.')
  const value = input.config ?? RECIPES[input.id]
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('This connector needs a command or URL from its project setup instructions.')
  }
  if (value.transport === 'stdio') {
    if (typeof value.command !== 'string' || !value.command.trim() || value.command.length > 256 || /[\r\n]/u.test(value.command)) {
      throw new Error('Enter a valid executable command.')
    }
    if (!Array.isArray(value.args) || value.args.length > 32 || value.args.some((arg) => typeof arg !== 'string' || arg.length > 1024 || /[\r\n]/u.test(arg))) {
      throw new Error('Arguments must be a JSON array of strings.')
    }
    return { serverName: serverName(input.id), transport: 'stdio', command: value.command.trim(), args: value.args }
  }
  if (value.transport === 'streamable-http') {
    if (typeof value.url !== 'string' || value.url.length > 2048) throw new Error('Enter a valid MCP URL.')
    const url = new URL(value.url)
    if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) {
      throw new Error('MCP URL must use HTTPS or local HTTP.')
    }
    if (url.username || url.password) throw new Error('Credentials in MCP URLs are not supported.')
    return { serverName: serverName(input.id), transport: 'streamable-http', url: value.url }
  }
  throw new Error('Choose stdio or Streamable HTTP transport.')
}

export async function readConnectorState(home) {
  const path = presetPath(home)
  const stat = await lstat(path)
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('The Atelier preset composition is not a regular file.')
  return connectorState(await readFile(path, 'utf8'))
}

export async function installConnector(home, input) {
  const config = validateConnector(input)
  const path = presetPath(home)
  const stat = await lstat(path)
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('The Atelier preset composition is not a regular file.')
  const source = await readFile(path, 'utf8')
  const document = readDocument(source)
  const rows = entries(document)
  if (rows.some((row) => row.id === `mcp-${config.serverName}` ||
      (row.name === '@deepseek-ai/dsh-mcp-client' && row.config?.serverName === config.serverName))) {
    return { installed: true, alreadyPresent: true }
  }
  document.add({ id: `mcp-${config.serverName}`, name: '@deepseek-ai/dsh-mcp-client', config: { ...config, failOnStartupError: false } })
  const temporary = `${path}.atelier-mcp-${process.pid}-${Date.now()}.tmp`
  try {
    await writeFile(temporary, String(document), { mode: stat.mode })
    await rename(temporary, path)
  } finally {
    await rm(temporary, { force: true }).catch(() => undefined)
  }
  return { installed: true, alreadyPresent: false }
}
