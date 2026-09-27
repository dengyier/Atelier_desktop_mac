import { createServer } from 'node:http'
import { afterEach, describe, expect, it } from 'vitest'
import { recommendSkill } from '../packages/atelier-decision-router/recommend.mjs'

const candidates = [{ name: 'atelier-blender-workflow', description: 'Create editable Blender sculptures with verified renders.' }]
const answer = (choice = 's0') => ({ model: 'jev-1.13.0', answers: { skill: {
  type: 'choice', choice, confidence: 0.9,
  probabilities: { s0: choice === 's0' ? 0.95 : 0.05, none: choice === 'none' ? 0.95 : 0.05 }
} }, usage: { input_tokens: 220, output_tokens: 12 } })
const servers: ReturnType<typeof createServer>[] = []
afterEach(async () => { await Promise.all(servers.splice(0).map(server => new Promise<void>(resolve => server.close(() => resolve())))) })

describe('Jev skill recommendation', () => {
  it('sends a bounded typed request and maps only known IDs to advice', async () => {
    let sent: unknown
    const server = createServer(async (req, res) => {
      expect(req.url).toBe('/v1/systemone')
      expect(req.headers.authorization).toBe('Bearer test-only-key')
      let body = ''
      for await (const chunk of req) body += chunk
      sent = JSON.parse(body)
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(answer()))
    })
    servers.push(server)
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('No address')
    const result = await recommendSkill({ task: 'Create a sculpture', candidates, apiKey: 'test-only-key',
      fetchImpl: (_url, init) => fetch(`http://127.0.0.1:${address.port}/v1/systemone`, init) })
    expect(result.status).toBe('recommended')
    expect(result.skill).toBe('atelier-blender-workflow')
    expect(sent).toMatchObject({ model: 'jev-1.13.0', state: { task: 'Create a sculpture' },
      questions: { skill: { type: 'choice', criteria: { none: expect.any(String), s0: expect.any(Object) } } } })
    expect(JSON.stringify(sent)).not.toContain('test-only-key')
  })

  it('keeps no-match separate from a recommendation', async () => {
    const result = await recommendSkill({ task: 'Hello', candidates, apiKey: 'test',
      fetchImpl: async () => Response.json(answer('none')) })
    expect(result.status).toBe('no-match')
    expect(result.skill).toBeNull()
  })

  it('makes no request without a key or with oversized input', async () => {
    let calls = 0
    const fetchImpl: typeof fetch = async () => { calls++; return Response.json(answer()) }
    expect((await recommendSkill({ task: 'hi', candidates, fetchImpl })).reason).toBe('missing-key')
    expect((await recommendSkill({ task: 'x'.repeat(8001), candidates, apiKey: 'test', fetchImpl })).reason).toBe('input-too-large')
    expect(calls).toBe(0)
  })

  it.each([401, 429, 529])('falls back on HTTP %s without exposing response data', async status => {
    const result = await recommendSkill({ task: 'hi', candidates, apiKey: 'test',
      fetchImpl: async () => new Response('private provider data', { status }) })
    expect(result).toMatchObject({ status: 'fallback', reason: 'service-error', httpStatus: status })
    expect(JSON.stringify(result)).not.toContain('private')
  })

  it.each(['unknown-id', 'wrong-version', 'bad-probability'])('rejects %s responses', async failure => {
    const data = answer()
    if (failure === 'unknown-id') data.answers.skill.choice = 'install-random-tool'
    if (failure === 'wrong-version') data.model = 'unexpected-version'
    if (failure === 'bad-probability') data.answers.skill.probabilities.s0 = 2
    expect((await recommendSkill({ task: 'hi', candidates, apiKey: 'test',
      fetchImpl: async () => Response.json(data) })).reason).toBe('invalid-response')
  })

  it('bounds an unresponsive provider and handles cancellation', async () => {
    const hanging: typeof fetch = () => new Promise(() => {})
    expect((await recommendSkill({ task: 'hi', candidates, apiKey: 'test', timeoutMs: 15, fetchImpl: hanging })).reason).toBe('timeout')
    const controller = new AbortController()
    const request = recommendSkill({ task: 'hi', candidates, apiKey: 'test', signal: controller.signal, fetchImpl: hanging })
    controller.abort()
    expect((await request).reason).toBe('cancelled')
  })
})
