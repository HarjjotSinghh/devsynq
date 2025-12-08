import React, { useEffect, useState, useCallback } from 'react';
import { RunningIDE, ProcessStats } from '../../types';
import { ResourceUsage } from '../types.d';

interface ProcessManagerProps {
    onClose?: () => void;
}

function ProcessManager({ onClose }: ProcessManagerProps) {
    const [runningIDEs, setRunningIDEs] = useState<RunningIDE[]>([]);
    const [stats, setStats] = useState<ProcessStats | null>(null);
    const [resourceUsage, setResourceUsage] = useState<ResourceUsage | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [actionInProgress, setActionInProgress] = useState<string | null>(null);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

    // Load data
    const loadData = useCallback(async () => {
        try {
            const [ides, processStats, resources] = await Promise.all([
                window.electronAPI.getRunningIDEs(),
                window.electronAPI.getProcessStats(),
                window.electronAPI.getResourceUsage(),
            ]);
            setRunningIDEs(ides);
            setStats(processStats);
            setResourceUsage(resources);
            setLastRefresh(new Date());
        } catch (error) {
            console.error('Failed to load process data:', error);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadData();
        // Auto-refresh every 5 seconds
        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, [loadData]);

    const handleFocusIDE = async (pid: number, name: string) => {
        setActionInProgress(`focus-${pid}`);
        try {
            await window.electronAPI.focusIDE(pid);
        } catch (error) {
            console.error(`Failed to focus ${name}:`, error);
        }
        setActionInProgress(null);
    };

    const handleKillIDE = async (pid: number, name: string) => {
        if (!confirm(`Are you sure you want to quit ${name}?`)) return;

        setActionInProgress(`kill-${pid}`);
        try {
            await window.electronAPI.killIDE(pid);
            // Refresh the list
            await loadData();
        } catch (error) {
            console.error(`Failed to kill ${name}:`, error);
        }
        setActionInProgress(null);
    };

    const handleKillAll = async () => {
        if (!confirm(`Are you sure you want to quit ALL ${runningIDEs.length} running IDEs?`)) return;

        setActionInProgress('kill-all');
        try {
            await window.electronAPI.killAllIDEs();
            await loadData();
        } catch (error) {
            console.error('Failed to kill all IDEs:', error);
        }
        setActionInProgress(null);
    };

    const formatUptime = (startTime?: number) => {
        if (!startTime) return 'Unknown';
        const ms = Date.now() - startTime;
        const minutes = Math.floor(ms / 60000);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        }
        return `${minutes}m`;
    };

    const formatMemory = (mb?: number) => {
        if (!mb) return '0 MB';
        if (mb >= 1024) {
            return `${(mb / 1024).toFixed(1)} GB`;
        }
        return `${mb} MB`;
    };

    return (
        <div className="process-manager">
            <div className="process-manager-header">
                <div className="pm-header-left">
                    <h2>
                        <span className="pm-icon">⚡</span>
                        IDE Process Manager
                    </h2>
                    <span className="pm-subtitle">
                        Monitor and control running IDEs
                    </span>
                </div>
                <div className="pm-header-actions">
                    <button
                        className="pm-btn pm-btn-refresh"
                        onClick={loadData}
                        disabled={isLoading}
                    >
                        🔄 Refresh
                    </button>
                    {runningIDEs.length > 0 && (
                        <button
                            className="pm-btn pm-btn-danger"
                            onClick={handleKillAll}
                            disabled={actionInProgress !== null}
                        >
                            ⚠️ Kill All
                        </button>
                    )}
                </div>
            </div>

            {/* Resource Usage Stats */}
            <div className="pm-stats-grid">
                <div className="pm-stat-card">
                    <div className="pm-stat-icon">🖥️</div>
                    <div className="pm-stat-content">
                        <div className="pm-stat-value">{runningIDEs.length}</div>
                        <div className="pm-stat-label">Running IDEs</div>
                    </div>
                </div>
                <div className="pm-stat-card">
                    <div className="pm-stat-icon">💾</div>
                    <div className="pm-stat-content">
                        <div className="pm-stat-value">{formatMemory(resourceUsage?.ideMemoryUsage)}</div>
                        <div className="pm-stat-label">IDE Memory</div>
                    </div>
                </div>
                <div className="pm-stat-card">
                    <div className="pm-stat-icon">📊</div>
                    <div className="pm-stat-content">
                        <div className="pm-stat-value">
                            {resourceUsage ? Math.round((resourceUsage.ideMemoryUsage / resourceUsage.totalSystemMemory) * 100) : 0}%
                        </div>
                        <div className="pm-stat-label">System Usage</div>
                    </div>
                </div>
                <div className="pm-stat-card">
                    <div className="pm-stat-icon">⏱️</div>
                    <div className="pm-stat-content">
                        <div className="pm-stat-value">{lastRefresh.toLocaleTimeString()}</div>
                        <div className="pm-stat-label">Last Update</div>
                    </div>
                </div>
            </div>

            {/* Running IDEs List */}
            <div className="pm-list">
                {isLoading ? (
                    <div className="pm-loading">
                        <div className="pm-loading-spinner"></div>
                        <span>Scanning processes...</span>
                    </div>
                ) : runningIDEs.length === 0 ? (
                    <div className="pm-empty">
                        <span className="pm-empty-icon">😴</span>
                        <h3>No IDEs Running</h3>
                        <p>Launch an IDE to see it here</p>
                    </div>
                ) : (
                    runningIDEs.map((ide) => (
                        <div
                            key={ide.pid}
                            className="pm-process-card"
                            style={{ '--accent-color': ide.color } as React.CSSProperties}
                        >
                            <div className="pm-process-icon">
                                <span className="pm-ide-icon">{ide.icon}</span>
                                <span className="pm-status-dot"></span>
                            </div>
                            <div className="pm-process-info">
                                <div className="pm-process-name">{ide.name}</div>
                                <div className="pm-process-details">
                                    <span className="pm-detail">
                                        <span className="pm-detail-icon">💾</span>
                                        {formatMemory(ide.memoryUsage)}
                                    </span>
                                    {ide.cpuUsage !== undefined && (
                                        <span className="pm-detail">
                                            <span className="pm-detail-icon">⚡</span>
                                            {ide.cpuUsage.toFixed(1)}% CPU
                                        </span>
                                    )}
                                    {ide.startTime && (
                                        <span className="pm-detail">
                                            <span className="pm-detail-icon">⏱️</span>
                                            {formatUptime(ide.startTime)}
                                        </span>
                                    )}
                                    <span className="pm-detail pm-pid">
                                        PID: {ide.pid}
                                    </span>
                                </div>
                            </div>
                            <div className="pm-process-actions">
                                <button
                                    className="pm-action-btn pm-action-focus"
                                    onClick={() => handleFocusIDE(ide.pid, ide.name)}
                                    disabled={actionInProgress !== null}
                                    title="Bring to front"
                                >
                                    {actionInProgress === `focus-${ide.pid}` ? '...' : '👁️ Focus'}
                                </button>
                                <button
                                    className="pm-action-btn pm-action-kill"
                                    onClick={() => handleKillIDE(ide.pid, ide.name)}
                                    disabled={actionInProgress !== null}
                                    title="Quit IDE"
                                >
                                    {actionInProgress === `kill-${ide.pid}` ? '...' : '✕ Quit'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ProcessManager;
