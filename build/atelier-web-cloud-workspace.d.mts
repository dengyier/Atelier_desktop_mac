export const name: string
export const inject: string[]
export function apply(ctx: {
  workspaceRegistry: { list(): unknown[]; create(path: string, title: string): Promise<unknown> }
}): Promise<void>
