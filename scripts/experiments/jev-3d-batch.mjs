import { readFile, writeFile, stat } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const args = process.argv.slice(2)
const option = k => args.indexOf(k) < 0 ? undefined : args[args.indexOf(k) + 1]
const root = option('--root'), credentials = option('--credentials')
if (!root || !credentials || !args.includes('--dedicated-blender')) throw new Error('Require --root, --credentials and --dedicated-blender. Reset only an experiment-owned Blender instance.')
const client = new Client({ name: 'atelier-jev-controlled-scene', version: '1.0.0' })
const transport = new StdioClientTransport({ command: 'uvx', args: ['--python', '3.11', 'mcp-for-blender==2.0.4'], env: { ...process.env, BLENDER_HOST: '127.0.0.1', BLENDER_PORT: '9876', BLENDER_MCP_SAFE_MODE: '1' }, stderr: 'pipe' })
await client.connect(transport)
const outcomes = []
try {
  for (const language of ['en', 'fr']) for (const arm of ['A', 'B', 'C']) {
    let existing
    try { existing = JSON.parse(await readFile(join(root, `${language}-${arm}`, 'process-result.json'), 'utf8')) } catch (error) { if (error.code !== 'ENOENT') throw error }
    if (!existing) {
      let pending = false
      try { pending = (await stat(join(root, `${language}-${arm}`))).isDirectory() } catch (error) { if (error.code !== 'ENOENT') throw error }
      if (pending) {
        console.log(`${language}-${arm}: waiting for the existing run before resetting Blender`)
        const deadline = Date.now() + 300000
        while (!existing && Date.now() < deadline) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          try { existing = JSON.parse(await readFile(join(root, `${language}-${arm}`, 'process-result.json'), 'utf8')) } catch (error) { if (error.code !== 'ENOENT') throw error }
        }
        if (!existing) throw new Error('Unfinished existing run; refusing to reset its Blender scene')
      }
    }
    if (existing) { outcomes.push(existing); console.log(`${language}-${arm}: retained existing result`); continue }
    const reset = await client.callTool({ name: 'execute_blender_code', arguments: { code: 'import bpy\nbpy.ops.wm.read_factory_settings(use_empty=False)\nprint("ATELIER_EXPERIMENT_RESET")' } })
    if (reset.isError) throw new Error('Blender reset failed')
    const health = await client.callTool({ name: 'get_addon_status', arguments: {} })
    if (health.isError) throw new Error('Blender health check failed')
    console.log(`${language}-${arm}: starting`)
    const runner = join(dirname(fileURLToPath(import.meta.url)), 'jev-3d-run.mjs')
    const child = spawn(process.execPath, [runner, '--root', root, '--credentials', credentials, '--arm', arm, '--language', language], { env: process.env, stdio: ['ignore', 'inherit', 'inherit'] })
    const code = await new Promise((resolve, reject) => { child.on('error', reject); child.on('exit', resolve) })
    outcomes.push({ language, arm, code })
    console.log(`${language}-${arm}: exited ${code}`)
  }
} finally { await client.close(); await writeFile(join(root, 'batch-results.json'), JSON.stringify(outcomes, null, 2) + '\n') }
