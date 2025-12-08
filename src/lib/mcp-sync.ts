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
