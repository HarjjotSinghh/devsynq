import React, { useEffect, useState, useRef, useCallback } from 'react';
import { IDE, Project, RunningIDE } from '../../types';
import './CommandPalette.css';

interface CommandItem {
    id: string;
    type: 'project' | 'ide' | 'running' | 'action';
    title: string;
    subtitle?: string;
    icon: string;
    color?: string;
    action: () => void;
    shortcut?: string;
    keywords?: string[];
}

function CommandPalette() {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [items, setItems] = useState<CommandItem[]>([]);
    const [allItems, setAllItems] = useState<CommandItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Load data on mount
    useEffect(() => {
        loadData();
        inputRef.current?.focus();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await window.electronAPI.getCommandPaletteData();
            const commandItems: CommandItem[] = [];

            // Add running IDEs at the top
            data.runningIDEs.forEach((ide: RunningIDE) => {
                commandItems.push({
                    id: `running-${ide.pid}`,
                    type: 'running',
                    title: ide.name,
                    subtitle: `Running • ${ide.memoryUsage ?? 0} MB`,
                    icon: ide.icon,
                    color: ide.color,
                    keywords: ['running', 'focus', 'switch'],
                    action: async () => {
                        await window.electronAPI.focusIDE(ide.pid);
                        window.electronAPI.hideCommandPalette();
                    },
                });
            });

            // Add projects
            data.projects.forEach((project: Project) => {
                const ide = data.ides.find((i: IDE) => i.name === project.preferredIDE);
                commandItems.push({
                    id: `project-${project.id}`,
                    type: 'project',
                    title: project.name,
                    subtitle: project.path,
                    icon: ide?.icon ?? '📁',
                    color: ide?.color,
                    keywords: ['project', 'open', 'folder', project.preferredIDE.toLowerCase()],
                    action: async () => {
                        await window.electronAPI.launchIDE(project.preferredIDE, project.path);
                        window.electronAPI.hideCommandPalette();
                    },
                });
            });

            // Add installed IDEs
            data.ides.forEach((ide: IDE) => {
                commandItems.push({
                    id: `ide-${ide.name}`,
                    type: 'ide',
                    title: `Launch ${ide.name}`,
                    subtitle: 'Open IDE',
                    icon: ide.icon,
                    color: ide.color,
                    keywords: ['launch', 'open', 'start', ide.name.toLowerCase()],
                    action: async () => {
                        await window.electronAPI.launchIDE(ide.name);
                        window.electronAPI.hideCommandPalette();
                    },
                });
            });

            // Add actions
            commandItems.push({
                id: 'action-add-project',
                type: 'action',
                title: 'Add Project',
                subtitle: 'Add a new project folder',
                icon: '➕',
                keywords: ['add', 'new', 'project', 'folder'],
                action: async () => {
                    await window.electronAPI.addProject();
                    window.electronAPI.hideCommandPalette();
                },
            });

            commandItems.push({
                id: 'action-sync-mcp',
                type: 'action',
                title: 'Sync MCP Configs',
                subtitle: 'Sync to all enabled IDEs',
                icon: '🔄',
                keywords: ['sync', 'mcp', 'config', 'settings'],
                action: async () => {
                    await window.electronAPI.syncMCPConfigs();
                    window.electronAPI.hideCommandPalette();
                },
            });

            commandItems.push({
                id: 'action-sync-api-keys',
                type: 'action',
                title: 'Sync API Keys',
                subtitle: 'Sync API keys to all IDEs',
                icon: '🔑',
                keywords: ['sync', 'api', 'keys', 'settings'],
                action: async () => {
                    await window.electronAPI.syncAPIKeysToAll();
                    window.electronAPI.hideCommandPalette();
                },
            });

            if (data.runningIDEs.length > 0) {
                commandItems.push({
                    id: 'action-kill-all',
                    type: 'action',
                    title: 'Kill All IDEs',
                    subtitle: `Stop ${data.runningIDEs.length} running IDE(s)`,
                    icon: '⚠️',
                    keywords: ['kill', 'stop', 'quit', 'close', 'all'],
                    action: async () => {
                        await window.electronAPI.killAllIDEs();
                        window.electronAPI.hideCommandPalette();
                    },
                });
            }

            setAllItems(commandItems);
            setItems(commandItems);
        } catch (error) {
            console.error('Failed to load data:', error);
        }
        setIsLoading(false);
    };

    // Fuzzy search function
    const fuzzyMatch = useCallback((text: string, pattern: string): boolean => {
        pattern = pattern.toLowerCase();
        text = text.toLowerCase();

        // Simple contains check for now
        if (text.includes(pattern)) return true;

        // Check for match at word boundaries
        const words = text.split(/\s+/);
        return words.some(word => word.startsWith(pattern));
    }, []);

    // Filter items based on query
    useEffect(() => {
        if (!query.trim()) {
            setItems(allItems);
            setSelectedIndex(0);
            return;
        }

        const filtered = allItems.filter(item => {
            if (fuzzyMatch(item.title, query)) return true;
            if (item.subtitle && fuzzyMatch(item.subtitle, query)) return true;
            if (item.keywords?.some(kw => fuzzyMatch(kw, query))) return true;
            return false;
        });

        setItems(filtered);
        setSelectedIndex(0);
    }, [query, allItems, fuzzyMatch]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(prev => Math.max(prev - 1, 0));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (items[selectedIndex]) {
                        items[selectedIndex].action();
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    window.electronAPI.hideCommandPalette();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [items, selectedIndex]);

    // Scroll selected item into view
    useEffect(() => {
        const selected = listRef.current?.querySelector('.command-item.selected');
        selected?.scrollIntoView({ block: 'nearest' });
    }, [selectedIndex]);

    const getTypeLabel = (type: CommandItem['type']) => {
        switch (type) {
            case 'running': return 'RUNNING';
            case 'project': return 'PROJECT';
            case 'ide': return 'IDE';
            case 'action': return 'ACTION';
        }
    };

    const getTypeClass = (type: CommandItem['type']) => {
        switch (type) {
            case 'running': return 'type-running';
            case 'project': return 'type-project';
            case 'ide': return 'type-ide';
            case 'action': return 'type-action';
        }
    };

    return (
        <div className="command-palette">
            <div className="command-palette-container">
                <div className="command-search">
                    <span className="search-icon">🔍</span>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search projects, IDEs, actions..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="search-input"
                        spellCheck={false}
                        autoComplete="off"
                    />
                    <div className="search-shortcut">
                        <kbd>↑</kbd>
                        <kbd>↓</kbd>
                        <span>navigate</span>
                        <kbd>↵</kbd>
                        <span>select</span>
                        <kbd>esc</kbd>
                        <span>close</span>
                    </div>
                </div>

                <div className="command-list" ref={listRef}>
                    {isLoading ? (
                        <div className="command-loading">
                            <div className="loading-spinner"></div>
                            <span>Loading...</span>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="command-empty">
                            <span className="empty-icon">🔎</span>
                            <span>No results found</span>
                        </div>
                    ) : (
                        items.map((item, index) => (
                            <div
                                key={item.id}
                                className={`command-item ${index === selectedIndex ? 'selected' : ''}`}
                                onClick={() => item.action()}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <div
                                    className="item-icon"
                                    style={item.color ? { backgroundColor: `${item.color}20` } : undefined}
                                >
                                    {item.icon}
                                </div>
                                <div className="item-content">
                                    <div className="item-title">{item.title}</div>
                                    {item.subtitle && (
                                        <div className="item-subtitle">{item.subtitle}</div>
                                    )}
                                </div>
                                <div className={`item-type ${getTypeClass(item.type)}`}>
                                    {getTypeLabel(item.type)}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="command-footer">
                    <span className="footer-tip">
                        💡 Press <kbd>Alt+Shift+Space</kbd> anywhere to open
                    </span>
                </div>
            </div>
        </div>
    );
}

export default CommandPalette;
