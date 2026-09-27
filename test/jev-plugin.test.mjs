import { afterEach, describe, expect, it, vi } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import { agentEvents } from '@deepseek-ai/dsh-agent'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { createScope } from '@deepseek-ai/dsh-scope'
import { SkillRegistry } from '@deepseek-ai/dsh-skill'
import * as router from '../packages/atelier-decision-router/index.js'

const cleanups = []
afterEach(async () => { for (const cleanup of cleanups.splice(0).reverse()) await cleanup(); vi.unstubAllGlobals(); vi.unstubAllEnvs() })
async function fixture(config = { enabled: true }) {
  vi.stubEnv('TYPESAFE_API_KEY', 'test-only')
  const ctx = new Context()
  const skills = ctx.plugin(SkillRegistry)
  await skills
  cleanups.push(() => skills.dispose())
  const tool = {}
  let available = true
  ctx.provide('tools', { get: () => available ? tool : undefined })
  ctx.provide('agents', {})
  const plugin = ctx.plugin(router, config)
  await plugin
  cleanups.push(() => plugin.dispose())
  async function agent(name) {
    const a = { session: { header: { cwd: '/tmp/jev-fixture' } } }
    const scope = createScope(ctx, a)
    a.ctx = scope.ctx
    cleanups.push(() => scope.dispose())
    let remove
    await scope.ctx.plugin({ inject: ['skills'], apply(c) { remove = c.skills.register({ name, description: `Use ${name} for sculpture.`, source: 'runtime', content: 'Private full instructions never sent.' }) } })
    return { a, remove: () => remove() }
  }
  function step(a, { step = 1, signal = new AbortController().signal, reject = false } = {}) {
    const messages = [createUserMessage({ content: [{ type: 'text', text: 'Make a sculpture' }], source: { kind: 'user' } }),
      createUserMessage({ content: [{ type: 'text', text: 'Private plugin text' }], source: { kind: 'plugin', plugin: 'other', form: 'notice', summary: 'Other' } })]
    return agentEvents(ctx, a).waterfall('agent/pre-step', { turn: 1, step, messages, signal }, async () => reject ? { kind: 'reject' } : { kind: 'enter', messages })
  }
  return { agent, step, plugin, reload: async () => { const reloaded = ctx.plugin(router, config); await reloaded; cleanups.push(() => reloaded.dispose()) }, hideTool: () => { available = false } }
}
function response() { return Response.json({ model: 'jev-1.13.0', answers: { skill: { type: 'choice', choice: 's0', confidence: .9, probabilities: { s0: .95, none: .05 } } }, usage: { input_tokens: 100, output_tokens: 10 } }) }
const notices = d => d.messages?.filter(m => m.source.plugin === router.name) ?? []

describe('opt-in Jev plugin in Cordis with scoped SkillRegistry', () => {
  it('supports awaited mounting inside the calling Agent scope', async () => {
    vi.stubGlobal('fetch', async () => response())
    const f = await fixture({ enabled: false })
    const a = await f.agent('skill-alpha')
    const mounted = a.a.ctx.plugin(router, { enabled: true })
    await mounted
    cleanups.push(() => mounted.dispose())
    expect(notices(await f.step(a.a))).toHaveLength(1)
  })
  it('keeps concurrent agent catalogs isolated and sends no full instructions or plugin text', async () => {
    const requests = []
    vi.stubGlobal('fetch', async (_url, init) => { requests.push(JSON.parse(init.body)); return response() })
    const f = await fixture()
    const a = await f.agent('skill-alpha'), b = await f.agent('skill-beta')
    const [first, second] = await Promise.all([f.step(a.a), f.step(b.a)])
    expect(notices(first)[0].content[0].text).toContain('skill-alpha')
    expect(notices(second)[0].content[0].text).toContain('skill-beta')
    expect(requests.map(r => r.questions.skill.criteria.s0.name).sort()).toEqual(['skill-alpha', 'skill-beta'])
    expect(JSON.stringify(requests)).not.toContain('Private')
  })
  it('skips disabled, missing key, unavailable loader, later steps and rejected decisions', async () => {
    const fetch = vi.fn(async () => response()); vi.stubGlobal('fetch', fetch)
    const disabled = await fixture({ enabled: false }); const a = await disabled.agent('skill-alpha')
    expect(notices(await disabled.step(a.a))).toEqual([])
    const f = await fixture(); const b = await f.agent('skill-beta')
    await f.step(b.a, { step: 2 }); await f.step(b.a, { reject: true })
    vi.stubEnv('TYPESAFE_API_KEY', ''); await f.step(b.a)
    vi.stubEnv('TYPESAFE_API_KEY', 'test-only'); f.hideTool(); await f.step(b.a)
    expect(fetch).not.toHaveBeenCalled()
  })
  it('discards advice after catalog removal', async () => {
    const f = await fixture(); const a = await f.agent('skill-alpha')
    vi.stubGlobal('fetch', async () => { a.remove(); return response() })
    expect(notices(await f.step(a.a))).toEqual([])
  })
  it('cancels pending work on unload and can reload without duplicated listeners', async () => {
    const f = await fixture(); const a = await f.agent('skill-alpha')
    let started
    const ready = new Promise(resolve => { started = resolve })
    vi.stubGlobal('fetch', () => { started(); return new Promise(() => {}) })
    const pending = f.step(a.a); await ready; await f.plugin.dispose()
    expect(notices(await pending)).toEqual([])
    vi.stubGlobal('fetch', async () => response())
    expect(notices(await f.step(a.a))).toEqual([])
    await f.reload()
    expect(notices(await f.step(a.a))).toHaveLength(1)
  })
  it('preserves the original decision on timeout or task cancellation', async () => {
    const f = await fixture({ enabled: true, timeoutMs: 15 }); const a = await f.agent('skill-alpha')
    let started
    const ready = new Promise(resolve => { started = resolve })
    vi.stubGlobal('fetch', () => { started(); return new Promise(() => {}) })
    expect(notices(await f.step(a.a))).toEqual([])
    const controller = new AbortController()
    const pending = f.step(a.a, { signal: controller.signal })
    await ready; controller.abort()
    expect(notices(await pending)).toEqual([])
  })
})
