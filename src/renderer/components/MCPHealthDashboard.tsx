/**
 * MCP Health Dashboard Component
 * 
 * Visual dashboard showing running MCP servers with logs and control
 */

import React, { useState, useEffect, useCallback } from 'react';
import './MCPHealthDashboard.css';

interface MCPProcess {
    serverName: string;
    pid: number;
    status: 'running' | 'stopped' | 'error' | 'starting';
    command: string;
    uptime?: number;
    startTime?: number;
    cpuUsage?: number;
    memoryUsage?: number;
    lastLog?: string;
    errorCount: number;
}

interface MCPLogEntry {
    timestamp: number;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    serverName: string;
}

interface MCPHealthDashboardProps {
    isOpen: boolean;
    onClose: () => void;
    onToast: (message: string) => void;
}

export const MCPHealthDashboard: React.FC<MCPHealthDashboardProps> = ({
    isOpen,
    onClose,
    onToast,
}) => {
    const [processes, setProcesses] = useState<MCPProcess[]>([]);
    const [selectedServer, setSelectedServer] = useState<string | null>(null);
    const [logs, setLogs] = useState<MCPLogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionInProgress, setActionInProgress] = useState<string | null>(null);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

    const loadData = useCallback(async () => {
        try {
            const status = await window.electronAPI.getMCPHealthStatus();
            setProcesses(status.servers);
            setLastRefresh(new Date());
        } catch (error) {
            console.error('Failed to load MCP health status:', error);
        }
        setIsLoading(false);
    }, []);

    const loadLogs = useCallback(async (serverName: string) => {
        try {
            const serverLogs = await window.electronAPI.getMCPLogs(serverName);
            setLogs(serverLogs);
        } catch (error) {
            console.error('Failed to load logs:', error);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            loadData();
            const interval = setInterval(loadData, 5000);
            return () => clearInterval(interval);
        }
    }, [isOpen, loadData]);

    useEffect(() => {
        if (selectedServer) {
            loadLogs(selectedServer);
            const interval = setInterval(() => loadLogs(selectedServer), 2000);
            return () => clearInterval(interval);
        }
    }, [selectedServer, loadLogs]);

    const handleKill = async (pid: number, serverName: string) => {
        if (!confirm(`Kill ${serverName}?`)) return;

        setActionInProgress(`kill-${pid}`);
        try {
            const result = await window.electronAPI.killMCPServer(pid);
            if (result.success) {
                onToast(`${serverName} killed`);
                await loadData();
            } else {
                onToast(result.error || 'Failed to kill server');
            }
        } catch (error) {
            onToast('Failed to kill server');
        }
        setActionInProgress(null);
    };

    const handleRestart = async (serverName: string, command: string) => {
        setActionInProgress(`restart-${serverName}`);
        try {
            const result = await window.electronAPI.restartMCPServer(serverName, command);
            if (result.success) {
                onToast(`${serverName} restarting...`);
                await loadData();
            } else {
                onToast(result.error || 'Failed to restart');
            }
        } catch (error) {
            onToast('Failed to restart server');
        }
        setActionInProgress(null);
    };

    const formatUptime = (startTime?: number): string => {
        if (!startTime) return 'Unknown';
        const ms = Date.now() - startTime;
        const minutes = Math.floor(ms / 60000);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        return `${minutes}m`;
    };

    const formatMemory = (mb?: number): string => {
        if (!mb) return '0 MB';
        if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
        return `${mb} MB`;
    };

    const getStatusColor = (status: MCPProcess['status']): string => {
        switch (status) {
            case 'running': return 'var(--accent-primary)';
            case 'error': return 'var(--error)';
            case 'starting': return 'var(--warning)';
            default: return 'var(--text-muted)';
        }
    };

    const getLogLevelColor = (level: MCPLogEntry['level']): string => {
        switch (level) {
            case 'error': return 'var(--error)';
            case 'warn': return 'var(--warning)';
            case 'debug': return 'var(--text-muted)';
            default: return 'var(--text-secondary)';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="mcp-health-overlay" onClick={onClose}>
            <div className="mcp-health-modal" onClick={(e) => e.stopPropagation()}>
                <div className="mcp-health-header">
                    <h2>🔧 MCP Health Dashboard</h2>
                    <p className="mcp-health-subtitle">
                        Monitor and control running MCP servers
                    </p>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="mcp-health-content">
                    {/* Stats Bar */}
                    <div className="mcp-health-stats">
                        <div className="stat-item">
                            <span className="stat-value">{processes.length}</span>
                            <span className="stat-label">Running</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">
                                {processes.reduce((sum, p) => sum + p.errorCount, 0)}
                            </span>
                            <span className="stat-label">Errors</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{lastRefresh.toLocaleTimeString()}</span>
                            <span className="stat-label">Last Check</span>
                        </div>
                        <button className="refresh-btn" onClick={loadData} disabled={isLoading}>
                            🔄 Refresh
                        </button>
                    </div>

                    <div className="mcp-health-body">
                        {/* Server List */}
                        <div className="server-list">
                            <h3>Servers</h3>
                            {isLoading ? (
                                <div className="loading">Loading...</div>
                            ) : processes.length === 0 ? (
                                <div className="empty-state">
                                    <p>No MCP servers detected</p>
                                    <span className="hint">MCP servers will appear here when running</span>
                                </div>
                            ) : (
                                processes.map((proc) => (
                                    <div
                                        key={proc.pid}
                                        className={`server-item ${selectedServer === proc.serverName ? 'selected' : ''}`}
                                        onClick={() => setSelectedServer(proc.serverName)}
                                    >
                                        <div className="server-status">
                                            <span
                                                className="status-dot"
                                                style={{ background: getStatusColor(proc.status) }}
                                            />
                                        </div>
                                        <div className="server-info">
                                            <div className="server-name">{proc.serverName}</div>
                                            <div className="server-meta">
                                                <span>PID: {proc.pid}</span>
                                                <span>{formatMemory(proc.memoryUsage)}</span>
                                                {proc.cpuUsage !== undefined && (
                                                    <span>{proc.cpuUsage.toFixed(1)}% CPU</span>
                                                )}
                                                {proc.startTime && (
                                                    <span>⏱️ {formatUptime(proc.startTime)}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="server-actions">
                                            <button
                                                className="action-btn restart"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRestart(proc.serverName, proc.command);
                                                }}
                                                disabled={actionInProgress !== null}
                                                title="Restart"
                                            >
                                                🔄
                                            </button>
                                            <button
                                                className="action-btn kill"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleKill(proc.pid, proc.serverName);
                                                }}
                                                disabled={actionInProgress !== null}
                                                title="Kill"
                                            >
                                                ⏹️
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Log Panel */}
                        <div className="log-panel">
                            <h3>
                                Logs {selectedServer && <span>- {selectedServer}</span>}
                            </h3>
                            {!selectedServer ? (
                                <div className="empty-state">
                                    <p>Select a server to view logs</p>
                                </div>
                            ) : logs.length === 0 ? (
                                <div className="empty-state">
                                    <p>No logs yet</p>
                                </div>
                            ) : (
                                <div className="log-entries">
                                    {logs.slice(-50).reverse().map((log, i) => (
                                        <div
                                            key={i}
                                            className={`log-entry log-${log.level}`}
                                            style={{ color: getLogLevelColor(log.level) }}
                                        >
                                            <span className="log-time">
                                                {new Date(log.timestamp).toLocaleTimeString()}
                                            </span>
                                            <span className="log-level">[{log.level.toUpperCase()}]</span>
                                            <span className="log-message">{log.message}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MCPHealthDashboard;
