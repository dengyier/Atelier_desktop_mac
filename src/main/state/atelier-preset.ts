import { cp, copyFile, lstat, mkdir, mkdtemp, rename, rm } from 'node:fs/promises'
import { join } from 'node:path'

/** Install the bundled preset once while leaving later user edits untouched. */
export async function ensureAtelierPreset(dshHome: string, source: string): Promise<void> {
  const root = join(dshHome, '.agent-presets')
  const target = join(root, 'atelier')
  await mkdir(root, { recursive: true })
  try {
    await lstat(target)
    return
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }

  const staging = await mkdtemp(join(root, '.atelier-'))
  try {
    await copyFile(join(source, 'agent.cordis.yml'), join(staging, 'agent.cordis.yml'))
    await copyFile(join(source, 'preset.yml'), join(staging, 'preset.yml'))
    await cp(join(source, 'skills'), join(staging, 'skills'), { recursive: true })
    await rename(staging, target)
  } finally {
    await rm(staging, { recursive: true, force: true })
  }
}
