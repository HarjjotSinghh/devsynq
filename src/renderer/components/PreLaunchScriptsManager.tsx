/**
 * PreLaunchScriptsManager Component
 * 
 * Allows users to manage pre-launch scripts for a project
 */

import React, { useState, useEffect } from 'react';
import './PreLaunchScriptsManager.css';

interface PreLaunchScript {
    id: string;
    name: string;
    command: string;
    args?: string[];
    cwd?: string;
    runInBackground?: boolean;
    waitForCompletion?: boolean;
    enabled: boolean;
}

interface PreLaunchScriptsManagerProps {
    projectId: string;
    projectPath: string;
    isOpen: boolean;
    onClose: () => void;
    onToast: (message: string) => void;
}

export const PreLaunchScriptsManager: React.FC<PreLaunchScriptsManagerProps> = ({
    projectId,
    projectPath,
    isOpen,
    onClose,
    onToast,
}) => {
    const [scripts, setScripts] = useState<PreLaunchScript[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [runningScript, setRunningScript] = useState<string | null>(null);
    const [scriptOutput, setScriptOutput] = useState<{ id: string; output: string; error: string } | null>(null);

    // Form state
    const [formName, setFormName] = useState('');
    const [formCommand, setFormCommand] = useState('');
    const [formArgs, setFormArgs] = useState('');
    const [formCwd, setFormCwd] = useState('');
    const [formRunInBackground, setFormRunInBackground] = useState(false);
    const [formWaitForCompletion, setFormWaitForCompletion] = useState(true);
    const [formEnabled, setFormEnabled] = useState(true);

    useEffect(() => {
        if (isOpen) {
            loadScripts();
        }
    }, [isOpen, projectId]);

    const loadScripts = async () => {
        setIsLoading(true);
        try {
            const loadedScripts = await window.electronAPI.getPreLaunchScripts(projectId);
            setScripts(loadedScripts);
        } catch (error) {
            console.error('Failed to load scripts:', error);
        }
        setIsLoading(false);
    };

    const resetForm = () => {
        setFormName('');
        setFormCommand('');
        setFormArgs('');
        setFormCwd('');
        setFormRunInBackground(false);
        setFormWaitForCompletion(true);
        setFormEnabled(true);
    };

    const handleCreate = () => {
        setIsCreating(true);
        setIsEditing(null);
        resetForm();
    };

    const handleEdit = (script: PreLaunchScript) => {
        setIsEditing(script.id);
        setIsCreating(false);
        setFormName(script.name);
        setFormCommand(script.command);
        setFormArgs(script.args?.join(' ') || '');
        setFormCwd(script.cwd || '');
        setFormRunInBackground(script.runInBackground || false);
        setFormWaitForCompletion(script.waitForCompletion !== false);
        setFormEnabled(script.enabled);
    };

    const handleCancel = () => {
        setIsCreating(false);
        setIsEditing(null);
        resetForm();
    };

    const handleSave = async () => {
        if (!formName.trim() || !formCommand.trim()) {
            onToast('Name and command are required');
            return;
        }

        const scriptData = {
            name: formName.trim(),
            command: formCommand.trim(),
            args: formArgs.trim() ? formArgs.trim().split(' ') : undefined,
            cwd: formCwd.trim() || undefined,
            runInBackground: formRunInBackground,
            waitForCompletion: formWaitForCompletion,
            enabled: formEnabled,
        };

        try {
            if (isCreating) {
                const newScript = await window.electronAPI.addPreLaunchScript(projectId, scriptData);
                if (newScript) {
                    setScripts([...scripts, newScript]);
                    onToast('Script added');
                }
            } else if (isEditing) {
                const updatedScript = await window.electronAPI.updatePreLaunchScript(projectId, {
                    id: isEditing,
                    ...scriptData,
                });
                if (updatedScript) {
                    setScripts(scripts.map(s => s.id === isEditing ? updatedScript : s));
                    onToast('Script updated');
                }
            }
            handleCancel();
        } catch (error) {
            console.error('Failed to save script:', error);
            onToast('Failed to save script');
        }
    };

    const handleDelete = async (scriptId: string) => {
        try {
            await window.electronAPI.deletePreLaunchScript(projectId, scriptId);
            setScripts(scripts.filter(s => s.id !== scriptId));
            onToast('Script deleted');
        } catch (error) {
            console.error('Failed to delete script:', error);
            onToast('Failed to delete script');
        }
    };

    const handleToggle = async (scriptId: string, enabled: boolean) => {
        try {
            const updated = await window.electronAPI.togglePreLaunchScript(projectId, scriptId, enabled);
            if (updated) {
                setScripts(scripts.map(s => s.id === scriptId ? updated : s));
            }
        } catch (error) {
            console.error('Failed to toggle script:', error);
        }
    };

    const handleRun = async (scriptId: string) => {
        setRunningScript(scriptId);
        setScriptOutput(null);
        try {
            const result = await window.electronAPI.runPreLaunchScript(projectId, scriptId);
            setScriptOutput({
                id: scriptId,
                output: result.output || '',
                error: result.error || '',
            });
            if (result.success) {
                onToast('Script executed successfully');
            } else {
                onToast('Script failed');
            }
        } catch (error) {
            console.error('Failed to run script:', error);
            onToast('Failed to run script');
        }
        setRunningScript(null);
    };

    if (!isOpen) return null;

    return (
        <div className="pre-launch-scripts-overlay" onClick={onClose}>
            <div className="pre-launch-scripts-modal" onClick={(e) => e.stopPropagation()}>
                <div className="pre-launch-scripts-header">
                    <h2>⚡ Pre-Launch Scripts</h2>
                    <p className="pre-launch-scripts-subtitle">
                        Scripts that run before launching the IDE
                    </p>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="pre-launch-scripts-content">
                    {isLoading ? (
                        <div className="loading-state">Loading scripts...</div>
                    ) : (
                        <>
                            {/* Script Form */}
                            {(isCreating || isEditing) && (
                                <div className="script-form">
                                    <h3>{isCreating ? 'Add New Script' : 'Edit Script'}</h3>

                                    <div className="form-row">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            value={formName}
                                            onChange={(e) => setFormName(e.target.value)}
                                            placeholder="e.g., Start Docker"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <label>Command</label>
                                        <input
                                            type="text"
                                            value={formCommand}
                                            onChange={(e) => setFormCommand(e.target.value)}
                                            placeholder="e.g., docker-compose up -d"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <label>Arguments (optional)</label>
                                        <input
                                            type="text"
                                            value={formArgs}
                                            onChange={(e) => setFormArgs(e.target.value)}
                                            placeholder="Space-separated arguments"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <label>Working Directory (optional)</label>
                                        <input
                                            type="text"
                                            value={formCwd}
                                            onChange={(e) => setFormCwd(e.target.value)}
                                            placeholder={projectPath}
                                        />
                                        <span className="form-hint">Defaults to project path</span>
                                    </div>

                                    <div className="form-row checkbox-row">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={formRunInBackground}
                                                onChange={(e) => setFormRunInBackground(e.target.checked)}
                                            />
                                            Run in background (detached)
                                        </label>
                                    </div>

                                    <div className="form-row checkbox-row">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={formWaitForCompletion}
                                                onChange={(e) => setFormWaitForCompletion(e.target.checked)}
                                                disabled={formRunInBackground}
                                            />
                                            Wait for completion before launching IDE
                                        </label>
                                    </div>

                                    <div className="form-row checkbox-row">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={formEnabled}
                                                onChange={(e) => setFormEnabled(e.target.checked)}
                                            />
                                            Enabled
                                        </label>
                                    </div>

                                    <div className="form-actions">
                                        <button className="btn-secondary" onClick={handleCancel}>
                                            Cancel
                                        </button>
                                        <button className="btn-primary" onClick={handleSave}>
                                            {isCreating ? 'Add Script' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Scripts List */}
                            {!isCreating && !isEditing && (
                                <>
                                    <div className="scripts-header">
                                        <button className="btn-primary" onClick={handleCreate}>
                                            + Add Script
                                        </button>
                                    </div>

                                    {scripts.length === 0 ? (
                                        <div className="empty-state">
                                            <p>No pre-launch scripts configured</p>
                                            <p className="hint">Add scripts to automate tasks before launching your IDE</p>
                                        </div>
                                    ) : (
                                        <div className="scripts-list">
                                            {scripts.map((script) => (
                                                <div
                                                    key={script.id}
                                                    className={`script-item ${!script.enabled ? 'disabled' : ''}`}
                                                >
                                                    <div className="script-toggle">
                                                        <input
                                                            type="checkbox"
                                                            checked={script.enabled}
                                                            onChange={(e) => handleToggle(script.id, e.target.checked)}
                                                        />
                                                    </div>
                                                    <div className="script-info">
                                                        <div className="script-name">{script.name}</div>
                                                        <div className="script-command">
                                                            <code>{script.command} {script.args?.join(' ')}</code>
                                                        </div>
                                                        <div className="script-flags">
                                                            {script.runInBackground && (
                                                                <span className="flag">🔄 Background</span>
                                                            )}
                                                            {script.waitForCompletion && !script.runInBackground && (
                                                                <span className="flag">⏳ Wait</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="script-actions">
                                                        <button
                                                            className="action-btn run"
                                                            onClick={() => handleRun(script.id)}
                                                            disabled={runningScript === script.id}
                                                            title="Run now"
                                                        >
                                                            {runningScript === script.id ? '⏳' : '▶️'}
                                                        </button>
                                                        <button
                                                            className="action-btn edit"
                                                            onClick={() => handleEdit(script)}
                                                            title="Edit"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            className="action-btn delete"
                                                            onClick={() => handleDelete(script.id)}
                                                            title="Delete"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Script Output */}
                                    {scriptOutput && (
                                        <div className="script-output">
                                            <h4>Output</h4>
                                            {scriptOutput.output && (
                                                <pre className="output-content">{scriptOutput.output}</pre>
                                            )}
                                            {scriptOutput.error && (
                                                <pre className="output-error">{scriptOutput.error}</pre>
                                            )}
                                            <button
                                                className="btn-secondary"
                                                onClick={() => setScriptOutput(null)}
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PreLaunchScriptsManager;
