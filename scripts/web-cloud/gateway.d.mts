import type { Server } from 'node:http'
import type { Runner } from './runtime.mjs'

export function createCloudGateway(options: {
  authBase: string
  origin: string
  runtime: { get(userId: string): Promise<Runner>; invalidate?(userId: string): void }
  fetcher?: typeof fetch
  loginHtml: string
  accountHtml?: string
}): Server
