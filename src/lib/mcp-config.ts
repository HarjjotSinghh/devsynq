/**
 * MCP Configuration Management
 * Defines paths for MCP configuration files across different AI IDEs
 */

import path from 'path';
import os from 'os';
import { IDEType } from "../types";

export interface IDEMCPConfig {
  id: string;
  name: string;
  path: string;
  enabled: boolean;
  hasOverride: boolean;
  requiresRestart: boolean;
  lastSynced?: number;
  status?: "synced" | "pending" | "failed" | "not-installed";
}

export interface MCPServer {
  command: string;
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
  disabled?: boolean;
}

export interface MCPConfig {
  mcpServers: Record<string, MCPServer>;
}

const HOME = os.homedir();
const APPDATA = process.env.APPDATA || path.join(HOME, "AppData", "Roaming");
const LOCALAPPDATA =
  process.env.LOCALAPPDATA || path.join(HOME, "AppData", "Local");

/**
 * IDE MCP configuration file paths
 * These are the locations where each IDE stores its MCP configuration
 */
export const IDE_MCP_PATHS: Record<string, string> = {
  cursor: path.join(HOME, ".cursor", "mcp.json"),
  qoder: path.join(APPDATA, "Qoder", "SharedClientCache", "mcp.json"),
  antigravity: path.join(HOME, ".gemini", "settings", "mcp_config.json"),
  trae: path.join(APPDATA, "Trae", "user", "mcp.json"),
  windsurf: path.join(HOME, ".windsurf", "mcp.json"),
  vscode: path.join(
    APPDATA,
    "Code",
    "User",
    "globalStorage",
    "rooveterinaryinc.roo-cline",
    "settings",
    "cline_mcp_settings.json"
  ),
  kiro: path.join(APPDATA, "Kiro", "mcp.json"),
};

/**
 * Human-readable names for IDEs
 */
export const IDE_NAMES: Record<IDEType, string> = {
  [IDEType.Cursor]: "Cursor",
  [IDEType.VSCode]: "VS Code (Cline)",
  [IDEType.Windsurf]: "Windsurf",
  [IDEType.Zed]: "Zed",
  [IDEType.WebStorm]: "WebStorm",
  [IDEType.Trae]: "Trae",
  [IDEType.Replit]: "Replit",
  [IDEType.Cody]: "Cody",
  [IDEType.Continue]: "Continue",
  [IDEType.IntelliJIDEA]: "IntelliJ IDEA",
  [IDEType.PyCharm]: "PyCharm",
  [IDEType.Antigravity]: "Antigravity",
  [IDEType.Kiro]: "Kiro",
  [IDEType.Qoder]: "Qoder",
};

/**
 * IDE icons (emoji representations)
 */
export const IDE_ICONS: Record<string, string> = {
  cursor: '⚡',
  qoder: '🔷',
  antigravity: '🚀',
  trae: '🎯',
  windsurf: '🏄',
  vscode: '💻',
  kiro: '🔮',
};

/**
 * DevSynq configuration directory
 */
export const DEVSYNQ_DIR = path.join(HOME, '.devsynq');

/**
 * Master MCP configuration file path
 */
export const MASTER_MCP_PATH = path.join(DEVSYNQ_DIR, 'mcp.json');

/**
 * Sync settings file path
 */
export const SYNC_SETTINGS_PATH = path.join(DEVSYNQ_DIR, 'sync-settings.json');

/**
 * Sync log file path
 */
export const SYNC_LOG_PATH = path.join(DEVSYNQ_DIR, 'sync-log.json');

/**
 * Get the override path for a specific IDE
 * Override files allow IDE-specific customizations
 */
export function getOverridePath(ideId: string): string {
  return path.join(DEVSYNQ_DIR, `mcp.${ideId}.json`);
}

/**
 * Get the backup path for a specific IDE config
 */
export function getBackupPath(ideId: string, timestamp: string): string {
  return path.join(DEVSYNQ_DIR, 'backups', `${ideId}`, `mcp.${timestamp}.json`);
}
