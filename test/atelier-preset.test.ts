import { afterEach, describe, expect, it } from 'vitest'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { ensureAtelierPreset } from '../src/main/state/atelier-preset'

const roots: string[] = []
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })))
})

describe('Atelier preset installation', () => {
  it('installs the bundled composition and skill once without overwriting user edits', async () => {
    const root = await mkdtemp(join(tmpdir(), 'atelier-preset-test-'))
    roots.push(root)
    const source = join(root, 'source')
    const home = join(root, 'home')
    await mkdir(join(source, 'skills', 'atelier-blender-workflow'), { recursive: true })
    await writeFile(join(source, 'agent.cordis.yml'), '- id: persona\n')
    await writeFile(join(source, 'preset.yml'), 'name: Atelier\n')
    await writeFile(join(source, 'skills', 'atelier-blender-workflow', 'SKILL.md'), '# workflow\n')

    await ensureAtelierPreset(home, source)
    const target = join(home, '.agent-presets', 'atelier')
    expect(await readFile(join(target, 'skills', 'atelier-blender-workflow', 'SKILL.md'), 'utf8'))
      .toBe('# workflow\n')

    await writeFile(join(target, 'preset.yml'), 'name: My Atelier\n')
    await ensureAtelierPreset(home, source)
    expect(await readFile(join(target, 'preset.yml'), 'utf8')).toBe('name: My Atelier\n')
  })
})
