import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { connectorState, installConnector, presetPath, readConnectorState, validateConnector } from '../packages/dsh-desktop-market-installer/mcp-connectors.mjs'

const homes: string[] = []
afterEach(async () => { await Promise.all(homes.splice(0).map((home) => rm(home, { recursive: true, force: true }))) })

async function fixture(source = "- id: original\n  name: '@deepseek-ai/dsh-mcp-client'\n  config:\n    serverName: blender\n    transport: stdio\n    command: uvx\n    args: ['mcp-for-blender']\n- id: skill\n  name: skill\n  config:\n    path: !!js process.env.SKILL_PATH\n") {
  const home = await mkdtemp(join(tmpdir(), 'atelier-mcp-'))
  homes.push(home)
  const path = presetPath(home)
  await mkdir(join(home, '.agent-presets', 'atelier'), { recursive: true })
  await writeFile(path, source)
  return { home, path }
}

describe('MCP connector installation', () => {
  it('detects existing connectors and preserves user preset content while adding a curated recipe', async () => {
    const { home, path } = await fixture()
    expect((await readConnectorState(home)).blender).toBe(true)
    expect((await readConnectorState(home)).openMuseum).toBe(false)
    expect(await installConnector(home, { id: 'openMuseum' })).toEqual({ installed: true, alreadyPresent: false })
    const contents = await readFile(path, 'utf8')
    expect(contents).toContain('!!js process.env.SKILL_PATH')
    expect(contents).toContain('open-museum-mcp')
    expect(connectorState(contents).openMuseum).toBe(true)
    expect(await installConnector(home, { id: 'openMuseum' })).toEqual({ installed: true, alreadyPresent: true })
    expect(await readFile(path, 'utf8')).toBe(contents)
  })

  it('adds a manual HTTPS connector without accepting arbitrary keys or secrets in URLs', async () => {
    const { home, path } = await fixture()
    await installConnector(home, { id: 'photopea', config: { transport: 'streamable-http', url: 'https://example.org/mcp', headers: { Authorization: 'secret' } } })
    const contents = await readFile(path, 'utf8')
    expect(contents).toContain('https://example.org/mcp')
    expect(contents).not.toContain('secret')
    expect(connectorState(contents).photopea).toBe(true)
    expect(() => validateConnector({ id: 'photopea', config: { transport: 'streamable-http', url: 'http://example.org/mcp' } })).toThrow('HTTPS')
    expect(() => validateConnector({ id: 'photopea', config: { transport: 'streamable-http', url: 'https://user:password@example.org/mcp' } })).toThrow('Credentials')
  })

  it('rejects malformed commands without changing the composition', async () => {
    const { home, path } = await fixture()
    const before = await readFile(path, 'utf8')
    await expect(installConnector(home, { id: 'build123d', config: { transport: 'stdio', command: 'uvx\nrm', args: [] } })).rejects.toThrow('command')
    expect(await readFile(path, 'utf8')).toBe(before)
  })
})
