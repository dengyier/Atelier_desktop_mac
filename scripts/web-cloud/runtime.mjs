import { createHash } from 'node:crypto'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const exec = promisify(execFile)
const PORT = '3080/tcp'

export function tenantId(userId) {
  if (typeof userId !== 'string' || !userId) throw new Error('Missing user ID')
  return createHash('sha256').update(userId).digest('hex').slice(0, 32)
}

export class DockerRuntime {
  constructor({ image, maxActive = 16, docker = 'docker', command = exec }) {
    if (!image) throw new Error('ATELIER_WEB_IMAGE is required')
    this.image = image
    this.maxActive = maxActive
    this.docker = docker
    this.command = command
    this.active = new Map()
    this.starting = new Map()
  }

  async call(...args) {
    const { stdout } = await this.command(this.docker, args, { timeout: 30000, maxBuffer: 1024 * 1024 })
    return stdout.trim()
  }

  async get(userId) {
    const id = tenantId(userId)
    if (this.active.has(id)) return this.active.get(id)
    if (this.starting.has(id)) return this.starting.get(id)
    if (this.active.size + this.starting.size >= this.maxActive) throw new Error('AT_CAPACITY')
    const promise = this.start(id).then(value => {
      this.active.set(id, value)
      return value
    }).finally(() => this.starting.delete(id))
    this.starting.set(id, promise)
    return promise
  }

  invalidate(userId) {
    this.active.delete(tenantId(userId))
  }

  async start(id) {
    const name = `atelier-web-${id}`
    const volume = `atelier-web-${id}`
    await this.call('volume', 'create', volume)
    let running = false
    try {
      running = (await this.call('inspect', '--format', '{{.State.Running}}', name)) === 'true'
    } catch { /* Absent container; create it below. */ }
    if (!running) {
      try { await this.call('rm', '-f', name) } catch { /* Absent container. */ }
      await this.call('run', '-d', '--rm', '--init', '--name', name,
        '--label', 'space.artsmart.atelier.web=tenant',
        '--user', '10001:10001', '--cap-drop', 'ALL', '--security-opt', 'no-new-privileges',
        '--read-only', '--tmpfs', '/tmp:rw,nosuid,size=256m',
        '--memory', '1536m', '--cpus', '1.5', '--pids-limit', '192',
        '--mount', `type=volume,source=${volume},target=/data`,
        '-p', `127.0.0.1::${PORT.split('/')[0]}`, this.image)
    }
    const binding = await this.call('port', name, PORT)
    const port = Number(binding.match(/127\.0\.0\.1:(\d+)/)?.[1])
    if (!Number.isInteger(port) || port < 1) throw new Error('Runner port unavailable')
    for (let i = 0; i < 40; i++) {
      try {
        const tokenUrl = await this.call('exec', name, 'cat', '/tmp/atelier-launch-url')
        if (tokenUrl.startsWith('http://127.0.0.1:3081/?token=')) return { name, port, tokenUrl, cookie: '' }
      } catch { /* Runner is still starting. */ }
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    throw new Error('Runner did not become ready')
  }
}
