import { expect, it } from 'vitest'
import { runInNewContext } from 'node:vm'
import { enableCloudSettings } from '../scripts/web-cloud/cloud-page.mjs'
it('enables remote settings before the isolated cloud boot executes', () => {
  const html = enableCloudSettings('<script>globalThis["__DSH_BOOT__"]={rev:"test"};</script>')
  const page: Record<string, unknown> = {}
  runInNewContext(html.slice(8, -9), page)
  expect(page.__ATELIER_CLOUD_SETTINGS__).toBe(true)
  expect(page.__DSH_BOOT__).toEqual({ rev: 'test' })
})
