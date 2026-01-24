import { IDE, Project, Settings, MCPSyncStatus, SyncSettings, SyncResult, RunningIDE, ProcessStats, APIKeys, APIKeysSettings, ProfileSyncResult, ProfileSyncSettings, ProfileSyncStatus, MCPMarketplaceServer, MCPMarketplaceCategory, ProjectMetadata, ProjectGroup } from '../types';

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
    scanProjectDirectory: () => Promise<{ name: string; path: string }[] | null>;
    addMultipleProjects: (projectPaths: string[]) => Promise<Project[]>;

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
    // Project-Specific MCP Config APIs
    // ============================================================================

    // Get project MCP config info
    getProjectMcpInfo: (projectId: string) => Promise<{
        usesCustom: boolean;
        configPath: string;
        exists: boolean;
        serverCount: number;
        error?: string;
    }>;

    // Set custom MCP config path for a project
    setProjectMcpConfig: (projectId: string, configPath: string | null) => Promise<{
        success: boolean;
        error?: string;
    }>;

    // Clear custom MCP config (revert to centralized)
    clearProjectMcpConfig: (projectId: string) => Promise<{
        success: boolean;
        error?: string;
    }>;

    // Browse for MCP config file
    browseForMcpConfig: () => Promise<{
        path: string;
        valid: boolean;
        error?: string;
    } | null>;

    // Create project-specific MCP config from master
    createProjectMcpConfig: (projectId: string) => Promise<{
        success: boolean;
        configPath?: string;
        error?: string;
    }>;

    // Open project MCP config in default editor
    openProjectMcpConfig: (projectId: string) => Promise<{
        success: boolean;
        error?: string;
    }>;

    // ============================================================================
    // Profile Sync APIs
    // ============================================================================
    getProfileSyncStatus: () => Promise<ProfileSyncStatus[]>;
    getProfileSyncSettings: () => Promise<ProfileSyncSettings>;
    saveProfileSyncSettings: (settings: ProfileSyncSettings) => Promise<{ success: boolean }>;
    toggleProfileIDESync: (ideId: string, enabled: boolean) => Promise<ProfileSyncSettings>;
    syncProfiles: (ideIds?: string[]) => Promise<ProfileSyncResult>;
    openProfileMaster: () => Promise<{ success: boolean }>;

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

    // Get resource history for an IDE
    getResourceHistory: (ideName: string) => Promise<{ cpu: number[]; memory: number[] }>;

    // Get system resource history
    getSystemResourceHistory: () => Promise<{ cpu: number[]; memory: number[] }>;

    // Get running IDEs with resource history (for sparklines)
    getRunningIDEsWithHistory: () => Promise<Array<RunningIDE & { history?: { cpu: number[]; memory: number[] } }>>;

    // ============================================================================
    // MCP Health Monitoring APIs
    // ============================================================================

    // Get MCP health status
    getMCPHealthStatus: () => Promise<{
        servers: Array<{
            serverName: string;
            pid: number;
            status: 'running' | 'stopped' | 'error' | 'starting';
            command: string;
            uptime?: number;
            startTime?: number;
            cpuUsage?: number;
            memoryUsage?: number;
            lastLog?: string;
            errorCount: number;
        }>;
        totalRunning: number;
        totalErrors: number;
        lastChecked: number;
    }>;

    // Get MCP server logs
    getMCPLogs: (serverName: string) => Promise<Array<{
        timestamp: number;
        level: 'info' | 'warn' | 'error' | 'debug';
        message: string;
        serverName: string;
    }>>;

    // Kill an MCP server
    killMCPServer: (pid: number) => Promise<{ success: boolean; error?: string }>;

    // Restart an MCP server
    restartMCPServer: (serverName: string, command: string) => Promise<{ success: boolean; error?: string }>;

    // ============================================================================
    // Rules Library APIs
    // ============================================================================

    // Get all user templates
    getRulesTemplates: () => Promise<Array<{
        id: string;
        name: string;
        description: string;
        content: string;
        tags: string[];
        createdAt: number;
        updatedAt: number;
    }>>;

    // Get built-in templates
    getBuiltInTemplates: () => Promise<Array<{
        id: string;
        name: string;
        description: string;
        content: string;
        tags: string[];
        createdAt: number;
        updatedAt: number;
    }>>;

    // Save a new template
    saveRulesTemplate: (template: {
        name: string;
        description: string;
        content: string;
        tags: string[];
    }) => Promise<{
        id: string;
        name: string;
        description: string;
        content: string;
        tags: string[];
        createdAt: number;
        updatedAt: number;
    }>;

    // Update a template
    updateRulesTemplate: (id: string, updates: {
        name?: string;
        description?: string;
        content?: string;
        tags?: string[];
    }) => Promise<{
        id: string;
        name: string;
        description: string;
        content: string;
        tags: string[];
        createdAt: number;
        updatedAt: number;
    } | null>;

    // Delete a template
    deleteRulesTemplate: (id: string) => Promise<boolean>;

    // Apply a template to a project
    applyRulesTemplate: (templateId: string, projectPath: string) => Promise<{ success: boolean; error?: string }>;

    // Extract rules from a project
    extractRulesFromProject: (projectPath: string) => Promise<string | null>;

    // Get project rules info
    getProjectRulesInfo: (projectPath: string) => Promise<{
        fileName: string;
        path: string;
        content: string;
    } | null>;

    // ============================================================================
    // Rules Sync APIs (Multi-IDE Syncing)
    // ============================================================================

    // Get rules sync settings
    getRulesSyncSettings: () => Promise<{
        masterRulesFile: string;
        targetRulesFiles: string[];
        autoSync: boolean;
    }>;

    // Save rules sync settings
    saveRulesSyncSettings: (settings: {
        masterRulesFile: string;
        targetRulesFiles: string[];
        autoSync: boolean;
    }) => Promise<{ success: boolean }>;

    // Sync rules in a project
    syncRulesInProject: (projectPath: string) => Promise<{
        success: boolean;
        results: Array<{ file: string; status: 'synced' | 'failed' | 'skipped'; error?: string }>;
    }>;

    // Get project rules sync status
    getProjectRulesSyncStatus: (projectPath: string) => Promise<{
        masterFile: string;
        syncedFiles: string[];
        unsyncedFiles: string[];
        missingFiles: string[];
    }>;

    // Get available rules files in a project
    getProjectRulesFiles: (projectPath: string) => Promise<string[]>;

    // Get all supported rules file types
    getSupportedRulesFiles: () => Promise<string[]>;

    // ============================================================================
    // Extension Sync APIs
    // ============================================================================

    // Get extension sync settings
    getExtensionSyncSettings: () => Promise<{
        masterIDE: string;
        targetIDEs: string[];
        autoSync: boolean;
    }>;

    // Save extension sync settings
    saveExtensionSyncSettings: (settings: {
        masterIDE: string;
        targetIDEs: string[];
        autoSync: boolean;
    }) => Promise<{ success: boolean }>;

    // Get extensions for an IDE
    getIDEExtensions: (ideId: string) => Promise<Array<{
        id: string;
        name: string;
        version: string;
        publisher: string;
    }>>;

    // Compare extensions between IDEs
    compareExtensions: (masterIDE: string, targetIDE: string) => Promise<{
        common: Array<{ id: string; name: string; version: string; publisher: string }>;
        onlyInMaster: Array<{ id: string; name: string; version: string; publisher: string }>;
        onlyInTarget: Array<{ id: string; name: string; version: string; publisher: string }>;
    }>;

    // Get available IDEs for extension sync
    getAvailableIDEsForExtensionSync: () => Promise<Array<{
        id: string;
        name: string;
        hasExtensions: boolean;
        extensionCount: number;
    }>>;

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

    // ============================================================================
    // MCP Marketplace APIs
    // ============================================================================

    // Get all available MCP servers with install status
    getMCPMarketplaceServers: () => Promise<MCPMarketplaceServer[]>;

    // Get MCP categories with counts
    getMCPCategories: () => Promise<MCPMarketplaceCategory[]>;

    // Install an MCP server to master config
    installMCPServer: (server: MCPMarketplaceServer) => Promise<{ success: boolean; error?: string }>;

    // Uninstall an MCP server from master config
    uninstallMCPServer: (serverName: string) => Promise<{ success: boolean; error?: string }>;

    // Open external URL in browser
    openExternal: (url: string) => Promise<void>;

    // ============================================================================
    // Project Metadata APIs
    // ============================================================================

    // Get project metadata (git status, node version, etc.)
    getProjectMetadata: (projectPath: string) => Promise<ProjectMetadata | null>;

    // Refresh all projects metadata
    refreshAllProjectMetadata: () => Promise<void>;

    // ============================================================================
    // Project Groups APIs
    // ============================================================================

    // Get all project groups
    getProjectGroups: () => Promise<ProjectGroup[]>;

    // Create a new project group
    createProjectGroup: (group: Omit<ProjectGroup, 'id'>) => Promise<ProjectGroup>;

    // Update a project group
    updateProjectGroup: (group: ProjectGroup) => Promise<ProjectGroup>;

    // Delete a project group
    deleteProjectGroup: (groupId: string) => Promise<{ success: boolean }>;

    // Assign project to group
    assignProjectToGroup: (projectId: string, groupId: string | null) => Promise<Project>;

    // Add tags to project
    addProjectTags: (projectId: string, tags: string[]) => Promise<Project>;

    // Remove tag from project
    removeProjectTag: (projectId: string, tag: string) => Promise<Project>;

    // ============================================================================
    // Pre-Launch Scripts APIs
    // ============================================================================

    // Get pre-launch scripts for a project
    getPreLaunchScripts: (projectId: string) => Promise<PreLaunchScript[]>;

    // Add a pre-launch script to a project
    addPreLaunchScript: (projectId: string, script: Omit<PreLaunchScript, 'id'>) => Promise<PreLaunchScript | null>;

    // Update a pre-launch script
    updatePreLaunchScript: (projectId: string, script: PreLaunchScript) => Promise<PreLaunchScript | null>;

    // Delete a pre-launch script
    deletePreLaunchScript: (projectId: string, scriptId: string) => Promise<{ success: boolean }>;

    // Toggle a pre-launch script enabled/disabled
    togglePreLaunchScript: (projectId: string, scriptId: string, enabled: boolean) => Promise<PreLaunchScript | null>;

    // Run a pre-launch script manually
    runPreLaunchScript: (projectId: string, scriptId: string) => Promise<{ success: boolean; output?: string; error?: string }>;

    // ============================================================================
    // Cloud Sync APIs
    // ============================================================================

    // Cloud sync data types
    cloudSyncIsLoggedIn: () => Promise<boolean>;
    cloudSyncGetConfig: () => Promise<CloudSyncConfig | null>;
    cloudSyncRegister: (
        email: string,
        encryptionPassword: string,
        displayName?: string,
        serverUrl?: string
    ) => Promise<CloudSyncResult>;
    cloudSyncLogin: (
        accessKey: string,
        encryptionPassword: string,
        serverUrl?: string
    ) => Promise<CloudSyncResult>;
    cloudSyncLogout: () => Promise<{ success: boolean }>;
    cloudSyncSetPassword: (password: string) => Promise<{ success: boolean }>;
    cloudSyncPush: (dataType: string, data: unknown) => Promise<CloudSyncResult>;
    cloudSyncPull: (dataType: string) => Promise<CloudSyncResult>;
    cloudSyncListBackups: () => Promise<CloudSyncResult & { data?: CloudSyncBackupInfo[] }>;
    cloudSyncDeleteBackup: (dataType?: string) => Promise<CloudSyncResult>;
    cloudSyncGetAccount: () => Promise<CloudSyncResult>;
    cloudSyncUpdateSettings: (settings: { autoSync?: boolean; syncInterval?: number }) => Promise<{ success: boolean }>;
    cloudSyncFullBackup: () => Promise<CloudSyncResult>;
    cloudSyncRestoreBackup: () => Promise<CloudSyncResult>;
    cloudSyncCreateCheckoutSession: () => Promise<CloudSyncResult & { checkoutUrl?: string }>;
}

// Cloud Sync Types
interface CloudSyncConfig {
    syncServerUrl: string;
    userId: string;
    email: string;
    displayName: string;
    deviceId: string;
    lastSyncAt: number | null;
    autoSync: boolean;
    syncInterval: number;
    planType?: string;
}

interface CloudSyncResult {
    success: boolean;
    message: string;
    error?: string;
    data?: unknown;
}

interface CloudSyncBackupInfo {
    id: string;
    dataType: string;
    version: number;
    plaintextSize: number;
    updatedAt: string;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
