export interface Runner {
  name: string
  port: number
  tokenUrl: string
  cookie: string
}

export function tenantId(userId: string): string

export class DockerRuntime {
  constructor(options: {
    image: string
    maxActive?: number
    docker?: string
    command?: (binary: string, args: string[], options: { timeout: number; maxBuffer: number }) => Promise<{ stdout: string }>
  })
  get(userId: string): Promise<Runner>
  invalidate(userId: string): void
}
