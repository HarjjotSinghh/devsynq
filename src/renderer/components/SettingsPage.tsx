import React from 'react';
import { Settings, IDEType, IDE } from '../../types';
import { MCPSyncSettings } from './MCPSyncSettings';
import { ProfileSyncSettings } from './ProfileSyncSettings';
import ProcessManager from './ProcessManager';
import APIKeysManager from './APIKeysManager';
import { Icon, IdeIcon } from './Icons';
import './SettingsPage.css';

interface SettingsPageProps {
    settings: Settings;
    ides: IDE[];
    onSettingsChange: (settings: Settings) => void;
    onSave: () => void;
    onClose: () => void;
    onToast: (message: React.ReactNode) => void;
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
    resolveShortcutIDE: (index: number) => IDEType | undefined;
}

type TabId = 'general' | 'shortcuts' | 'mcp' | 'profile' | 'processes' | 'apikeys';

interface Tab {
    id: TabId;
    label: string;
    icon: React.ReactNode;
    description: string;
}

const TABS: Tab[] = [
    { id: 'general', label: 'General', icon: <Icon name="settings" />, description: 'App preferences and defaults' },
    { id: 'shortcuts', label: 'Shortcuts', icon: <Icon name="keyboard" />, description: 'Configure keyboard bindings' },
    { id: 'mcp', label: 'MCP Sync', icon: <Icon name="sync" />, description: 'Model Context Protocol configuration' },
    { id: 'profile', label: 'Profile Sync', icon: <Icon name="profile" />, description: 'Sync .code-profile across IDEs' },
    { id: 'processes', label: 'Processes', icon: <Icon name="project" />, description: 'Running IDE management' },
    { id: 'apikeys', label: 'API Keys', icon: <Icon name="theme" />, description: 'API key storage and sync' },
];

function SettingsPage({
    settings,
    ides,
    onSettingsChange,
    onSave,
    onClose,
    onToast,
    activeTab,
    onTabChange,
    resolveShortcutIDE,
}: SettingsPageProps) {
    const handleSettingChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    const shortcutBindingKey = (n: number) => `cmdorctrl+${n}`;

    const [isClosing, setIsClosing] = React.useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 200);
    };

    return (
        <div className={`settings-page ${isClosing ? 'closing' : ''}`}>
            {/* Header */}
            <header className="settings-header">
                <div className="settings-header-left">
                    <button className="settings-back-btn" onClick={handleClose}>
                        <Icon name="arrowLeft" />
                        <span>Back</span>
                    </button>
                    <h1>Settings</h1>
                </div>
                <div className="settings-header-right">
                    <span className="settings-version">DevSynq v1.9.1</span>
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
                                onClick={() => onTabChange(tab.id)}
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
                            <kbd>Cmd/Ctrl + ,</kbd>
                        </div>
                    </div>
                </aside>

                {/* Content Area */}
                <main className="settings-content">
                    {activeTab === 'general' && (
                        <div key="general" className="settings-panel page-transition-enter">
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
                                                {ide.name}
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
                                    <Icon name="download" size={16} />
                                    <span>Save Changes</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'shortcuts' && (
                        <div key="shortcuts" className="settings-panel page-transition-enter">
                            <div className="panel-header">
                                <h2>Keyboard Shortcuts</h2>
                                <p>Bind Cmd/Ctrl + number keys to launch specific IDEs</p>
                            </div>
                            <div className="shortcut-grid">
                                {[1, 2, 3, 4, 5].map((n) => {
                                    const key = shortcutBindingKey(n);
                                    const value = settings.shortcutBindings?.[key] || '';
                                    const resolved = resolveShortcutIDE(n);
                                    return (
                                        <div key={n} className="shortcut-row">
                                            <div className="shortcut-label">
                                                <Icon name="keyboard" size={16} />
                                                <span>Cmd/Ctrl + {n}</span>
                                            </div>
                                            <select
                                                className="settings-select"
                                                value={value}
                                                onChange={(e) => {
                                                    const nextBindings = { ...(settings.shortcutBindings || {}) };
                                                    nextBindings[key] = e.target.value ? (e.target.value as IDEType) : null;
                                                    onSettingsChange({ ...settings, shortcutBindings: nextBindings });
                                                }}
                                            >
                                                <option value="">Follow installed order</option>
                                                {ides
                                                    .filter((ide) => ide.installed)
                                                    .map((ide) => (
                                                        <option key={ide.name} value={ide.name}>
                                                            {ide.name}
                                                        </option>
                                                    ))}
                                            </select>
                                            <div className="shortcut-resolved">
                                                <span className="resolved-label">Will launch:</span>
                                                <span className="resolved-ide">
                                                    {resolved ? <IdeIcon ide={resolved} size={20} /> : '—'}
                                                    <span style={{ marginLeft: 6 }}>{resolved || 'First available'}</span>
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="panel-actions">
                                <button className="btn-primary" onClick={onSave}>
                                    <Icon name="download" size={16} />
                                    <span>Save Shortcuts</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'mcp' && (
                        <div key="mcp" className="settings-panel page-transition-enter">
                            <div className="panel-header">
                                <h2>MCP Configuration Sync</h2>
                                <p>Manage Model Context Protocol servers across all your IDEs</p>
                            </div>
                            <MCPSyncSettings onToast={onToast} />
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div key="profile" className="settings-panel page-transition-enter">
                            <div className="panel-header">
                                <h2>Profile Sync</h2>
                                <p>Sync your .code-profile to each configured IDE</p>
                            </div>
                            <ProfileSyncSettings onToast={onToast} />
                        </div>
                    )}

                    {activeTab === 'processes' && (
                        <div key="processes" className="settings-panel page-transition-enter">
                            <ProcessManager />
                        </div>
                    )}

                    {activeTab === 'apikeys' && (
                        <div key="apikeys" className="settings-panel page-transition-enter">
                            <APIKeysManager />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default SettingsPage;
