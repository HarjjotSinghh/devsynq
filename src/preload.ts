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
    // Profile Sync APIs
    // ============================================================================

    getProfileSyncStatus: () => ipcRenderer.invoke("get-profile-sync-status"),
    getProfileSyncSettings: () => ipcRenderer.invoke("get-profile-sync-settings"),
    saveProfileSyncSettings: (settings: any) =>
        ipcRenderer.invoke("save-profile-sync-settings", settings),
    toggleProfileIDESync: (ideId: string, enabled: boolean) =>
        ipcRenderer.invoke("toggle-profile-ide-sync", ideId, enabled),
    syncProfiles: (ideIds?: string[]) =>
        ipcRenderer.invoke("sync-profiles", ideIds),
    openProfileMaster: () =>
        ipcRenderer.invoke("open-profile-master"),

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

    // Get resource history for an IDE
    getResourceHistory: (ideName: string) => ipcRenderer.invoke("get-resource-history", ideName),

    // Get system resource history
    getSystemResourceHistory: () => ipcRenderer.invoke("get-system-resource-history"),

    // Get running IDEs with resource history (for sparklines)
    getRunningIDEsWithHistory: () => ipcRenderer.invoke("get-running-ides-with-history"),

    // ============================================================================
    // MCP Health Monitoring APIs
    // ============================================================================

    // Get MCP health status
    getMCPHealthStatus: () => ipcRenderer.invoke("get-mcp-health-status"),

    // Get MCP server logs
    getMCPLogs: (serverName: string) => ipcRenderer.invoke("get-mcp-logs", serverName),

    // Kill an MCP server
    killMCPServer: (pid: number) => ipcRenderer.invoke("kill-mcp-server", pid),

    // Restart an MCP server
    restartMCPServer: (serverName: string, command: string) =>
        ipcRenderer.invoke("restart-mcp-server", serverName, command),

    // ============================================================================
    // Rules Library APIs
    // ============================================================================

    // Get all user templates
    getRulesTemplates: () => ipcRenderer.invoke("get-rules-templates"),

    // Get built-in templates
    getBuiltInTemplates: () => ipcRenderer.invoke("get-built-in-templates"),

    // Save a new template
    saveRulesTemplate: (template: any) => ipcRenderer.invoke("save-rules-template", template),

    // Update a template
    updateRulesTemplate: (id: string, updates: any) =>
        ipcRenderer.invoke("update-rules-template", id, updates),

    // Delete a template
    deleteRulesTemplate: (id: string) => ipcRenderer.invoke("delete-rules-template", id),

    // Apply a template to a project
    applyRulesTemplate: (templateId: string, projectPath: string) =>
        ipcRenderer.invoke("apply-rules-template", templateId, projectPath),

    // Extract rules from a project
    extractRulesFromProject: (projectPath: string) =>
        ipcRenderer.invoke("extract-rules-from-project", projectPath),

    // Get project rules info
    getProjectRulesInfo: (projectPath: string) =>
        ipcRenderer.invoke("get-project-rules-info", projectPath),

    // ============================================================================
    // Rules Sync APIs (Multi-IDE Syncing)
    // ============================================================================

    // Get rules sync settings
    getRulesSyncSettings: () => ipcRenderer.invoke("get-rules-sync-settings"),

    // Save rules sync settings
    saveRulesSyncSettings: (settings: any) =>
        ipcRenderer.invoke("save-rules-sync-settings", settings),

    // Sync rules in a project
    syncRulesInProject: (projectPath: string) =>
        ipcRenderer.invoke("sync-rules-in-project", projectPath),

    // Get project rules sync status
    getProjectRulesSyncStatus: (projectPath: string) =>
        ipcRenderer.invoke("get-project-rules-sync-status", projectPath),

    // Get available rules files in a project
    getProjectRulesFiles: (projectPath: string) =>
        ipcRenderer.invoke("get-project-rules-files", projectPath),

    // Get all supported rules file types
    getSupportedRulesFiles: () => ipcRenderer.invoke("get-supported-rules-files"),

    // ============================================================================
    // Extension Sync APIs
    // ============================================================================

    // Get extension sync settings
    getExtensionSyncSettings: () => ipcRenderer.invoke("get-extension-sync-settings"),

    // Save extension sync settings
    saveExtensionSyncSettings: (settings: any) =>
        ipcRenderer.invoke("save-extension-sync-settings", settings),

    // Get extensions for an IDE
    getIDEExtensions: (ideId: string) =>
        ipcRenderer.invoke("get-ide-extensions", ideId),

    // Compare extensions between IDEs
    compareExtensions: (masterIDE: string, targetIDE: string) =>
        ipcRenderer.invoke("compare-extensions", masterIDE, targetIDE),

    // Get available IDEs for extension sync
    getAvailableIDEsForExtensionSync: () =>
        ipcRenderer.invoke("get-available-ides-for-extension-sync"),

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

    // ============================================================================
    // MCP Marketplace APIs
    // ============================================================================

    // Get all available MCP servers with install status
    getMCPMarketplaceServers: () => ipcRenderer.invoke("get-mcp-marketplace-servers"),

    // Get MCP categories with counts
    getMCPCategories: () => ipcRenderer.invoke("get-mcp-categories"),

    // Install an MCP server to master config
    installMCPServer: (server: any) => ipcRenderer.invoke("install-mcp-server", server),

    // Uninstall an MCP server from master config
    uninstallMCPServer: (serverName: string) => ipcRenderer.invoke("uninstall-mcp-server", serverName),

    // Open external URL in browser
    openExternal: (url: string) => ipcRenderer.invoke("open-external", url),

    // ============================================================================
    // Project Metadata APIs
    // ============================================================================

    // Get project metadata (git status, node version, etc.)
    getProjectMetadata: (projectPath: string) => ipcRenderer.invoke("get-project-metadata", projectPath),

    // Refresh all projects metadata
    refreshAllProjectMetadata: () => ipcRenderer.invoke("refresh-all-project-metadata"),

    // ============================================================================
    // Project Groups APIs
    // ============================================================================

    // Get all project groups
    getProjectGroups: () => ipcRenderer.invoke("get-project-groups"),

    // Create a new project group
    createProjectGroup: (group: any) => ipcRenderer.invoke("create-project-group", group),

    // Update a project group
    updateProjectGroup: (group: any) => ipcRenderer.invoke("update-project-group", group),

    // Delete a project group
    deleteProjectGroup: (groupId: string) => ipcRenderer.invoke("delete-project-group", groupId),

    // Assign project to group
    assignProjectToGroup: (projectId: string, groupId: string | null) =>
        ipcRenderer.invoke("assign-project-to-group", projectId, groupId),

    // Add tags to project
    addProjectTags: (projectId: string, tags: string[]) =>
        ipcRenderer.invoke("add-project-tags", projectId, tags),

    // Remove tag from project
    removeProjectTag: (projectId: string, tag: string) =>
        ipcRenderer.invoke("remove-project-tag", projectId, tag),

    // ============================================================================
    // Pre-Launch Scripts APIs
    // ============================================================================

    // Get pre-launch scripts for a project
    getPreLaunchScripts: (projectId: string) =>
        ipcRenderer.invoke("get-pre-launch-scripts", projectId),

    // Add a pre-launch script to a project
    addPreLaunchScript: (projectId: string, script: any) =>
        ipcRenderer.invoke("add-pre-launch-script", projectId, script),

    // Update a pre-launch script
    updatePreLaunchScript: (projectId: string, script: any) =>
        ipcRenderer.invoke("update-pre-launch-script", projectId, script),

    // Delete a pre-launch script
    deletePreLaunchScript: (projectId: string, scriptId: string) =>
        ipcRenderer.invoke("delete-pre-launch-script", projectId, scriptId),

    // Toggle a pre-launch script enabled/disabled
    togglePreLaunchScript: (projectId: string, scriptId: string, enabled: boolean) =>
        ipcRenderer.invoke("toggle-pre-launch-script", projectId, scriptId, enabled),

    // Run a pre-launch script manually
    runPreLaunchScript: (projectId: string, scriptId: string) =>
        ipcRenderer.invoke("run-pre-launch-script", projectId, scriptId),

    // ============================================================================
    // Cloud Sync APIs
    // ============================================================================

    // Check if logged in to cloud sync
    cloudSyncIsLoggedIn: () => ipcRenderer.invoke("cloud-sync-is-logged-in"),

    // Get cloud sync config
    cloudSyncGetConfig: () => ipcRenderer.invoke("cloud-sync-get-config"),

    // Register for cloud sync
    cloudSyncRegister: (
        email: string,
        encryptionPassword: string,
        displayName?: string,
        serverUrl?: string
    ) => ipcRenderer.invoke("cloud-sync-register", email, encryptionPassword, displayName, serverUrl),

    // Login to cloud sync
    cloudSyncLogin: (
        accessKey: string,
        encryptionPassword: string,
        serverUrl?: string
    ) => ipcRenderer.invoke("cloud-sync-login", accessKey, encryptionPassword, serverUrl),

    // Logout from cloud sync
    cloudSyncLogout: () => ipcRenderer.invoke("cloud-sync-logout"),

    // Set encryption password
    cloudSyncSetPassword: (password: string) => ipcRenderer.invoke("cloud-sync-set-password", password),

    // Push data to cloud sync
    cloudSyncPush: (dataType: string, data: unknown) =>
        ipcRenderer.invoke("cloud-sync-push", dataType, data),

    // Pull data from cloud sync
    cloudSyncPull: (dataType: string) => ipcRenderer.invoke("cloud-sync-pull", dataType),

    // List all backups
    cloudSyncListBackups: () => ipcRenderer.invoke("cloud-sync-list-backups"),

    // Delete a backup
    cloudSyncDeleteBackup: (dataType?: string) =>
        ipcRenderer.invoke("cloud-sync-delete-backup", dataType),

    // Get account info
    cloudSyncGetAccount: () => ipcRenderer.invoke("cloud-sync-get-account"),

    // Update cloud sync settings
    cloudSyncUpdateSettings: (settings: { autoSync?: boolean; syncInterval?: number }) =>
        ipcRenderer.invoke("cloud-sync-update-settings", settings),

    // Create full backup
    cloudSyncFullBackup: () => ipcRenderer.invoke("cloud-sync-full-backup"),

    // Restore from full backup
    cloudSyncRestoreBackup: () => ipcRenderer.invoke("cloud-sync-restore-backup"),
});
