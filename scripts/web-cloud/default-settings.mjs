import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parseDocument } from 'yaml'
import { withFileLock, writeFileAtomic } from '@deepseek-ai/dsh-atomic-write'

// Use the same settings document and writer lock as the Harness settings provider.
export async function ensureDefaultLanguage(home) {
  const filename = join(home, 'settings.yaml')
  await withFileLock(filename, async () => {
    let source = ''
    try { source = await readFile(filename, 'utf8') }
    catch (error) { if (error.code !== 'ENOENT') throw error }
    const document = parseDocument(source)
    if (document.errors.length) throw document.errors[0]
    if (document.getIn(['locale', 'preference']) != null) return
    document.setIn(['locale', 'preference'], 'en')
    await writeFileAtomic(filename, document.toString(), { mode: 0o600 })
  })
}
