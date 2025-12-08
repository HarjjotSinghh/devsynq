/**
 * API Keys Sync Library
 * Manages storing and syncing API keys across IDEs
 */

import { APIKeys, APIKeysSettings } from '../types';
const path = require('path');
const fs = require('fs');
const os = require('os');
const { app } = require('electron');

// Get user data path
function getUserDataPath(): string {
    try {
        return app.getPath('userData');
    } catch {
        // Fallback for when app is not ready
        return path.join(os.homedir(), '.devsynq');
    }
}

const API_KEYS_FILE = () => path.join(getUserDataPath(), 'api-keys.json');

// IDE config file paths
interface IDEConfigInfo {
    id: string;
    name: string;
    configPath: () => string;
    keyMapping: Record<keyof APIKeys, string | null>; // null means not supported
    format: 'json' | 'jsonc' | 'env';
}

const IDE_CONFIGS: IDEConfigInfo[] = [
    {
        id: 'cursor',
        name: 'Cursor',
        configPath: () => {
            const platform = os.platform();
            if (platform === 'darwin') {
                return path.join(os.homedir(), 'Library/Application Support/Cursor/User/settings.json');
            } else if (platform === 'win32') {
                return path.join(process.env.APPDATA || '', 'Cursor/User/settings.json');
            }
            return path.join(os.homedir(), '.config/Cursor/User/settings.json');
        },
        keyMapping: {
            openai: 'cursor.openaiApiKey',
            anthropic: 'cursor.anthropicApiKey',
            gemini: null,
            cursor: null, // Cursor uses its own auth
            codeium: null,
            sourcegraph: null,
        },
        format: 'json',
    },
    {
        id: 'windsurf',
        name: 'Windsurf',
        configPath: () => {
            const platform = os.platform();
            if (platform === 'darwin') {
                return path.join(os.homedir(), 'Library/Application Support/Windsurf/User/settings.json');
            } else if (platform === 'win32') {
                return path.join(process.env.APPDATA || '', 'Windsurf/User/settings.json');
            }
            return path.join(os.homedir(), '.config/Windsurf/User/settings.json');
        },
        keyMapping: {
            openai: 'openai.apiKey',
            anthropic: 'anthropic.apiKey',
            gemini: null,
            cursor: null,
            codeium: null, // Codeium uses its own auth
            sourcegraph: null,
        },
        format: 'json',
    },
    {
        id: 'vscode',
        name: 'VS Code',
        configPath: () => {
            const platform = os.platform();
            if (platform === 'darwin') {
                return path.join(os.homedir(), 'Library/Application Support/Code/User/settings.json');
            } else if (platform === 'win32') {
                return path.join(process.env.APPDATA || '', 'Code/User/settings.json');
            }
            return path.join(os.homedir(), '.config/Code/User/settings.json');
        },
        keyMapping: {
            openai: 'github.copilot.advanced.openaiKey', // For GitHub Copilot with custom API
            anthropic: null,
            gemini: null,
            cursor: null,
            codeium: 'codeium.api_key',
            sourcegraph: 'sourcegraph.accessToken',
        },
        format: 'jsonc',
    },
    {
        id: 'trae',
        name: 'Trae',
        configPath: () => {
            const platform = os.platform();
            if (platform === 'darwin') {
                return path.join(os.homedir(), 'Library/Application Support/Trae/User/settings.json');
            } else if (platform === 'win32') {
                return path.join(process.env.APPDATA || '', 'Trae/User/settings.json');
            }
            return path.join(os.homedir(), '.config/Trae/User/settings.json');
        },
        keyMapping: {
            openai: 'trae.openaiApiKey',
            anthropic: 'trae.anthropicApiKey',
            gemini: 'trae.geminiApiKey',
            cursor: null,
            codeium: null,
            sourcegraph: null,
        },
        format: 'json',
    },
];

/**
 * Load API keys settings
 */
export function loadAPIKeysSettings(): APIKeysSettings {
    const defaultSettings: APIKeysSettings = {
        keys: {},
        syncEnabled: {
            cursor: true,
            windsurf: true,
            vscode: true,
            trae: true,
        },
    };

    try {
        const filePath = API_KEYS_FILE();
        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            return { ...defaultSettings, ...data };
        }
    } catch (error) {
        console.error('Error loading API keys settings:', error);
    }

    return defaultSettings;
}

/**
 * Save API keys settings
 */
export function saveAPIKeysSettings(settings: APIKeysSettings): void {
    try {
        const filePath = API_KEYS_FILE();
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));
    } catch (error) {
        console.error('Error saving API keys settings:', error);
    }
}

/**
 * Update a specific API key
 */
export function updateAPIKey(keyName: keyof APIKeys, value: string | undefined): void {
    const settings = loadAPIKeysSettings();
    if (value) {
        settings.keys[keyName] = value;
    } else {
        delete settings.keys[keyName];
    }
    saveAPIKeysSettings(settings);
}

/**
 * Delete an API key
 */
export function deleteAPIKey(keyName: keyof APIKeys): void {
    const settings = loadAPIKeysSettings();
    delete settings.keys[keyName];
    saveAPIKeysSettings(settings);
}

/**
 * Parse JSON with comments (JSONC format used by VS Code)
 */
function parseJSONC(content: string): any {
    // Remove single-line comments
    let cleaned = content.replace(/\/\/.*$/gm, '');
    // Remove multi-line comments
    cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
    // Handle trailing commas
    cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');

    return JSON.parse(cleaned);
}

/**
 * Set a nested property in an object using dot notation
 */
function setNestedProperty(obj: any, pathStr: string, value: any): void {
    const parts = pathStr.split('.');
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (part && !(part in current)) {
            current[part] = {};
        }
        if (part) {
            current = current[part];
        }
    }

    const lastPart = parts[parts.length - 1];
    if (lastPart) {
        current[lastPart] = value;
    }
}

/**
 * Sync API keys to a specific IDE
 */
export async function syncToIDE(ideId: string): Promise<{ success: boolean; error?: string }> {
    const ideConfig = IDE_CONFIGS.find(c => c.id === ideId);
    if (!ideConfig) {
        return { success: false, error: `Unknown IDE: ${ideId}` };
    }

    const settings = loadAPIKeysSettings();
    const configPath = ideConfig.configPath();

    // Check if sync is enabled for this IDE
    if (!settings.syncEnabled[ideId]) {
        return { success: false, error: 'Sync disabled for this IDE' };
    }

    try {
        let config: any = {};

        // Load existing config if it exists
        if (fs.existsSync(configPath)) {
            const content = fs.readFileSync(configPath, 'utf8');
            config = ideConfig.format === 'jsonc' ? parseJSONC(content) : JSON.parse(content);
        } else {
            // Ensure directory exists
            const dir = path.dirname(configPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        }

        // Apply API keys
        let keysApplied = 0;
        for (const [keyName, keyValue] of Object.entries(settings.keys)) {
            const configKey = ideConfig.keyMapping[keyName as keyof APIKeys];
            if (configKey && keyValue) {
                setNestedProperty(config, configKey, keyValue);
                keysApplied++;
            }
        }

        if (keysApplied === 0) {
            return { success: true }; // No keys to sync
        }

        // Write updated config
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

        // Update last synced timestamp
        const updatedSettings = loadAPIKeysSettings();
        updatedSettings.lastSynced = Date.now();
        saveAPIKeysSettings(updatedSettings);

        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

/**
 * Sync API keys to all enabled IDEs
 */
export async function syncToAllIDEs(): Promise<{
    success: string[];
    failed: Array<{ ide: string; error: string }>;
}> {
    const settings = loadAPIKeysSettings();
    const results = {
        success: [] as string[],
        failed: [] as Array<{ ide: string; error: string }>,
    };

    for (const ideConfig of IDE_CONFIGS) {
        if (settings.syncEnabled[ideConfig.id]) {
            const result = await syncToIDE(ideConfig.id);
            if (result.success) {
                results.success.push(ideConfig.name);
            } else {
                results.failed.push({ ide: ideConfig.name, error: result.error ?? 'Unknown error' });
            }
        }
    }

    return results;
}

/**
 * Toggle sync enabled for an IDE
 */
export function toggleIDEKeySync(ideId: string, enabled: boolean): void {
    const settings = loadAPIKeysSettings();
    settings.syncEnabled[ideId] = enabled;
    saveAPIKeysSettings(settings);
}

/**
 * Get available API key types
 */
export function getAPIKeyTypes(): Array<{
    id: keyof APIKeys;
    name: string;
    description: string;
    supportedIDEs: string[];
}> {
    return [
        {
            id: 'openai',
            name: 'OpenAI API Key',
            description: 'For GPT-4, ChatGPT, and other OpenAI services',
            supportedIDEs: IDE_CONFIGS.filter(c => c.keyMapping.openai).map(c => c.name),
        },
        {
            id: 'anthropic',
            name: 'Anthropic API Key',
            description: 'For Claude models',
            supportedIDEs: IDE_CONFIGS.filter(c => c.keyMapping.anthropic).map(c => c.name),
        },
        {
            id: 'gemini',
            name: 'Google AI (Gemini) API Key',
            description: 'For Gemini models',
            supportedIDEs: IDE_CONFIGS.filter(c => c.keyMapping.gemini).map(c => c.name),
        },
        {
            id: 'codeium',
            name: 'Codeium API Key',
            description: 'For Codeium/Windsurf AI features',
            supportedIDEs: IDE_CONFIGS.filter(c => c.keyMapping.codeium).map(c => c.name),
        },
        {
            id: 'sourcegraph',
            name: 'Sourcegraph Access Token',
            description: 'For Cody AI assistant',
            supportedIDEs: IDE_CONFIGS.filter(c => c.keyMapping.sourcegraph).map(c => c.name),
        },
    ];
}

/**
 * Get sync status for all IDEs
 */
export function getAPIKeySyncStatus(): Array<{
    id: string;
    name: string;
    enabled: boolean;
    configExists: boolean;
    supportedKeys: string[];
}> {
    const settings = loadAPIKeysSettings();

    return IDE_CONFIGS.map(config => ({
        id: config.id,
        name: config.name,
        enabled: settings.syncEnabled[config.id] ?? false,
        configExists: fs.existsSync(config.configPath()),
        supportedKeys: Object.entries(config.keyMapping)
            .filter(([_, val]) => val !== null)
            .map(([key]) => key),
    }));
}

/**
 * Mask an API key for display (show first 4 and last 4 characters)
 */
export function maskAPIKey(key: string): string {
    if (key.length <= 8) {
        return '****';
    }
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

/**
 * Validate an API key format (basic checks)
 */
export function validateAPIKey(keyName: keyof APIKeys, value: string): { valid: boolean; error?: string } {
    if (!value || value.trim().length === 0) {
        return { valid: false, error: 'Key cannot be empty' };
    }

    switch (keyName) {
        case 'openai':
            if (!value.startsWith('sk-') || value.length < 40) {
                return { valid: false, error: 'OpenAI keys should start with "sk-"' };
            }
            break;
        case 'anthropic':
            if (!value.startsWith('sk-ant-') && value.length < 40) {
                return { valid: false, error: 'Anthropic keys should start with "sk-ant-"' };
            }
            break;
        case 'gemini':
            if (value.length < 30) {
                return { valid: false, error: 'Gemini API keys are typically longer' };
            }
            break;
    }

    return { valid: true };
}
