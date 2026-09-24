export type HarnessLocale = 'en' | 'zh'

export function resolveHarnessLocale(
  preference: unknown,
  preferredSystemLanguages: readonly string[]
): HarnessLocale {
  if (preference === 'zh' || preference === 'en') return preference
  // Native menus have no French dictionary yet; use English instead of the system language.
  if (preference === 'fr') return 'en'

  return preferredSystemLanguages[0]?.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}
