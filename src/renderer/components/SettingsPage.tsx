import React, { useState } from 'react';
import { Settings, IDEType, IDE } from '../../types';
import { MCPSyncSettings } from './MCPSyncSettings';
import ProcessManager from './ProcessManager';
import APIKeysManager from './APIKeysManager';
import './SettingsPage.css';

interface SettingsPageProps {
    settings: Settings;
    ides: IDE[];
    onSettingsChange: (settings: Settings) => void;
    onSave: () => void;
    onClose: () => void;
    onToast: (message: string) => void;
}

type TabId = 'general' | 'mcp' | 'processes' | 'apikeys';

interface Tab {
    id: TabId;
    label: string;
    icon: string;
    description: string;
}

const TABS: Tab[] = [
    { id: 'general', label: 'General', icon: '⚙️', description: 'App preferences and defaults' },
    { id: 'mcp', label: 'MCP Sync', icon: '🔄', description: 'Model Context Protocol configuration' },
    { id: 'processes', label: 'Processes', icon: '⚡', description: 'Running IDE management' },
    { id: 'apikeys', label: 'API Keys', icon: '🔑', description: 'API key storage and sync' },
];

function SettingsPage({
    settings,
    ides,
    onSettingsChange,
    onSave,
    onClose,
    onToast,
}: SettingsPageProps) {
    const [activeTab, setActiveTab] = useState<TabId>('general');

    const handleSettingChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    return (
        <div className="settings-page">
            {/* Header */}
            <header className="settings-header">
                <div className="settings-header-left">
                    <button className="settings-back-btn" onClick={onClose}>
                        ← Back
                    </button>
                    <h1>Settings</h1>
                </div>
                <div className="settings-header-right">
                    <span className="settings-version">DevSynq v1.0.0</span>
                </div>
            </header>

            {/* Main Layout */}
            <div className="settings-layout">
                {/* Sidebar Navigation */}
                <aside className="settings-sidebar">
                    <nav className="settings-nav">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className="nav-icon">{tab.icon}</span>
                                <div className="nav-content">
                                    <span className="nav-label">{tab.label}</span>
                                    <span className="nav-description">{tab.description}</span>
                                </div>
                            </button>
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="settings-sidebar-footer">
                        <div className="shortcut-info">
                            <span className="shortcut-label">Quick Access</span>
                            <kbd>Alt+Shift+Space</kbd>
                        </div>
                    </div>
                </aside>

                {/* Content Area */}
                <main className="settings-content">
                    {activeTab === 'general' && (
                        <div className="settings-panel">
                            <div className="panel-header">
                                <h2>General Settings</h2>
                                <p>Configure your default preferences</p>
                            </div>

                            <div className="settings-group">
                                <h3>Default IDE</h3>
                                <p className="group-description">
                                    Choose which IDE opens when launching projects without a specific preference
                                </p>
                                <select
                                    className="settings-select"
                                    value={settings.defaultIDE}
                                    onChange={(e) => handleSettingChange('defaultIDE', e.target.value as IDEType)}
                                >
                                    {ides.length > 0 ? (
                                        ides.map((ide) => (
                                            <option key={ide.name} value={ide.name}>
                                                {ide.icon} {ide.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="Cursor">Cursor</option>
                                    )}
                                </select>
                            </div>

                            <div className="settings-group">
                                <h3>Appearance</h3>
                                <div className="settings-toggle-row">
                                    <div className="toggle-info">
                                        <span className="toggle-label">Light Theme</span>
                                        <span className="toggle-description">Use light colors instead of dark</span>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={settings.theme === 'light'}
                                            onChange={(e) => handleSettingChange('theme', e.target.checked ? 'light' : 'dark')}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="settings-group">
                                <h3>Behavior</h3>
                                <div className="settings-toggle-row">
                                    <div className="toggle-info">
                                        <span className="toggle-label">Launch at Startup</span>
                                        <span className="toggle-description">Open DevSynq when your computer starts</span>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={settings.launchAtStartup}
                                            onChange={(e) => handleSettingChange('launchAtStartup', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="settings-toggle-row">
                                    <div className="toggle-info">
                                        <span className="toggle-label">Auto-detect IDEs</span>
                                        <span className="toggle-description">Automatically scan for newly installed IDEs on launch</span>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={settings.autoDetectIDEs}
                                            onChange={(e) => handleSettingChange('autoDetectIDEs', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="panel-actions">
                                <button className="btn-primary" onClick={onSave}>
                                    💾 Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'mcp' && (
                        <div className="settings-panel">
                            <div className="panel-header">
                                <h2>MCP Configuration Sync</h2>
                                <p>Manage Model Context Protocol servers across all your IDEs</p>
                            </div>
                            <MCPSyncSettings onToast={onToast} />
                        </div>
                    )}

                    {activeTab === 'processes' && (
                        <div className="settings-panel">
                            <ProcessManager />
                        </div>
                    )}

                    {activeTab === 'apikeys' && (
                        <div className="settings-panel">
                            <APIKeysManager />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default SettingsPage;
