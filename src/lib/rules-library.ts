/**
 * Rules Template Library
 * 
 * Manages a library of .cursorrules / .windsurfrules templates
 */

import fs from 'fs';
import path from 'path';
import { DEVSYNQ_DIR } from './mcp-config';

// ============================================================================
// Types
// ============================================================================

export interface RuleTemplate {
    id: string;
    name: string;
    description: string;
    content: string;
    tags: string[];
    createdAt: number;
    updatedAt: number;
}

// ============================================================================
// Constants
// ============================================================================

const RULES_DIR = path.join(DEVSYNQ_DIR, 'rules-library');
const RULES_INDEX_PATH = path.join(RULES_DIR, 'index.json');

// Rule file names for different IDEs
const RULE_FILE_NAMES = [
    '.cursorrules',
    '.windsurfrules',
    '.trae-rules',
    '.clinerules',
    '.aider-rules',
    'AGENTS.md',
    'CLAUDE.md',
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
// Template Management
// ============================================================================

/**
 * Initialize the rules library
 */
export function initRulesLibrary(): void {
    ensureDir(RULES_DIR);

    // Create index if not exists
    if (!fs.existsSync(RULES_INDEX_PATH)) {
        writeJSON(RULES_INDEX_PATH, { templates: [] });
    }
}

/**
 * Get all rule templates
 */
export function getTemplates(): RuleTemplate[] {
    initRulesLibrary();
    const data = readJSON<{ templates: RuleTemplate[] }>(RULES_INDEX_PATH, { templates: [] });
    return data.templates;
}

/**
 * Get a single template by ID
 */
export function getTemplate(id: string): RuleTemplate | null {
    const templates = getTemplates();
    return templates.find(t => t.id === id) || null;
}

/**
 * Save a new template
 */
export function saveTemplate(template: Omit<RuleTemplate, 'id' | 'createdAt' | 'updatedAt'>): RuleTemplate {
    const templates = getTemplates();

    const newTemplate: RuleTemplate = {
        ...template,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    templates.push(newTemplate);
    writeJSON(RULES_INDEX_PATH, { templates });

    // Also save the raw content as a file
    const contentPath = path.join(RULES_DIR, `${newTemplate.id}.txt`);
    fs.writeFileSync(contentPath, newTemplate.content, 'utf8');

    return newTemplate;
}

/**
 * Update an existing template
 */
export function updateTemplate(id: string, updates: Partial<Omit<RuleTemplate, 'id' | 'createdAt'>>): RuleTemplate | null {
    const templates = getTemplates();
    const index = templates.findIndex(t => t.id === id);

    if (index === -1) return null;

    const existing = templates[index]!;
    const updated: RuleTemplate = {
        id: existing.id,
        name: updates.name ?? existing.name,
        description: updates.description ?? existing.description,
        content: updates.content ?? existing.content,
        tags: updates.tags ?? existing.tags,
        createdAt: existing.createdAt,
        updatedAt: Date.now(),
    };

    templates[index] = updated;

    writeJSON(RULES_INDEX_PATH, { templates });

    // Update content file if content was changed
    if (updates.content) {
        const contentPath = path.join(RULES_DIR, `${id}.txt`);
        fs.writeFileSync(contentPath, updates.content, 'utf8');
    }

    return updated;
}

/**
 * Delete a template
 */
export function deleteTemplate(id: string): boolean {
    const templates = getTemplates();
    const index = templates.findIndex(t => t.id === id);

    if (index === -1) return false;

    templates.splice(index, 1);
    writeJSON(RULES_INDEX_PATH, { templates });

    // Delete content file
    const contentPath = path.join(RULES_DIR, `${id}.txt`);
    if (fs.existsSync(contentPath)) {
        fs.unlinkSync(contentPath);
    }

    return true;
}

// ============================================================================
// Apply/Extract Rules
// ============================================================================

/**
 * Apply a template to a project
 */
export function applyTemplate(templateId: string, projectPath: string, fileName: string = '.cursorrules'): { success: boolean; error?: string } {
    const template = getTemplate(templateId);
    if (!template) {
        return { success: false, error: 'Template not found' };
    }

    try {
        const targetPath = path.join(projectPath, fileName);
        fs.writeFileSync(targetPath, template.content, 'utf8');
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

/**
 * Extract rules from an existing project
 */
export function extractRulesFromProject(projectPath: string): string | null {
    for (const fileName of RULE_FILE_NAMES) {
        const filePath = path.join(projectPath, fileName);
        if (fs.existsSync(filePath)) {
            try {
                return fs.readFileSync(filePath, 'utf8');
            } catch (e) {
                console.error(`Error reading ${filePath}:`, e);
            }
        }
    }
    return null;
}

/**
 * Get project rules file name and path if exists
 */
export function getProjectRulesInfo(projectPath: string): { fileName: string; path: string; content: string } | null {
    for (const fileName of RULE_FILE_NAMES) {
        const filePath = path.join(projectPath, fileName);
        if (fs.existsSync(filePath)) {
            try {
                return {
                    fileName,
                    path: filePath,
                    content: fs.readFileSync(filePath, 'utf8'),
                };
            } catch (e) {
                console.error(`Error reading ${filePath}:`, e);
            }
        }
    }
    return null;
}

/**
 * Remove rules from a project
 */
export function removeProjectRules(projectPath: string): boolean {
    let removed = false;
    for (const fileName of RULE_FILE_NAMES) {
        const filePath = path.join(projectPath, fileName);
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                removed = true;
            } catch (e) {
                console.error(`Error removing ${filePath}:`, e);
            }
        }
    }
    return removed;
}

// ============================================================================
// Built-in Templates
// ============================================================================

/**
 * Get built-in starter templates
 */
export function getBuiltInTemplates(): RuleTemplate[] {
    return [
        {
            id: 'builtin-clean-code',
            name: 'Clean Code',
            description: 'Focus on clean, readable, and maintainable code',
            content: `# Clean Code Guidelines

## Principles
- Write self-documenting code with clear names
- Keep functions small and focused (Single Responsibility)
- Avoid deep nesting - prefer early returns
- Use meaningful variable and function names
- Comments explain "why", not "what"

## Code Style
- Consistent formatting and indentation
- Group related code together
- Remove dead code and unnecessary comments
- Use TypeScript types for better documentation

## Best Practices
- Prefer composition over inheritance
- Handle errors gracefully
- Write pure functions when possible
- Avoid global state`,
            tags: ['clean-code', 'best-practices'],
            createdAt: 0,
            updatedAt: 0,
        },
        {
            id: 'builtin-tdd',
            name: 'TDD Focus',
            description: 'Test-Driven Development approach',
            content: `# Test-Driven Development

## Workflow
1. Write a failing test first
2. Write minimal code to pass
3. Refactor while keeping tests green

## Testing Guidelines
- Test behavior, not implementation
- One assertion per test when possible
- Use descriptive test names
- Mock external dependencies

## Coverage Goals
- Aim for > 80% code coverage
- Focus on critical paths first
- Don't test trivial code (getters/setters)`,
            tags: ['testing', 'tdd'],
            createdAt: 0,
            updatedAt: 0,
        },
        {
            id: 'builtin-typescript',
            name: 'TypeScript Strict',
            description: 'Strict TypeScript coding standards',
            content: `# TypeScript Guidelines

## Type Safety
- Enable strict mode in tsconfig
- Avoid \`any\` type - use \`unknown\` instead
- Define explicit return types for functions
- Use discriminated unions for complex types

## Patterns
- Use interfaces for object shapes
- Use type for unions and intersections
- Leverage type inference when obvious
- Use generics for reusable code

## Best Practices
- Enable noUncheckedIndexedAccess
- Use readonly for immutable data
- Prefer const assertions for literals`,
            tags: ['typescript', 'strict'],
            createdAt: 0,
            updatedAt: 0,
        },
    ];
}

// Initialize on load
initRulesLibrary();
