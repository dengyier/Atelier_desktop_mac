import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { recommendSkill, MODEL } from '../../packages/atelier-decision-router/recommend.mjs'

// Synthetic, non-sensitive labels fixed before the first live run.
export const fixtures = [
  ['en', 'dev', 'Build an editable geometric sculpture in Blender and render two views.', true],
  ['en', 'dev', 'Create a museum exhibition scene with sculptures and export a GLB.', true],
  ['en', 'dev', 'Model a hanging art installation with real dimensions and a blend file.', true],
  ['en', 'dev', 'Find opening hours for the Louvre.', false],
  ['en', 'dev', 'Summarize these meeting notes.', false],
  ['en', 'dev', 'Do not use Blender; write a short poem about sculpture.', false],
  ['fr', 'dev', 'Crée une sculpture géométrique modifiable dans Blender et deux rendus.', true],
  ['fr', 'dev', 'Construis une scène d’exposition avec des œuvres 3D et un fichier GLB.', true],
  ['fr', 'dev', 'Modélise une installation artistique suspendue et livre le fichier blend.', true],
  ['fr', 'dev', 'Trouve les horaires du musée d’Orsay.', false],
  ['fr', 'dev', 'Résume les notes de cette réunion.', false],
  ['fr', 'dev', 'N’utilise pas Blender ; écris un poème sur la sculpture.', false],
  ['en', 'holdout', 'I need a three-dimensional pavilion for a gallery, editable with two camera renders.', true],
  ['en', 'holdout', 'Produce a scale-accurate digital maquette of a kinetic artwork.', true],
  ['en', 'holdout', 'Deliver a .blend containing an abstract bronze artwork and verified views.', true],
  ['en', 'holdout', 'Translate this curatorial statement into French.', false],
  ['en', 'holdout', 'Explain the difference between Cubism and Impressionism.', false],
  ['en', 'holdout', 'Blender is mentioned in a book; I only want a plain-text bibliography.', false],
  ['fr', 'holdout', 'Il me faut un pavillon tridimensionnel de galerie, modifiable, avec deux vues de caméra.', true],
  ['fr', 'holdout', 'Réalise une maquette numérique à l’échelle d’une œuvre cinétique.', true],
  ['fr', 'holdout', 'Livre un .blend avec une œuvre abstraite en bronze et des vues vérifiées.', true],
  ['fr', 'holdout', 'Traduis ce texte de commissariat en anglais.', false],
  ['fr', 'holdout', 'Explique la différence entre le cubisme et l’impressionnisme.', false],
  ['fr', 'holdout', 'Blender apparaît dans un livre ; je veux seulement une bibliographie en texte brut.', false]
].map(([language, split, task, match], i) => ({ id: `case-${i + 1}`, language, split, task, match }))

export function ruleMatch(task) {
  if (/do not|n’utilise pas|only.*(?:poem|plain-text)|seulement.*texte/i.test(task)) return false
  return /blender|\.blend|\bglb\b|sculpture|installation|exposition|exhibition/i.test(task)
}

async function run() {
  const skillFile = new URL('../../build/atelier-preset/skills/atelier-blender-workflow/SKILL.md', import.meta.url)
  const source = await readFile(skillFile, 'utf8')
  const name = /^name: (.+)$/m.exec(source)?.[1]
  const description = /^description: (.+)$/m.exec(source)?.[1]
  if (!name || !description) throw new Error('Missing bundled Skill metadata')
  const live = process.argv.includes('--live')
  let apiKey = process.env.TYPESAFE_API_KEY
  if (process.argv.includes('--stdin-key')) {
    apiKey = ''
    for await (const chunk of process.stdin) apiKey += chunk
    apiKey = apiKey.trim()
  }
  if (live && !apiKey?.trim()) throw new Error('Set TYPESAFE_API_KEY for a live experiment')
  const rows = []
  for (const f of fixtures) {
    const result = live ? await recommendSkill({ task: f.task, candidates: [{ name, description }], apiKey, timeoutMs: 5000 }) : null
    rows.push({ ...f, expected: f.match ? name : null, ruleCorrect: ruleMatch(f.task) === f.match,
      result, jevCorrect: result && result.status !== 'fallback' ? result.skill === (f.match ? name : null) : null })
    if (live) process.stdout.write(`${f.id}: ${result.status}${result.reason ? ` (${result.reason})` : ''}\n`)
  }
  const groups = ['en', 'fr'].flatMap(language => ['dev', 'holdout'].map(split => {
    const group = rows.filter(r => r.language === language && r.split === split)
    return { language, split, count: group.length, ruleCorrect: group.filter(r => r.ruleCorrect).length,
      jevCorrect: live ? group.filter(r => r.jevCorrect === true).length : null, fallback: live ? group.filter(r => r.result.status === 'fallback').length : null }
  }))
  const latencies = rows.flatMap(r => r.result && r.result.status !== 'fallback' ? [r.result.elapsedMs] : []).sort((a, b) => a - b)
  const report = { createdAt: new Date().toISOString(), model: MODEL, mode: live ? 'live-recommendation-only' : 'offline-fixtures-only',
    limitations: '24 synthetic tasks, one installed Skill. No main-model or complete Blender task comparison. Labels are developer judgments. No production capacity claim.',
    groups, latencyMs: latencies.length ? { p50: latencies[Math.ceil(latencies.length * .5) - 1], p95: latencies[Math.ceil(latencies.length * .95) - 1] } : null,
    inputTokens: rows.reduce((sum, r) => sum + (r.result?.usage?.input_tokens ?? 0), 0), rows }
  const outputIndex = process.argv.indexOf('--output')
  if (outputIndex >= 0) {
    const output = process.argv[outputIndex + 1]
    if (!output) throw new Error('Missing output path')
    await writeFile(output, JSON.stringify(report, null, 2) + '\n', { flag: 'wx', mode: 0o600 })
  }
  process.stdout.write(JSON.stringify({ mode: report.mode, groups, latencyMs: report.latencyMs, inputTokens: report.inputTokens }) + '\n')
}
if (process.argv[1] === fileURLToPath(import.meta.url)) await run()
