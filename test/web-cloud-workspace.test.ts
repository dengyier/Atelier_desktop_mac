import { expect, it, vi } from 'vitest'
import { apply } from '../build/atelier-web-cloud-workspace.mjs'

it('registers the private cloud working directory for a fresh environment', async () => {
  const create = vi.fn(async () => ({}))
  await apply({ workspaceRegistry: { list: () => [], create } })
  expect(create).toHaveBeenCalledWith('/data/workspace', 'My workspace')
})
it('preserves existing user workspaces', async () => {
  const create = vi.fn(async () => ({}))
  await apply({ workspaceRegistry: { list: () => [{ id: 'existing' }], create } })
  expect(create).not.toHaveBeenCalled()
})
