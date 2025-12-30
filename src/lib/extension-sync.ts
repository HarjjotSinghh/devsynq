/**
 * IDE Extension Sync
 * 
 * Basic extension sync utility for VS Code-based IDEs
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { DEVSYNQ_DIR } from './mcp-config';

// ============================================================================
// Types
// ============================================================================

export interface ExtensionInfo {
    id: string;
    name: string;
    version: string;
    publisher: string;
}

export interface ExtensionSyncSettings {
    masterIDE: string;
    targetIDEs: string[];
    autoSync: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const EXT_SYNC_SETTINGS_PATH = path.join(DEVSYNQ_DIR, 'extension-sync-settings.json');

// IDE extension directories
function getExtensionPaths(): Record<string, string> {
    const homeDir = os.homedir();
    const platform = os.platform();

    if (platform === 'win32') {
        return {
            vscode: path.join(homeDir, '.vscode', 'extensions'),
            cursor: path.join(homeDir, '.cursor', 'extensions'),
            windsurf: path.join(homeDir, '.windsurf', 'extensions'),
        };
    } else if (platform === 'darwin') {
        return {
            vscode: path.join(homeDir, '.vscode', 'extensions'),
            cursor: path.join(homeDir, '.cursor', 'extensions'),
            windsurf: path.join(homeDir, '.windsurf', 'extensions'),
        };
    } else {
        return {
            vscode: path.join(homeDir, '.vscode', 'extensions'),
            cursor: path.join(homeDir, '.cursor', 'extensions'),
            windsurf: path.join(homeDir, '.windsurf', 'extensions'),
        };
    }
}

// ============================================================================
// Helpers
// ============================================================================

function ensureDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function readJSON<T>(filePath: string, defaultValue: T): T {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e);
    }
    return defaultValue;
}

function writeJSON<T>(filePath: string, data: T): void {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// ============================================================================
// Settings
// ============================================================================

const DEFAULT_EXT_SYNC_SETTINGS: ExtensionSyncSettings = {
    masterIDE: 'cursor',
    targetIDEs: ['vscode', 'windsurf'],
    autoSync: false,
};

export function loadExtensionSyncSettings(): ExtensionSyncSettings {
    return {
        ...DEFAULT_EXT_SYNC_SETTINGS,
        ...readJSON<Partial<ExtensionSyncSettings>>(EXT_SYNC_SETTINGS_PATH, {}),
    };
}

export function saveExtensionSyncSettings(settings: ExtensionSyncSettings): void {
    writeJSON(EXT_SYNC_SETTINGS_PATH, settings);
}

// ============================================================================
// Extension Detection
// ============================================================================

/**
 * Parse extension folder name to get extension info
 */
function parseExtensionDir(dirName: string): ExtensionInfo | null {
    // Format: publisher.name-version
    const match = dirName.match(/^(.+?)\.(.+?)-(\d+\.\d+\.\d+.*)$/);
    if (match) {
        return {
            id: `${match[1]}.${match[2]}`,
            publisher: match[1]!,
            name: match[2]!,
            version: match[3]!,
        };
    }
    return null;
}

/**
 * Get installed extensions for an IDE
 */
export function getIDEExtensions(ideId: string): ExtensionInfo[] {
    const extensionPaths = getExtensionPaths();
    const extPath = extensionPaths[ideId];

    if (!extPath || !fs.existsSync(extPath)) {
        return [];
    }

    try {
        const dirs = fs.readdirSync(extPath);
        const extensions: ExtensionInfo[] = [];

        for (const dir of dirs) {
            const fullPath = path.join(extPath, dir);
            if (fs.statSync(fullPath).isDirectory()) {
                const info = parseExtensionDir(dir);
                if (info) {
                    extensions.push(info);
                }
            }
        }

        return extensions;
    } catch (error) {
        console.error(`Error reading extensions for ${ideId}:`, error);
        return [];
    }
}

/**
 * Get extension comparison between IDEs
 */
export function compareExtensions(masterIDE: string, targetIDE: string): {
    common: ExtensionInfo[];
    onlyInMaster: ExtensionInfo[];
    onlyInTarget: ExtensionInfo[];
} {
    const masterExts = getIDEExtensions(masterIDE);
    const targetExts = getIDEExtensions(targetIDE);

    const masterIds = new Set(masterExts.map(e => e.id));
    const targetIds = new Set(targetExts.map(e => e.id));

    return {
        common: masterExts.filter(e => targetIds.has(e.id)),
        onlyInMaster: masterExts.filter(e => !targetIds.has(e.id)),
        onlyInTarget: targetExts.filter(e => !masterIds.has(e.id)),
    };
}

/**
 * Get available IDEs for extension sync
 */
export function getAvailableIDEsForExtensionSync(): Array<{
    id: string;
    name: string;
    hasExtensions: boolean;
    extensionCount: number;
}> {
    const extensionPaths = getExtensionPaths();
    const ideNames: Record<string, string> = {
        vscode: 'VS Code',
        cursor: 'Cursor',
        windsurf: 'Windsurf',
    };

    return Object.entries(extensionPaths).map(([id, extPath]) => {
        const hasExtensions = fs.existsSync(extPath);
        let extensionCount = 0;

        if (hasExtensions) {
            try {
                const dirs = fs.readdirSync(extPath);
                extensionCount = dirs.filter(d => {
                    const fullPath = path.join(extPath, d);
                    return fs.statSync(fullPath).isDirectory();
                }).length;
            } catch (e) {
                // Ignore errors
            }
        }

        return {
            id,
            name: ideNames[id] || id,
            hasExtensions,
            extensionCount,
        };
    });
}
