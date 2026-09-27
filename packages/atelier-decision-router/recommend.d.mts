export const MODEL: 'jev-1.13.0'
export interface SkillCandidate { name: string; description: string }
export interface Recommendation {
  status: 'recommended' | 'no-match' | 'fallback'
  skill: string | null
  reason?: string
  elapsedMs: number
  httpStatus?: number
  model?: string
  confidence?: number
  probabilities?: Record<string, number>
  usage?: { input_tokens: number; output_tokens: number }
}
export function recommendSkill(options: { task: string; candidates: SkillCandidate[]; apiKey?: string; signal?: AbortSignal; timeoutMs?: number; fetchImpl?: typeof fetch }): Promise<Recommendation>
