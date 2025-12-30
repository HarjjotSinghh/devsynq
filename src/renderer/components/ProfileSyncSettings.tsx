import React, { useCallback, useEffect, useState } from 'react';
import { ProfileSyncResult, ProfileSyncSettings as ProfileSyncSettingsType, ProfileSyncStatus } from '../../types';
import './MCPSyncSettings.css'; // Reuse styling
import { Icon, IdeIcon } from './Icons';

interface Props {
    onToast: (message: React.ReactNode) => void;
}

export const ProfileSyncSettings: React.FC<Props> = ({ onToast }) => {
    const [statuses, setStatuses] = useState<ProfileSyncStatus[]>([]);
    const [settings, setSettings] = useState<ProfileSyncSettingsType | null>(null);
    const [syncing, setSyncing] = useState(false);
    const [lastResult, setLastResult] = useState<ProfileSyncResult | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [statusData, settingsData] = await Promise.all([
                window.electronAPI.getProfileSyncStatus(),
                window.electronAPI.getProfileSyncSettings(),
            ]);
            setStatuses(statusData);
            setSettings(settingsData);
        } catch (error) {
            console.error('Failed to load profile sync data:', error);
            onToast('Failed to load profile sync settings');
        } finally {
            setLoading(false);
        }
    }, [onToast]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleToggleIDE = async (ideId: string) => {
        if (!settings) return;
        const newEnabled = !settings.enabledIDEs[ideId];
        try {
            const newSettings = await window.electronAPI.toggleProfileIDESync(ideId, newEnabled);
            setSettings(newSettings);
            setStatuses(prev =>
                prev.map(s => (s.ideId === ideId ? { ...s, enabled: newEnabled } : s))
            );
        } catch (error) {
            console.error('Failed to toggle profile sync:', error);
            onToast('Failed to update profile sync settings');
        }
    };

    const handleSyncAll = async () => {
        setSyncing(true);
        try {
            const result = await window.electronAPI.syncProfiles();
            setLastResult(result);
            await loadData();

            if (result.success.length > 0) {
                onToast(<><Icon name="checkCircle" size={14} color="var(--success)" /> Synced to {result.success.length} IDE(s)</>);
            }
            if (result.failed.length > 0) {
                onToast(<><Icon name="alert" size={14} color="var(--warning)" /> {result.failed.length} failed</>);
            }
        } catch (error) {
            console.error('Profile sync failed:', error);
            onToast('Profile sync failed');
        } finally {
            setSyncing(false);
        }
    };

    const handleOpenMaster = async () => {
        try {
            await window.electronAPI.openProfileMaster();
        } catch (error) {
            console.error('Failed to open profile file:', error);
            onToast('Failed to open .code-profile');
        }
    };

    const handleUpdateSettings = async (key: keyof ProfileSyncSettingsType, value: boolean) => {
        if (!settings) return;
        const newSettings = { ...settings, [key]: value };
        try {
            await window.electronAPI.saveProfileSyncSettings(newSettings);
            setSettings(newSettings);
        } catch (error) {
            console.error('Failed to save profile sync settings:', error);
            onToast('Failed to save settings');
        }
    };

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

    const getStatusClass = (status: ProfileSyncStatus['status']) => {
        switch (status) {
            case 'synced': return 'status-synced';
            case 'pending': return 'status-pending';
            case 'not-installed': return 'status-not-installed';
            default: return '';
        }
    };

    if (loading) {
        return (
            <div className="mcp-sync-loading">
                <div className="loading-spinner"></div>
                <p>Loading profile sync...</p>
            </div>
        );
    }

    return (
        <div className="mcp-sync-settings">
            <div className="mcp-header">
                <div className="mcp-header-info">
                    <h3 className="mcp-header-title"><Icon name="profile" /> Profile Sync</h3>
                    <p className="mcp-description">
                        Keep your .code-profile in sync across all configured IDEs
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
                        <>
                            <Icon name="sync" size={16} color="var(--text-on-accent)" /> Sync All
                        </>
                    )}
                </button>
            </div>

            <div className="mcp-section mcp-master-config">
                <div className="section-header">
                    <h4><Icon name="window" /> Master Profile</h4>
                    <button className="mcp-edit-btn" onClick={handleOpenMaster}>
                        <Icon name="launch" size={16} /> Edit in Editor
                    </button>
                </div>
                <div className="master-config-info">
                    <code className="config-path">~/.devsynq/.code-profile</code>
                    <p className="config-hint">
                        This is your canonical .code-profile. Changes here sync to all enabled IDEs.
                    </p>
                </div>
            </div>

            <div className="mcp-section">
                <h4><Icon name="project" /> Synced IDEs</h4>
                <div className="mcp-ide-list">
                    {statuses.map(ide => (
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
                                        <span className="ide-icon"><IdeIcon ide={ide.name} size={22} /></span>
                                        <span className="ide-name" style={{ textTransform: 'capitalize' }}>{ide.name}</span>
                                    </span>
                                </label>
                                <div className={`ide-status ${getStatusClass(ide.status)}`}>
                                    {ide.status === 'synced' && <><Icon name="check" size={12} /> Synced</>}
                                    {ide.status === 'pending' && <><Icon name="circle" size={12} /> Pending</>}
                                    {ide.status === 'not-installed' && <><Icon name="minimize" size={12} /> Not Installed</>}
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
                        </div>
                    ))}
                </div>
            </div>

            <div className="mcp-section mcp-options">
                <h4><Icon name="settings" size={16} /> Sync Options</h4>
                <div className="mcp-option-list">
                    <label className="mcp-option">
                        <input
                            type="checkbox"
                            checked={settings?.autoSyncOnLaunch ?? true}
                            onChange={e => handleUpdateSettings('autoSyncOnLaunch', e.target.checked)}
                        />
                        <span>Auto-sync when launching IDE from DevSynq</span>
                    </label>
                </div>
            </div>

            {lastResult && (
                <div className="mcp-section mcp-result">
                    <h4><Icon name="barChart" size={16} color="white" /> Last Sync Result</h4>
                    <div className="result-details">
                        {lastResult.success.length > 0 && (
                            <div className="result-item result-success">
                                <Icon name="check" size={12} /> Synced: {lastResult.success.join(', ')}
                            </div>
                        )}
                        {lastResult.skipped.length > 0 && (
                            <div className="result-item result-skipped">
                                <Icon name="slash" size={12} /> Skipped: {lastResult.skipped.join(', ')}
                            </div>
                        )}
                        {lastResult.failed.length > 0 && (
                            <div className="result-item result-failed">
                                <Icon name="close" size={12} /> Failed:
                                {lastResult.failed.map(f => (
                                    <div key={f.ide} className="failed-detail">
                                        {f.ide}: {f.error}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

