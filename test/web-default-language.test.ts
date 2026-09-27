import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { parse } from 'yaml'
import { describe, expect, it } from 'vitest'
import { ensureDefaultLanguage } from '../scripts/web-cloud/default-settings.mjs'

describe('Web Cloud default language', () => {
  it('defaults to English and preserves other settings and an explicit language choice', async () => {
    const home = await mkdtemp(join(tmpdir(), 'atelier-language-'))
    try {
      await ensureDefaultLanguage(home)
      const file = join(home, 'settings.yaml')
      expect(parse(await readFile(file, 'utf8')).locale.preference).toBe('en')
      const configured = '# User settings\nlocale:\n  preference: fr\nother:\n  enabled: true\n'
      await writeFile(file, configured)
      await ensureDefaultLanguage(home)
      expect(await readFile(file, 'utf8')).toBe(configured)
      await writeFile(file, '# Keep this comment\nother:\n  enabled: true\n')
      await ensureDefaultLanguage(home)
      const updated = await readFile(file, 'utf8')
      expect(updated).toContain('# Keep this comment')
      expect(parse(updated)).toEqual({ locale: { preference: 'en' }, other: { enabled: true } })
    } finally {
      await rm(home, { recursive: true, force: true })
    }
  })
})
