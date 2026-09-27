import type { Context } from '@deepseek-ai/cordis'
export declare const name: 'atelier-decision-router'
export declare const inject: string[]
export interface Config { enabled?: boolean; timeoutMs?: number }
export declare function apply(ctx: Context, config?: Config): void
