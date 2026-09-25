import { createServer, request } from 'node:http'
import { readFile } from 'node:fs/promises'
import { randomBytes } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { DockerRuntime } from './runtime.mjs'

const LOGIN_PAGE = fileURLToPath(new URL('../../build/web-cloud-login.html', import.meta.url))
const ACCOUNT_PAGE = fileURLToPath(new URL('../../build/web-cloud-account.html', import.meta.url))
const COOKIE = 'atelier_web_session'
const AUTH_ROUTES = new Map([
  ['login', '/auth/login'],
  ['register', '/auth/register'],
  ['verify', '/auth/email/verify'],
  ['reset-request', '/auth/email/password/reset/request'],
  ['reset-confirm', '/auth/email/password/reset/confirm']
])

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
  res.end(typeof body === 'string' ? body : JSON.stringify(body))
}

function cookieValue(req, name) {
  return req.headers.cookie?.split(';').map(part => part.trim()).find(part => part.startsWith(`${name}=`))?.slice(name.length + 1)
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk
      if (body.length > 16 * 1024) { reject(new Error('Request too large')); req.destroy() }
    })
    req.on('end', () => {
      try { resolve(JSON.parse(body)) } catch { reject(new Error('Invalid JSON')) }
    })
    req.on('error', reject)
  })
}

function proxyHeaders(req, runner) {
  const headers = { ...req.headers }
  for (const name of ['host', 'cookie', 'authorization', 'origin', 'x-forwarded-for', 'x-forwarded-host', 'x-forwarded-proto']) delete headers[name]
  headers.host = '127.0.0.1:3081'
  headers.cookie = runner.cookie
  if (req.headers.origin) headers.origin = 'http://127.0.0.1:3081'
  return headers
}

function captureRunnerCookie(response) {
  const values = response.headers['set-cookie'] ?? []
  return values.map(value => value.split(';', 1)[0]).join('; ')
}

async function exchangeToken(runner) {
  if (runner.cookie) return
  const url = new URL(runner.tokenUrl)
  const response = await new Promise((resolve, reject) => {
    const upstream = request({ host: '127.0.0.1', port: runner.port,
      path: `${url.pathname}${url.search}`, headers: { host: '127.0.0.1:3081' } }, res => {
      res.resume()
      res.on('end', () => resolve(res))
    })
    upstream.on('error', reject)
    upstream.end()
  })
  if (response.statusCode !== 303) throw new Error('Runner authentication failed')
  runner.cookie = captureRunnerCookie(response)
  if (!runner.cookie) throw new Error('Runner did not issue a session cookie')
}

function proxyHttp(req, res, runner, unavailable) {
  const upstream = request({ host: '127.0.0.1', port: runner.port, method: req.method,
    path: req.url, headers: proxyHeaders(req, runner) }, response => {
    if (response.statusCode === 502) unavailable()
    const headers = { ...response.headers }
    delete headers['set-cookie']
    headers['cache-control'] = 'no-store'
    res.writeHead(response.statusCode ?? 502, headers)
    response.pipe(res)
  })
  upstream.on('error', () => { unavailable(); if (!res.headersSent) send(res, 502, { error: 'RUNNER_UNAVAILABLE' }); else res.destroy() })
  req.pipe(upstream)
}

function proxyUpgrade(req, socket, head, runner, unavailable) {
  const upstream = request({ host: '127.0.0.1', port: runner.port, method: req.method,
    path: req.url, headers: proxyHeaders(req, runner) })
  upstream.on('upgrade', (response, upstreamSocket, upstreamHead) => {
    socket.write(`HTTP/1.1 ${response.statusCode} ${response.statusMessage}\r\n`)
    for (const [name, value] of Object.entries(response.headers)) {
      if (name !== 'set-cookie' && value !== undefined) socket.write(`${name}: ${value}\r\n`)
    }
    socket.write('\r\n')
    if (upstreamHead.length) socket.write(upstreamHead)
    if (head.length) upstreamSocket.write(head)
    socket.pipe(upstreamSocket).pipe(socket)
  })
  upstream.on('response', response => { response.resume(); socket.destroy() })
  upstream.on('error', () => { unavailable(); socket.destroy() })
  socket.on('error', () => upstream.destroy())
  upstream.end()
}

export function createCloudGateway({ authBase, origin, runtime, fetcher = fetch, loginHtml, accountHtml = '<h1>Account</h1>' }) {
  if (!authBase || !origin || !runtime) throw new Error('Auth URL, public origin and runtime are required')
  const api = new URL('/api/v1/', authBase)
  const sessions = new Map()
  const secure = new URL(origin).protocol === 'https:'
  const sessionCookie = value => `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`
  const sameOrigin = req => !req.headers.origin || req.headers.origin === origin

  async function authCall(path, { method = 'GET', body, token } = {}) {
    const response = await fetcher(new URL(path.replace(/^\//, ''), api), {
      method,
      headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(10000)
    })
    const data = response.status === 204 ? null : await response.json()
    return { status: response.status, data }
  }

  async function identity(req) {
    const id = cookieValue(req, COOKIE)
    const session = sessions.get(id)
    if (!session) return null
    try {
      const result = await authCall('/auth/me', { token: session.token })
      if (result.status === 200 && result.data?.userId === session.userId) return result.data
    } catch { /* Identity service unavailable: fail closed. */ }
    sessions.delete(id)
    return null
  }

  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url, origin).pathname
      if (req.method !== 'GET' && req.method !== 'HEAD' && !sameOrigin(req)) return send(res, 403, { error: 'INVALID_ORIGIN' })
      if (req.method === 'GET' && path === '/favicon.ico') { res.writeHead(204); return res.end() }
      if (req.method === 'GET' && path === '/login') return send(res, 200, loginHtml, 'text/html; charset=utf-8')
      if (req.method === 'POST' && path === '/cloud/auth/logout') {
        const id = cookieValue(req, COOKIE)
        const session = sessions.get(id)
        if (session) {
          sessions.delete(id)
          try { await authCall('/auth/logout', { method: 'POST', token: session.token }) } catch { /* Local session is already gone. */ }
        }
        res.setHeader('Set-Cookie', sessionCookie('') + '; Max-Age=0')
        return send(res, 200, { ok: true })
      }
      if (req.method === 'POST' && path.startsWith('/cloud/auth/')) {
        const action = path.slice('/cloud/auth/'.length)
        const backend = AUTH_ROUTES.get(action)
        if (!backend) return send(res, 404, { error: 'NOT_FOUND' })
        const result = await authCall(backend, { method: 'POST', body: await readJson(req) })
        if (result.status >= 400) return send(res, result.status, result.data)
        if (result.data?.token) {
          const me = await authCall('/auth/me', { token: result.data.token })
          if (me.status !== 200 || !me.data?.userId) return send(res, 502, { error: 'IDENTITY_FAILED' })
          const id = randomBytes(32).toString('base64url')
          sessions.set(id, { userId: me.data.userId, token: result.data.token })
          res.setHeader('Set-Cookie', sessionCookie(id))
          return send(res, 200, { userId: me.data.userId, displayName: me.data.displayName })
        }
        return send(res, result.status, result.data)
      }
      const user = await identity(req)
      if (!user) {
        if (req.method === 'GET' && (path === '/' || path === '/index.html')) {
          res.writeHead(302, { Location: '/login', 'Cache-Control': 'no-store' })
          return res.end()
        }
        return send(res, 401, { error: 'AUTH_REQUIRED' })
      }
      if (path === '/cloud/auth/me') return send(res, 200, { userId: user.userId, displayName: user.displayName })
      if (path === '/cloud/account') return send(res, 200, accountHtml, 'text/html; charset=utf-8')
      const runner = await runtime.get(user.userId)
      await exchangeToken(runner)
      proxyHttp(req, res, runner, () => runtime.invalidate?.(user.userId))
    } catch (error) {
      if (error?.message === 'AT_CAPACITY') return send(res, 503, { error: 'AT_CAPACITY' })
      if (!res.headersSent) send(res, 502, { error: 'SERVICE_UNAVAILABLE' })
    }
  })
  server.on('upgrade', async (req, socket, head) => {
    try {
      if (!sameOrigin(req)) throw new Error('Invalid origin')
      const user = await identity(req)
      if (!user) throw new Error('Unauthenticated')
      const runner = await runtime.get(user.userId)
      await exchangeToken(runner)
      proxyUpgrade(req, socket, head, runner, () => runtime.invalidate?.(user.userId))
    } catch { socket.write('HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n'); socket.destroy() }
  })
  return server
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const authBase = process.env.ATELIER_AUTH_BASE_URL
  const origin = process.env.ATELIER_WEB_ORIGIN
  const image = process.env.ATELIER_WEB_IMAGE
  const port = Number(process.env.ATELIER_WEB_PORT || 18081)
  const loginHtml = await readFile(LOGIN_PAGE, 'utf8')
  const accountHtml = await readFile(ACCOUNT_PAGE, 'utf8')
  const runtime = new DockerRuntime({ image, maxActive: Number(process.env.ATELIER_WEB_MAX_ACTIVE || 16) })
  createCloudGateway({ authBase, origin, runtime, loginHtml, accountHtml }).listen(port, '127.0.0.1', () => {
    process.stdout.write(`Atelier cloud gateway listening on 127.0.0.1:${port}\n`)
  })
}
