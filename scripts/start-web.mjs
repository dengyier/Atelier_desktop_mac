import { spawn } from 'node:child_process'
import { cp, lstat, mkdir, mkdtemp, rename, rm } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const home = resolve(process.env.ATELIER_WEB_HOME || join(homedir(), '.atelier-web'))
const workdir = resolve(process.env.ATELIER_WEB_WORKDIR || root)
const preset = join(home, '.agent-presets', 'atelier')
const port = Number(process.env.ATELIER_WEB_PORT || 3080)
const trustedHost = process.env.ATELIER_WEB_TRUSTED_HOST

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('ATELIER_WEB_PORT must be a TCP port between 1 and 65535')
}

await mkdir(dirname(preset), { recursive: true })
try {
  await lstat(preset)
} catch (error) {
  if (error.code !== 'ENOENT') throw error
  const staging = await mkdtemp(join(dirname(preset), '.atelier-'))
  try {
    await cp(join(root, 'build', 'atelier-preset'), staging, { recursive: true })
    await rename(staging, preset)
  } finally {
    await rm(staging, { recursive: true, force: true })
  }
}

const entry = join(root, 'build', 'harness-node-entry.mjs')
const dsh = join(root, 'node_modules', '@deepseek-ai', 'dsh', 'lib', 'bin.js')
const patch = join(root, 'build', 'dsh-desktop.patch.yml')
const args = [
  '--expose-internals', entry, dsh, 'web', '--patch', patch,
  '--no-open', '--host', '127.0.0.1', '--port', String(port)
]
if (trustedHost) args.push('--trusted-host', trustedHost)

const child = spawn(process.execPath, args, {
  cwd: workdir,
  env: { ...process.env, DSH_HOME: home },
  stdio: 'inherit'
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => child.kill(signal))
}
child.once('error', (error) => {
  console.error('Could not start Atelier Web:', error)
  process.exitCode = 1
})
child.once('exit', (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0)
})
