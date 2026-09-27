import type { Server } from 'node:http'
import type { Runner } from './runtime.mjs'

export function createCloudGateway(options: {
  origin: string
  runtime: { get(userId: string): Promise<Runner>; invalidate?(userId: string): void }
}): Server
