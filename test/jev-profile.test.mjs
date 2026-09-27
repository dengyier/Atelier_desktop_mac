import { spawnSync } from 'node:child_process'
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { expect, it } from 'vitest'

it('boots the opt-in package through a temporary Profile and the real Harness loader', async () => {
  const home = await mkdtemp(join(tmpdir(), 'atelier-jev-profile-'))
  try {
    const profile = join(home, 'profiles', 'web')
    const installed = join(profile, 'node_modules', 'atelier-decision-router')
    await mkdir(join(profile, 'node_modules', '@deepseek-ai'), { recursive: true })
    await cp(resolve('packages/atelier-decision-router'), installed, { recursive: true })
    const manifest = JSON.parse(await readFile(join(installed, 'package.json'), 'utf8'))
    for (const peer of Object.keys(manifest.peerDependencies)) {
      const peerManifest = JSON.parse(await readFile(resolve('node_modules', peer, 'package.json'), 'utf8'))
      expect(peer === '@deepseek-ai/cordis' || peerManifest.version === manifest.peerDependencies[peer]).toBe(true)
      await symlink(resolve('node_modules', peer), join(profile, 'node_modules', peer), 'dir')
    }
    await writeFile(join(profile, 'package.json'), JSON.stringify({ dependencies: { 'atelier-decision-router': '0.1.0' }, dsh: { profile: { bundles: [] } } }))
    await writeFile(join(profile, 'cordis.yml'), JSON.stringify([{ id: 'jev-advice', name: pathToFileURL(join(installed, 'index.js')).href, config: { enabled: true } }]))
    const entry = join(home, 'smoke.mjs')
    await writeFile(entry, `
      import { boot, loadProfile } from ${JSON.stringify(pathToFileURL(resolve('node_modules/@deepseek-ai/dsh-app-boot/lib/index.js')).href)};
      import { SkillRegistry } from ${JSON.stringify(pathToFileURL(resolve('node_modules/@deepseek-ai/dsh-skill/lib/index.js')).href)};
      const profile = loadProfile('jev-smoke', 'web', ${JSON.stringify(resolve('node_modules/@deepseek-ai/dsh/package.json'))}, ${JSON.stringify(home)});
      const ctx = await boot('jev-smoke', ${JSON.stringify(join(profile, 'cordis.yml'))}, profile.layers.flatMap(layer => layer.patches), async ctx => {
        ctx.provide('agents', {});
        ctx.provide('tools', { get: () => undefined });
        await ctx.plugin(SkillRegistry);
      });
      console.log('JEV_PROFILE_ACTIVE');
      await ctx.fiber.dispose();
    `)
    const result = spawnSync(process.execPath, [resolve('build/harness-node-entry.mjs'), entry], { encoding: 'utf8', timeout: 15000, env: { ...process.env, TYPESAFE_API_KEY: '' } })
    expect(result.error).toBeUndefined()
    expect(result.status, result.stderr).toBe(0)
    expect(result.stdout).toContain('JEV_PROFILE_ACTIVE')
  } finally { await rm(home, { recursive: true, force: true }) }
})
