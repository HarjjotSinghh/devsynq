// Preload script - must use require for Electron compatibility
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods for renderer process
contextBridge.exposeInMainWorld("electronAPI", {
    // Get all IDEs with their installation status
    getIDEs: () => ipcRenderer.invoke("get-ides"),
    refreshIDEs: () => ipcRenderer.invoke("refresh-ides"),

    // Launch an IDE by name, optionally with a project path
    launchIDE: (ideName: string, projectPath?: string) =>
        ipcRenderer.invoke("launch-ide", ideName, projectPath),

    // Open download URL in browser
    openDownload: (url: string) => ipcRenderer.invoke("open-download", url),

    // Project Management
    getProjects: () => ipcRenderer.invoke("get-projects"),
    addProject: () => ipcRenderer.invoke("add-project"),
    deleteProject: (projectId: string) =>
        ipcRenderer.invoke("delete-project", projectId),
    updateProjectIDE: (projectId: string, ideName: string) =>
        ipcRenderer.invoke("update-project-ide", projectId, ideName),

    // Add multiple projects from master directory
    scanProjectDirectory: () => ipcRenderer.invoke("scan-project-directory"),
    addMultipleProjects: (projectPaths: string[]) => ipcRenderer.invoke("add-multiple-projects", projectPaths),

    // Settings
    getSettings: () => ipcRenderer.invoke("get-settings"),
    saveSettings: (settings: any) =>
        ipcRenderer.invoke("save-settings", settings),
    onShowSettings: (callback: () => void) =>
        ipcRenderer.on("show-settings", callback),

    // Window controls
    minimize: () => ipcRenderer.send("window-minimize"),
    maximize: () => ipcRenderer.send("window-maximize"),
    close: () => ipcRenderer.send("window-close"),

    // ============================================================================
    // MCP Sync APIs
    // ============================================================================

    // Get sync status for all IDEs
    getMCPSyncStatus: () => ipcRenderer.invoke("get-mcp-sync-status"),

    // Get sync settings
    getMCPSyncSettings: () => ipcRenderer.invoke("get-mcp-sync-settings"),

    // Save sync settings
    saveMCPSyncSettings: (settings: any) =>
        ipcRenderer.invoke("save-mcp-sync-settings", settings),

    // Toggle IDE sync enabled/disabled
    toggleMCPIDESync: (ideId: string, enabled: boolean) =>
        ipcRenderer.invoke("toggle-mcp-ide-sync", ideId, enabled),

    // Sync MCP configs to IDEs
    syncMCPConfigs: (ideIds?: string[]) =>
        ipcRenderer.invoke("sync-mcp-configs", ideIds),

    // Import config from an IDE
    importMCPFromIDE: (ideId: string) =>
        ipcRenderer.invoke("import-mcp-from-ide", ideId),

    // Create IDE-specific override
    createMCPOverride: (ideId: string) =>
        ipcRenderer.invoke("create-mcp-override", ideId),

    // Delete IDE-specific override
    deleteMCPOverride: (ideId: string) =>
        ipcRenderer.invoke("delete-mcp-override", ideId),

    // Open master config in default editor
    openMCPMasterConfig: () =>
        ipcRenderer.invoke("open-mcp-master-config"),

    // Get sync log
    getMCPSyncLog: () =>
        ipcRenderer.invoke("get-mcp-sync-log"),

    // ============================================================================
    // Process Management APIs
    // ============================================================================

    // Get running IDEs
    getRunningIDEs: () => ipcRenderer.invoke("get-running-ides"),

    // Get process stats
    getProcessStats: () => ipcRenderer.invoke("get-process-stats"),

    // Focus an IDE by PID
    focusIDE: (pid: number) => ipcRenderer.invoke("focus-ide", pid),

    // Kill an IDE by PID
    killIDE: (pid: number) => ipcRenderer.invoke("kill-ide", pid),

    // Kill all running IDEs
    killAllIDEs: () => ipcRenderer.invoke("kill-all-ides"),

    // Get resource usage stats
    getResourceUsage: () => ipcRenderer.invoke("get-resource-usage"),

    // ============================================================================
    // API Keys Sync APIs
    // ============================================================================

    // Get API keys settings
    getAPIKeysSettings: () => ipcRenderer.invoke("get-api-keys-settings"),

    // Save API keys settings
    saveAPIKeysSettings: (settings: any) =>
        ipcRenderer.invoke("save-api-keys-settings", settings),

    // Update a specific API key
    updateAPIKey: (keyName: string, value: string | undefined) =>
        ipcRenderer.invoke("update-api-key", keyName, value),

    // Delete an API key
    deleteAPIKey: (keyName: string) =>
        ipcRenderer.invoke("delete-api-key", keyName),

    // Sync API keys to a specific IDE
    syncAPIKeysToIDE: (ideId: string) =>
        ipcRenderer.invoke("sync-api-keys-to-ide", ideId),

    // Sync API keys to all enabled IDEs
    syncAPIKeysToAll: () =>
        ipcRenderer.invoke("sync-api-keys-to-all"),

    // Toggle IDE key sync
    toggleIDEKeySync: (ideId: string, enabled: boolean) =>
        ipcRenderer.invoke("toggle-ide-key-sync", ideId, enabled),

    // Get API key types
    getAPIKeyTypes: () => ipcRenderer.invoke("get-api-key-types"),

    // Get API key sync status
    getAPIKeySyncStatus: () => ipcRenderer.invoke("get-api-key-sync-status"),

    // Mask an API key
    maskAPIKey: (key: string) => ipcRenderer.invoke("mask-api-key", key),

    // Validate an API key
    validateAPIKey: (keyName: string, value: string) =>
        ipcRenderer.invoke("validate-api-key", keyName, value),

    // ============================================================================
    // Command Palette APIs
    // ============================================================================

    // Hide the command palette
    hideCommandPalette: () => ipcRenderer.send("hide-command-palette"),

    // Get command palette data
    getCommandPaletteData: () => ipcRenderer.invoke("get-command-palette-data"),
});
