/**
 * Multi-IDE Rules Syncing
 * 
 * Synchronizes .cursorrules and similar rule files across multiple IDEs
 */

import fs from 'fs';
import path from 'path';
import { DEVSYNQ_DIR } from './mcp-config';

// ============================================================================
// Types
// ============================================================================

export interface RulesFileConfig {
    ideId: string;
    fileName: string;
    description: string;
}

export interface RulesSyncSettings {
    masterRulesFile: string; // 'cursorrules' | 'windsurfrules' | 'custom'
    enabledFiles: string[];
    autoSync: boolean;
}

export interface RulesSyncResult {
    success: string[];
    failed: Array<{ file: string; error: string }>;
}

// ============================================================================
// Constants
// ============================================================================

const RULES_SYNC_SETTINGS_PATH = path.join(DEVSYNQ_DIR, 'rules-sync-settings.json');

// Supported rule file types
export const RULES_FILES: RulesFileConfig[] = [
    { ideId: 'cursor', fileName: '.cursorrules', description: 'Cursor AI Rules' },
    { ideId: 'windsurf', fileName: '.windsurfrules', description: 'Windsurf AI Rules' },
    { ideId: 'trae', fileName: '.trae-rules', description: 'Trae IDE Rules' },
    { ideId: 'cline', fileName: '.clinerules', description: 'Cline/Roo Rules' },
    { ideId: 'aider', fileName: '.aider-rules', description: 'Aider Rules' },
    { ideId: 'openai', fileName: 'AGENTS.md', description: 'OpenAI Codex Rules' },
    { ideId: 'claude', fileName: 'CLAUDE.md', description: 'Claude/Anthropic Rules' },
];

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
// Settings Management
// ============================================================================

const DEFAULT_RULES_SYNC_SETTINGS: RulesSyncSettings = {
    masterRulesFile: '.cursorrules',
    enabledFiles: ['.cursorrules', '.windsurfrules'],
    autoSync: false,
};

export function loadRulesSyncSettings(): RulesSyncSettings {
    return {
        ...DEFAULT_RULES_SYNC_SETTINGS,
        ...readJSON<Partial<RulesSyncSettings>>(RULES_SYNC_SETTINGS_PATH, {}),
    };
}

export function saveRulesSyncSettings(settings: RulesSyncSettings): void {
    writeJSON(RULES_SYNC_SETTINGS_PATH, settings);
}

// ============================================================================
// Rules Syncing
// ============================================================================

/**
 * Sync rules from master file to other rule files in a project
 */
export function syncRulesInProject(projectPath: string): RulesSyncResult {
    const settings = loadRulesSyncSettings();
    const result: RulesSyncResult = {
        success: [],
        failed: [],
    };

    // Find master rules file
    const masterPath = path.join(projectPath, settings.masterRulesFile);
    if (!fs.existsSync(masterPath)) {
        return {
            success: [],
            failed: [{ file: settings.masterRulesFile, error: 'Master rules file not found' }],
        };
    }

    // Read master content
    let masterContent: string;
    try {
        masterContent = fs.readFileSync(masterPath, 'utf8');
    } catch (error) {
        return {
            success: [],
            failed: [{ file: settings.masterRulesFile, error: String(error) }],
        };
    }

    // Sync to each enabled file
    for (const fileName of settings.enabledFiles) {
        if (fileName === settings.masterRulesFile) {
            continue; // Skip master file itself
        }

        const targetPath = path.join(projectPath, fileName);

        try {
            fs.writeFileSync(targetPath, masterContent, 'utf8');
            result.success.push(fileName);
        } catch (error) {
            result.failed.push({ file: fileName, error: String(error) });
        }
    }

    return result;
}

/**
 * Get rules sync status for a project
 */
export function getProjectRulesSyncStatus(projectPath: string): {
    hasRules: boolean;
    masterFile: string | null;
    syncedFiles: string[];
    unsyncedFiles: string[];
} {
    const settings = loadRulesSyncSettings();
    const masterPath = path.join(projectPath, settings.masterRulesFile);
    const hasRules = fs.existsSync(masterPath);

    let masterContent = '';
    if (hasRules) {
        try {
            masterContent = fs.readFileSync(masterPath, 'utf8');
        } catch (e) {
            // Ignore
        }
    }

    const syncedFiles: string[] = [];
    const unsyncedFiles: string[] = [];

    for (const fileName of settings.enabledFiles) {
        if (fileName === settings.masterRulesFile) continue;

        const filePath = path.join(projectPath, fileName);
        if (fs.existsSync(filePath)) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                if (content === masterContent) {
                    syncedFiles.push(fileName);
                } else {
                    unsyncedFiles.push(fileName);
                }
            } catch (e) {
                unsyncedFiles.push(fileName);
            }
        } else {
            unsyncedFiles.push(fileName);
        }
    }

    return {
        hasRules,
        masterFile: hasRules ? settings.masterRulesFile : null,
        syncedFiles,
        unsyncedFiles,
    };
}

/**
 * Remove a specific rules file from a project
 */
export function removeRulesFile(projectPath: string, fileName: string): boolean {
    const filePath = path.join(projectPath, fileName);
    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
            return true;
        } catch (e) {
            console.error(`Error removing ${filePath}:`, e);
        }
    }
    return false;
}

/**
 * Get available rules files in a project
 */
export function getProjectRulesFiles(projectPath: string): Array<{
    fileName: string;
    exists: boolean;
    description: string;
}> {
    return RULES_FILES.map(config => ({
        fileName: config.fileName,
        exists: fs.existsSync(path.join(projectPath, config.fileName)),
        description: config.description,
    }));
}
