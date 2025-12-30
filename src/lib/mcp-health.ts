/**
 * MCP Health Monitoring Library
 * 
 * Monitors MCP server processes, logs, and provides restart/kill functionality
 */

import { exec, spawn, ChildProcess } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { DEVSYNQ_DIR } from './mcp-config';

// ============================================================================
// Types
// ============================================================================

export interface MCPProcess {
    serverName: string;
    pid: number;
    status: 'running' | 'stopped' | 'error' | 'starting';
    command: string;
    uptime?: number;  // milliseconds
    startTime?: number;
    cpuUsage?: number;
    memoryUsage?: number; // MB
    lastLog?: string;
    errorCount: number;
}

export interface MCPLogEntry {
    timestamp: number;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    serverName: string;
}

export interface MCPHealthStatus {
    servers: MCPProcess[];
    totalRunning: number;
    totalErrors: number;
    lastChecked: number;
}

// ============================================================================
// Log Storage
// ============================================================================

const MCP_LOGS_DIR = path.join(DEVSYNQ_DIR, 'mcp-logs');
const MAX_LOG_ENTRIES = 100;

// In-memory log buffer per server
const logBuffer: Map<string, MCPLogEntry[]> = new Map();

// Tracked MCP processes
const trackedProcesses: Map<string, MCPProcess> = new Map();

/**
 * Initialize the MCP health monitoring
 */
export function initMCPHealth(): void {
    // Ensure logs directory exists
    if (!fs.existsSync(MCP_LOGS_DIR)) {
        fs.mkdirSync(MCP_LOGS_DIR, { recursive: true });
    }
}

/**
 * Add a log entry for an MCP server
 */
export function addMCPLog(serverName: string, level: MCPLogEntry['level'], message: string): void {
    let logs = logBuffer.get(serverName);
    if (!logs) {
        logs = [];
        logBuffer.set(serverName, logs);
    }

    logs.push({
        timestamp: Date.now(),
        level,
        message,
        serverName,
    });

    // Keep only last MAX_LOG_ENTRIES
    if (logs.length > MAX_LOG_ENTRIES) {
        logs.shift();
    }
}

/**
 * Get logs for an MCP server
 */
export function getMCPLogs(serverName: string): MCPLogEntry[] {
    return logBuffer.get(serverName) || [];
}

/**
 * Clear logs for an MCP server
 */
export function clearMCPLogs(serverName: string): void {
    logBuffer.delete(serverName);
}

/**
 * Get all MCP logs
 */
export function getAllMCPLogs(): MCPLogEntry[] {
    const allLogs: MCPLogEntry[] = [];
    logBuffer.forEach((logs) => {
        allLogs.push(...logs);
    });
    return allLogs.sort((a, b) => b.timestamp - a.timestamp);
}

// ============================================================================
// Process Detection
// ============================================================================

/**
 * Execute command and return output
 */
function execAsync(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}

/**
 * Get running MCP server processes
 */
export async function getMCPProcesses(): Promise<MCPProcess[]> {
    const platform = os.platform();
    const processes: MCPProcess[] = [];

    try {
        if (platform === 'win32') {
            // Search for common MCP server patterns
            const patterns = ['npx.*mcp', 'node.*mcp', 'python.*mcp', 'uvx.*mcp', 'bun.*mcp'];
            const psCommand = `Get-Process | Where-Object { $_.CommandLine -match 'mcp' } | Select-Object Id, Name, Path, CPU, WorkingSet64, StartTime, CommandLine | ConvertTo-Json -Compress`;

            try {
                const output = await execAsync(`powershell -NoProfile -Command "${psCommand}"`);
                if (output.trim()) {
                    const parsed = JSON.parse(output);
                    const procs = Array.isArray(parsed) ? parsed : [parsed];

                    for (const proc of procs) {
                        if (proc.CommandLine && proc.CommandLine.toLowerCase().includes('mcp')) {
                            // Extract server name from command line
                            const serverName = extractServerName(proc.CommandLine);

                            processes.push({
                                serverName,
                                pid: proc.Id,
                                status: 'running',
                                command: proc.CommandLine || '',
                                startTime: proc.StartTime ? new Date(proc.StartTime).getTime() : undefined,
                                cpuUsage: proc.CPU ? Math.round(proc.CPU * 100) / 100 : undefined,
                                memoryUsage: proc.WorkingSet64 ? Math.round(proc.WorkingSet64 / 1024 / 1024) : undefined,
                                errorCount: 0,
                            });
                        }
                    }
                }
            } catch (e) {
                console.log('No MCP processes found');
            }
        } else {
            // macOS/Linux
            try {
                const output = await execAsync("ps aux | grep -E 'mcp|MCP' | grep -v grep");
                const lines = output.split('\n').filter(l => l.trim());

                for (const line of lines) {
                    const parts = line.trim().split(/\s+/);
                    if (parts.length > 10) {
                        const pid = parseInt(parts[1] || '0');
                        const command = parts.slice(10).join(' ');
                        const serverName = extractServerName(command);

                        processes.push({
                            serverName,
                            pid,
                            status: 'running',
                            command,
                            cpuUsage: parseFloat(parts[2] || '0'),
                            memoryUsage: Math.round(parseInt(parts[5] || '0') / 1024),
                            errorCount: 0,
                        });
                    }
                }
            } catch (e) {
                // No processes found
            }
        }
    } catch (error) {
        console.error('Error getting MCP processes:', error);
    }

    // Update tracked processes
    for (const proc of processes) {
        const existing = trackedProcesses.get(proc.serverName);
        if (existing) {
            proc.uptime = proc.startTime ? Date.now() - proc.startTime : existing.uptime;
            proc.errorCount = existing.errorCount;
            proc.lastLog = existing.lastLog;
        }
        trackedProcesses.set(proc.serverName, proc);
    }

    return processes;
}

/**
 * Extract server name from command line
 */
function extractServerName(commandLine: string): string {
    // Common patterns: @modelcontextprotocol/server-xxx, mcp-server-xxx, xxx-mcp
    const patterns = [
        /@[\w-]+\/([\w-]+)/,           // @scope/package
        /mcp-server-([\w-]+)/i,         // mcp-server-name
        /([\w-]+)-mcp/i,                // name-mcp
        /mcp[_-]?([\w-]+)/i,            // mcp_name or mcp-name
    ];

    for (const pattern of patterns) {
        const match = commandLine.match(pattern);
        if (match && match[1]) {
            return match[1].charAt(0).toUpperCase() + match[1].slice(1);
        }
    }

    // Fallback: use a portion of the command
    const words = commandLine.split(/\s+/).filter(w => w.includes('mcp'));
    if (words.length > 0) {
        return words[0]?.substring(0, 20) || 'Unknown';
    }

    return 'Unknown MCP Server';
}

/**
 * Get MCP health status
 */
export async function getMCPHealthStatus(): Promise<MCPHealthStatus> {
    const servers = await getMCPProcesses();

    return {
        servers,
        totalRunning: servers.filter(s => s.status === 'running').length,
        totalErrors: servers.reduce((sum, s) => sum + s.errorCount, 0),
        lastChecked: Date.now(),
    };
}

// ============================================================================
// Process Control
// ============================================================================

/**
 * Kill an MCP server process
 */
export async function killMCPServer(pid: number): Promise<{ success: boolean; error?: string }> {
    const platform = os.platform();

    try {
        if (platform === 'win32') {
            await execAsync(`taskkill /PID ${pid} /F`);
        } else {
            await execAsync(`kill -9 ${pid}`);
        }

        // Remove from tracking
        trackedProcesses.forEach((proc, name) => {
            if (proc.pid === pid) {
                trackedProcesses.delete(name);
                addMCPLog(name, 'info', 'Server killed by user');
            }
        });

        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

/**
 * Restart an MCP server
 */
export async function restartMCPServer(serverName: string, command: string): Promise<{ success: boolean; error?: string }> {
    // Find and kill existing process
    const existing = trackedProcesses.get(serverName);
    if (existing) {
        await killMCPServer(existing.pid);
    }

    addMCPLog(serverName, 'info', 'Restarting server...');

    // Start new process
    try {
        const child = spawn(command, [], {
            shell: true,
            detached: true,
            stdio: 'pipe',
        });

        child.stdout?.on('data', (data: Buffer) => {
            addMCPLog(serverName, 'info', data.toString());
        });

        child.stderr?.on('data', (data: Buffer) => {
            addMCPLog(serverName, 'error', data.toString());
        });

        child.on('error', (error) => {
            addMCPLog(serverName, 'error', `Process error: ${error.message}`);
        });

        child.on('exit', (code) => {
            addMCPLog(serverName, 'info', `Process exited with code ${code}`);
        });

        child.unref();

        addMCPLog(serverName, 'info', `Server started with PID ${child.pid}`);

        return { success: true };
    } catch (error) {
        addMCPLog(serverName, 'error', `Failed to start: ${error}`);
        return { success: false, error: String(error) };
    }
}

// Initialize on load
initMCPHealth();
