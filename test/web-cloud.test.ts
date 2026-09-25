import { createServer } from 'node:http'
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
  it('requires identity for both page and task API, then keeps users on separate runners', async () => {
    const seen: Array<{ user: string; cookie: string }> = []
    const runners = new Map<string, { name: string; port: number; tokenUrl: string; cookie: string }>()
    for (const user of ['alice', 'bob']) {
      const runner = createServer((req, res) => {
        if (req.url === '/?token=launch') {
          res.setHeader('Set-Cookie', `runner=${user}; HttpOnly; Path=/`)
          res.writeHead(303, { Location: '/' })
          return res.end()
        }
        seen.push({ user, cookie: req.headers.cookie || '' })
        res.setHeader('Set-Cookie', 'should-not-reach-browser=1')
        res.end(user)
      })
      const port = await listen(runner)
      runners.set(user, { name: user, port, tokenUrl: 'http://127.0.0.1:3081/?token=launch', cookie: '' })
    }
    const runtime = { get: async (id: string) => runners.get(id)! }
    const valid = new Set(['alice', 'bob'])
    const fetcher = async (url: URL, init: RequestInit) => {
      const path = url.pathname
      if (path.endsWith('/auth/login')) {
        const body = JSON.parse(String(init.body))
        return authResponse(200, { token: body.email, userId: body.email })
      }
      if (path.endsWith('/auth/me')) {
        const id = String(init.headers && (init.headers as Record<string, string>).Authorization).replace('Bearer ', '')
        return valid.has(id) ? authResponse(200, { userId: id, displayName: id }) : authResponse(401, { detail: 'INVALID_SESSION' })
      }
      return authResponse(404, {})
    }
    const gateway = createCloudGateway({ authBase: 'http://auth.local', origin: 'http://127.0.0.1:18081', runtime, fetcher: fetcher as typeof fetch, loginHtml: '<h1>login</h1>' })
    const port = await listen(gateway)
    const base = `http://127.0.0.1:${port}`
    expect((await fetch(base, { redirect: 'manual' })).status).toBe(302)
    expect((await fetch(`${base}/api/session`)).status).toBe(401)
    const cookies = new Map<string, string>()
    const cookieFor = (user: string) => {
      const value = cookies.get(user)
      if (!value) throw new Error('Missing session cookie')
      return value
    }
    for (const user of ['alice', 'bob']) {
      const response = await fetch(`${base}/cloud/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: user, password: 'test' }) })
      expect(response.status).toBe(200)
      expect(await response.text()).not.toContain('token')
      const setCookie = response.headers.get('set-cookie')
      if (!setCookie) throw new Error('Missing Set-Cookie')
      expect(setCookie).toContain('HttpOnly')
      cookies.set(user, setCookie.split(';')[0] || '')
    }
    for (const user of ['alice', 'bob']) {
      const response = await fetch(`${base}/api/session`, { headers: { cookie: cookieFor(user) } })
      expect(await response.text()).toBe(user)
      expect(response.headers.get('set-cookie')).toBeNull()
    }
    expect(seen).toEqual([{ user: 'alice', cookie: 'runner=alice' }, { user: 'bob', cookie: 'runner=bob' }])
    valid.delete('alice')
    expect((await fetch(`${base}/api/session`, { headers: { cookie: cookieFor('alice') } })).status).toBe(401)
    expect((await fetch(`${base}/api/session`, { headers: { cookie: cookieFor('bob') } })).status).toBe(200)
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
