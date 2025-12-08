import { IDE, Project, Settings, MCPSyncStatus, SyncSettings, SyncResult, RunningIDE, ProcessStats, APIKeys, APIKeysSettings } from '../types';

export interface SyncLogEntry {
    timestamp: number;
    ideId: string;
    action: 'sync' | 'import' | 'backup';
    success: boolean;
    error?: string;
}

export interface APIKeyType {
    id: keyof APIKeys;
    name: string;
    description: string;
    supportedIDEs: string[];
}

export interface APIKeySyncStatusItem {
    id: string;
    name: string;
    enabled: boolean;
    configExists: boolean;
    supportedKeys: string[];
}

export interface ResourceUsage {
    totalSystemMemory: number;
    freeSystemMemory: number;
    ideMemoryUsage: number;
    ideCount: number;
    cpuCores: number;
}

export interface CommandPaletteData {
    ides: IDE[];
    projects: Project[];
    runningIDEs: RunningIDE[];
}

export interface ElectronAPI {
    getIDEs: () => Promise<IDE[]>;
    refreshIDEs: () => Promise<IDE[]>;
    launchIDE: (
        ideName: string,
        projectPath?: string
    ) => Promise<{ success: boolean; error?: string }>;
    openDownload: (url: string) => Promise<{ success: boolean }>;

    // Project APIs
    getProjects: () => Promise<Project[]>;
    addProject: () => Promise<Project | null>;
    deleteProject: (projectId: string) => Promise<Project[]>;
    updateProjectIDE: (projectId: string, ideName: string) => Promise<Project[]>;

    // Settings APIs
    getSettings: () => Promise<Settings>;
    saveSettings: (settings: Settings) => Promise<{ success: boolean }>;
    onShowSettings: (callback: () => void) => void;

    // Window controls
    minimize: () => void;
    maximize: () => void;
    close: () => void;

    // ============================================================================
    // MCP Sync APIs
    // ============================================================================

    // Get sync status for all IDEs
    getMCPSyncStatus: () => Promise<MCPSyncStatus[]>;

    // Get sync settings
    getMCPSyncSettings: () => Promise<SyncSettings>;

    // Save sync settings
    saveMCPSyncSettings: (settings: SyncSettings) => Promise<{ success: boolean }>;

    // Toggle IDE sync enabled/disabled
    toggleMCPIDESync: (ideId: string, enabled: boolean) => Promise<SyncSettings>;

    // Sync MCP configs to IDEs
    syncMCPConfigs: (ideIds?: string[]) => Promise<SyncResult>;

    // Import config from an IDE
    importMCPFromIDE: (ideId: string) => Promise<{ success: boolean; error?: string }>;

    // Create IDE-specific override
    createMCPOverride: (ideId: string) => Promise<{ success: boolean }>;

    // Delete IDE-specific override
    deleteMCPOverride: (ideId: string) => Promise<{ success: boolean }>;

    // Open master config in default editor
    openMCPMasterConfig: () => Promise<{ success: boolean }>;

    // Get sync log
    getMCPSyncLog: () => Promise<SyncLogEntry[]>;

    // ============================================================================
    // Process Management APIs
    // ============================================================================

    // Get running IDEs
    getRunningIDEs: () => Promise<RunningIDE[]>;

    // Get process stats
    getProcessStats: () => Promise<ProcessStats>;

    // Focus an IDE by PID
    focusIDE: (pid: number) => Promise<{ success: boolean; error?: string }>;

    // Kill an IDE by PID
    killIDE: (pid: number) => Promise<{ success: boolean; error?: string }>;

    // Kill all running IDEs
    killAllIDEs: () => Promise<{ success: string[]; failed: Array<{ name: string; error: string }> }>;

    // Get resource usage stats
    getResourceUsage: () => Promise<ResourceUsage>;

    // ============================================================================
    // API Keys Sync APIs
    // ============================================================================

    // Get API keys settings
    getAPIKeysSettings: () => Promise<APIKeysSettings>;

    // Save API keys settings
    saveAPIKeysSettings: (settings: APIKeysSettings) => Promise<{ success: boolean }>;

    // Update a specific API key
    updateAPIKey: (keyName: string, value: string | undefined) => Promise<{ success: boolean }>;

    // Delete an API key
    deleteAPIKey: (keyName: string) => Promise<{ success: boolean }>;

    // Sync API keys to a specific IDE
    syncAPIKeysToIDE: (ideId: string) => Promise<{ success: boolean; error?: string }>;

    // Sync API keys to all enabled IDEs
    syncAPIKeysToAll: () => Promise<{ success: string[]; failed: Array<{ ide: string; error: string }> }>;

    // Toggle IDE key sync
    toggleIDEKeySync: (ideId: string, enabled: boolean) => Promise<{ success: boolean }>;

    // Get API key types
    getAPIKeyTypes: () => Promise<APIKeyType[]>;

    // Get API key sync status
    getAPIKeySyncStatus: () => Promise<APIKeySyncStatusItem[]>;

    // Mask an API key
    maskAPIKey: (key: string) => Promise<string>;

    // Validate an API key
    validateAPIKey: (keyName: string, value: string) => Promise<{ valid: boolean; error?: string }>;

    // ============================================================================
    // Command Palette APIs
    // ============================================================================

    // Hide the command palette
    hideCommandPalette: () => void;

    // Get command palette data
    getCommandPaletteData: () => Promise<CommandPaletteData>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
