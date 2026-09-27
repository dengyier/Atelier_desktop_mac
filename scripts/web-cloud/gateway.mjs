import { createServer, request } from 'node:http'
import { randomBytes } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { DockerRuntime } from './runtime.mjs'

const COOKIE = 'atelier_web_tenant'

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
  res.end(typeof body === 'string' ? body : JSON.stringify(body))
}

function cookieValue(req, name) {
  return req.headers.cookie?.split(';').map(part => part.trim()).find(part => part.startsWith(`${name}=`))?.slice(name.length + 1)
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

function isVersionedClientResource(req) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return false
  const url = new URL(req.url, 'http://localhost')
  return (url.pathname === '/plugins/' && url.search.startsWith('??') && /^[a-f0-9]{12}$/.test(url.searchParams.get('rev') || '')) ||
    /^\/assets\/[^/]+-[A-Za-z0-9_-]{8,}\.(?:js|css|woff2?)$/.test(url.pathname) ||
    /^\/dsh-ppt\/previews\/[a-f0-9]{64}\.(?:jpg|png|webp)$/.test(url.pathname)
}

function proxyHttp(req, res, runner, unavailable, setCookie) {
  const upstream = request({ host: '127.0.0.1', port: runner.port, method: req.method,
    path: req.url, headers: proxyHeaders(req, runner) }, response => {
    if (response.statusCode === 502) unavailable()
    const headers = { ...response.headers }
    delete headers['set-cookie']
    // Cache immutable client bytes per browser identity; user APIs remain uncached.
    const cacheable = isVersionedClientResource(req) && (response.statusCode === 200 || response.statusCode === 304)
    headers['cache-control'] = cacheable ? 'private, max-age=31536000, immutable' : 'no-store'
    if (cacheable) headers.vary = [headers.vary, 'Cookie'].filter(Boolean).join(', ')
    if (setCookie) headers['set-cookie'] = [setCookie]
    res.writeHead(response.statusCode ?? 502, headers)
    response.pipe(res)
  })
  upstream.on('error', () => { unavailable(); if (!res.headersSent) send(res, 502, { error: 'RUNNER_UNAVAILABLE' }); else res.destroy() })
  if (req.method === 'GET' || req.method === 'HEAD') upstream.end()
  else req.pipe(upstream)
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

export function createCloudGateway({ origin, runtime }) {
  if (!origin || !runtime) throw new Error('Public origin and runtime are required')
  const secure = new URL(origin).protocol === 'https:'
  const sameOrigin = req => !req.headers.origin || req.headers.origin === origin
  const tenantCookie = value => `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`

  function tenant(req) {
    const existing = cookieValue(req, COOKIE)
    if (existing && /^[A-Za-z0-9_-]{32,128}$/.test(existing)) return { id: existing, setCookie: '' }
    const id = randomBytes(32).toString('base64url')
    return { id, setCookie: tenantCookie(id) }
  }

  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url, origin).pathname
      if (req.method !== 'GET' && req.method !== 'HEAD' && !sameOrigin(req)) return send(res, 403, { error: 'INVALID_ORIGIN' })
      if (req.method === 'GET' && path === '/favicon.ico') { res.writeHead(204); return res.end() }
      const current = tenant(req)
      const runner = await runtime.get(current.id)
      await exchangeToken(runner)
      proxyHttp(req, res, runner, () => runtime.invalidate?.(current.id), current.setCookie)
    } catch (error) {
      if (error?.message === 'AT_CAPACITY') return send(res, 503, { error: 'AT_CAPACITY' })
      if (!res.headersSent) send(res, 502, { error: 'SERVICE_UNAVAILABLE' })
    }
  })
  server.on('upgrade', async (req, socket, head) => {
    try {
      if (!sameOrigin(req)) throw new Error('Invalid origin')
      const current = tenant(req)
      const runner = await runtime.get(current.id)
      await exchangeToken(runner)
      proxyUpgrade(req, socket, head, runner, () => runtime.invalidate?.(current.id))
    } catch { socket.write('HTTP/1.1 503 Service Unavailable\r\nConnection: close\r\n\r\n'); socket.destroy() }
  })
  return server
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const origin = process.env.ATELIER_WEB_ORIGIN
  const image = process.env.ATELIER_WEB_IMAGE
  const port = Number(process.env.ATELIER_WEB_PORT || 18081)
  const runtime = new DockerRuntime({ image, maxActive: Number(process.env.ATELIER_WEB_MAX_ACTIVE || 16) })
  createCloudGateway({ origin, runtime }).listen(port, '127.0.0.1', () => {
    process.stdout.write(`Atelier cloud gateway listening on 127.0.0.1:${port}\n`)
  })
}
