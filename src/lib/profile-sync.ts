/**
 * Profile Sync Engine
 * Synchronizes the canonical .code-profile across supported IDEs.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { IDEType } from '../types';
import { DEVSYNQ_DIR } from './mcp-config';

// ---------------------------------------------------------------------------//
// Paths & Defaults
// ---------------------------------------------------------------------------//

const HOME = os.homedir();
const APPDATA = process.env.APPDATA || path.join(HOME, 'AppData', 'Roaming');
const LOCALAPPDATA =
    process.env.LOCALAPPDATA || path.join(HOME, 'AppData', 'Local');

export const MASTER_PROFILE_PATH = path.join(DEVSYNQ_DIR, '.code-profile');
export const PROFILE_SYNC_SETTINGS_PATH = path.join(
    DEVSYNQ_DIR,
    'profile-sync-settings.json',
);

type Platform = 'darwin' | 'win32' | 'linux';

interface IDEProfileConfig {
    id: string;
    name: string;
    path: () => string;
}

const IDE_PROFILE_PATHS: IDEProfileConfig[] = [
    {
        id: 'cursor',
        name: IDEType.Cursor,
        path: () => {
            const platform = os.platform() as Platform;
            if (platform === 'darwin') {
                return path.join(
                    HOME,
                    'Library',
                    'Application Support',
                    'Cursor',
                    'User',
                    '.code-profile',
                );
            }
            if (platform === 'win32') {
                return path.join(APPDATA, 'Cursor', 'User', '.code-profile');
            }
            return path.join(HOME, '.config', 'Cursor', 'User', '.code-profile');
        },
    },
    {
        id: 'windsurf',
        name: IDEType.Windsurf,
        path: () => {
            const platform = os.platform() as Platform;
            if (platform === 'darwin') {
                return path.join(
                    HOME,
                    'Library',
                    'Application Support',
                    'Windsurf',
                    'User',
                    '.code-profile',
                );
            }
            if (platform === 'win32') {
                return path.join(APPDATA, 'Windsurf', 'User', '.code-profile');
            }
            return path.join(
                HOME,
                '.config',
                'Windsurf',
                'User',
                '.code-profile',
            );
        },
    },
    {
        id: 'vscode',
        name: IDEType.VSCode,
        path: () => {
            const platform = os.platform() as Platform;
            if (platform === 'darwin') {
                return path.join(
                    HOME,
                    'Library',
                    'Application Support',
                    'Code',
                    'User',
                    '.code-profile',
                );
            }
            if (platform === 'win32') {
                return path.join(APPDATA, 'Code', 'User', '.code-profile');
            }
            return path.join(HOME, '.config', 'Code', 'User', '.code-profile');
        },
    },
    {
        id: 'webstorm',
        name: IDEType.WebStorm,
        path: () => {
            const platform = os.platform() as Platform;
            if (platform === 'darwin') {
                return path.join(
                    HOME,
                    'Library',
                    'Application Support',
                    'JetBrains',
                    'WebStorm',
                    'options',
                    '.code-profile',
                );
            }
            if (platform === 'win32') {
                return path.join(APPDATA, 'JetBrains', 'WebStorm', 'options', '.code-profile');
            }
            return path.join(
                HOME,
                '.config',
                'JetBrains',
                'WebStorm',
                'options',
                '.code-profile',
            );
        },
    },
    {
        id: 'intellij',
        name: IDEType.IntelliJIDEA,
        path: () => {
            const platform = os.platform() as Platform;
            if (platform === 'darwin') {
                return path.join(
                    HOME,
                    'Library',
                    'Application Support',
                    'JetBrains',
                    'IntelliJIdea',
                    'options',
                    '.code-profile',
                );
            }
            if (platform === 'win32') {
                return path.join(
                    APPDATA,
                    'JetBrains',
                    'IntelliJIdea',
                    'options',
                    '.code-profile',
                );
            }
            return path.join(
                HOME,
                '.config',
                'JetBrains',
                'IntelliJIdea',
                'options',
                '.code-profile',
            );
        },
    },
    {
        id: 'pycharm',
        name: IDEType.PyCharm,
        path: () => {
            const platform = os.platform() as Platform;
            if (platform === 'darwin') {
                return path.join(
                    HOME,
                    'Library',
                    'Application Support',
                    'JetBrains',
                    'PyCharm',
                    'options',
                    '.code-profile',
                );
            }
            if (platform === 'win32') {
                return path.join(
                    APPDATA,
                    'JetBrains',
                    'PyCharm',
                    'options',
                    '.code-profile',
                );
            }
            return path.join(
                HOME,
                '.config',
                'JetBrains',
                'PyCharm',
                'options',
                '.code-profile',
            );
        },
    },
];

// ---------------------------------------------------------------------------//
// Types
// ---------------------------------------------------------------------------//

export interface ProfileSyncSettings {
    enabledIDEs: Record<string, boolean>;
    autoSyncOnLaunch: boolean;
    lastSynced?: Record<string, number>;
    lastGlobalSync?: number;
}

export interface ProfileSyncStatus {
    ideId: string;
    name: string;
    path: string;
    enabled: boolean;
    isInstalled: boolean;
    lastSynced?: number;
    status: 'synced' | 'pending' | 'not-installed';
}

export interface ProfileSyncResult {
    success: string[];
    failed: Array<{ ide: string; error: string }>;
    skipped: string[];
}

// ---------------------------------------------------------------------------//
// Helpers
// ---------------------------------------------------------------------------//

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

function ensureMasterProfile(): void {
    ensureDir(path.dirname(MASTER_PROFILE_PATH));
    if (!fs.existsSync(MASTER_PROFILE_PATH)) {
        fs.writeFileSync(MASTER_PROFILE_PATH, '', 'utf8');
    }
}

// ---------------------------------------------------------------------------//
// Settings
// ---------------------------------------------------------------------------//

const DEFAULT_PROFILE_SYNC_SETTINGS: ProfileSyncSettings = {
    enabledIDEs: IDE_PROFILE_PATHS.reduce<Record<string, boolean>>((acc, ide) => {
        acc[ide.id] = true;
        return acc;
    }, {}),
    autoSyncOnLaunch: true,
    lastSynced: {},
};

export function loadProfileSyncSettings(): ProfileSyncSettings {
    const saved = readJSON<Partial<ProfileSyncSettings>>(
        PROFILE_SYNC_SETTINGS_PATH,
        {},
    );
    return {
        ...DEFAULT_PROFILE_SYNC_SETTINGS,
        ...saved,
        enabledIDEs: {
            ...DEFAULT_PROFILE_SYNC_SETTINGS.enabledIDEs,
            ...(saved.enabledIDEs || {}),
        },
        lastSynced: {
            ...DEFAULT_PROFILE_SYNC_SETTINGS.lastSynced,
            ...(saved.lastSynced || {}),
        },
    };
}

export function saveProfileSyncSettings(settings: ProfileSyncSettings): void {
    writeJSON(PROFILE_SYNC_SETTINGS_PATH, settings);
}

export function toggleProfileIDESync(
    ideId: string,
    enabled: boolean,
): ProfileSyncSettings {
    const settings = loadProfileSyncSettings();
    settings.enabledIDEs[ideId] = enabled;
    saveProfileSyncSettings(settings);
    return settings;
}

// ---------------------------------------------------------------------------//
// Status
// ---------------------------------------------------------------------------//

function getProfilePathForIDE(ideId: string): string | null {
    const ide = IDE_PROFILE_PATHS.find((i) => i.id === ideId);
    return ide ? ide.path() : null;
}

function isIDEInstalled(ideId: string): boolean {
    const filePath = getProfilePathForIDE(ideId);
    if (!filePath) return false;
    const dir = path.dirname(filePath);
    return fs.existsSync(dir);
}

export function getProfileSyncStatus(): ProfileSyncStatus[] {
    const settings = loadProfileSyncSettings();
    const now = Date.now();

    return IDE_PROFILE_PATHS.map(({ id, name, path: pathFn }) => {
        const filePath = pathFn();
        const isInstalled = isIDEInstalled(id);
        const lastSynced = settings.lastSynced?.[id];

        let status: ProfileSyncStatus['status'] = 'pending';
        if (!isInstalled) {
            status = 'not-installed';
        } else if (lastSynced && now - lastSynced < 5 * 60 * 1000) {
            status = 'synced';
        }

        return {
            ideId: id,
            name,
            path: filePath,
            enabled: settings.enabledIDEs[id] ?? true,
            isInstalled,
            lastSynced,
            status,
        };
    });
}

// ---------------------------------------------------------------------------//
// Sync
// ---------------------------------------------------------------------------//

async function syncProfileToIDE(
    ideId: string,
    settings: ProfileSyncSettings,
): Promise<{ success: boolean; error?: string }> {
    const targetPath = getProfilePathForIDE(ideId);
    if (!targetPath) {
        return { success: false, error: 'Unknown IDE' };
    }

    if (!settings.enabledIDEs[ideId]) {
        return { success: false, error: 'Sync disabled for this IDE' };
    }

    if (!isIDEInstalled(ideId)) {
        return { success: false, error: 'IDE not installed' };
    }

    try {
        ensureMasterProfile();
        ensureDir(path.dirname(targetPath));
        fs.copyFileSync(MASTER_PROFILE_PATH, targetPath);

        const updated = loadProfileSyncSettings();
        updated.lastSynced = updated.lastSynced || {};
        updated.lastSynced[ideId] = Date.now();
        saveProfileSyncSettings(updated);

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function syncProfiles(
    ideIds?: string[],
): Promise<ProfileSyncResult> {
    ensureMasterProfile();
    const settings = loadProfileSyncSettings();
    const result: ProfileSyncResult = {
        success: [],
        failed: [],
        skipped: [],
    };

    const targets = ideIds ?? IDE_PROFILE_PATHS.map((i) => i.id);

    for (const ideId of targets) {
        if (!settings.enabledIDEs[ideId]) {
            result.skipped.push(ideId);
            continue;
        }

        if (!isIDEInstalled(ideId)) {
            result.skipped.push(ideId);
            continue;
        }

        const syncResult = await syncProfileToIDE(ideId, settings);
        if (syncResult.success) {
            result.success.push(ideId);
        } else {
            result.failed.push({
                ide: ideId,
                error: syncResult.error || 'Unknown error',
            });
        }
    }

    const updated = loadProfileSyncSettings();
    updated.lastGlobalSync = Date.now();
    saveProfileSyncSettings(updated);

    return result;
}

// ---------------------------------------------------------------------------//
// Utilities
// ---------------------------------------------------------------------------//

export function getMasterProfilePath(): string {
    ensureMasterProfile();
    return MASTER_PROFILE_PATH;
}

export function getProfileTargets() {
    return IDE_PROFILE_PATHS.map((item) => ({
        id: item.id,
        name: item.name,
        path: item.path(),
    }));
}

