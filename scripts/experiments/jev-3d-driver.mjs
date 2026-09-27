import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { installModelSelection } from '@deepseek-ai/dsh-agent'

export const name = 'atelier-jev-3d-experiment'
export const inject = ['agents', 'sessions', 'agentDefaultModel', 'agentPresets', 'tools', 'skills']

// Thin experiment driver over the existing Harness, not a separate Agent runtime.
export function apply(ctx, config) {
  const decisions = []
  const exit = ctx.get('appExit')
  if (config.arm === 'C') {
    const original = globalThis.fetch
    globalThis.fetch = async (url, init) => {
      if (String(url) !== 'https://api.typesafe.ai/v1/systemone') return original(url, init)
      const started = performance.now()
      const response = await original(url, init)
      const data = response.ok ? await response.clone().json() : null
      decisions.push({ status: response.status, elapsedMs: performance.now() - started, model: data?.model, answer: data?.answers?.skill, usage: data?.usage })
      return response
    }
    ctx.effect(() => () => { globalThis.fetch = original })
  }
  run(ctx, config, decisions, exit).catch(async error => {
    await writeFile(join(process.cwd(), 'driver-error.json'), JSON.stringify({ error: 'harness-driver-failed', code: error?.code, detail: error?.message?.slice(0, 500) }) + '\n')
    if (exit) exit(1)
  })
}

async function run(ctx, config, decisions, exit) {
  await ctx.get('loader')?.await()
  const selection = ctx.agentDefaultModel.currentSelection()
  const started = performance.now()
  const handle = await ctx.agents.create({
    sessionId: `session-${randomUUID()}`,
    meta: { cwd: process.cwd(), agentPreset: 'atelier' },
    agentOptions: { provider: selection.provider, model: selection.model },
    setup: async agentCtx => {
      await ctx.agentPresets.mount(agentCtx, 'atelier')
      if (config.advicePlugin) await agentCtx.plugin(await import(config.advicePlugin), { enabled: true, timeoutMs: 2000 })
      installModelSelection(agentCtx, { current: selection, assembled: undefined })
      const blender = ['get_addon_status', 'get_scene_info', 'get_object_info', 'get_viewport_screenshot', 'execute_blender_code', 'describe_node_type', 'bpy_api_lookup', 'export_scene']
      agentCtx.get('tools').restrict({ allow: ['skill', 'read_image', ...blender.map(n => `mcp__blender__${n}`)] })
    }
  })
  const { agent } = handle
  if (!ctx.tools.get('skill', agent) || !ctx.tools.get('mcp__blender__get_addon_status', agent) || !ctx.tools.get('mcp__blender__execute_blender_code', agent)) throw new Error('Experiment preflight: scoped Skill or Blender tools are missing')
  const catalog = await ctx.skills.snapshot({ cwd: agent.session.header.cwd, scope: agent })
  await writeFile(join(process.cwd(), 'catalog-preflight.json'), JSON.stringify({ complete: catalog.complete, keyPresent: !!process.env.TYPESAFE_API_KEY?.trim(),
    skills: catalog.skills.filter(s => s.invocation.modelInvocable).map(s => ({ name: s.name, descriptionLength: [s.description, s.whenToUse].filter(Boolean).join('\n').length })) }, null, 2) + '\n')
  if (config.arm === 'C' && !process.env.TYPESAFE_API_KEY?.trim()) throw new Error('Experiment preflight: TypeSafe key missing from Harness process')
  await agent.whenIdle()
  agent.followup(createUserMessage({ source: { kind: 'user' }, content: [{ type: 'text', text: config.task }] }))
  await agent.whenIdle()
  await ctx.sessions.flush(agent.session)
  const events = agent.session.snapshotEvents()
  const end = events.filter(e => e.type === 'turn/end').at(-1)
  const assistant = events.filter(e => e.type === 'assistant/message')
  const usages = assistant.flatMap(e => e.data.usage ? [e.data.usage] : [])
  const messages = events.filter(e => e.type === 'user/message')
  await writeFile(join(process.cwd(), 'session-events.json'), JSON.stringify(events, null, 2) + '\n')
  const metrics = { model: selection, durationMs: performance.now() - started, reason: end?.data.reason,
    assistantSteps: assistant.length, usage: usages,
    routerNotices: messages.filter(e => e.data.source?.plugin === 'atelier-decision-router').length,
    ruleNotices: messages.filter(e => e.data.source?.plugin === 'atelier-rule-experiment').length,
    skillLoads: events.filter(e => e.type === 'tool/call' && e.data.name === 'skill').length,
    decisions }
  await writeFile(join(process.cwd(), 'run-metrics.json'), JSON.stringify(metrics, null, 2) + '\n')
  console.log(JSON.stringify({ completed: end?.data.reason?.kind === 'completed', durationMs: metrics.durationMs, steps: assistant.length }))
  if (exit) exit(end?.data.reason?.kind === 'completed' ? 0 : 1)
}
