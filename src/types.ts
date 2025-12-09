export enum IDEType {
  Cursor = "Cursor",
  VSCode = "VS Code",
  Windsurf = "Windsurf",
  Zed = "Zed",
  WebStorm = "WebStorm",
  Trae = "Trae",
  Replit = "Replit",
  Cody = "Cody",
  Continue = "Continue",
  IntelliJIDEA = "IntelliJ IDEA",
  PyCharm = "PyCharm",
  Antigravity = "Antigravity",
  Kiro = "Kiro",
  Qoder = "Qoder",
}

export interface IDE {
  name: IDEType;
  icon: string;
  macPaths: string[];
  winPaths: string[];
  linuxPaths: string[];
  downloadUrl: string;
  color: string;
  installed?: boolean; // Optional because main process adds this
}

export interface Project {
  id: string;
  name: string;
  path: string;
  preferredIDE: IDEType;
  lastOpened?: number;
}

export interface Settings {
  defaultIDE: IDEType;
  launchAtStartup: boolean;
  theme: "dark" | "light";
  autoDetectIDEs: boolean;
  shortcutBindings?: Record<string, IDEType | null>;
  windowState?: WindowState;
}

export interface WindowState {
  width: number;
  height: number;
  x?: number;
  y?: number;
  isMaximized?: boolean;
}

// MCP Sync Types
export interface MCPSyncStatus {
  ideId: string;
  name: string;
  icon: string;
  path: string;
  enabled: boolean;
  hasOverride: boolean;
  isInstalled: boolean;
  lastSynced?: number;
  status: "synced" | "pending" | "failed" | "not-installed";
}

export interface SyncSettings {
  enabledIDEs: Record<string, boolean>;
  autoSyncOnLaunch: boolean;
  createBackups: boolean;
  syncToPerProject: boolean;
  lastGlobalSync?: number;
}

export interface SyncResult {
  success: string[];
  failed: Array<{ ide: string; error: string }>;
  requireRestart: string[];
  skipped: string[];
}

// Profile Sync Types
export interface ProfileSyncStatus {
  ideId: string;
  name: string;
  path: string;
  enabled: boolean;
  isInstalled: boolean;
  lastSynced?: number;
  status: "synced" | "pending" | "not-installed";
}

export interface ProfileSyncSettings {
  enabledIDEs: Record<string, boolean>;
  autoSyncOnLaunch: boolean;
  lastSynced?: Record<string, number>;
  lastGlobalSync?: number;
}

export interface ProfileSyncResult {
  success: string[];
  failed: Array<{ ide: string; error: string }>;
  skipped: string[];
}

// ============================================================================
// Process Management Types
// ============================================================================

export interface RunningIDE {
  name: IDEType;
  icon: string;
  color: string;
  pid: number;
  execPath: string;
  windowTitle?: string;
  cpuUsage?: number;
  memoryUsage?: number; // in MB
  startTime?: number;
}

export interface ProcessStats {
  totalCPU: number;
  totalMemory: number; // in MB
  runningCount: number;
}

// ============================================================================
// API Keys Sync Types
// ============================================================================

export interface APIKeys {
  openai?: string;
  anthropic?: string;
  gemini?: string;
  cursor?: string; // Cursor-specific API key
  codeium?: string; // For Windsurf/Codeium products
  sourcegraph?: string; // For Cody
  // Add more as needed
}

export interface APIKeysSettings {
  keys: APIKeys;
  syncEnabled: Record<string, boolean>; // Which IDEs should receive keys
  lastSynced?: number;
}

// ============================================================================
// Command Palette Types
// ============================================================================

export type CommandType = "project" | "ide" | "action" | "settings";

export interface CommandItem {
  id: string;
  type: CommandType;
  title: string;
  subtitle?: string;
  icon: string;
  color?: string;
  keywords?: string[];
  action: () => void;
  shortcut?: string;
}

export interface CommandPaletteState {
  isOpen: boolean;
  query: string;
  selectedIndex: number;
  items: CommandItem[];
}
