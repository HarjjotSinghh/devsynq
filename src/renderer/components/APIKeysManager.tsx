import React, { useEffect, useState, useCallback } from 'react';
import { APIKeysSettings, APIKeys } from '../../types';
import { APIKeyType, APIKeySyncStatusItem } from '../types.d';
import { Icon } from './Icons';

function APIKeysManager() {
    const [settings, setSettings] = useState<APIKeysSettings | null>(null);
    const [keyTypes, setKeyTypes] = useState<APIKeyType[]>([]);
    const [syncStatus, setSyncStatus] = useState<APIKeySyncStatusItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [keyInput, setKeyInput] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: React.ReactNode; type: 'success' | 'error' } | null>(null);

    const loadData = useCallback(async () => {
        try {
            const [apiSettings, types, status] = await Promise.all([
                window.electronAPI.getAPIKeysSettings(),
                window.electronAPI.getAPIKeyTypes(),
                window.electronAPI.getAPIKeySyncStatus(),
            ]);
            setSettings(apiSettings);
            setKeyTypes(types);
            setSyncStatus(status);
        } catch (error) {
            console.error('Failed to load API keys data:', error);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const showToast = (message: React.ReactNode, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSaveKey = async (keyName: keyof APIKeys) => {
        if (!keyInput.trim()) {
            setValidationError('Key cannot be empty');
            return;
        }

        // Validate the key
        const validation = await window.electronAPI.validateAPIKey(keyName, keyInput);
        if (!validation.valid) {
            setValidationError(validation.error || 'Invalid key format');
            return;
        }

        try {
            await window.electronAPI.updateAPIKey(keyName, keyInput);
            await loadData();
            setEditingKey(null);
            setKeyInput('');
            setValidationError(null);
            setValidationError(null);
            showToast(<><Icon name="checkCircle" size={14} /> {keyName} key saved successfully</>, 'success');
        } catch (error) {
            showToast(<><Icon name="xCircle" size={14} /> Failed to save key</>, 'error');
        }
    };

    const handleDeleteKey = async (keyName: keyof APIKeys) => {
        if (!confirm(`Are you sure you want to delete the ${keyName} API key?`)) return;

        try {
            await window.electronAPI.deleteAPIKey(keyName);
            await loadData();
            showToast(<><Icon name="checkCircle" size={14} /> {keyName} key deleted</>, 'success');
        } catch (error) {
            showToast(<><Icon name="xCircle" size={14} /> Failed to delete key</>, 'error');
        }
    };

    const handleSyncToAll = async () => {
        setIsSyncing(true);
        try {
            const result = await window.electronAPI.syncAPIKeysToAll();
            if (result.success.length > 0) {
                showToast(<><Icon name="checkCircle" size={14} /> Synced to {result.success.join(', ')}</>, 'success');
            }
            if (result.failed.length > 0) {
                showToast(<><Icon name="xCircle" size={14} /> Failed: {result.failed.map(f => f.ide).join(', ')}</>, 'error');
            }
        } catch (error) {
            showToast(<><Icon name="xCircle" size={14} /> Failed to sync API keys</>, 'error');
        }
        setIsSyncing(false);
    };

    const handleToggleIDESync = async (ideId: string, enabled: boolean) => {
        try {
            await window.electronAPI.toggleIDEKeySync(ideId, enabled);
            await loadData();
        } catch (error) {
            showToast(<><Icon name="xCircle" size={14} /> Failed to update settings</>, 'error');
        }
    };

    const getMaskedKey = async (key: string): Promise<string> => {
        return await window.electronAPI.maskAPIKey(key);
    };

    const getKeyValue = (keyName: keyof APIKeys): string | undefined => {
        return settings?.keys[keyName];
    };

    const hasKey = (keyName: keyof APIKeys): boolean => {
        return !!settings?.keys[keyName];
    };

    if (isLoading) {
        return (
            <div className="apikeys-loading">
                <div className="apikeys-spinner"></div>
                <span>Loading API Keys...</span>
            </div>
        );
    }

    return (
        <div className="apikeys-manager">
            {/* Toast Notification */}
            {toast && (
                <div className={`apikeys-toast ${toast.type}`}>
                    {toast.type === 'success' ? <Icon name="checkCircle" size={16} /> : <Icon name="xCircle" size={16} />} {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="apikeys-header">
                <div className="apikeys-header-left">
                    <h2>
                        <span className="apikeys-icon"><Icon name="key" size={24} /></span>
                        API Keys Sync
                    </h2>
                    <p className="apikeys-subtitle">
                        Store your API keys once, sync to all IDEs automatically
                    </p>
                </div>
                <button
                    className="apikeys-sync-btn"
                    onClick={handleSyncToAll}
                    disabled={isSyncing || !settings?.keys || Object.keys(settings.keys).length === 0}
                >
                    {isSyncing ? (
                        <>
                            <span className="sync-spinner"></span>
                            Syncing...
                        </>
                    ) : (
                        <><Icon name="sync" size={14} /> Sync All Keys</>
                    )}
                </button>
            </div>

            {/* API Keys List */}
            <div className="apikeys-section">
                <h3>Your API Keys</h3>
                <div className="apikeys-list">
                    {keyTypes.map((keyType) => (
                        <div key={keyType.id} className="apikey-card">
                            <div className="apikey-info">
                                <div className="apikey-name">{keyType.name}</div>
                                <div className="apikey-desc">{keyType.description}</div>
                                <div className="apikey-supported">
                                    Supported: {keyType.supportedIDEs.join(', ') || 'None'}
                                </div>
                            </div>
                            <div className="apikey-value">
                                {editingKey === keyType.id ? (
                                    <div className="apikey-edit">
                                        <input
                                            type="password"
                                            placeholder={`Enter ${keyType.name}...`}
                                            value={keyInput}
                                            onChange={(e) => {
                                                setKeyInput(e.target.value);
                                                setValidationError(null);
                                            }}
                                            className={validationError ? 'input-error' : ''}
                                            autoFocus
                                        />
                                        {validationError && (
                                            <div className="apikey-error">{validationError}</div>
                                        )}
                                        <div className="apikey-edit-actions">
                                            <button
                                                className="apikey-btn apikey-btn-save"
                                                onClick={() => handleSaveKey(keyType.id)}
                                            >
                                                <Icon name="check" size={14} /> Save
                                            </button>
                                            <button
                                                className="apikey-btn apikey-btn-cancel"
                                                onClick={() => {
                                                    setEditingKey(null);
                                                    setKeyInput('');
                                                    setValidationError(null);
                                                }}
                                            >
                                                <Icon name="close" size={14} /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : hasKey(keyType.id) ? (
                                    <div className="apikey-saved">
                                        <span className="apikey-masked">••••••••••••</span>
                                        <div className="apikey-actions">
                                            <button
                                                className="apikey-btn apikey-btn-edit"
                                                onClick={() => setEditingKey(keyType.id)}
                                            >
                                                <Icon name="edit" size={14} /> Edit
                                            </button>
                                            <button
                                                className="apikey-btn apikey-btn-delete"
                                                onClick={() => handleDeleteKey(keyType.id)}
                                            >
                                                <Icon name="delete" size={14} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        className="apikey-add-btn"
                                        onClick={() => setEditingKey(keyType.id)}
                                    >
                                        <Icon name="add" size={14} /> Add Key
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* IDE Sync Settings */}
            <div className="apikeys-section">
                <h3>IDE Sync Settings</h3>
                <p className="section-desc">Choose which IDEs should receive your API keys</p>
                <div className="apikeys-ides-grid">
                    {syncStatus.map((ide) => (
                        <div
                            key={ide.id}
                            className={`apikeys-ide-card ${ide.enabled ? 'enabled' : ''} ${!ide.configExists ? 'not-installed' : ''}`}
                        >
                            <div className="apikeys-ide-header">
                                <span className="apikeys-ide-name">{ide.name}</span>
                                <label className="apikeys-toggle">
                                    <input
                                        type="checkbox"
                                        checked={ide.enabled}
                                        onChange={(e) => handleToggleIDESync(ide.id, e.target.checked)}
                                        disabled={!ide.configExists}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="apikeys-ide-status">
                                {ide.configExists ? (
                                    <span className="status-installed"><Icon name="check" size={14} /> Installed</span>
                                ) : (
                                    <span className="status-not-installed">Not Installed</span>
                                )}
                            </div>
                            <div className="apikeys-ide-keys" style={{ textTransform: 'capitalize' }}>
                                Supports: {ide.supportedKeys.join(', ')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Info Section */}
            <div className="apikeys-info">
                <div className="info-icon"><Icon name="lightbulb" size={24} /></div>
                <div className="info-content">
                    <strong>How it works:</strong>
                    <p>
                        Your API keys are securely stored locally and automatically injected into each IDE's
                        configuration file when you sync. No data is sent to any external servers.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default APIKeysManager;
