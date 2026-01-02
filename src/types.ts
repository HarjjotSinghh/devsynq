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
  // Enhancement: Project Grouping
  tags?: string[];
  group?: string;
  color?: string;
  // Enhancement: Pre-Launch Scripts
  preLaunchScripts?: PreLaunchScript[];
  postCloseCleanup?: boolean;
  // Enhancement: Project Metadata (cached from git)
  metadata?: ProjectMetadata;
  // Enhancement: Project-Specific MCPs
  mcpServers?: string[]; // Array of MCP server IDs
  // Custom MCP configuration path (absolute or relative to project)
  // When set, this overrides the centralized master MCP config for this project
  customMcpConfigPath?: string;
}

export interface PreLaunchScript {
  id: string;
  name: string;
  command: string;
  args?: string[];
  cwd?: string; // defaults to project path
  runInBackground?: boolean;
  waitForCompletion?: boolean;
  enabled: boolean;
}

export interface ProjectMetadata {
  gitBranch?: string;
  gitLastCommit?: string;
  gitUncommittedChanges?: number;
  nodeVersion?: string;
  packageManager?: "npm" | "yarn" | "pnpm" | "bun";
  lastUpdated?: number;
}

export interface ProjectGroup {
  id: string;
  name: string;
  color: string;
  icon?: string;
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

// ============================================================================
// MCP Marketplace Types
// ============================================================================

export interface MCPMarketplaceServer {
  id: number;
  name: string;
  description: string;
  url: string;
  sponsor?: boolean;
  category?: string;
  installMethod?: "npx" | "pip" | "manual";
  command?: string;
  isInstalled?: boolean;
}

export interface MCPMarketplaceCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

// ============================================================================
// Cloud Sync Types (Pro Feature)
// ============================================================================

export interface CloudSyncUser {
  id: string;
  email: string;
  encryptionKey?: string;
  createdAt: number;
  lastSyncAt?: number;
}

export interface CloudSyncBackup {
  id: string;
  userId: string;
  timestamp: number;
  version: string;
  checksum: string;
  encryptedData?: string;
}

