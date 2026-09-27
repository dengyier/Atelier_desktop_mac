import { createServer, request } from 'node:http'
import { afterEach, describe, expect, it } from 'vitest'
import { createCloudGateway } from '../scripts/web-cloud/gateway.mjs'
import { DockerRuntime, tenantId } from '../scripts/web-cloud/runtime.mjs'

const servers: ReturnType<typeof createServer>[] = []
afterEach(async () => {
  await Promise.all(servers.splice(0).map(server => new Promise<void>(resolve => server.close(() => resolve()))))
})

async function listen(server: ReturnType<typeof createServer>) {
  servers.push(server)
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('Missing port')
  return address.port
}

function authResponse(status: number, data: object) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } })
}

describe('Atelier cloud gateway', () => {
  it('forwards initial upgraded response bytes to the browser', async () => {
    const runner = createServer((_req, res) => {
      res.writeHead(303, { 'Set-Cookie': 'runner=test; Path=/' })
      res.end()
    })
    const upstreamSockets = new Set<import('node:stream').Duplex>()
    runner.on('upgrade', (_req, socket) => {
      upstreamSockets.add(socket)
      socket.write('HTTP/1.1 101 Switching Protocols\r\nConnection: Upgrade\r\nUpgrade: websocket\r\n\r\nhello')
    })
    const runnerPort = await listen(runner)
    const gatewayPort = await listen(createCloudGateway({
      origin: 'http://127.0.0.1:18081',
      runtime: { get: async () => ({ name: 'test', port: runnerPort, tokenUrl: 'http://127.0.0.1:3081/?token=launch', cookie: '' }) }
    }))
    try {
      const received = await new Promise<string>((resolve, reject) => {
        const client = request({ host: '127.0.0.1', port: gatewayPort, path: '/', headers: { Connection: 'Upgrade', Upgrade: 'websocket' } })
        const timer = setTimeout(() => { client.destroy(); reject(new Error('Missing upgrade payload')) }, 2000)
        client.on('error', error => { clearTimeout(timer); reject(error) })
        client.on('upgrade', (_response, socket, head) => {
          let bytes = head.toString()
          const finish = () => {
            if (!bytes.includes('hello')) return
            clearTimeout(timer)
            socket.destroy()
            resolve(bytes)
          }
          socket.on('data', chunk => { bytes += chunk.toString(); finish() })
          finish()
        })
        client.end()
      })
      expect(received).toBe('hello')
    } finally {
      for (const socket of upstreamSockets) socket.destroy()
    }
  })

  it('allows anonymous access while assigning each browser an isolated runner', async () => {
    const seen: Array<{ tenant: string; cookie: string }> = []
    const runners = new Map<string, { name: string; port: number; tokenUrl: string; cookie: string }>()
    const runtime = { get: async (id: string) => {
      if (!runners.has(id)) {
        const runner = createServer((req, res) => {
          if (req.url === '/?token=launch') {
            res.setHeader('Set-Cookie', `runner=${id}; HttpOnly; Path=/`)
            res.writeHead(303, { Location: '/' })
            return res.end()
          }
          seen.push({ tenant: id, cookie: req.headers.cookie || '' })
          res.setHeader('Set-Cookie', 'should-not-reach-browser=1')
          res.end(id)
        })
        const port = await listen(runner)
        runners.set(id, { name: id, port, tokenUrl: 'http://127.0.0.1:3081/?token=launch', cookie: '' })
      }
      return runners.get(id)!
    }}
    const gateway = createCloudGateway({ origin: 'http://127.0.0.1:18081', runtime })
    const port = await listen(gateway)
    const base = `http://127.0.0.1:${port}`
    const first = await fetch(base)
    expect(first.status).toBe(200)
    const firstCookie = first.headers.get('set-cookie')
    expect(firstCookie).toMatch(/^atelier_web_tenant=[A-Za-z0-9_-]+; Path=\/; HttpOnly; SameSite=Lax/)
    const firstTenant = firstCookie!.split(';')[0]!
    const second = await fetch(base)
    const secondTenant = second.headers.get('set-cookie')!.split(';')[0]!
    expect(secondTenant).not.toBe(firstTenant)
    expect(await (await fetch(`${base}/api/session`, { headers: { cookie: firstTenant } })).text()).toBe(firstTenant.split('=')[1])
    expect(await (await fetch(`${base}/api/session`, { headers: { cookie: secondTenant } })).text()).toBe(secondTenant.split('=')[1])
    expect(seen).toHaveLength(4)
    expect(seen[0]!.tenant).not.toBe(seen[1]!.tenant)
    expect(seen[2]!.tenant).toBe(seen[0]!.tenant)
    expect(seen[3]!.tenant).toBe(seen[1]!.tenant)
    expect(seen.every(entry => /^runner=/.test(entry.cookie))).toBe(true)
  })

  it('caches only versioned client resources and keeps user responses uncached', async () => {
    const runner = createServer((req, res) => {
      if (req.url === '/?token=launch') {
        res.writeHead(303, { 'Set-Cookie': 'runner=private; Path=/' })
        return res.end()
      }
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      res.end('response')
    })
    const runnerPort = await listen(runner)
    const gatewayPort = await listen(createCloudGateway({
      origin: 'http://127.0.0.1:18081',
      runtime: { get: async () => ({ name: 'test', port: runnerPort, tokenUrl: 'http://127.0.0.1:3081/?token=launch', cookie: '' }) }
    }))
    for (const asset of ['/plugins/??test/client.js&rev=abcdef123456', '/assets/index-BKQ_L1z6.js', `/dsh-ppt/previews/${'a'.repeat(64)}.jpg`]) {
      const response = await fetch(`http://127.0.0.1:${gatewayPort}${asset}`)
      expect(response.headers.get('cache-control')).toBe('private, max-age=31536000, immutable')
      expect(response.headers.get('vary')).toContain('Cookie')
    }
    for (const path of ['/', '/api/settings', '/api/session', '/plugins/events', '/plugins/??test/client.js', '/data/private.jpg']) {
      const response = await fetch(`http://127.0.0.1:${gatewayPort}${path}`)
      expect(response.headers.get('cache-control')).toBe('no-store')
    }
  })

  it('uses opaque stable tenant names without exposing user IDs', () => {
    expect(tenantId('alice')).toMatch(/^[a-f0-9]{32}$/)
    expect(tenantId('alice')).toBe(tenantId('alice'))
    expect(tenantId('alice')).not.toBe(tenantId('bob'))
  })

  it('provisions a distinct constrained volume and container for each identity', async () => {
    const calls: string[][] = []
    const command = async (_bin: string, args: string[]) => {
      calls.push(args)
      if (args[0] === 'inspect' || args[0] === 'rm') throw new Error('absent')
      if (args[0] === 'port') return { stdout: '127.0.0.1:49152\n' }
      if (args[0] === 'exec') return { stdout: 'http://127.0.0.1:3081/?token=secret\n' }
      return { stdout: 'ok\n' }
    }
    const runtime = new DockerRuntime({ image: 'atelier-web-runner:test', maxActive: 2, command })
    const alice = await runtime.get('alice')
    const bob = await runtime.get('bob')
    expect(alice.name).not.toBe(bob.name)
    const runs = calls.filter(args => args[0] === 'run')
    expect(runs).toHaveLength(2)
    expect(calls.some(args => args[0] === 'exec' && args[3] === '/tmp/atelier-launch-url')).toBe(true)
    expect(calls.some(args => args[0] === 'logs')).toBe(false)
    expect(runs[0]).toContain(`type=volume,source=atelier-web-${tenantId('alice')},target=/data`)
    expect(runs[1]).toContain(`type=volume,source=atelier-web-${tenantId('bob')},target=/data`)
    expect(runs[0]).toContain('--read-only')
    expect(runs[0]).toContain('no-new-privileges')
    await expect(runtime.get('charlie')).rejects.toThrow('AT_CAPACITY')
  })
})
