// Only the isolated Cloud runner marks its HTML; ordinary remote Harness pages
// retain upstream's process-local settings behavior.
export function enableCloudSettings(html) {
  return html.replace('globalThis["__DSH_BOOT__"]', 'globalThis["__ATELIER_CLOUD_SETTINGS__"]=true;globalThis["__DSH_BOOT__"]')
}
