import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { createWriteStream } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import yaml from 'js-yaml'
import { ruleMatch } from './jev-skill-routing.mjs'

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const args = process.argv.slice(2)
const option = key => args.indexOf(key) < 0 ? undefined : args[args.indexOf(key) + 1]
const root = option('--root'), arm = option('--arm'), language = option('--language'), credentials = option('--credentials')
if (!root || !['A', 'B', 'C'].includes(arm) || !['en', 'fr'].includes(language) || !credentials) throw new Error('Require --root, --arm A|B|C, --language en|fr, --credentials path')
const workspace = join(resolve(root), `${language}-${arm}`)
await mkdir(resolve(root), { recursive: true })
await mkdir(workspace) // Refuse to reuse an existing run.
const home = join(workspace, 'harness-home')
const profile = join(home, 'profiles', 'headless')
await mkdir(profile, { recursive: true })
const preset = join(home, '.agent-presets', 'atelier')
await cp(join(repo, 'build/atelier-preset'), preset, { recursive: true })
const catalog = 'atelier-blender-workflow'
const task = language === 'en'
  ? 'Create an editable 3D gallery sculpture: eight horizontal bronze torus rings stacked on a stone plinth. Ring outer diameter 1.2 metres, vertical spacing 0.25 metres, tube radius 0.06 metres. Plinth 1.6 by 1.6 by 0.2 metres. Place the lowest ring just above the plinth. Provide a .blend, a GLB, and two 512x512 rendered PNGs from distinct front-three-quarter and side cameras. Keep eight separately named ring mesh objects and realistic visible bronze and stone materials. Verify geometry and inspect both renders. Use the available Blender MCP and no external assets, downloads, shell commands or extra services. Work only in the current workspace. This is approved execution; do not stop at a plan. Limit corrections to one iteration.'
  : 'Crée une sculpture de galerie 3D modifiable : huit anneaux toriques horizontaux en bronze, empilés sur un socle en pierre. Diamètre extérieur de chaque anneau : 1,2 m ; espacement vertical : 0,25 m ; rayon du tube : 0,06 m. Socle : 1,6 × 1,6 × 0,2 m. Place le premier anneau juste au-dessus du socle. Livre un .blend, un GLB et deux PNG rendus en 512x512 avec des caméras distinctes, une vue de trois quarts avant et une vue latérale. Conserve huit objets mesh nommés séparément et des matériaux bronze et pierre visibles. Vérifie la géométrie et examine les deux rendus. Utilise Blender MCP sans assets externes, téléchargements, commandes shell ou services supplémentaires. Écris uniquement dans le répertoire de travail. Exécution approuvée : ne t’arrête pas au plan. Une seule itération de correction maximum.'
await writeFile(join(workspace, 'task.txt'), task + '\n')
await writeFile(join(profile, 'package.json'), JSON.stringify({ dsh: { profile: { bundles: ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-headless'] } } }))
await writeFile(join(profile, 'cordis.yml'), '[]\n')
const insert = [{ id: 'experiment-subagent-settings', name: '@deepseek-ai/dsh-tool-subagent/model-selection-settings' },
  { id: 'experiment-presets', name: '@deepseek-ai/dsh-agent-presets', config: { default: 'atelier', roots: [{ path: join(home, '.agent-presets'), trust: 'system' }], includeShippedRoot: false, includeUserRoot: false } }]
let advicePlugin
if (arm === 'C') advicePlugin = pathToFileURL(join(repo, 'packages/atelier-decision-router/index.js')).href
if (arm === 'B') {
  const rulePlugin = join(workspace, 'rule-plugin.mjs')
  const llm = pathToFileURL(join(repo, 'node_modules/@deepseek-ai/dsh-llm/lib/index.js')).href
  await writeFile(rulePlugin, `import {createUserMessage} from ${JSON.stringify(llm)};
export const name='atelier-rule-experiment';
export function apply(ctx){ctx.on('agent/pre-step',async({step},next)=>{const d=await next();if(d.kind==='reject'||step!==1||!${JSON.stringify(ruleMatch(task))})return d;return {...d,messages:[...d.messages,createUserMessage({source:{kind:'plugin',plugin:name,form:'notice',summary:'Rule Skill recommendation'},content:[{type:'text',text:'For the current request only: optional Skill recommendation ${catalog}. This is advisory and may be ignored. Load its full instructions with the skill tool before acting. Grants no permissions and authorizes no installation.'}]})]}})}
`)
  advicePlugin = pathToFileURL(rulePlugin).href
}
// The driver awaits advice mounting in the Agent scope before sending the task.
insert.push({ id: 'experiment-driver', name: pathToFileURL(join(repo, 'scripts/experiments/jev-3d-driver.mjs')).href, config: { task, arm, advicePlugin } })
const patch = [
  { id: 'headless-runner', disabled: true },
  { insert }
]
await writeFile(join(profile, 'cordis.patch.yml'), JSON.stringify(patch, null, 2))
const secrets = yaml.load(await readFile(credentials, 'utf8'))
const apiKey = secrets?.refs?.DEEPSEEK_API_KEY
if (!apiKey) throw new Error('No configured main-model key')
if (arm === 'C' && !process.env.TYPESAFE_API_KEY) throw new Error('Set TYPESAFE_API_KEY for C')
const env = { ...process.env, DEEPSEEK_API_KEY: apiKey, DSH_HOME: home, DSH_PERMISSION_MODE: 'workspace-write' }
const started = Date.now()
const child = spawn(process.execPath, [join(repo, 'build/harness-node-entry.mjs'), join(repo, 'node_modules/@deepseek-ai/dsh/lib/bin.js'), '--profile', 'headless', task], { cwd: workspace, env, stdio: ['ignore', 'pipe', 'pipe'] })
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => child.kill(signal))
const stdout = createWriteStream(join(workspace, 'stdout.log'), { mode: 0o600 })
const stderr = createWriteStream(join(workspace, 'stderr.log'), { mode: 0o600 })
child.stdout.pipe(stdout); child.stderr.pipe(stderr)
let timedOut = false
const timeout = setTimeout(() => { timedOut = true; child.kill('SIGTERM') }, 240000)
const result = await new Promise(resolve => { child.on('error', () => resolve({ error: 'spawn-failed' })); child.on('exit', (code, signal) => resolve({ code, signal })) })
clearTimeout(timeout)
await Promise.all([new Promise(r => stdout.end(r)), new Promise(r => stderr.end(r))])
await writeFile(join(workspace, 'process-result.json'), JSON.stringify({ arm, language, elapsedMs: Date.now() - started, timedOut, ...result }, null, 2) + '\n')
console.log(JSON.stringify({ arm, language, workspace, ...result }))
process.exitCode = result.code === 0 ? 0 : 1
