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
// Imported from data file
import { MCP_SERVERS } from "../data/mcp-servers";

export const CURATED_MCP_SERVERS: MCPServer[] = MCP_SERVERS.map(s => ({
    ...s,
    // Ensure all fields match the interface
    installMethod: s.installMethod as "npx" | "pip" | "manual",
    category: s.category || "Utilities"
}));

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
