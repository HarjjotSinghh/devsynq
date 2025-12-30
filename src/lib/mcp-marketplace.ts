/**
 * MCP Marketplace / Discovery Hub
 * This module provides functionality for browsing and installing MCP servers
 */

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { exec, spawn } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// ===========================================================================
// TYPES
// ===========================================================================

export interface MCPServer {
    id: number;
    name: string;
    description: string;
    url: string;
    sponsor?: boolean;
    category?: string;
    installMethod?: "npx" | "pip" | "manual";
    command?: string;
    isInstalled?: boolean;
}

export interface MCPInstallConfig {
    name: string;
    command: string;
    args?: string[];
    env?: Record<string, string>;
}

export interface MCPCategory {
    id: string;
    name: string;
    icon: string;
    count: number;
}

// ===========================================================================
// MCP SERVER DATA
// ===========================================================================

// This is a curated list of popular MCP servers with install configurations
export const CURATED_MCP_SERVERS: MCPServer[] = [
    {
        id: 1,
        name: "Time",
        description: "Get current time information and perform timezone conversions using IANA timezone names.",
        url: "https://mcp.so/server/time",
        category: "Utilities",
        installMethod: "npx",
        command: "@modelcontextprotocol/server-time",
    },
    {
        id: 4,
        name: "Filesystem",
        description: "Secure file operations with configurable access controls for reading, writing, and managing files.",
        url: "https://mcp.so/server/filesystem",
        category: "Development",
        installMethod: "npx",
        command: "@modelcontextprotocol/server-filesystem",
    },
    {
        id: 5,
        name: "Redis",
        description: "Interact with Redis key-value stores through standardized tools.",
        url: "https://mcp.so/server/redis",
        category: "Database",
        installMethod: "npx",
        command: "@modelcontextprotocol/server-redis",
    },
    {
        id: 17,
        name: "PostgreSQL",
        description: "Read-only database access with schema inspection for PostgreSQL databases.",
        url: "https://mcp.so/server/postgresql",
        category: "Database",
        installMethod: "npx",
        command: "@modelcontextprotocol/server-postgres",
    },
    {
        id: 27,
        name: "Playwright",
        description: "Browser automation and web testing with Playwright.",
        url: "https://mcp.so/server/playwright",
        category: "Browser Automation",
        installMethod: "npx",
        command: "@playwright/mcp",
    },
    {
        id: 28,
        name: "Puppeteer",
        description: "Browser automation and web scraping using Puppeteer.",
        url: "https://mcp.so/server/puppeteer",
        category: "Browser Automation",
        installMethod: "npx",
        command: "@modelcontextprotocol/server-puppeteer",
    },
    {
        id: 38,
        name: "Fetch",
        description: "Web content fetching and conversion for efficient LLM usage.",
        url: "https://mcp.so/server/fetch",
        category: "Web",
        installMethod: "npx",
        command: "@modelcontextprotocol/server-fetch",
    },
    {
        id: 39,
        name: "Slack",
        description: "Channel management and messaging capabilities for Slack workspaces.",
        url: "https://mcp.so/server/slack",
        category: "Communication",
        installMethod: "npx",
        command: "@modelcontextprotocol/server-slack",
    },
    {
        id: 40,
        name: "Brave Search",
        description: "Web and local search using Brave's Search API.",
        url: "https://mcp.so/server/brave-search",
        category: "Search",
        installMethod: "npx",
        command: "@modelcontextprotocol/server-brave-search",
    },
    {
        id: 41,
        name: "GitHub",
        description: "Repository management, file operations, and GitHub API integration.",
        url: "https://mcp.so/server/github",
        category: "Development",
        installMethod: "npx",
        command: "@modelcontextprotocol/server-github",
    },
    {
        id: 42,
        name: "Google Maps",
        description: "Location services, directions, and place details with Google Maps.",
        url: "https://mcp.so/server/google-maps",
        category: "Maps",
        installMethod: "npx",
        command: "@modelcontextprotocol/server-google-maps",
    },
    {
        id: 6,
        name: "GitLab",
        description: "GitLab API for project management and CI/CD integration.",
        url: "https://mcp.so/server/gitlab",
        category: "Development",
        installMethod: "npx",
        command: "@modelcontextprotocol/server-gitlab",
    },
    {
        id: 22,
        name: "Firecrawl",
        description: "Powerful web scraping for Cursor, Claude and other LLM clients.",
        url: "https://mcp.so/server/firecrawl",
        category: "Web",
        installMethod: "npx",
        command: "firecrawl-mcp",
    },
    {
        id: 23,
        name: "Sequential Thinking",
        description: "Dynamic and reflective problem-solving through a structured thinking process.",
        url: "https://mcp.so/server/sequential-thinking",
        category: "AI Enhancement",
        installMethod: "npx",
        command: "@modelcontextprotocol/server-sequential-thinking",
    },
    {
        id: 26,
        name: "Context7",
        description: "Up-to-date code documentation for LLMs and AI code editors.",
        url: "https://mcp.so/server/context7",
        category: "Development",
        installMethod: "npx",
        command: "@upstash/context7-mcp",
    },
    {
        id: 47,
        name: "Notion",
        description: "Notion integration for Claude and other AI assistants.",
        url: "https://mcp.so/server/notion",
        category: "Productivity",
        installMethod: "npx",
        command: "@modelcontextprotocol/server-notion",
    },
    {
        id: 46,
        name: "Todoist",
        description: "Natural language management of Todoist via Claude and MCP.",
        url: "https://mcp.so/server/todoist",
        category: "Productivity",
        installMethod: "npx",
        command: "todoist-mcp-server",
    },
    {
        id: 45,
        name: "Vercel",
        description: "Give your AI agent access to the Vercel API.",
        url: "https://mcp.so/server/vercel",
        category: "Deployment",
        installMethod: "npx",
        command: "vercel-mcp",
    },
    {
        id: 7,
        name: "Blender",
        description: "Connect Blender to Claude AI for 3D modeling and scene manipulation.",
        url: "https://mcp.so/server/blender",
        category: "3D & Creative",
        installMethod: "pip",
        command: "blender-mcp",
    },
    {
        id: 9,
        name: "Sentry",
        description: "Retrieve and analyze issues from Sentry.io.",
        url: "https://mcp.so/server/sentry",
        category: "Development",
        installMethod: "npx",
        command: "@modelcontextprotocol/server-sentry",
    },
    {
        id: 69,
        name: "Twilio",
        description: "Send SMS messages using Twilio through AI assistants.",
        url: "https://mcp.so/server/twilio",
        category: "Communication",
        installMethod: "npx",
        command: "twilio-mcp-server",
    },
    {
        id: 78,
        name: "Linear",
        description: "Linear issue tracking integration for AI assistants.",
        url: "https://mcp.so/server/linear",
        category: "Development",
        installMethod: "npx",
        command: "@modelcontextprotocol/server-linear",
    },
    {
        id: 105,
        name: "Cloudflare",
        description: "Give your Cursor Agent access to the Cloudflare API.",
        url: "https://mcp.so/server/cloudflare",
        category: "Deployment",
        installMethod: "npx",
        command: "cloudflare-api-mcp",
    },
    {
        id: 119,
        name: "YouTube",
        description: "Search and access transcripts on YouTube through a single call.",
        url: "https://mcp.so/server/youtube",
        category: "Media",
        installMethod: "npx",
        command: "@modelcontextprotocol/server-youtube",
    },
    {
        id: 100,
        name: "Wikipedia",
        description: "Fetch Wikipedia summaries for AI assistants.",
        url: "https://mcp.so/server/wikipedia",
        category: "Knowledge",
        installMethod: "npx",
        command: "mcp-wikipedia",
    },
];

// Categories for filtering
export const MCP_CATEGORIES: MCPCategory[] = [
    { id: "all", name: "All", icon: "🌐", count: 0 },
    { id: "development", name: "Development", icon: "💻", count: 0 },
    { id: "database", name: "Database", icon: "🗃️", count: 0 },
    { id: "browser-automation", name: "Browser Automation", icon: "🌍", count: 0 },
    { id: "web", name: "Web", icon: "🕸️", count: 0 },
    { id: "communication", name: "Communication", icon: "💬", count: 0 },
    { id: "search", name: "Search", icon: "🔍", count: 0 },
    { id: "productivity", name: "Productivity", icon: "📋", count: 0 },
    { id: "deployment", name: "Deployment", icon: "🚀", count: 0 },
    { id: "ai-enhancement", name: "AI Enhancement", icon: "🧠", count: 0 },
    { id: "media", name: "Media", icon: "🎬", count: 0 },
    { id: "knowledge", name: "Knowledge", icon: "📚", count: 0 },
    { id: "3d-creative", name: "3D & Creative", icon: "🎨", count: 0 },
    { id: "maps", name: "Maps", icon: "🗺️", count: 0 },
    { id: "utilities", name: "Utilities", icon: "🔧", count: 0 },
];

// ===========================================================================
// FUNCTIONS
// ===========================================================================

/**
 * Get the path to the master MCP config file
 */
export function getMasterConfigPath(): string {
    const homeDir = os.homedir();
    return path.join(homeDir, ".devsynq", "mcp.json");
}

/**
 * Read the master MCP config
 */
export function readMasterConfig(): { mcpServers: Record<string, any> } {
    const configPath = getMasterConfigPath();
    if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, "utf-8");
        return JSON.parse(content);
    }
    return { mcpServers: {} };
}

/**
 * Write to the master MCP config
 */
export function writeMasterConfig(config: { mcpServers: Record<string, any> }): void {
    const configPath = getMasterConfigPath();
    const configDir = path.dirname(configPath);

    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

/**
 * Check if a server is already installed in master config
 */
export function isServerInstalled(serverName: string): boolean {
    const config = readMasterConfig();
    const serverKey = serverName.toLowerCase().replace(/\s+/g, "-");
    return serverKey in config.mcpServers;
}

/**
 * Get list of installed servers
 */
export function getInstalledServers(): string[] {
    const config = readMasterConfig();
    return Object.keys(config.mcpServers);
}

/**
 * Generate config entry for an MCP server
 */
export function generateServerConfig(server: MCPServer): { command: string; args: string[] } {
    if (server.installMethod === "npx") {
        return {
            command: "npx",
            args: ["-y", server.command || server.name.toLowerCase()],
        };
    } else if (server.installMethod === "pip") {
        return {
            command: "uvx",
            args: [server.command || server.name.toLowerCase()],
        };
    }
    return {
        command: server.command || server.name.toLowerCase(),
        args: [],
    };
}

/**
 * Install an MCP server to the master config
 */
export function installServer(server: MCPServer): { success: boolean; error?: string } {
    try {
        const config = readMasterConfig();
        const serverKey = server.name.toLowerCase().replace(/\s+/g, "-");

        // Check if already installed
        if (serverKey in config.mcpServers) {
            return { success: false, error: "Server already installed" };
        }

        // Generate config
        const serverConfig = generateServerConfig(server);
        config.mcpServers[serverKey] = serverConfig;

        // Write config
        writeMasterConfig(config);

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Uninstall an MCP server from master config
 */
export function uninstallServer(serverName: string): { success: boolean; error?: string } {
    try {
        const config = readMasterConfig();
        const serverKey = serverName.toLowerCase().replace(/\s+/g, "-");

        if (!(serverKey in config.mcpServers)) {
            return { success: false, error: "Server not found in config" };
        }

        delete config.mcpServers[serverKey];
        writeMasterConfig(config);

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Get all available MCP servers with their installation status
 */
export function getAvailableServers(): MCPServer[] {
    const installedServers = getInstalledServers();

    return CURATED_MCP_SERVERS.map(server => ({
        ...server,
        isInstalled: installedServers.includes(server.name.toLowerCase().replace(/\s+/g, "-")),
    }));
}

/**
 * Get categories with counts
 */
export function getCategoriesWithCounts(): MCPCategory[] {
    const servers = getAvailableServers();

    return MCP_CATEGORIES.map(category => {
        if (category.id === "all") {
            return { ...category, count: servers.length };
        }

        const categoryId = category.id.toLowerCase().replace(/-/g, " ");
        const count = servers.filter(
            s => s.category?.toLowerCase().replace(/\s+/g, " ") === categoryId ||
                s.category?.toLowerCase().replace(/\s+/g, "-") === category.id
        ).length;

        return { ...category, count };
    }).filter(c => c.id === "all" || c.count > 0);
}

/**
 * Search MCP servers by name or description
 */
export function searchServers(query: string): MCPServer[] {
    const lowerQuery = query.toLowerCase();
    return getAvailableServers().filter(
        server =>
            server.name.toLowerCase().includes(lowerQuery) ||
            server.description.toLowerCase().includes(lowerQuery) ||
            server.category?.toLowerCase().includes(lowerQuery)
    );
}

/**
 * Filter servers by category
 */
export function filterByCategory(categoryId: string): MCPServer[] {
    if (categoryId === "all") {
        return getAvailableServers();
    }

    const categoryName = categoryId.toLowerCase().replace(/-/g, " ");
    return getAvailableServers().filter(
        server =>
            server.category?.toLowerCase().replace(/\s+/g, " ") === categoryName ||
            server.category?.toLowerCase().replace(/\s+/g, "-") === categoryId
    );
}
