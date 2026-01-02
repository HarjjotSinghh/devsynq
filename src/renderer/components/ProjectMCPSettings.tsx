import React, { useState, useEffect, useCallback } from 'react';
import { Project } from '../../types';
import './ProjectMCPSettings.css';
import { Icon } from './Icons';

interface Props {
    project: Project;
    onClose: () => void;
    onToast: (message: React.ReactNode) => void;
    onProjectUpdated: () => void;
}

interface MCPInfo {
    usesCustom: boolean;
    configPath: string;
    exists: boolean;
    serverCount: number;
    error?: string;
}

export const ProjectMCPSettings: React.FC<Props> = ({
    project,
    onClose,
    onToast,
    onProjectUpdated,
}) => {
    const [mcpInfo, setMcpInfo] = useState<MCPInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const loadMCPInfo = useCallback(async () => {
        try {
            setLoading(true);
            const info = await window.electronAPI.getProjectMcpInfo(project.id);
            setMcpInfo(info);
        } catch (error) {
            console.error('Failed to load MCP info:', error);
            onToast(<><Icon name="xCircle" size={14} color="var(--error)" /> Failed to load MCP config info</>);
        } finally {
            setLoading(false);
        }
    }, [project.id, onToast]);

    useEffect(() => {
        loadMCPInfo();
    }, [loadMCPInfo]);

    const handleUseCentralized = async () => {
        setActionLoading(true);
        try {
            const result = await window.electronAPI.clearProjectMcpConfig(project.id);
            if (result.success) {
                onToast(<><Icon name="checkCircle" size={14} color="var(--success)" /> Using centralized MCP config</>);
                onProjectUpdated();
                await loadMCPInfo();
            } else {
                onToast(<><Icon name="xCircle" size={14} color="var(--error)" /> {result.error}</>);
            }
        } catch (error: any) {
            onToast(<><Icon name="xCircle" size={14} color="var(--error)" /> {error.message}</>);
        } finally {
            setActionLoading(false);
        }
    };

    const handleBrowseConfig = async () => {
        setActionLoading(true);
        try {
            const result = await window.electronAPI.browseForMcpConfig();
            if (!result) {
                setActionLoading(false);
                return; // User cancelled
            }

            if (!result.valid) {
                onToast(<><Icon name="alert" size={14} color="var(--warning)" /> Invalid config: {result.error}</>);
                setActionLoading(false);
                return;
            }

            const setResult = await window.electronAPI.setProjectMcpConfig(project.id, result.path);
            if (setResult.success) {
                onToast(<><Icon name="checkCircle" size={14} color="var(--success)" /> Custom MCP config set</>);
                onProjectUpdated();
                await loadMCPInfo();
            } else {
                onToast(<><Icon name="xCircle" size={14} color="var(--error)" /> {setResult.error}</>);
            }
        } catch (error: any) {
            onToast(<><Icon name="xCircle" size={14} color="var(--error)" /> {error.message}</>);
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreateFromMaster = async () => {
        setActionLoading(true);
        try {
            const result = await window.electronAPI.createProjectMcpConfig(project.id);
            if (result.success) {
                onToast(<><Icon name="checkCircle" size={14} color="var(--success)" /> Created custom config from master</>);
                onProjectUpdated();
                await loadMCPInfo();
            } else {
                onToast(<><Icon name="xCircle" size={14} color="var(--error)" /> {result.error}</>);
            }
        } catch (error: any) {
            onToast(<><Icon name="xCircle" size={14} color="var(--error)" /> {error.message}</>);
        } finally {
            setActionLoading(false);
        }
    };

    const handleOpenConfig = async () => {
        try {
            const result = await window.electronAPI.openProjectMcpConfig(project.id);
            if (!result.success) {
                onToast(<><Icon name="xCircle" size={14} color="var(--error)" /> {result.error}</>);
            }
        } catch (error: any) {
            onToast(<><Icon name="xCircle" size={14} color="var(--error)" /> {error.message}</>);
        }
    };

    const handleOpenMasterConfig = async () => {
        try {
            await window.electronAPI.openMCPMasterConfig();
        } catch (error: any) {
            onToast(<><Icon name="xCircle" size={14} color="var(--error)" /> {error.message}</>);
        }
    };

    return (
        <div className="project-mcp-settings">
            <div className="project-mcp-header">
                <div className="header-info">
                    <h3><Icon name="settings" /> MCP Configuration</h3>
                    <p className="project-name">{project.name}</p>
                </div>
                <button className="close-btn" onClick={onClose} title="Close">
                    <Icon name="close" size={18} />
                </button>
            </div>

            {loading ? (
                <div className="project-mcp-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading configuration...</p>
                </div>
            ) : (
                <div className="project-mcp-content">
                    {/* Current Status */}
                    <div className="mcp-status-section">
                        <div className="status-indicator">
                            <div className={`status-badge ${mcpInfo?.usesCustom ? 'custom' : 'centralized'}`}>
                                <Icon name={mcpInfo?.usesCustom ? 'folder' : 'sync'} size={16} />
                                {mcpInfo?.usesCustom ? 'Custom Config' : 'Centralized Config'}
                            </div>
                            {mcpInfo && (
                                <span className="server-count">
                                    {mcpInfo.serverCount} MCP server{mcpInfo.serverCount !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                        {mcpInfo && (
                            <div className="config-path" title={mcpInfo.configPath}>
                                <Icon name="folder" size={14} />
                                <code>{mcpInfo.configPath}</code>
                                {!mcpInfo.exists && <span className="missing-badge">Missing</span>}
                            </div>
                        )}
                    </div>

                    {/* Mode Selection */}
                    <div className="mcp-mode-section">
                        <h4>Configuration Mode</h4>
                        
                        <div className="mode-options">
                            <div 
                                className={`mode-option ${!mcpInfo?.usesCustom ? 'selected' : ''}`}
                                onClick={!actionLoading && mcpInfo?.usesCustom ? handleUseCentralized : undefined}
                            >
                                <div className="mode-header">
                                    <Icon name="sync" size={20} />
                                    <span className="mode-title">Centralized</span>
                                    {!mcpInfo?.usesCustom && <Icon name="check" size={16} className="check-icon" />}
                                </div>
                                <p className="mode-description">
                                    Use the global master MCP configuration. Changes sync to all projects.
                                </p>
                                {!mcpInfo?.usesCustom && (
                                    <button 
                                        className="mode-action-btn"
                                        onClick={handleOpenMasterConfig}
                                    >
                                        <Icon name="launch" size={14} /> Edit Master Config
                                    </button>
                                )}
                            </div>

                            <div 
                                className={`mode-option ${mcpInfo?.usesCustom ? 'selected' : ''}`}
                            >
                                <div className="mode-header">
                                    <Icon name="folder" size={20} />
                                    <span className="mode-title">Custom</span>
                                    {mcpInfo?.usesCustom && <Icon name="check" size={16} className="check-icon" />}
                                </div>
                                <p className="mode-description">
                                    Use a project-specific MCP configuration file for this project only.
                                </p>
                                
                                <div className="custom-actions">
                                    {mcpInfo?.usesCustom ? (
                                        <>
                                            <button 
                                                className="mode-action-btn primary"
                                                onClick={handleOpenConfig}
                                                disabled={!mcpInfo.exists}
                                            >
                                                <Icon name="launch" size={14} /> Edit Config
                                            </button>
                                            <button 
                                                className="mode-action-btn"
                                                onClick={handleBrowseConfig}
                                                disabled={actionLoading}
                                            >
                                                <Icon name="folder" size={14} /> Change File
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button 
                                                className="mode-action-btn primary"
                                                onClick={handleCreateFromMaster}
                                                disabled={actionLoading}
                                            >
                                                <Icon name="add" size={14} /> Create from Master
                                            </button>
                                            <button 
                                                className="mode-action-btn"
                                                onClick={handleBrowseConfig}
                                                disabled={actionLoading}
                                            >
                                                <Icon name="folder" size={14} /> Select Existing
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className="mcp-info-note">
                        <Icon name="info" size={16} />
                        <p>
                            Custom MCP configs let you have specialized AI tool configurations for specific projects 
                            without affecting other projects or the global settings.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectMCPSettings;
