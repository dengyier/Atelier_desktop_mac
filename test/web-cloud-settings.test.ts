import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { describe, expect, it, vi } from 'vitest'

function createSnapshotStore(initial: unknown) {
  let snapshot = initial
  return { getSnapshot: () => snapshot, set: (value: unknown) => { snapshot = value }, subscribe: () => () => {} }
}

function settingsPlugin(cloud = false) {
  let factory: (require: (id: string) => unknown) => { apply: (ctx: object, config?: object) => void }
  runInNewContext(readFileSync('node_modules/@deepseek-ai/dsh-client-ui-settings/lib/client.js', 'utf8'), {
    __ATELIER_CLOUD_SETTINGS__: cloud,
    window: { __ModuleLoader__: { load: (entry: { factory: typeof factory }) => { factory = entry.factory } } }
  })
  class Service {
    ctx: Record<string, unknown>
    constructor(ctx: Record<string, unknown>, name: string) { this.ctx = ctx; ctx[name] = this }
  }
  return factory!(id => {
    if (id === '@deepseek-ai/cordis') return { Service }
    if (id === '@deepseek-ai/dsh-client-store') return { createSnapshotStore }
    throw new Error(`Unexpected dependency ${id}`)
  })
}

async function load(isLoopback: boolean, cloud = false) {
  const describeSettings = vi.fn(async () => ({ ok: true, value: { writable: true, namespaces: [] } }))
  const ctx = {
    remote: { $host: { isLoopback }, settings: { describe: describeSettings }, $on: () => () => {} },
    effect: (fn: () => unknown) => fn(), on: () => () => {},
    settingsScope: undefined as unknown as { describe(): { ensure(): Promise<void>; getSnapshot(): { status: string; view?: { writable: boolean } } } }
  }
  settingsPlugin(cloud).apply(ctx)
  const mirror = ctx.settingsScope.describe()
  await mirror.ensure()
  return { snapshot: mirror.getSnapshot(), describeSettings }
}

describe('Web Cloud remote model settings', () => {
  it('loads host settings for an explicitly isolated cloud environment on a public domain', async () => {
    const { snapshot, describeSettings } = await load(false, true)
    expect(describeSettings).toHaveBeenCalledOnce()
    expect(snapshot.status).toBe('ready')
    expect(snapshot.view?.writable).toBe(true)
  })
  it('keeps unconfigured remote sites process-local', async () => {
    const { snapshot, describeSettings } = await load(false)
    expect(describeSettings).not.toHaveBeenCalled()
    expect(snapshot.status).toBe('unavailable')
  })
  it('preserves desktop and loopback settings', async () => {
    expect((await load(true)).snapshot.status).toBe('ready')
  })
})
