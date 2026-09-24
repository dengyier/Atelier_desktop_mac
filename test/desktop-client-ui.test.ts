import { readFile } from 'node:fs/promises'
import path from 'node:path'
import vm from 'node:vm'
import { describe, expect, it, vi } from 'vitest'

const projectRoot = path.resolve(import.meta.dirname, '..')

interface Registration {
  config: { name: string; id?: string; order?: number }
  component: (props: Record<string, unknown>) => unknown
}
type Rendered = { props: { className?: string; children: unknown[]; onClick?: () => void; disabled?: boolean } }
const children = (node: Rendered): Rendered[] => node.props.children.flat() as Rendered[]

describe('Atelier Desktop client slot occupants', () => {
  it('renders the Atelier hero and fills the draft from both suggestion modes', async () => {
    const source = await readFile(
      path.join(projectRoot, 'packages', 'dsh-desktop-client-ui', 'client.js'),
      'utf8'
    )
    let definition: {
      factory: (require: (id: string) => unknown) => {
        apply: (ctx: unknown) => void
        inject: string[]
      }
    } | undefined
    const appended: Array<{ textContent?: string }> = []
    const document = {
      getElementById: vi.fn(() => null),
      createElement: vi.fn(() => ({ id: '', dataset: {}, textContent: '', remove: vi.fn() })),
      head: { appendChild: (node: { textContent?: string }) => appended.push(node) }
    }
    vm.runInNewContext(source, {
      document,
      navigator: { language: 'en-US' },
      window: {
        __ModuleLoader__: {
          load: (value: typeof definition) => {
            definition = value
          }
        }
      }
    })

    expect(definition).toBeDefined()
    const createElement = (
      type: unknown,
      props: Record<string, unknown> | null,
      ...children: unknown[]
    ): { type: unknown; props: Record<string, unknown> } => ({
      type,
      props: { ...props, children }
    })
    let mode = 'work'
    const plugin = definition!.factory((id) => {
      if (id === 'react') {
        return {
          createElement,
          useEffect: (effect: () => void | (() => void)) => effect(),
          useState: () => [mode, (next: string) => { mode = next }]
        }
      }
      throw new Error(`Unexpected client dependency: ${id}`)
    })

    const registrations: Registration[] = []
    const slots = {
      inject: (_name: string, callback: () => unknown): unknown => {
        const result = callback()
        if (result && typeof result === 'object' && Symbol.iterator in result) {
          for (const _entry of result as Iterable<unknown>) void _entry
        }
        return result
      },
      register: (
        config: Registration['config'],
        component: Registration['component']
      ): (() => void) => {
        if (config.name === 'conversation.hero.suggestions' && !config.id) {
          throw new Error('list slot requires options.id')
        }
        registrations.push({ config, component })
        return () => undefined
      }
    }
    const locale = {
      addLanguage: vi.fn(() => () => undefined),
      register: vi.fn((namespace: string, dictionaries: Record<string, Record<string, string>> | string) => {
        if (namespace === 'atelier.desktop.home' && typeof dictionaries !== 'string') {
          expect(Object.keys(dictionaries.zh!)).toEqual(Object.keys(dictionaries.en!))
          expect(Object.keys(dictionaries.fr!)).toEqual(Object.keys(dictionaries.en!))
        }
        return () => undefined
      }),
      bind: vi.fn(() => (key: string) => key)
    }
    plugin.apply({ slots, locale, effect: (callback: () => unknown) => callback() })

    expect(locale.addLanguage).toHaveBeenCalledWith({ id: 'fr', label: 'Français', fallback: 'en' })
    expect(locale.register).toHaveBeenCalledWith('settings.locale', 'fr', { 'language.title': 'Langue' })

    expect(plugin.inject).toEqual(['slots', 'locale'])
    expect(registrations.map(({ config }) => config.name)).toEqual([
      'sidebar.brand.mark',
      'sidebar.brand.name',
      'conversation.hero.presentation',
      'conversation.hero.suggestions'
    ])
    expect(appended).toHaveLength(1)
    expect(appended[0]!.textContent).toContain('.atelier-home-hero')

    const sidebarName = registrations.find(
      ({ config }) => config.name === 'sidebar.brand.name'
    )!.component({}) as { type: unknown; props: Record<string, unknown> }
    expect(sidebarName.type).toBe('span')
    expect(sidebarName.props.children).toEqual(['atelier'])

    const sidebarMark = registrations.find(
      ({ config }) => config.name === 'sidebar.brand.mark'
    )!.component({ size: 24 }) as { type: unknown; props: Record<string, unknown> }
    expect(sidebarMark.type).toBe('span')
    expect(sidebarMark.props.children).toEqual(['a'])

    const hero = registrations.find(
      ({ config }) => config.name === 'conversation.hero.presentation'
    )!.component({}) as Rendered
    expect(hero.props.className).toBe('atelier-home-hero')
    expect(children(hero)[1]!.props.children).toEqual(['headline'])

    const suggestions = registrations.find(
      ({ config }) => config.name === 'conversation.hero.suggestions'
    )!.component
    const setDraft = vi.fn()
    const props = { input: { draft: '已有内容' }, inputActions: { setDraft, submit: vi.fn() } }
    const work = suggestions(props) as Rendered
    const workButtons = children(children(work)[1]!)
    expect(workButtons).toHaveLength(5)
    workButtons[0]!.props.onClick!()
    expect(setDraft).toHaveBeenCalledWith(expect.stringMatching(/^已有内容\n\nprompt\.documents$/))
    expect(props.inputActions.submit).not.toHaveBeenCalled()

    children(children(work)[0]!)[1]!.props.onClick!()
    const creative = suggestions(props) as Rendered
    const creativeButtons = children(children(creative)[1]!)
    expect(creativeButtons).toHaveLength(5)
    creativeButtons[0]!.props.onClick!()
    expect(setDraft).toHaveBeenLastCalledWith('已有内容\n\nprompt.theme')

    const beforeWorkspace = suggestions({}) as Rendered
    expect(children(children(beforeWorkspace)[1]!).every(button => button.props.disabled)).toBe(true)
  })
})
