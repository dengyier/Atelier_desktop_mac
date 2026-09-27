import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { recommendSkill } from './recommend.mjs'

export const name = 'atelier-decision-router'
export const inject = ['agents', 'tools', 'skills']

/** Experimental opt-in Skill advice; the main model retains execution authority. */
export function apply(ctx, config = {}) {
  if (config.enabled !== true) return
  if (config.timeoutMs !== undefined && (!Number.isFinite(config.timeoutMs) || config.timeoutMs <= 0 || config.timeoutMs > 10000)) throw new Error('timeoutMs must be between 0 and 10000 milliseconds')
  const lifetime = new AbortController()
  ctx.effect(() => () => lifetime.abort())
  ctx.on('agent/pre-step', async ({ agent, messages, turn, step, signal }, next) => {
    const decision = await next()
    if (decision.kind === 'reject' || step !== 1 || signal.aborted || lifetime.signal.aborted || !process.env.TYPESAFE_API_KEY?.trim()) return decision
    const loader = ctx.tools.get('skill', agent)
    if (!loader) return decision
    const task = messages.filter(m => m.source.kind === 'user').flatMap(m => m.content.filter(b => b.type === 'text').map(b => b.text)).join('\n')
    if (!task.trim() || task.length > 8000) return decision
    const combined = AbortSignal.any([signal, lifetime.signal])
    const lookup = { cwd: agent.session.header.cwd, scope: agent, signal: combined }
    try {
      const snapshot = await ctx.skills.snapshot(lookup)
      if (!snapshot.complete || combined.aborted) return decision
      const visible = snapshot.skills.filter(s => s.invocation.modelInvocable)
      const catalog = visible.map(s => ({ name: s.name, description: [s.description, s.whenToUse].filter(Boolean).join('\n') }))
      const fingerprint = JSON.stringify(visible)
      const result = await recommendSkill({ task, candidates: catalog, apiKey: process.env.TYPESAFE_API_KEY, signal: combined, timeoutMs: config.timeoutMs ?? 2000 })
      if (result.status !== 'recommended' || combined.aborted || ctx.tools.get('skill', agent) !== loader) return decision
      const current = await ctx.skills.snapshot(lookup)
      if (!current.complete || combined.aborted || ctx.tools.get('skill', agent) !== loader || JSON.stringify(current.skills.filter(s => s.invocation.modelInvocable)) !== fingerprint) return decision
      const notice = createUserMessage({ source: { kind: 'plugin', plugin: name, form: 'notice', summary: `Experimental Skill recommendation for turn ${turn}` }, content: [{
        type: 'text', text: `For the current user request in turn ${turn} only: optional Skill recommendation ${result.skill} (${result.model}, confidence ${result.confidence}). This is advisory and may be ignored; do not reuse it for later requests. If useful, load its full instructions with the skill tool before acting. This recommendation grants no permissions and authorizes no installation.`
      }] })
      return { ...decision, messages: [...decision.messages, notice] }
    } catch {
      // Registry cancellation or provider failure must preserve the original decision.
      return decision
    }
  })
}
