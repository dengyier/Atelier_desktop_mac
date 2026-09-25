import { createServer, request } from 'node:http'
import { connect } from 'node:net'
import { spawn } from 'node:child_process'
import { lstat, mkdir, symlink, writeFile } from 'node:fs/promises'
import { createInterface } from 'node:readline'

await mkdir('/data/workspace', { recursive: true })
const modules = '/data/profiles/web/node_modules'
await mkdir(modules, { recursive: true })
for (const name of [
  'dsh-desktop-log-bridge', 'dsh-desktop-client-ui', 'dsh-desktop-market-installer',
  'dsh-ppt-composer', 'dsh-desktop-hmr-fallback', 'dsh-desktop-preset-transfer'
]) {
  try { await lstat(`${modules}/${name}`) }
  catch (error) {
    if (error.code !== 'ENOENT') throw error
    await symlink(`/app/node_modules/${name}`, `${modules}/${name}`)
  }
}
const child = spawn(process.execPath, ['/app/scripts/start-web.mjs'], {
  cwd: '/app',
  env: {
    PATH: process.env.PATH,
    HOME: '/data',
    ATELIER_WEB_HOME: '/data',
    ATELIER_WEB_WORKDIR: '/data/workspace',
    ATELIER_WEB_PORT: '3081',
    DSH_TELEMETRY_DISABLED: '1'
  },
  stdio: ['inherit', 'pipe', 'pipe']
})
for (const [stream, destination] of [[child.stdout, process.stdout], [child.stderr, process.stderr]]) {
  createInterface({ input: stream }).on('line', line => {
    const tokenUrl = /dsh web:\s*(https?:\/\/\S+)/.exec(line)?.[1]
    if (tokenUrl) writeFile('/tmp/atelier-launch-url', tokenUrl, { mode: 0o600 }).catch(error => {
      process.stderr.write(`Could not store runner launch URL: ${error.message}\n`)
    })
    destination.write(line.replace(/([?&]token=)[^&\s]+/g, '$1[redacted]') + '\n')
  })
}

const server = createServer((incoming, outgoing) => {
  const upstream = request({ host: '127.0.0.1', port: 3081, method: incoming.method,
    path: incoming.url, headers: { ...incoming.headers, host: '127.0.0.1:3081' } }, response => {
    outgoing.writeHead(response.statusCode ?? 502, response.headers)
    response.pipe(outgoing)
  })
  upstream.on('error', () => { if (!outgoing.headersSent) outgoing.writeHead(502); outgoing.end() })
  incoming.pipe(upstream)
})
server.on('upgrade', (incoming, socket, head) => {
  const upstream = connect(3081, '127.0.0.1', () => {
    const headers = { ...incoming.headers, host: '127.0.0.1:3081' }
    upstream.write(`${incoming.method} ${incoming.url} HTTP/1.1\r\n`)
    for (const [key, value] of Object.entries(headers)) upstream.write(`${key}: ${value}\r\n`)
    upstream.write('\r\n')
    if (head.length) upstream.write(head)
    socket.pipe(upstream).pipe(socket)
  })
  upstream.on('error', () => socket.destroy())
  socket.on('error', () => upstream.destroy())
})
server.listen(3080, '0.0.0.0')
child.once('exit', code => { server.close(); process.exitCode = code ?? 1 })
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => child.kill(signal))
