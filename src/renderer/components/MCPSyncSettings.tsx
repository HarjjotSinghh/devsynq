import React, { useState, useEffect, useCallback } from 'react';
import { MCPSyncStatus, SyncSettings, SyncResult } from '../../types';
import './MCPSyncSettings.css';

interface Props {
    onToast: (message: string) => void;
}

export const MCPSyncSettings: React.FC<Props> = ({ onToast }) => {
    const [ideStatuses, setIdeStatuses] = useState<MCPSyncStatus[]>([]);
    const [settings, setSettings] = useState<SyncSettings | null>(null);
    const [syncing, setSyncing] = useState(false);
    const [lastResult, setLastResult] = useState<SyncResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'sync' | 'log'>('sync');
    const [syncLog, setSyncLog] = useState<any[]>([]);

    // Load initial data
    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [statusData, settingsData] = await Promise.all([
                window.electronAPI.getMCPSyncStatus(),
                window.electronAPI.getMCPSyncSettings(),
            ]);
            setIdeStatuses(statusData);
            setSettings(settingsData);
        } catch (error) {
            console.error('Failed to load MCP sync data:', error);
            onToast('Failed to load MCP sync settings');
        } finally {
            setLoading(false);
        }
    }, [onToast]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Toggle IDE sync
    const handleToggleIDE = async (ideId: string) => {
        if (!settings) return;

        const newEnabled = !settings.enabledIDEs[ideId];
        try {
            const newSettings = await window.electronAPI.toggleMCPIDESync(ideId, newEnabled);
            setSettings(newSettings);
            setIdeStatuses(prev =>
                prev.map(s => (s.ideId === ideId ? { ...s, enabled: newEnabled } : s))
            );
        } catch (error) {
            console.error('Failed to toggle IDE sync:', error);
            onToast('Failed to update settings');
        }
    };

    // Sync to specific IDE
    const handleSyncIDE = async (ideId: string) => {
        setSyncing(true);
        try {
            const result = await window.electronAPI.syncMCPConfigs([ideId]);
            setLastResult(result);
            await loadData();

            if (result.success.length > 0) {
                onToast(`✅ Synced to ${result.success.join(', ')}`);
            } else if (result.failed.length > 0) {
                onToast(`❌ Failed: ${result.failed[0]?.error ?? 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Sync failed:', error);
            onToast('Sync failed');
        } finally {
            setSyncing(false);
        }
    };

    // Sync to all IDEs
    const handleSyncAll = async () => {
        setSyncing(true);
        try {
            const result = await window.electronAPI.syncMCPConfigs();
            setLastResult(result);
            await loadData();

            if (result.success.length > 0) {
                onToast(`✅ Synced to ${result.success.length} IDE(s)`);
            }
            if (result.failed.length > 0) {
                onToast(`⚠️ ${result.failed.length} failed`);
            }
        } catch (error) {
            console.error('Sync all failed:', error);
            onToast('Sync failed');
        } finally {
            setSyncing(false);
        }
    };

    // Import from IDE
    const handleImportFromIDE = async (ideId: string) => {
        try {
            const result = await window.electronAPI.importMCPFromIDE(ideId);
            if (result.success) {
                onToast(`✅ Imported config from ${ideId}`);
                await loadData();
            } else {
                onToast(`❌ Import failed: ${result.error}`);
            }
        } catch (error: any) {
            console.error('Import failed:', error);
            onToast(`Import failed: ${error.message}`);
        }
    };

    // Create/Delete override
    const handleToggleOverride = async (ideId: string, hasOverride: boolean) => {
        try {
            if (hasOverride) {
                await window.electronAPI.deleteMCPOverride(ideId);
                onToast(`Removed override for ${ideId}`);
            } else {
                await window.electronAPI.createMCPOverride(ideId);
                onToast(`Created override for ${ideId}`);
            }
            await loadData();
        } catch (error) {
            console.error('Override toggle failed:', error);
            onToast('Failed to update override');
        }
    };

    // Open master config
    const handleOpenMasterConfig = async () => {
        try {
            await window.electronAPI.openMCPMasterConfig();
        } catch (error) {
            console.error('Failed to open master config:', error);
            onToast('Failed to open config file');
        }
    };

    // Update sync settings
    const handleUpdateSettings = async (key: keyof SyncSettings, value: boolean) => {
        if (!settings) return;

        const newSettings = { ...settings, [key]: value };
        try {
            await window.electronAPI.saveMCPSyncSettings(newSettings);
            setSettings(newSettings);
        } catch (error) {
            console.error('Failed to save settings:', error);
            onToast('Failed to save settings');
        }
    };

    // Load sync log
    const loadSyncLog = async () => {
        try {
            const log = await window.electronAPI.getMCPSyncLog();
            setSyncLog(log);
        } catch (error) {
            console.error('Failed to load sync log:', error);
        }
    };

    useEffect(() => {
        if (activeTab === 'log') {
            loadSyncLog();
        }
    }, [activeTab]);

    // Format relative time
    const formatRelativeTime = (timestamp: number | undefined) => {
        if (!timestamp) return 'Never';

        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    // Get status indicator class
    const getStatusClass = (status: MCPSyncStatus['status']) => {
        switch (status) {
            case 'synced': return 'status-synced';
            case 'pending': return 'status-pending';
            case 'failed': return 'status-failed';
            case 'not-installed': return 'status-not-installed';
            default: return '';
        }
    };

    if (loading) {
        return (
            <div className="mcp-sync-loading">
                <div className="loading-spinner"></div>
                <p>Loading MCP configuration...</p>
            </div>
        );
    }

    return (
        <div className="mcp-sync-settings">
            {/* Header */}
            <div className="mcp-header">
                <div className="mcp-header-info">
                    <h3>🔄 MCP Configuration Manager</h3>
                    <p className="mcp-description">
                        Sync your MCP (Model Context Protocol) servers across all AI IDEs
                    </p>
                </div>
                <button
                    className="mcp-sync-all-btn"
                    onClick={handleSyncAll}
                    disabled={syncing}
                >
                    {syncing ? (
                        <>
                            <span className="btn-spinner"></span>
                            Syncing...
                        </>
                    ) : (
                        <>🔄 Sync All</>
                    )}
                </button>
            </div>

            {/* Tabs */}
            <div className="mcp-tabs">
                <button
                    className={`mcp-tab ${activeTab === 'sync' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sync')}
                >
                    IDE Sync
                </button>
                <button
                    className={`mcp-tab ${activeTab === 'log' ? 'active' : ''}`}
                    onClick={() => setActiveTab('log')}
                >
                    Sync Log
                </button>
            </div>

            {activeTab === 'sync' ? (
                <>
                    {/* Master Config Section */}
                    <div className="mcp-section mcp-master-config">
                        <div className="section-header">
                            <h4>📁 Master Configuration</h4>
                            <button className="mcp-edit-btn" onClick={handleOpenMasterConfig}>
                                Edit in Editor
                            </button>
                        </div>
                        <div className="master-config-info">
                            <code className="config-path">
                                C:\Users\{'{user}'}\.devsynq\mcp.json
                            </code>
                            <p className="config-hint">
                                This is your master MCP config. Changes here sync to all enabled IDEs.
                            </p>
                        </div>
                    </div>

                    {/* IDE List */}
                    <div className="mcp-section">
                        <h4>🖥️ Synced IDEs</h4>
                        <div className="mcp-ide-list">
                            {ideStatuses.map(ide => (
                                <div
                                    key={ide.ideId}
                                    className={`mcp-ide-item ${!ide.isInstalled ? 'not-installed' : ''}`}
                                >
                                    <div className="ide-main">
                                        <label className="ide-toggle">
                                            <input
                                                type="checkbox"
                                                checked={ide.enabled}
                                                onChange={() => handleToggleIDE(ide.ideId)}
                                                disabled={!ide.isInstalled}
                                            />
                                            <span className="ide-info">
                                                <span className="ide-icon">{ide.icon}</span>
                                                <span className="ide-name">{ide.name}</span>
                                                {ide.hasOverride && (
                                                    <span className="override-badge">Custom</span>
                                                )}
                                            </span>
                                        </label>
                                        <div className={`ide-status ${getStatusClass(ide.status)}`}>
                                            {ide.status === 'synced' && '✓ Synced'}
                                            {ide.status === 'pending' && '○ Pending'}
                                            {ide.status === 'failed' && '✗ Failed'}
                                            {ide.status === 'not-installed' && '— Not Installed'}
                                            {ide.lastSynced && ide.status !== 'not-installed' && (
                                                <span className="sync-time">
                                                    {formatRelativeTime(ide.lastSynced)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="ide-path" title={ide.path}>
                                        {ide.path}
                                    </div>
                                    <div className="ide-actions">
                                        <button
                                            className="ide-action-btn"
                                            onClick={() => handleSyncIDE(ide.ideId)}
                                            disabled={!ide.enabled || !ide.isInstalled || syncing}
                                            title="Sync Now"
                                        >
                                            🔄
                                        </button>
                                        <button
                                            className="ide-action-btn"
                                            onClick={() => handleImportFromIDE(ide.ideId)}
                                            disabled={!ide.isInstalled}
                                            title="Import from IDE"
                                        >
                                            📥
                                        </button>
                                        <button
                                            className="ide-action-btn"
                                            onClick={() => handleToggleOverride(ide.ideId, ide.hasOverride)}
                                            disabled={!ide.isInstalled}
                                            title={ide.hasOverride ? 'Remove Override' : 'Create Override'}
                                        >
                                            {ide.hasOverride ? '🗑️' : '📝'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sync Options */}
                    <div className="mcp-section mcp-options">
                        <h4>⚙️ Sync Options</h4>
                        <div className="mcp-option-list">
                            <label className="mcp-option">
                                <input
                                    type="checkbox"
                                    checked={settings?.autoSyncOnLaunch ?? true}
                                    onChange={e => handleUpdateSettings('autoSyncOnLaunch', e.target.checked)}
                                />
                                <span>Auto-sync when launching IDE from DevSynq</span>
                            </label>
                            <label className="mcp-option">
                                <input
                                    type="checkbox"
                                    checked={settings?.createBackups ?? true}
                                    onChange={e => handleUpdateSettings('createBackups', e.target.checked)}
                                />
                                <span>Create backups before sync</span>
                            </label>
                        </div>
                    </div>

                    {/* Last Result */}
                    {lastResult && (
                        <div className="mcp-section mcp-result">
                            <h4>📊 Last Sync Result</h4>
                            <div className="result-details">
                                {lastResult.success.length > 0 && (
                                    <div className="result-item result-success">
                                        ✓ Synced: {lastResult.success.join(', ')}
                                    </div>
                                )}
                                {lastResult.skipped.length > 0 && (
                                    <div className="result-item result-skipped">
                                        ⊘ Skipped: {lastResult.skipped.join(', ')}
                                    </div>
                                )}
                                {lastResult.failed.length > 0 && (
                                    <div className="result-item result-failed">
                                        ✗ Failed:
                                        {lastResult.failed.map(f => (
                                            <div key={f.ide} className="failed-detail">
                                                {f.ide}: {f.error}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {lastResult.requireRestart.length > 0 && (
                                    <div className="result-item result-warning">
                                        ⚠ Restart required: {lastResult.requireRestart.join(', ')}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                /* Sync Log Tab */
                <div className="mcp-section mcp-log">
                    <div className="section-header">
                        <h4>📜 Sync History</h4>
                        <button className="mcp-refresh-btn" onClick={loadSyncLog}>
                            🔄 Refresh
                        </button>
                    </div>
                    <div className="sync-log-list">
                        {syncLog.length === 0 ? (
                            <div className="log-empty">No sync history yet</div>
                        ) : (
                            syncLog.slice(0, 50).map((entry, idx) => (
                                <div
                                    key={idx}
                                    className={`log-entry ${entry.success ? 'success' : 'failed'}`}
                                >
                                    <span className="log-icon">
                                        {entry.success ? '✓' : '✗'}
                                    </span>
                                    <span className="log-action">{entry.action}</span>
                                    <span className="log-ide">{entry.ideId}</span>
                                    <span className="log-time">
                                        {new Date(entry.timestamp).toLocaleString()}
                                    </span>
                                    {entry.error && (
                                        <span className="log-error">{entry.error}</span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MCPSyncSettings;
