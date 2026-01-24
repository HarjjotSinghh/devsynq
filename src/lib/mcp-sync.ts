/**
 * MCP Sync Engine
 * Handles synchronization of MCP configurations across multiple AI IDEs
 */

import fs from 'fs';
import path from 'path';
import {
    IDE_MCP_PATHS,
    IDE_NAMES,
    IDE_ICONS,
    IDE_CONFIG_FORMATS,
    MASTER_MCP_PATH,
    DEVSYNQ_DIR,
    SYNC_SETTINGS_PATH,
    SYNC_LOG_PATH,
    getOverridePath,
    getBackupPath,
    MCPConfig,
    IDEMCPConfig,
} from './mcp-config';
import { IDEType } from '../types';

// ============================================================================
// Types
// ============================================================================

export interface SyncSettings {
    enabledIDEs: Record<string, boolean>;
    autoSyncOnLaunch: boolean;
    createBackups: boolean;
    syncToPerProject: boolean;
    lastGlobalSync?: number;
}

export interface SyncLogEntry {
    timestamp: number;
    ideId: string;
    action: 'sync' | 'import' | 'backup';
    success: boolean;
    error?: string;
}

export interface SyncResult {
    success: string[];
    failed: Array<{ ide: string; error: string }>;
    requireRestart: string[];
    skipped: string[];
}

export interface MCPSyncStatus {
    ideId: string;
    name: string;
    icon: string;
    path: string;
    enabled: boolean;
    hasOverride: boolean;
    isInstalled: boolean;
    lastSynced?: number;
    status: 'synced' | 'pending' | 'failed' | 'not-installed';
}

// ============================================================================
// File System Helpers
// ============================================================================

function ensureDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function readJSON<T>(filePath: string, defaultValue: T): T {
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(content) as T;
        }
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
    }
    return defaultValue;
}

function writeJSON<T>(filePath: string, data: T): void {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
}

function copyFile(src: string, dest: string): void {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
}

// ============================================================================
// Settings Management
// ============================================================================

const DEFAULT_SYNC_SETTINGS: SyncSettings = {
    enabledIDEs: {
        cursor: true,
        qoder: true,
        antigravity: true,
        trae: true,
        windsurf: true,
        vscode: false,
        kiro: true,
        // CLI Tools
        claudecode: true,
        codexcli: true,
        geminicli: true,
        augmentcli: true,
    },
    autoSyncOnLaunch: true,
    createBackups: true,
    syncToPerProject: false,
};

export function loadSyncSettings(): SyncSettings {
    const saved = readJSON<Partial<SyncSettings>>(SYNC_SETTINGS_PATH, {});
    return {
        ...DEFAULT_SYNC_SETTINGS,
        ...saved,
        enabledIDEs: {
            ...DEFAULT_SYNC_SETTINGS.enabledIDEs,
            ...saved.enabledIDEs,
        },
    };
}

export function saveSyncSettings(settings: SyncSettings): void {
    writeJSON(SYNC_SETTINGS_PATH, settings);
}

export function toggleIDESync(ideId: string, enabled: boolean): SyncSettings {
    const settings = loadSyncSettings();
    settings.enabledIDEs[ideId] = enabled;
    saveSyncSettings(settings);
    return settings;
}

// ============================================================================
// Sync Log Management
// ============================================================================

export function loadSyncLog(): SyncLogEntry[] {
    return readJSON<SyncLogEntry[]>(SYNC_LOG_PATH, []);
}

function appendSyncLog(entry: SyncLogEntry): void {
    const log = loadSyncLog();
    log.unshift(entry); // Add to beginning
    // Keep only last 100 entries
    const trimmed = log.slice(0, 100);
    writeJSON(SYNC_LOG_PATH, trimmed);
}

export function getLastSyncTime(ideId: string): number | undefined {
    const log = loadSyncLog();
    const entry = log.find(e => e.ideId === ideId && e.action === 'sync' && e.success);
    return entry?.timestamp;
}

// ============================================================================
// Master Config Management
// ============================================================================

export function ensureMasterConfig(): MCPConfig {
    ensureDir(DEVSYNQ_DIR);

    if (!fileExists(MASTER_MCP_PATH)) {
        const defaultConfig: MCPConfig = {
            mcpServers: {},
        };
        writeJSON(MASTER_MCP_PATH, defaultConfig);
        return defaultConfig;
    }

    return readJSON<MCPConfig>(MASTER_MCP_PATH, { mcpServers: {} });
}

export function getMasterConfig(): MCPConfig {
    return ensureMasterConfig();
}

export function saveMasterConfig(config: MCPConfig): void {
    writeJSON(MASTER_MCP_PATH, config);
}

// ============================================================================
// Override Management
// ============================================================================

export function hasOverride(ideId: string): boolean {
    return fileExists(getOverridePath(ideId));
}

export function createOverride(ideId: string): void {
    const masterConfig = getMasterConfig();
    const overridePath = getOverridePath(ideId);
    writeJSON(overridePath, masterConfig);
}

export function deleteOverride(ideId: string): void {
    const overridePath = getOverridePath(ideId);
    if (fileExists(overridePath)) {
        fs.unlinkSync(overridePath);
    }
}

export function getOverrideConfig(ideId: string): MCPConfig | null {
    const overridePath = getOverridePath(ideId);
    if (fileExists(overridePath)) {
        return readJSON<MCPConfig>(overridePath, { mcpServers: {} });
    }
    return null;
}

// ============================================================================
// Backup Management
// ============================================================================

function createBackup(ideId: string, sourcePath: string): string | null {
    if (!fileExists(sourcePath)) {
        return null;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T').join('_');
    const backupPath = getBackupPath(ideId, timestamp);

    try {
        copyFile(sourcePath, backupPath);
        return backupPath;
    } catch (error) {
        console.error(`Failed to create backup for ${ideId}:`, error);
        return null;
    }
}

// ============================================================================
// IDE Status
// ============================================================================

export function getIDEInstallStatus(ideId: string): boolean {
    const idePath = IDE_MCP_PATHS[ideId];
    if (!idePath) return false;

    // Check if the directory containing the MCP config exists
    // This is a rough heuristic - ideally we'd check for the IDE executable
    const ideDir = path.dirname(idePath);

    // For some IDEs, the config dir only exists if the IDE is installed
    // For others like Cursor, it exists if user has used it
    return fileExists(ideDir) || fileExists(idePath);
}

export function getMCPSyncStatus(): MCPSyncStatus[] {
    const settings = loadSyncSettings();

    return Object.entries(IDE_MCP_PATHS).map(([ideId, idePath]) => {
        const isInstalled = getIDEInstallStatus(ideId);
        const lastSynced = getLastSyncTime(ideId);

        let status: MCPSyncStatus['status'] = 'pending';
        if (!isInstalled) {
            status = 'not-installed';
        } else if (lastSynced && Date.now() - lastSynced < 5 * 60 * 1000) {
            status = 'synced';
        }

        return {
            ideId,
            name: IDE_NAMES[ideId as IDEType] || ideId,
            icon: IDE_ICONS[ideId as IDEType] || '📦',
            path: idePath,
            enabled: settings.enabledIDEs[ideId] ?? true,
            hasOverride: hasOverride(ideId),
            isInstalled,
            lastSynced,
            status,
        };
    });
}

// ============================================================================
// Sync Engine
// ============================================================================

function getConfigForIDE(ideId: string): MCPConfig {
    // Check for IDE-specific override first
    const override = getOverrideConfig(ideId);
    if (override) {
        return override;
    }

    // Fall back to master config
    return getMasterConfig();
}

async function syncToIDE(
    ideId: string,
    settings: SyncSettings
): Promise<{ success: boolean; error?: string }> {
    const idePath = IDE_MCP_PATHS[ideId];

    if (!idePath) {
        return { success: false, error: 'Unknown IDE' };
    }

    // Check if sync is enabled for this IDE
    if (!settings.enabledIDEs[ideId]) {
        return { success: false, error: 'Sync disabled for this IDE' };
    }

    try {
        // Create backup if enabled and file exists
        if (settings.createBackups && fileExists(idePath)) {
            createBackup(ideId, idePath);
        }

        // Get the config to sync
        const config = getConfigForIDE(ideId);

        // Write the config
        writeJSON(idePath, config);

        // Log the sync
        appendSyncLog({
            timestamp: Date.now(),
            ideId,
            action: 'sync',
            success: true,
        });

        return { success: true };
    } catch (error: any) {
        appendSyncLog({
            timestamp: Date.now(),
            ideId,
            action: 'sync',
            success: false,
            error: error.message,
        });

        return { success: false, error: error.message };
    }
}

export async function syncMCPConfigs(ideIds?: string[]): Promise<SyncResult> {
    // Ensure master config exists
    ensureMasterConfig();

    const settings = loadSyncSettings();
    const result: SyncResult = {
        success: [],
        failed: [],
        requireRestart: [],
        skipped: [],
    };

    const idesToSync = ideIds || Object.keys(IDE_MCP_PATHS);

    for (const ideId of idesToSync) {
        // Check if IDE is enabled
        if (!settings.enabledIDEs[ideId]) {
            result.skipped.push(ideId);
            continue;
        }

        // Check if IDE is installed
        if (!getIDEInstallStatus(ideId)) {
            result.skipped.push(ideId);
            continue;
        }

        const syncResult = await syncToIDE(ideId, settings);

        if (syncResult.success) {
            result.success.push(ideId);
            result.requireRestart.push(ideId); // All IDEs need restart to pick up changes
        } else {
            result.failed.push({
                ide: ideId,
                error: syncResult.error || 'Unknown error',
            });
        }
    }

    // Update last global sync time
    settings.lastGlobalSync = Date.now();
    saveSyncSettings(settings);

    return result;
}

// ============================================================================
// Import from IDE
// ============================================================================

export async function importFromIDE(ideId: string): Promise<{ success: boolean; error?: string }> {
    const idePath = IDE_MCP_PATHS[ideId];

    if (!idePath) {
        return { success: false, error: 'Unknown IDE' };
    }

    if (!fileExists(idePath)) {
        return { success: false, error: `Config not found at ${idePath}` };
    }

    try {
        const config = readJSON<MCPConfig>(idePath, { mcpServers: {} });
        saveMasterConfig(config);

        appendSyncLog({
            timestamp: Date.now(),
            ideId,
            action: 'import',
            success: true,
        });

        return { success: true };
    } catch (error: any) {
        appendSyncLog({
            timestamp: Date.now(),
            ideId,
            action: 'import',
            success: false,
            error: error.message,
        });

        return { success: false, error: error.message };
    }
}

// ============================================================================
// Open Config File
// ============================================================================

export function getMasterConfigPath(): string {
    ensureMasterConfig();
    return MASTER_MCP_PATH;
}

export function getDevSynqDir(): string {
    ensureDir(DEVSYNQ_DIR);
    return DEVSYNQ_DIR;
}

// ============================================================================
// Project-Specific MCP Management
// ============================================================================

// Store for tracking injected project MCPs per IDE session
const injectedProjectMCPs: Map<string, string[]> = new Map();

/**
 * Load project-specific MCP configuration
 */
export function getProjectMCPConfig(projectPath: string): MCPConfig | null {
    const projectMCPPath = path.join(projectPath, '.devsynq', 'mcp-config.json');
    if (fileExists(projectMCPPath)) {
        return readJSON<MCPConfig>(projectMCPPath, { mcpServers: {} });
    }
    return null;
}

/**
 * Save project-specific MCP configuration
 */
export function saveProjectMCPConfig(projectPath: string, config: MCPConfig): void {
    const projectMCPPath = path.join(projectPath, '.devsynq', 'mcp-config.json');
    writeJSON(projectMCPPath, config);
}

/**
 * Get project MCP servers
 */
export function getProjectMCPServers(projectPath: string): MCPConfig['mcpServers'] {
    const config = getProjectMCPConfig(projectPath);
    return config?.mcpServers || {};
}

/**
 * Add an MCP server to a project
 */
export function addProjectMCPServer(
    projectPath: string,
    serverName: string,
    serverConfig: any
): void {
    const config = getProjectMCPConfig(projectPath) || { mcpServers: {} };
    config.mcpServers[serverName] = serverConfig;
    saveProjectMCPConfig(projectPath, config);
}

/**
 * Remove an MCP server from a project
 */
export function removeProjectMCPServer(projectPath: string, serverName: string): void {
    const config = getProjectMCPConfig(projectPath);
    if (config && config.mcpServers[serverName]) {
        delete config.mcpServers[serverName];
        saveProjectMCPConfig(projectPath, config);
    }
}

/**
 * Inject project-specific MCPs into an IDE's configuration
 * Returns the list of server names that were injected
 */
export function injectProjectMCPs(projectPath: string, ideId: string): string[] {
    const projectConfig = getProjectMCPConfig(projectPath);
    if (!projectConfig || Object.keys(projectConfig.mcpServers).length === 0) {
        return [];
    }

    const idePath = IDE_MCP_PATHS[ideId];
    if (!idePath) {
        return [];
    }

    try {
        // Read current IDE config
        const currentConfig = readJSON<MCPConfig>(idePath, { mcpServers: {} });
        const injectedServers: string[] = [];

        // Merge project MCPs into IDE config
        for (const [serverName, serverConfig] of Object.entries(projectConfig.mcpServers)) {
            // Prefix with project identifier to avoid conflicts
            const prefixedName = `[project] ${serverName}`;
            currentConfig.mcpServers[prefixedName] = serverConfig;
            injectedServers.push(prefixedName);
        }

        // Write merged config
        writeJSON(idePath, currentConfig);

        // Track what was injected
        const key = `${ideId}:${projectPath}`;
        injectedProjectMCPs.set(key, injectedServers);

        console.log(`Injected ${injectedServers.length} project MCPs for ${ideId}`);
        return injectedServers;
    } catch (error) {
        console.error('Error injecting project MCPs:', error);
        return [];
    }
}

/**
 * Remove project-specific MCPs from an IDE's configuration
 */
export function removeProjectMCPs(projectPath: string, ideId: string): void {
    const key = `${ideId}:${projectPath}`;
    const injectedServers = injectedProjectMCPs.get(key);

    if (!injectedServers || injectedServers.length === 0) {
        return;
    }

    const idePath = IDE_MCP_PATHS[ideId];
    if (!idePath) {
        return;
    }

    try {
        // Read current IDE config
        const currentConfig = readJSON<MCPConfig>(idePath, { mcpServers: {} });

        // Remove injected project MCPs
        for (const serverName of injectedServers) {
            delete currentConfig.mcpServers[serverName];
        }

        // Write cleaned config
        writeJSON(idePath, currentConfig);

        // Clear tracking
        injectedProjectMCPs.delete(key);

        console.log(`Removed ${injectedServers.length} project MCPs from ${ideId}`);
    } catch (error) {
        console.error('Error removing project MCPs:', error);
    }
}

/**
 * Check if project has MCP configuration
 */
export function hasProjectMCPs(projectPath: string): boolean {
    const config = getProjectMCPConfig(projectPath);
    return config !== null && Object.keys(config.mcpServers).length > 0;
}

// ============================================================================
// Centralized vs Per-Project MCP Configuration
// ============================================================================

export interface ProjectMCPInfo {
    usesCustom: boolean;
    configPath: string;
    exists: boolean;
    serverCount: number;
}

/**
 * Validate an MCP configuration file
 */
export function validateMCPConfigFile(filePath: string): { valid: boolean; error?: string } {
    if (!fileExists(filePath)) {
        return { valid: false, error: 'File does not exist' };
    }

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const config = JSON.parse(content);

        // Check for required mcpServers property
        if (!config.mcpServers || typeof config.mcpServers !== 'object') {
            return { valid: false, error: 'Missing or invalid mcpServers property' };
        }

        // Validate each server entry
        for (const [name, server] of Object.entries(config.mcpServers)) {
            if (!server || typeof server !== 'object') {
                return { valid: false, error: `Invalid server configuration for "${name}"` };
            }
            const serverObj = server as Record<string, unknown>;
            if (!serverObj.command || typeof serverObj.command !== 'string') {
                return { valid: false, error: `Missing command for server "${name}"` };
            }
        }

        return { valid: true };
    } catch (error: any) {
        return { valid: false, error: `Invalid JSON: ${error.message}` };
    }
}

/**
 * Get information about a project's MCP configuration
 */
export function getProjectCustomMCPInfo(projectPath: string, customPath?: string): ProjectMCPInfo {
    if (customPath) {
        // Custom path is set - resolve it
        const resolvedPath = path.isAbsolute(customPath)
            ? customPath
            : path.join(projectPath, customPath);
        
        const exists = fileExists(resolvedPath);
        let serverCount = 0;
        
        if (exists) {
            const config = readJSON<MCPConfig>(resolvedPath, { mcpServers: {} });
            serverCount = Object.keys(config.mcpServers).length;
        }

        return {
            usesCustom: true,
            configPath: resolvedPath,
            exists,
            serverCount,
        };
    }

    // No custom path - using centralized config
    const masterConfig = getMasterConfig();
    return {
        usesCustom: false,
        configPath: MASTER_MCP_PATH,
        exists: fileExists(MASTER_MCP_PATH),
        serverCount: Object.keys(masterConfig.mcpServers).length,
    };
}

/**
 * Get the effective MCP configuration for a project
 * Uses custom config if set, otherwise falls back to master
 */
export function getEffectiveMCPConfig(projectPath: string, customPath?: string): MCPConfig {
    if (customPath) {
        const resolvedPath = path.isAbsolute(customPath)
            ? customPath
            : path.join(projectPath, customPath);
        
        if (fileExists(resolvedPath)) {
            return readJSON<MCPConfig>(resolvedPath, { mcpServers: {} });
        }
        // Custom path set but file doesn't exist - fall back to master
        console.warn(`Custom MCP config not found at ${resolvedPath}, using master`);
    }

    return getMasterConfig();
}

/**
 * Create a project-specific MCP config from the master config
 */
export function createProjectMCPFromMaster(projectPath: string): string {
    const masterConfig = getMasterConfig();
    const projectConfigPath = path.join(projectPath, '.devsynq', 'mcp.json');
    
    writeJSON(projectConfigPath, masterConfig);
    
    console.log(`Created project MCP config at ${projectConfigPath}`);
    return projectConfigPath;
}

/**
 * Sync MCP config to IDEs for a specific project
 * Uses the project's custom config if set, otherwise uses master
 */
export async function syncMCPConfigsForProject(
    projectPath: string,
    customConfigPath?: string,
    ideIds?: string[]
): Promise<SyncResult> {
    const config = getEffectiveMCPConfig(projectPath, customConfigPath);
    const settings = loadSyncSettings();
    
    const result: SyncResult = {
        success: [],
        failed: [],
        requireRestart: [],
        skipped: [],
    };

    const idesToSync = ideIds || Object.keys(IDE_MCP_PATHS);

    for (const ideId of idesToSync) {
        if (!settings.enabledIDEs[ideId]) {
            result.skipped.push(ideId);
            continue;
        }

        if (!getIDEInstallStatus(ideId)) {
            result.skipped.push(ideId);
            continue;
        }

        const idePath = IDE_MCP_PATHS[ideId];
        if (!idePath) {
            result.skipped.push(ideId);
            continue;
        }
        
        try {
            // Create backup if enabled
            if (settings.createBackups && fileExists(idePath)) {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T').join('_');
                const backupPath = getBackupPath(ideId, timestamp);
                copyFile(idePath, backupPath);
            }

            // Write the effective config
            writeJSON(idePath, config);

            appendSyncLog({
                timestamp: Date.now(),
                ideId,
                action: 'sync',
                success: true,
            });

            result.success.push(ideId);
            result.requireRestart.push(ideId);
        } catch (error: any) {
            appendSyncLog({
                timestamp: Date.now(),
                ideId,
                action: 'sync',
                success: false,
                error: error.message,
            });

            result.failed.push({
                ide: ideId,
                error: error.message,
            });
        }
    }

    return result;
}

