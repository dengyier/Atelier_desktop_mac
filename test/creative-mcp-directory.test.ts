import { readFile } from 'node:fs/promises'
import path from 'node:path'
import vm from 'node:vm'
import { describe, expect, it } from 'vitest'

type View = { type: string | ((props: Record<string, unknown>) => View); props: Record<string, unknown> & { children: View[] } }

async function loadDirectory(marketInstalled: boolean, request?: (url: string, options: Record<string, unknown>) => Promise<unknown>) {
  const source = await readFile(path.resolve(import.meta.dirname, '../packages/dsh-desktop-market-installer/client.js'), 'utf8')
  let definition: { factory: (require: (id: string) => unknown) => { apply: (ctx: unknown) => void } } | undefined
  const state: unknown[] = []
  let stateIndex = 0
  const React = {
    Fragment: 'fragment',
    createElement: (type: View['type'], props: Record<string, unknown> | null, ...children: View[]): View => ({ type, props: { ...props, children } }),
    useState: (initial: unknown) => {
      const index = stateIndex++
      if (!(index in state)) state[index] = initial
      return [state[index], (next: unknown) => { state[index] = typeof next === 'function' ? (next as (current: unknown) => unknown)(state[index]) : next }]
    },
    useEffect: () => undefined
  }
  const context = {
    fetch: request,
    __DSH_BOOT__: { entries: marketInstalled ? [{ id: 'dshmarket' }] : [] },
    document: {
      querySelector: () => null,
      createElement: () => ({ dataset: {}, textContent: '' }),
      head: { appendChild: () => undefined }
    },
    window: { __ModuleLoader__: { load: (value: typeof definition) => { definition = value } } }
  }
  vm.runInNewContext(source, context)
  expect(definition).toBeDefined()
  const plugin = definition!.factory((id) => {
    if (id === 'react') return React
    throw new Error(`Unexpected dependency: ${id}`)
  })
  const registrations: Array<{ config: { name: string; id: string; order: number; label: () => string }; component: (props: Record<string, unknown>) => View }> = []
  let dictionaries: Record<string, Record<string, string>> = {}
  const marketVisibility: boolean[] = []
  const effects: Array<() => void> = []
  const effect = (callback: () => unknown) => {
    const dispose = callback()
    if (typeof dispose === 'function') effects.push(dispose as () => void)
  }
  plugin.apply({
    effect,
    inject: (_deps: string[], callback: (scope: unknown) => void) => {
      if (marketInstalled) callback({
        market: { setSettingsVisible: (visible: boolean) => marketVisibility.push(visible) },
        effect
      })
    },
    locale: {
      register: (_ns: string, value: typeof dictionaries) => { dictionaries = value },
      bind: () => (key: string) => dictionaries.zh?.[key] ?? key
    },
    slots: {
      inject: (_name: string, callback: () => unknown) => callback(),
      register: (config: { name: string; id: string; order: number; label: () => string }, component: (props: Record<string, unknown>) => View) => {
        registrations.push({ config, component })
        return () => undefined
      }
    }
  })
  expect(Object.keys(dictionaries.zh ?? {})).toEqual(Object.keys(dictionaries.en ?? {}))
  expect(Object.keys(dictionaries.fr ?? {})).toEqual(Object.keys(dictionaries.en ?? {}))
  expect(registrations).toHaveLength(1)
  expect(registrations[0]!.config).toMatchObject({ name: 'settings.section', id: 'mcp-connector-market', order: 41 })
  expect(registrations[0]!.config.label()).toBe('MCP 连接器市场')
  expect(dictionaries.en?.mcpTitle).toBe('MCP Connector Market')
  expect(dictionaries.fr?.mcpTitle).toBe('Marché des connecteurs MCP')
  state.length = 0
  const render = () => {
    stateIndex = 0
    return registrations[0]!.component({ t: (key: string) => dictionaries.zh?.[key] ?? key })
  }
  const findByClass = (node: View, className: string): View[] => {
    if (!node || typeof node !== 'object' || !node.props) return []
    return [
      ...(node.props.className === className ? [node] : []),
      ...node.props.children.flat().flatMap((child) => findByClass(child, className))
    ]
  }
  return { render, findByClass, registrations, marketVisibility, dispose: () => effects.forEach((stop) => stop()) }
}

describe('creative MCP directory', () => {
  it.each([false, true])('is available before and after dsh-market installation (%s)', async (installed) => {
    const { render, findByClass, marketVisibility, dispose } = await loadDirectory(installed)
    expect(marketVisibility).toEqual(installed ? [false] : [])
    const cards = findByClass(render(), 'dshDesktopMcpCard')
    expect(cards).toHaveLength(12)
    const links = findByClass(render(), 'dshDesktopMcpCardLink')
    expect(links.every((link) => String(link.props.href).startsWith('https://github.com/'))).toBe(true)
    expect(links.every((link) => link.props.target === '_blank' && link.props.rel === 'noopener noreferrer')).toBe(true)
    dispose()
    expect(marketVisibility).toEqual(installed ? [false, true] : [])
  })

  it('filters by category and searches localized descriptions', async () => {
    const { render, findByClass } = await loadDirectory(false)
    const filters = findByClass(render(), 'dshDesktopMcpFilter')
    ;(filters[2]!.props.onClick as () => void)()
    expect(findByClass(render(), 'dshDesktopMcpCard')).toHaveLength(6)
    expect(findByClass(render(), 'dshDesktopMarketLink')[0]!.props.href).toBe(
      'https://github.com/dengyier/awesome-mcp-servers/blob/main/README.md#architecture-and-design'
    )
    const search = findByClass(render(), 'dshDesktopMcpSearch')[0]!
    ;(search.props.onChange as (event: { target: { value: string } }) => void)({ target: { value: 'Figma' } })
    const cards = findByClass(render(), 'dshDesktopMcpCard')
    expect(cards).toHaveLength(1)
    expect(findByClass(cards[0]!, 'dshDesktopMcpCardName')[0]!.props.children).toEqual(['Figwright'])
    ;(search.props.onChange as (event: { target: { value: string } }) => void)({ target: { value: 'not-a-server' } })
    expect(findByClass(render(), 'dshDesktopMcpCard')).toHaveLength(0)
  })

  it('offers an install action on every card and registers a curated connector', async () => {
    const requests: Array<{ url: string; options: Record<string, unknown> }> = []
    const { render, findByClass } = await loadDirectory(false, async (url, options) => {
      requests.push({ url, options })
      return { ok: true, json: async () => ({ installed: true }) }
    })
    const buttons = findByClass(render(), 'dshDesktopMcpInstall')
    expect(buttons).toHaveLength(12)
    expect(buttons.every((button) => String(button.props.children[0]) === '安装')).toBe(true)
    ;(buttons[0]!.props.onClick as () => void)()
    expect(findByClass(render(), 'dshDesktopMarketModal')).toHaveLength(1)
    const modalInstall = findByClass(render(), 'dshDesktopMarketModalActions')[0]!.props.children[1]!
    await (modalInstall.props.onClick as () => Promise<void>)()
    expect(requests).toHaveLength(1)
    expect(requests[0]).toMatchObject({ url: '/dsh-desktop/mcp-connectors', options: { method: 'POST' } })
    expect(JSON.parse(String(requests[0]!.options.body))).toEqual({ id: 'openMuseum' })
    expect(String(findByClass(render(), 'dshDesktopMcpInstall')[0]!.props.children[0])).toBe('已配置')
  })
})
