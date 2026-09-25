import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const readmes = [
  'README.md',
  'README.zh.md',
  'README.fr.md',
  'README.ja.md',
  'README.ru.md',
  'README.es.md',
  'README.pt.md'
]

const requiredFacts = [
  'Atelier Desktop',
  'mcp-for-blender',
  'npm ci',
  'npm run dev',
  'npm run package:dev:mac:arm64',
  'https://artsmart.space/',
  'docs/development.md',
  'docs/architecture.md'
]

describe('localized README parity', () => {
  for (const path of readmes) {
    it(`${path} carries the current product facts`, () => {
      const content = readFileSync(path, 'utf8')

      for (const fact of requiredFacts) expect(content).toContain(fact)
      expect(content).not.toContain('https://github.com/dataelement/dsh-desktop/releases')
      expect(content).not.toContain('dsh-desktop-hero')
    })
  }

  it('keeps every relative Markdown link resolvable', () => {
    const documents = [
      ...readmes,
      'README-ATELIER.md',
      'RELEASE_NOTES.md',
      'docs/development.md',
      'docs/architecture.md',
      'docs/release-runbook.md',
      'docs/preset-packages.md'
    ]

    for (const path of documents) {
      const content = readFileSync(path, 'utf8')
      const links = content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)

      for (const match of links) {
        const target = match[1]
        if (!target) continue
        if (/^(?:https?:|mailto:)/.test(target)) continue
        const withoutAnchor = target.split('#', 1)[0]
        if (!withoutAnchor) continue
        expect(
          existsSync(resolve(dirname(path), decodeURIComponent(withoutAnchor))),
          `${path} links to missing ${target}`
        ).toBe(true)
      }
    }
  })

  it('does not publish internal working documents', () => {
    expect(existsSync('docs/preset-square-mvp.md')).toBe(false)
    expect(existsSync('docs/windows-profile-repair.md')).toBe(false)
  })
})
