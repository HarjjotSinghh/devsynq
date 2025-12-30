import React, { useState, useEffect } from 'react';
import { ProjectGroup, Project } from '../../types';
import { Icon } from './Icons';
import './ProjectGroupManager.css';

interface ProjectGroupManagerProps {
    isOpen: boolean;
    onClose: () => void;
    projects: Project[];
    onProjectsUpdated: () => void;
    onToast: (message: React.ReactNode) => void;
}

const DEFAULT_COLORS = [
    '#5de9b6', // Primary accent
    '#ef4444', // Red
    '#f59e0b', // Orange
    '#a855f7', // Purple
    '#3b82f6', // Blue
    '#ec4899', // Pink
    '#14b8a6', // Teal
    '#84cc16', // Lime
];

const ProjectGroupManager: React.FC<ProjectGroupManagerProps> = ({
    isOpen,
    onClose,
    projects,
    onProjectsUpdated,
    onToast,
}) => {
    const [groups, setGroups] = useState<ProjectGroup[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingGroup, setEditingGroup] = useState<ProjectGroup | null>(null);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupColor, setNewGroupColor] = useState(DEFAULT_COLORS[0]);
    const [newGroupIcon, setNewGroupIcon] = useState('📁');
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadGroups();
        }
    }, [isOpen]);

    const loadGroups = async () => {
        try {
            const loadedGroups = await window.electronAPI.getProjectGroups();
            setGroups(loadedGroups);
        } catch (error) {
            console.error('Failed to load groups:', error);
        }
    };

    const handleCreateGroup = async () => {
        if (!newGroupName.trim()) {
            onToast('Please enter a group name');
            return;
        }

        try {
            const newGroup = await window.electronAPI.createProjectGroup({
                name: newGroupName.trim(),
                color: newGroupColor || '#5de9b6',
                icon: newGroupIcon || '📁',
            });
            setGroups([...groups, newGroup]);
            setNewGroupName('');
            setNewGroupColor(DEFAULT_COLORS[0]);
            setNewGroupIcon('📁');
            setIsCreating(false);
            onToast(<><Icon name="checkCircle" size={16} /> Group "{newGroup.name}" created!</>);
        } catch (error) {
            console.error('Failed to create group:', error);
            onToast('Failed to create group');
        }
    };

    const handleUpdateGroup = async () => {
        if (!editingGroup) return;

        try {
            await window.electronAPI.updateProjectGroup(editingGroup);
            setGroups(groups.map(g => g.id === editingGroup.id ? editingGroup : g));
            setEditingGroup(null);
            onToast(<><Icon name="checkCircle" size={16} /> Group updated!</>);
        } catch (error) {
            console.error('Failed to update group:', error);
            onToast('Failed to update group');
        }
    };

    const handleDeleteGroup = async (groupId: string) => {
        const group = groups.find(g => g.id === groupId);
        if (!window.confirm(`Delete group "${group?.name}"? Projects will be unassigned.`)) {
            return;
        }

        try {
            await window.electronAPI.deleteProjectGroup(groupId);
            setGroups(groups.filter(g => g.id !== groupId));
            onProjectsUpdated();
            onToast(<><Icon name="checkCircle" size={16} /> Group deleted!</>);
        } catch (error) {
            console.error('Failed to delete group:', error);
            onToast('Failed to delete group');
        }
    };

    const handleAssignProject = async (projectId: string, groupId: string | null) => {
        try {
            await window.electronAPI.assignProjectToGroup(projectId, groupId);
            onProjectsUpdated();
            onToast(<><Icon name="checkCircle" size={16} /> Project assignment updated!</>);
        } catch (error) {
            console.error('Failed to assign project:', error);
            onToast('Failed to assign project');
        }
    };

    const getProjectsInGroup = (groupId: string | null) => {
        return projects.filter(p => (p.group || null) === groupId);
    };

    if (!isOpen) return null;

    return (
        <div className="group-manager-overlay" onClick={onClose}>
            <div className="group-manager-modal" onClick={e => e.stopPropagation()}>
                <div className="group-manager-header">
                    <h2>
                        <Icon name="folder" size={20} />
                        Project Groups
                    </h2>
                    <button className="close-btn" onClick={onClose}>
                        <Icon name="close" size={18} />
                    </button>
                </div>

                <div className="group-manager-content">
                    {/* Groups List */}
                    <div className="groups-section">
                        <div className="section-header">
                            <h3>Groups</h3>
                            {!isCreating && (
                                <button
                                    className="add-group-btn"
                                    onClick={() => setIsCreating(true)}
                                >
                                    <Icon name="add" size={14} />
                                    New Group
                                </button>
                            )}
                        </div>

                        {/* Create New Group Form */}
                        {isCreating && (
                            <div className="create-group-form">
                                <div className="form-row">
                                    <input
                                        type="text"
                                        placeholder="Group name..."
                                        value={newGroupName}
                                        onChange={e => setNewGroupName(e.target.value)}
                                        autoFocus
                                    />
                                    <input
                                        type="text"
                                        placeholder="📁"
                                        value={newGroupIcon}
                                        onChange={e => setNewGroupIcon(e.target.value)}
                                        maxLength={2}
                                        className="icon-input"
                                        title="Emoji icon"
                                    />
                                </div>
                                <div className="color-picker">
                                    {DEFAULT_COLORS.map(color => (
                                        <button
                                            key={color}
                                            className={`color-option ${newGroupColor === color ? 'selected' : ''}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setNewGroupColor(color)}
                                        />
                                    ))}
                                </div>
                                <div className="form-actions">
                                    <button className="btn-secondary" onClick={() => setIsCreating(false)}>
                                        Cancel
                                    </button>
                                    <button className="btn-primary" onClick={handleCreateGroup}>
                                        Create
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Groups List */}
                        <div className="groups-list">
                            {/* Ungrouped */}
                            <div
                                className={`group-item ${selectedGroupId === null ? 'selected' : ''}`}
                                onClick={() => setSelectedGroupId(null)}
                            >
                                <div className="group-info">
                                    <span className="group-icon">📂</span>
                                    <span className="group-name">Ungrouped</span>
                                    <span className="group-count">{getProjectsInGroup(null).length}</span>
                                </div>
                            </div>

                            {groups.map(group => (
                                <div
                                    key={group.id}
                                    className={`group-item ${selectedGroupId === group.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedGroupId(group.id)}
                                >
                                    {editingGroup?.id === group.id ? (
                                        <div className="group-edit-form">
                                            <input
                                                type="text"
                                                value={editingGroup.name}
                                                onChange={e => setEditingGroup({ ...editingGroup, name: e.target.value })}
                                                onClick={e => e.stopPropagation()}
                                            />
                                            <div className="color-picker inline">
                                                {DEFAULT_COLORS.map(color => (
                                                    <button
                                                        key={color}
                                                        className={`color-option small ${editingGroup.color === color ? 'selected' : ''}`}
                                                        style={{ backgroundColor: color }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingGroup({ ...editingGroup, color });
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <div className="edit-actions">
                                                <button
                                                    className="icon-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingGroup(null);
                                                    }}
                                                >
                                                    <Icon name="close" size={14} />
                                                </button>
                                                <button
                                                    className="icon-btn save"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUpdateGroup();
                                                    }}
                                                >
                                                    <Icon name="checkCircle" size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="group-info">
                                                <span
                                                    className="group-color-dot"
                                                    style={{ backgroundColor: group.color }}
                                                />
                                                <span className="group-icon">{group.icon || '📁'}</span>
                                                <span className="group-name">{group.name}</span>
                                                <span className="group-count">{getProjectsInGroup(group.id).length}</span>
                                            </div>
                                            <div className="group-actions">
                                                <button
                                                    className="icon-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingGroup(group);
                                                    }}
                                                    title="Edit group"
                                                >
                                                    <Icon name="settings" size={14} />
                                                </button>
                                                <button
                                                    className="icon-btn delete"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteGroup(group.id);
                                                    }}
                                                    title="Delete group"
                                                >
                                                    <Icon name="delete" size={14} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Projects in Selected Group */}
                    <div className="projects-in-group-section">
                        <h3>
                            {selectedGroupId === null
                                ? 'Ungrouped Projects'
                                : `Projects in "${groups.find(g => g.id === selectedGroupId)?.name}"`
                            }
                        </h3>
                        <div className="projects-list">
                            {getProjectsInGroup(selectedGroupId).length === 0 ? (
                                <div className="empty-state">
                                    No projects in this group
                                </div>
                            ) : (
                                getProjectsInGroup(selectedGroupId).map(project => (
                                    <div key={project.id} className="project-item">
                                        <div className="project-info">
                                            <span className="project-name">{project.name}</span>
                                            <span className="project-path">{project.path}</span>
                                        </div>
                                        <select
                                            value={project.group || ''}
                                            onChange={e => handleAssignProject(project.id, e.target.value || null)}
                                            className="group-select"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <option value="">Ungrouped</option>
                                            {groups.map(g => (
                                                <option key={g.id} value={g.id}>{g.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectGroupManager;
