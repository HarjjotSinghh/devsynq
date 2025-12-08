import React, { useEffect, useState } from 'react';
import { IDE, IDEType, Project, Settings } from '../types';
import { Icon, IdeIcon } from './components/Icons';
import SettingsPage from './components/SettingsPage';
import Modal from './components/Modal';

const SETTINGS_DEFAULTS: Settings = {
    defaultIDE: IDEType.Cursor,
    launchAtStartup: false,
    theme: 'dark',
    autoDetectIDEs: true,
    shortcutBindings: {},
};

const App: React.FC = () => {
    const [ides, setIdes] = useState<(IDE & { installed?: boolean })[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [settings, setSettings] = useState<Settings>(SETTINGS_DEFAULTS);
    const [projectSearchTerm, setProjectSearchTerm] = useState('');
    const [activeView, setActiveView] = useState<'home' | 'settings'>('home');
    const [settingsTab, setSettingsTab] = useState<'general' | 'mcp' | 'processes' | 'apikeys' | 'shortcuts'>('general');
    const [isLoadingIDEs, setIsLoadingIDEs] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [toastMessage, setToastMessage] = useState<React.ReactNode | null>(null);
    const [mcpSyncCount, setMcpSyncCount] = useState<number>(0);
    const [isSyncingMCP, setIsSyncingMCP] = useState(false);
    const [lastMcpSync, setLastMcpSync] = useState<number | null>(null);

    // Master Directory Scan State
    const [foundProjects, setFoundProjects] = useState<{ name: string, path: string }[]>([]);
    const [isProjectScanModalOpen, setIsProjectScanModalOpen] = useState(false);

    // --- Initialization ---
    useEffect(() => {
        const init = async () => {
            if (!window.electronAPI) {
                console.error('electronAPI is not available!');
                return;
            }

            // Load settings first
            try {
                const loadedSettings = await window.electronAPI.getSettings();
                const mergedSettings = { ...SETTINGS_DEFAULTS, ...loadedSettings };
                setSettings(mergedSettings);
                document.body.dataset.theme = mergedSettings.theme;
            } catch (error) {
                console.error('Failed to load settings:', error);
            }

            // Load IDEs
            await loadIDEs();

            // Load Projects
            await loadProjects();

            // Load MCP sync status
            await loadMCPStatus();

            // Listen for settings shortcut from main process
            window.electronAPI.onShowSettings(() => {
                setActiveView('settings');
                setSettingsTab('general');
            });
        };

        init();
    }, []);

    // --- MCP Status Loading ---
    const loadMCPStatus = async () => {
        try {
            const [status, syncSettings] = await Promise.all([
                window.electronAPI.getMCPSyncStatus(),
                window.electronAPI.getMCPSyncSettings(),
            ]);
            const enabledCount = status.filter(s => s.enabled && s.isInstalled).length;
            setMcpSyncCount(enabledCount);
            if (syncSettings.lastGlobalSync) {
                setLastMcpSync(syncSettings.lastGlobalSync);
            }
        } catch (error) {
            console.error('Failed to load MCP status:', error);
        }
    };

    // --- Quick MCP Sync ---
    const handleQuickMCPSync = async () => {
        setIsSyncingMCP(true);
        try {
            const result = await window.electronAPI.syncMCPConfigs();
            await loadMCPStatus();

            if (result.success.length > 0) {
                showToast(<><Icon name="checkCircle" size={16} /> Synced MCP config to {result.success.length} IDE(s)</>);
            }
            if (result.failed.length > 0) {
                showToast(<><Icon name="alert" size={16} /> {result.failed.length} failed to sync</>);
            }
            if (result.success.length === 0 && result.failed.length === 0) {
                showToast('No IDEs enabled for sync');
            }
        } catch (error) {
            console.error('MCP sync failed:', error);
            showToast(<><Icon name="xCircle" size={16} /> MCP sync failed</>);
        } finally {
            setIsSyncingMCP(false);
        }
    };

    // --- Data Loading ---
    const loadIDEs = async (forceScan = false) => {
        setIsLoadingIDEs(true);
        try {
            const loadedIDEs = forceScan
                ? await window.electronAPI.refreshIDEs()
                : await window.electronAPI.getIDEs();
            setIdes(loadedIDEs);
        } catch (error) {
            console.error('Failed to load IDEs:', error);
            showToast('Failed to load IDEs');
        } finally {
            setIsLoadingIDEs(false);
        }
    };

    const loadProjects = async () => {
        try {
            const loadedProjects = await window.electronAPI.getProjects();
            setProjects(loadedProjects);
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    };

    // --- Handlers ---
    const showToast = (message: React.ReactNode) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Format relative time for display
    const formatRelativeTime = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const handleRefreshIDEs = async () => {
        setIsRefreshing(true);
        await loadIDEs(true);
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const handleLaunchIDE = async (ide: IDE) => {
        if (!ide.installed) {
            showToast(`Opening ${ide.name} download page... Click refresh after install.`);
            await window.electronAPI.openDownload(ide.downloadUrl);
            return;
        }

        showToast(`Launching ${ide.name}...`);
        try {
            const result = await window.electronAPI.launchIDE(ide.name);
            if (result.success) {
                showToast(<><Icon name="checkCircle" size={16} /> Launched!</>);
            } else {
                showToast(<><Icon name="xCircle" size={16} /> Failed: {result.error}</>);
            }
        } catch (error) {
            showToast(<><Icon name="xCircle" size={16} /> Error launching IDE</>);
        }
    };

    const handleAddProject = async () => {
        try {
            const newProject = await window.electronAPI.addProject();
            if (newProject) {
                await loadProjects();
                showToast(`Project "${newProject.name}" added!`);
            }
        } catch (error) {
            console.error('Failed to add project:', error);
            showToast('Failed to add project');
        }
    };

    const handleAddMasterDirectory = async () => {
        try {
            const projects = await window.electronAPI.scanProjectDirectory();
            if (projects && projects.length > 0) {
                setFoundProjects(projects);
                setIsProjectScanModalOpen(true);
            } else if (projects && projects.length === 0) {
                showToast('No sub-directories found in selected folder');
            }
        } catch (error) {
            console.error('Failed to scan directory:', error);
            showToast('Failed to scan directory');
        }
    };

    const confirmAddProjects = async () => {
        try {
            setIsProjectScanModalOpen(false);
            const projectPaths = foundProjects.map(p => p.path);
            await window.electronAPI.addMultipleProjects(projectPaths);
            await loadProjects();
            showToast(`Added ${foundProjects.length} projects!`);
        } catch (error) {
            console.error('Failed to add projects:', error);
            showToast('Failed to add projects');
        }
    };

    const handleDeleteProject = async (e: React.MouseEvent, projectId: string, projectName: string) => {
        e.stopPropagation();
        if (confirm(`Remove "${projectName}" from list?`)) {
            await window.electronAPI.deleteProject(projectId);
            await loadProjects();
        }
    };

    const resolveIDEForProject = (project: Project): IDEType => {
        const preferred = project.preferredIDE || settings.defaultIDE || SETTINGS_DEFAULTS.defaultIDE;
        const installedPreferred = ides.find(ide => ide.name === preferred && ide.installed);
        if (installedPreferred) return installedPreferred.name;

        const installedDefault = ides.find(ide => ide.name === settings.defaultIDE && ide.installed);
        if (installedDefault) return installedDefault.name;

        const firstInstalled = ides.find(ide => ide.installed);
        return firstInstalled?.name || preferred;
    };

    const handleLaunchProject = async (project: Project) => {
        const hasInstalled = ides.some(ide => ide.installed);
        if (!hasInstalled) {
            showToast('No installed IDE found. Install one or refresh.');
            return;
        }

        const ideName = resolveIDEForProject(project);
        showToast(`Opening ${project.name} in ${ideName}...`);
        try {
            const result = await window.electronAPI.launchIDE(ideName, project.path);
            if (!result.success) {
                showToast(`Failed: ${result.error}`);
            } else {
                await loadProjects(); // Update last opened
            }
        } catch (error) {
            showToast('Error launching project');
            console.error(error);
        }
    };

    const handleUpdateProjectIDE = async (e: React.ChangeEvent<HTMLSelectElement>, projectId: string) => {
        const newIDE = e.target.value as IDEType;
        try {
            await window.electronAPI.updateProjectIDE(projectId, newIDE);
            await loadProjects(); // Reload to reflect changes
            showToast(`Project IDE updated to ${newIDE}`);
        } catch (error) {
            console.error('Failed to update project IDE:', error);
            showToast('Failed to update project IDE');
        }
    };

    const handleSaveSettings = async () => {
        try {
            document.body.dataset.theme = settings.theme;
            await window.electronAPI.saveSettings(settings);
            showToast('Settings saved');
            setActiveView('home');
        } catch (error) {
            console.error('Failed to save settings', error);
            showToast('Failed to save settings');
        }
    };

    // --- Keyboard Shortcuts ---
    useEffect(() => {
        const handleKeyDown = async (event: KeyboardEvent) => {
            const isCmdOrCtrl = event.metaKey || event.ctrlKey;
            if (!isCmdOrCtrl) return;

            if (event.key === ',' && !event.shiftKey) {
                event.preventDefault();
                setActiveView('settings');
                setSettingsTab('general');
                return;
            }

            if (event.key.toLowerCase() === 'p') {
                event.preventDefault();
                document.getElementById('project-search')?.focus();
                return;
            }

            const numeric = Number(event.key);
            if (!Number.isNaN(numeric) && numeric >= 1 && numeric <= 5) {
                event.preventDefault();
                const targetName = resolveShortcutIDE(numeric);
                if (!targetName) {
                    showToast('No IDE configured for that shortcut');
                    return;
                }
                const target = ides.find(ide => ide.name === targetName && ide.installed);
                if (target) {
                    handleLaunchIDE(target);
                } else {
                    showToast('Configured IDE is not installed');
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [ides, settings]); // Re-bind when ides or bindings change

    const resolveShortcutIDE = (index: number): IDEType | undefined => {
        const key = `cmdorctrl+${index}`;
        const bound = settings.shortcutBindings?.[key];
        if (bound) return bound as IDEType;
        const installed = ides.filter(ide => ide.installed);
        return installed[index - 1]?.name;
    };

    // --- Filtering & Sorting ---
    const filteredProjects = projects.filter(project => {
        const term = projectSearchTerm.trim().toLowerCase();
        if (!term) return true;
        return (
            project.name.toLowerCase().includes(term) ||
            project.path.toLowerCase().includes(term)
        );
    }).sort((a, b) => a.name.localeCompare(b.name));

    const recentProjects = [...projects]
        .filter(p => typeof p.lastOpened === 'number')
        .sort((a, b) => (b.lastOpened || 0) - (a.lastOpened || 0))
        .slice(0, 3);

    const installedCount = ides.filter(ide => ide.installed).length;

    // --- Render Helpers ---
    const getProjectIcon = (preferredIDE: IDEType) => {
        return <IdeIcon ide={preferredIDE} size={26} />;
    };

    if (activeView === 'settings') {
        return (
            <SettingsPage
                settings={settings}
                ides={ides}
                onSettingsChange={setSettings}
                onSave={handleSaveSettings}
                onClose={() => setActiveView('home')}
                onToast={showToast}
                activeTab={settingsTab}
                onTabChange={setSettingsTab}
                resolveShortcutIDE={resolveShortcutIDE}
            />
        );
    }

    return (
        <div className="app-container">
            {/* Title Bar */}
            <div className="title-bar">
                <div className="title-bar-title">
                    <div className="title-bar-logo">
                        <Icon name="logo" />
                    </div>
                    <span>DevSynq</span>
                </div>
                <div className="window-controls">
                    <button id="settings-btn" className="window-control-btn" title="Settings" onClick={() => setActiveView('settings')}>
                        <Icon name="settings" />
                    </button>
                    <button id="minimize-btn" className="window-control-btn" title="Minimize" onClick={() => window.electronAPI.minimize()}>
                        <Icon name="minimize" />
                    </button>
                    <button id="maximize-btn" className="window-control-btn" title="Maximize" onClick={() => window.electronAPI.maximize()}>
                        <Icon name="maximize" />
                    </button>
                    <button id="close-btn" className="window-control-btn close" title="Close" onClick={() => window.electronAPI.close()}>
                        <Icon name="close" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="main-content">
                {/* Header */}
                <header className="header">
                    <h1 className="header-title">DevSynq</h1>
                    <p className="header-subtitle">Launch your favorite AI-powered development environments instantly</p>

                    <div className="stats-bar">
                        <div className="stat-item">
                            <span className="stat-value" id="installed-count">{installedCount}</span>
                            <span className="stat-label">Installed</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value" id="total-count">{ides.length}</span>
                            <span className="stat-label">Total IDEs</span>
                        </div>
                        <button
                            id="refresh-btn"
                            title="Refresh IDE list"
                            onClick={handleRefreshIDEs}
                            disabled={isRefreshing}
                            className="icon-button-inline"
                        >
                            <Icon name="refresh" />
                            <span>Refresh</span>
                        </button>
                    </div>
                </header>

                {/* MCP Sync CTA Section */}
                <section className="mcp-sync-cta">
                    <div className="mcp-cta-content">
                        <div className="mcp-cta-info">
                            <div className="mcp-cta-icon">
                                <Icon name="sync" />
                            </div>
                            <div className="mcp-cta-text">
                                <h3>MCP Configuration Sync</h3>
                                <p>
                                    {mcpSyncCount > 0
                                        ? `Sync your MCP servers to ${mcpSyncCount} configured IDE${mcpSyncCount !== 1 ? 's' : ''}`
                                        : 'Configure and sync MCP servers across all your AI IDEs'
                                    }
                                </p>
                                {lastMcpSync && (
                                    <span className="mcp-last-sync">
                                        Last synced: {formatRelativeTime(lastMcpSync)}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="mcp-cta-actions">
                            <button
                                className="mcp-sync-btn primary"
                                onClick={handleQuickMCPSync}
                                disabled={isSyncingMCP}
                            >
                                {isSyncingMCP ? (
                                    <>
                                        <span className="btn-spinner"></span>
                                        Syncing...
                                    </>
                                ) : (
                                    <>
                                        <Icon name="sync" size={16} />
                                        Sync All Now
                                    </>
                                )}
                            </button>
                            <button
                                className="mcp-sync-btn secondary"
                                onClick={() => {
                                    setSettingsTab('mcp');
                                    setActiveView('settings');
                                }}
                            >
                                <Icon name="settings" size={16} />
                                Configure
                            </button>
                        </div>
                    </div>
                </section>

                {/* IDE Grid */}
                <div id="ide-grid">
                    {isLoadingIDEs ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Scanning for installed IDEs...</p>
                        </div>
                    ) : (
                        ides.map(ide => (
                            <div
                                key={ide.name}
                                className={`ide-card ${ide.installed ? 'installed' : 'not-installed'}`}
                                style={{ '--accent-color': ide.color } as React.CSSProperties}
                                onClick={() => handleLaunchIDE(ide)}
                            >
                                <div className="card-content">
                                    <div className="ide-icon-wrapper">
                                        <IdeIcon ide={ide.name} />
                                    </div>
                                    <h3 className="ide-name">{ide.name}</h3>
                                    <div className="ide-status">
                                        <span className={`status-dot ${ide.installed ? 'active' : 'inactive'}`}></span>
                                        <span className="status-text">{ide.installed ? 'Installed' : 'Not Installed'}</span>
                                    </div>
                                    <button
                                        className={`ide-action-btn ${ide.installed ? 'launch-btn' : 'install-btn'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLaunchIDE(ide);
                                        }}
                                    >
                                        {ide.installed ? (
                                            <>
                                                <Icon name="launch" size={16} />
                                                Launch
                                            </>
                                        ) : (
                                            <>
                                                <Icon name="download" size={16} />
                                                Install
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Projects Section */}
                <section className="projects-section">
                    <div className="section-header">
                        <h2 className="section-title">Projects</h2>
                        <button id="add-project-btn" className="add-project-btn" onClick={handleAddProject}>
                            <Icon name="add" />
                            <span>Add Project</span>
                        </button>
                        <button className="add-project-btn secondary" onClick={handleAddMasterDirectory} style={{ marginLeft: '10px' }}>
                            <Icon name="folder" />
                            <span>Add Master Dir</span>
                        </button>
                    </div>
                    <div className="project-toolbar">
                        <div className="search-input">
                            <span aria-hidden="true" className="search-icon">
                                <Icon name="search" />
                            </span>
                            <input
                                id="project-search"
                                type="text"
                                placeholder="Search projects by name or path (Cmd/Ctrl + P)"
                                value={projectSearchTerm}
                                onChange={(e) => setProjectSearchTerm(e.target.value)}
                            />
                            <span className="shortcut-hint">⌘/Ctrl + P</span>
                        </div>
                    </div>

                    {/* Recent Projects */}
                    <div>
                        <h3 className="section-subtitle">Recent</h3>
                        <div id="recent-projects" className="projects-grid recent-grid">
                            {recentProjects.length === 0 ? (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '12px' }}>
                                    Launch some projects to see recent items here.
                                </div>
                            ) : (
                                recentProjects.map(project => (
                                    <div
                                        key={project.id}
                                        className="project-card compact"
                                        onClick={() => handleLaunchProject(project)}
                                    >
                                        <div className="project-info">
                                            <div className="project-icon">{getProjectIcon(project.preferredIDE)}</div>
                                            <div className="project-details">
                                                <div className="project-name">{project.name}</div>
                                                <div className="project-path" title={project.path}>{project.path}</div>
                                                <div className="project-ide" style={{ fontSize: '11px', color: 'var(--accent-primary)', marginTop: '2px' }} onClick={(e) => e.stopPropagation()}>
                                                    <select
                                                        value={project.preferredIDE}
                                                        onChange={(e) => handleUpdateProjectIDE(e, project.id)}
                                                        className="project-ide-select"
                                                        title="Change preferred IDE"
                                                    >
                                                        {ides.filter(i => i.installed).map(ide => (
                                                            <option key={ide.name} value={ide.name}>
                                                                {ide.name}
                                                            </option>
                                                        ))}
                                                        {!ides.some(i => i.installed && i.name === project.preferredIDE) && (
                                                            <option value={project.preferredIDE} disabled>
                                                                {project.preferredIDE}
                                                            </option>
                                                        )}
                                                    </select>
                                                </div>
                                                <div className="project-meta">
                                                    Last opened {project.lastOpened ? new Date(project.lastOpened).toLocaleString() : ''}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="project-actions">
                                            <button
                                                className="project-action-btn launch"
                                                title={`Open in ${project.preferredIDE}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLaunchProject(project);
                                                }}
                                            >
                                                <Icon name="launch" size={16} />
                                            </button>
                                            <button
                                                className="project-action-btn delete"
                                                title="Remove Project"
                                                onClick={(e) => handleDeleteProject(e, project.id, project.name)}
                                            >
                                                <Icon name="delete" size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* All Projects */}
                    <div style={{ marginTop: 'var(--spacing-md)' }}>
                        <h3 className="section-subtitle">All Projects</h3>
                        <div id="projects-grid" className="projects-grid">
                            {filteredProjects.length === 0 ? (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                                    {projects.length === 0 ? 'No projects added yet. Click "Add Project" to get started.' : 'No projects found.'}
                                </div>
                            ) : (
                                filteredProjects.map(project => (
                                    <div
                                        key={project.id}
                                        className="project-card"
                                        onClick={() => handleLaunchProject(project)}
                                    >
                                        <div className="project-info">
                                            <div className="project-icon">{getProjectIcon(project.preferredIDE)}</div>
                                            <div className="project-details">
                                                <div className="project-name">{project.name}</div>
                                                <div className="project-path" title={project.path}>{project.path}</div>
                                                <div className="project-ide" style={{ fontSize: '11px', color: 'var(--accent-primary)', marginTop: '2px' }} onClick={(e) => e.stopPropagation()}>
                                                    <select
                                                        value={project.preferredIDE}
                                                        onChange={(e) => handleUpdateProjectIDE(e, project.id)}
                                                        className="project-ide-select"
                                                        title="Change preferred IDE"
                                                    >
                                                        {ides.filter(i => i.installed).map(ide => (
                                                            <option key={ide.name} value={ide.name}>
                                                                {ide.name}
                                                            </option>
                                                        ))}
                                                        {!ides.some(i => i.installed && i.name === project.preferredIDE) && (
                                                            <option value={project.preferredIDE} disabled>
                                                                {project.preferredIDE}
                                                            </option>
                                                        )}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="project-actions">
                                            <button
                                                className="project-action-btn launch"
                                                title={`Open in ${project.preferredIDE}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLaunchProject(project);
                                                }}
                                            >
                                                <Icon name="launch" size={16} />
                                            </button>
                                            <button
                                                className="project-action-btn delete"
                                                title="Remove Project"
                                                onClick={(e) => handleDeleteProject(e, project.id, project.name)}
                                            >
                                                <Icon name="delete" size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* Scan Projects Modal */}
            <Modal
                isOpen={isProjectScanModalOpen}
                onClose={() => setIsProjectScanModalOpen(false)}
                title={`Add ${foundProjects.length} Projects?`}
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => setIsProjectScanModalOpen(false)}>Cancel</button>
                        <button className="btn-primary" onClick={confirmAddProjects}>Import All</button>
                    </>
                }
            >
                <div>
                    <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                        Are you sure you want to add the following projects to DevSynq?
                    </p>
                    <div style={{
                        maxHeight: '300px',
                        overflowY: 'auto',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-card-secondary)'
                    }}>
                        {foundProjects.map(project => (
                            <div key={project.path} style={{
                                padding: '8px 12px',
                                borderBottom: '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <Icon name="folder" size={16} color="var(--text-muted)" />
                                <div>
                                    <div style={{ fontWeight: 500 }}>{project.name}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{project.path}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>

            {/* Footer */}
            <footer className="footer">
                <p>DevSynq v1.0.0 · Built with Electron + React + TypeScript</p>
            </footer>

            {/* Toast */}
            {
                toastMessage && (
                    <div className="toast show">
                        {toastMessage}
                    </div>
                )
            }
        </div >
    );
};

export default App;
