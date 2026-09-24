export const MCP_CONNECTOR_PATH: string
export const CONNECTOR_IDS: Set<string>
export const RECIPES: Record<string, { transport: string; command?: string; args?: string[]; url?: string }>
export function presetPath(home: string): string
export function connectorState(source: string): Record<string, boolean>
export function validateConnector(input: { id: string; config?: { transport: string; command?: string; args?: string[]; url?: string; [key: string]: unknown } }): Record<string, unknown>
export function readConnectorState(home: string): Promise<Record<string, boolean>>
export function installConnector(home: string, input: { id: string; config?: { transport: string; command?: string; args?: string[]; url?: string; [key: string]: unknown } }): Promise<{ installed: boolean; alreadyPresent: boolean }>
