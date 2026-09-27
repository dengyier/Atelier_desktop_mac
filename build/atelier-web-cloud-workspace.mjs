export const name = 'atelier-web-cloud-workspace'
export const inject = ['workspaceRegistry']

// A fresh cloud volume has no local directory or previous session to select.
// Register its private working directory through the authoritative registry.
export async function apply(ctx) {
  if (ctx.workspaceRegistry.list().length === 0) {
    await ctx.workspaceRegistry.create('/data/workspace', 'My workspace')
  }
}
