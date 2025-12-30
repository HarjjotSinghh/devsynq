/**
 * Rules Library Component
 * 
 * Manage and apply .cursorrules templates
 */

import React, { useState, useEffect, useCallback } from 'react';
import './RulesLibrary.css';

interface RuleTemplate {
    id: string;
    name: string;
    description: string;
    content: string;
    tags: string[];
    createdAt: number;
    updatedAt: number;
}

interface RulesLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onToast: (message: string) => void;
    projectPath?: string;
}

export const RulesLibrary: React.FC<RulesLibraryProps> = ({
    isOpen,
    onClose,
    onToast,
    projectPath,
}) => {
    const [templates, setTemplates] = useState<RuleTemplate[]>([]);
    const [builtInTemplates, setBuiltInTemplates] = useState<RuleTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<RuleTemplate | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', description: '', content: '', tags: '' });
    const [projectRules, setProjectRules] = useState<{ fileName: string; content: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'library' | 'create'>('library');

    const loadData = useCallback(async () => {
        try {
            const [userTemplates, builtin, rulesInfo] = await Promise.all([
                window.electronAPI.getRulesTemplates(),
                window.electronAPI.getBuiltInTemplates(),
                projectPath ? window.electronAPI.getProjectRulesInfo(projectPath) : null,
            ]);
            setTemplates(userTemplates);
            setBuiltInTemplates(builtin);
            setProjectRules(rulesInfo);
        } catch (error) {
            console.error('Failed to load templates:', error);
        }
        setIsLoading(false);
    }, [projectPath]);

    useEffect(() => {
        if (isOpen) {
            loadData();
        }
    }, [isOpen, loadData]);

    const handleSaveTemplate = async () => {
        if (!editForm.name.trim() || !editForm.content.trim()) {
            onToast('Name and content are required');
            return;
        }

        try {
            const template = {
                name: editForm.name,
                description: editForm.description,
                content: editForm.content,
                tags: editForm.tags.split(',').map(t => t.trim()).filter(t => t),
            };

            if (selectedTemplate && !selectedTemplate.id.startsWith('builtin-')) {
                await window.electronAPI.updateRulesTemplate(selectedTemplate.id, template);
                onToast('Template updated');
            } else {
                await window.electronAPI.saveRulesTemplate(template);
                onToast('Template saved');
            }

            await loadData();
            setIsEditing(false);
            setSelectedTemplate(null);
            setActiveTab('library');
        } catch (error) {
            onToast('Failed to save template');
        }
    };

    const handleDeleteTemplate = async (id: string) => {
        if (!confirm('Delete this template?')) return;

        try {
            await window.electronAPI.deleteRulesTemplate(id);
            onToast('Template deleted');
            await loadData();
            if (selectedTemplate?.id === id) {
                setSelectedTemplate(null);
            }
        } catch (error) {
            onToast('Failed to delete template');
        }
    };

    const handleApplyTemplate = async (template: RuleTemplate) => {
        if (!projectPath) {
            onToast('Select a project to apply rules');
            return;
        }

        try {
            const result = await window.electronAPI.applyRulesTemplate(template.id, projectPath);
            if (result.success) {
                onToast(`Applied "${template.name}" to project`);
                await loadData();
            } else {
                onToast(result.error || 'Failed to apply template');
            }
        } catch (error) {
            onToast('Failed to apply template');
        }
    };

    const handleExtractFromProject = async () => {
        if (!projectPath || !projectRules) {
            onToast('No rules found in project');
            return;
        }

        setEditForm({
            name: `Rules from ${projectPath.split(/[/\\]/).pop() || 'Project'}`,
            description: `Extracted from ${projectRules.fileName}`,
            content: projectRules.content,
            tags: 'extracted',
        });
        setActiveTab('create');
        setIsEditing(true);
    };

    const startEdit = (template: RuleTemplate | null) => {
        if (template) {
            setEditForm({
                name: template.name,
                description: template.description,
                content: template.content,
                tags: template.tags.join(', '),
            });
        } else {
            setEditForm({ name: '', description: '', content: '', tags: '' });
        }
        setSelectedTemplate(template);
        setIsEditing(true);
        setActiveTab('create');
    };

    if (!isOpen) return null;

    return (
        <div className="rules-overlay" onClick={onClose}>
            <div className="rules-modal" onClick={(e) => e.stopPropagation()}>
                <div className="rules-header">
                    <h2>📋 Rules Template Library</h2>
                    <p className="rules-subtitle">
                        Manage your .cursorrules and AI rules templates
                    </p>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="rules-tabs">
                    <button
                        className={`tab ${activeTab === 'library' ? 'active' : ''}`}
                        onClick={() => setActiveTab('library')}
                    >
                        📚 Library
                    </button>
                    <button
                        className={`tab ${activeTab === 'create' ? 'active' : ''}`}
                        onClick={() => startEdit(null)}
                    >
                        ✏️ Create New
                    </button>
                    {projectRules && (
                        <button className="extract-btn" onClick={handleExtractFromProject}>
                            📥 Extract from Project
                        </button>
                    )}
                </div>

                <div className="rules-content">
                    {isLoading ? (
                        <div className="loading">Loading templates...</div>
                    ) : activeTab === 'library' ? (
                        <div className="templates-grid">
                            {/* Built-in templates */}
                            {builtInTemplates.map((template) => (
                                <div key={template.id} className="template-card builtin">
                                    <div className="template-badge">Built-in</div>
                                    <h3>{template.name}</h3>
                                    <p>{template.description}</p>
                                    <div className="template-tags">
                                        {template.tags.map(tag => (
                                            <span key={tag} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                    <div className="template-actions">
                                        <button
                                            className="action-btn preview"
                                            onClick={() => setSelectedTemplate(template)}
                                        >
                                            👁️ Preview
                                        </button>
                                        {projectPath && (
                                            <button
                                                className="action-btn apply"
                                                onClick={() => handleApplyTemplate(template)}
                                            >
                                                ✅ Apply
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* User templates */}
                            {templates.map((template) => (
                                <div key={template.id} className="template-card">
                                    <h3>{template.name}</h3>
                                    <p>{template.description}</p>
                                    <div className="template-tags">
                                        {template.tags.map(tag => (
                                            <span key={tag} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                    <div className="template-actions">
                                        <button
                                            className="action-btn preview"
                                            onClick={() => setSelectedTemplate(template)}
                                        >
                                            👁️ Preview
                                        </button>
                                        <button
                                            className="action-btn edit"
                                            onClick={() => startEdit(template)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        {projectPath && (
                                            <button
                                                className="action-btn apply"
                                                onClick={() => handleApplyTemplate(template)}
                                            >
                                                ✅ Apply
                                            </button>
                                        )}
                                        <button
                                            className="action-btn delete"
                                            onClick={() => handleDeleteTemplate(template.id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {templates.length === 0 && builtInTemplates.length === 0 && (
                                <div className="empty-state">
                                    <p>No templates yet</p>
                                    <button onClick={() => startEdit(null)}>Create your first template</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="create-form">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    placeholder="Template name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    placeholder="Brief description"
                                />
                            </div>
                            <div className="form-group">
                                <label>Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    value={editForm.tags}
                                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                                    placeholder="clean-code, typescript, testing"
                                />
                            </div>
                            <div className="form-group full">
                                <label>Content</label>
                                <textarea
                                    value={editForm.content}
                                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                    placeholder="# Your Rules Here&#10;&#10;Write your AI coding rules..."
                                    rows={12}
                                />
                            </div>
                            <div className="form-actions">
                                <button className="cancel-btn" onClick={() => setActiveTab('library')}>
                                    Cancel
                                </button>
                                <button className="save-btn" onClick={handleSaveTemplate}>
                                    Save Template
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Preview Panel */}
                    {selectedTemplate && !isEditing && (
                        <div className="preview-panel">
                            <div className="preview-header">
                                <h3>{selectedTemplate.name}</h3>
                                <button onClick={() => setSelectedTemplate(null)}>×</button>
                            </div>
                            <pre className="preview-content">{selectedTemplate.content}</pre>
                        </div>
                    )}
                </div>

                {/* Current Project Rules Info */}
                {projectRules && (
                    <div className="project-rules-info">
                        <span className="info-icon">ℹ️</span>
                        <span>Current project has <strong>{projectRules.fileName}</strong></span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RulesLibrary;
