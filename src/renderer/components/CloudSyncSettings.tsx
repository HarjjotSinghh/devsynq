/**
 * CloudSyncSettings Component
 * 
 * Allows users to manage cloud sync settings, register, login, and sync data
 */

import React, { useState, useEffect } from 'react';
import './CloudSyncSettings.css';

interface CloudSyncConfig {
    syncServerUrl: string;
    userId: string;
    email: string;
    displayName: string;
    deviceId: string;
    lastSyncAt: number | null;
    autoSync: boolean;
    syncInterval: number;
}

interface BackupInfo {
    id: string;
    dataType: string;
    version: number;
    plaintextSize: number;
    updatedAt: string;
}

interface CloudSyncSettingsProps {
    isOpen: boolean;
    onClose: () => void;
    onToast: (message: string) => void;
}

export const CloudSyncSettings: React.FC<CloudSyncSettingsProps> = ({
    isOpen,
    onClose,
    onToast,
}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [config, setConfig] = useState<CloudSyncConfig | null>(null);
    const [backups, setBackups] = useState<BackupInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'status' | 'login' | 'register'>('status');
    const [isSyncing, setIsSyncing] = useState(false);

    // Form state for registration
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regDisplayName, setRegDisplayName] = useState('');
    const [regServerUrl, setRegServerUrl] = useState('https://devsynq.com/api/cloud-sync');

    // Form state for login
    const [loginAccessKey, setLoginAccessKey] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginServerUrl, setLoginServerUrl] = useState('https://devsynq.com/api/cloud-sync');

    // State for showing access key after registration
    const [newAccessKey, setNewAccessKey] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadStatus();
        }
    }, [isOpen]);

    const loadStatus = async () => {
        setIsLoading(true);
        try {
            const loggedIn = await window.electronAPI.cloudSyncIsLoggedIn();
            setIsLoggedIn(loggedIn);

            if (loggedIn) {
                const cfg = await window.electronAPI.cloudSyncGetConfig();
                setConfig(cfg);

                const backupsResult = await window.electronAPI.cloudSyncListBackups();
                if (backupsResult.success && backupsResult.data) {
                    setBackups(backupsResult.data);
                }
                setActiveTab('status');
            } else {
                setActiveTab('login');
            }
        } catch (error) {
            console.error('Failed to load cloud sync status:', error);
        }
        setIsLoading(false);
    };

    const handleRegister = async () => {
        if (!regEmail || !regPassword) {
            onToast('Email and encryption password are required');
            return;
        }

        setIsLoading(true);
        try {
            const result = await window.electronAPI.cloudSyncRegister(
                regEmail,
                regPassword,
                regDisplayName || undefined,
                regServerUrl
            );

            if (result.success) {
                const data = result.data as { accessKey?: string } | undefined;
                if (data?.accessKey) {
                    setNewAccessKey(data.accessKey);
                }
                onToast('Account created successfully!');
                await loadStatus();
            } else {
                onToast(result.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            onToast('Registration failed');
        }
        setIsLoading(false);
    };

    const handleLogin = async () => {
        if (!loginAccessKey || !loginPassword) {
            onToast('Access key and encryption password are required');
            return;
        }

        setIsLoading(true);
        try {
            const result = await window.electronAPI.cloudSyncLogin(
                loginAccessKey,
                loginPassword,
                loginServerUrl
            );

            if (result.success) {
                onToast('Logged in successfully!');
                await loadStatus();
            } else {
                onToast(result.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            onToast('Login failed');
        }
        setIsLoading(false);
    };

    const handleLogout = async () => {
        try {
            await window.electronAPI.cloudSyncLogout();
            setIsLoggedIn(false);
            setConfig(null);
            setBackups([]);
            setActiveTab('login');
            onToast('Logged out');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleFullBackup = async () => {
        setIsSyncing(true);
        try {
            const result = await window.electronAPI.cloudSyncFullBackup();
            if (result.success) {
                onToast('Full backup created!');
                await loadStatus();
            } else {
                onToast(result.error || 'Backup failed');
            }
        } catch (error) {
            console.error('Backup error:', error);
            onToast('Backup failed');
        }
        setIsSyncing(false);
    };

    const handleRestore = async () => {
        if (!confirm('This will replace your current data with the cloud backup. Continue?')) {
            return;
        }

        setIsSyncing(true);
        try {
            const result = await window.electronAPI.cloudSyncRestoreBackup();
            if (result.success) {
                onToast('Backup restored! Reload the app to see changes.');
            } else {
                onToast(result.error || 'Restore failed');
            }
        } catch (error) {
            console.error('Restore error:', error);
            onToast('Restore failed');
        }
        setIsSyncing(false);
    };

    const formatBytes = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const formatDate = (dateStr: string): string => {
        return new Date(dateStr).toLocaleString();
    };

    if (!isOpen) return null;

    return (
        <div className="cloud-sync-overlay" onClick={onClose}>
            <div className="cloud-sync-modal" onClick={(e) => e.stopPropagation()}>
                <div className="cloud-sync-header">
                    <h2>☁️ Cloud Sync</h2>
                    <p className="cloud-sync-subtitle">
                        End-to-end encrypted backup across devices
                    </p>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="cloud-sync-content">
                    {isLoading ? (
                        <div className="loading-state">Loading...</div>
                    ) : (
                        <>
                            {/* Access Key Display (after registration) */}
                            {newAccessKey && (
                                <div className="access-key-display">
                                    <h3>🔑 Your Access Key</h3>
                                    <p className="warning">
                                        Save this key now! It will not be shown again.
                                    </p>
                                    <code className="access-key">{newAccessKey}</code>
                                    <button
                                        className="btn-primary"
                                        onClick={() => {
                                            navigator.clipboard.writeText(newAccessKey);
                                            onToast('Access key copied to clipboard');
                                        }}
                                    >
                                        Copy to Clipboard
                                    </button>
                                    <button
                                        className="btn-secondary"
                                        onClick={() => setNewAccessKey(null)}
                                    >
                                        I've Saved It
                                    </button>
                                </div>
                            )}

                            {/* Tabs */}
                            {!newAccessKey && (
                                <div className="cloud-sync-tabs">
                                    {isLoggedIn ? (
                                        <button
                                            className={`tab ${activeTab === 'status' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('status')}
                                        >
                                            Status
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                className={`tab ${activeTab === 'login' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('login')}
                                            >
                                                Login
                                            </button>
                                            <button
                                                className={`tab ${activeTab === 'register' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('register')}
                                            >
                                                Register
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Status Tab */}
                            {!newAccessKey && activeTab === 'status' && isLoggedIn && config && (
                                <div className="status-content">
                                    <div className="account-info">
                                        <div className="info-row">
                                            <span className="label">Email:</span>
                                            <span className="value">{config.email}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Display Name:</span>
                                            <span className="value">{config.displayName}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Last Sync:</span>
                                            <span className="value">
                                                {config.lastSyncAt
                                                    ? new Date(config.lastSyncAt).toLocaleString()
                                                    : 'Never'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="sync-actions">
                                        <button
                                            className="btn-primary"
                                            onClick={handleFullBackup}
                                            disabled={isSyncing}
                                        >
                                            {isSyncing ? '⏳ Syncing...' : '⬆️ Backup Now'}
                                        </button>
                                        <button
                                            className="btn-secondary"
                                            onClick={handleRestore}
                                            disabled={isSyncing}
                                        >
                                            ⬇️ Restore from Cloud
                                        </button>
                                    </div>

                                    {backups.length > 0 && (
                                        <div className="backups-list">
                                            <h3>Backups</h3>
                                            {backups.map((backup) => (
                                                <div key={backup.id} className="backup-item">
                                                    <div className="backup-type">{backup.dataType}</div>
                                                    <div className="backup-meta">
                                                        <span>v{backup.version}</span>
                                                        <span>{formatBytes(backup.plaintextSize)}</span>
                                                        <span>{formatDate(backup.updatedAt)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="logout-section">
                                        <button className="btn-danger" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Login Tab */}
                            {!newAccessKey && activeTab === 'login' && !isLoggedIn && (
                                <div className="login-form">
                                    <div className="form-row">
                                        <label>Access Key</label>
                                        <input
                                            type="password"
                                            value={loginAccessKey}
                                            onChange={(e) => setLoginAccessKey(e.target.value)}
                                            placeholder="ds_..."
                                        />
                                    </div>
                                    <div className="form-row">
                                        <label>Encryption Password</label>
                                        <input
                                            type="password"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            placeholder="Your encryption password"
                                        />
                                        <span className="form-hint">
                                            This password encrypts your data locally before sync
                                        </span>
                                    </div>
                                    <div className="form-row">
                                        <label>Server URL (optional)</label>
                                        <input
                                            type="text"
                                            value={loginServerUrl}
                                            onChange={(e) => setLoginServerUrl(e.target.value)}
                                        />
                                    </div>
                                    <button className="btn-primary" onClick={handleLogin}>
                                        Login
                                    </button>
                                </div>
                            )}

                            {/* Register Tab */}
                            {!newAccessKey && activeTab === 'register' && !isLoggedIn && (
                                <div className="register-form">
                                    <div className="form-row">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={regEmail}
                                            onChange={(e) => setRegEmail(e.target.value)}
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    <div className="form-row">
                                        <label>Display Name (optional)</label>
                                        <input
                                            type="text"
                                            value={regDisplayName}
                                            onChange={(e) => setRegDisplayName(e.target.value)}
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div className="form-row">
                                        <label>Encryption Password</label>
                                        <input
                                            type="password"
                                            value={regPassword}
                                            onChange={(e) => setRegPassword(e.target.value)}
                                            placeholder="Choose a strong password"
                                        />
                                        <span className="form-hint">
                                            This password encrypts your data. Keep it safe!
                                            We cannot recover your data if you lose it.
                                        </span>
                                    </div>
                                    <div className="form-row">
                                        <label>Server URL (optional)</label>
                                        <input
                                            type="text"
                                            value={regServerUrl}
                                            onChange={(e) => setRegServerUrl(e.target.value)}
                                        />
                                    </div>
                                    <button className="btn-primary" onClick={handleRegister}>
                                        Create Account
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="cloud-sync-footer">
                    <span className="security-note">
                        🔒 Your data is encrypted end-to-end. We never see your plaintext data.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CloudSyncSettings;
