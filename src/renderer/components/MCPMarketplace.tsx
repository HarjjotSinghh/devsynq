/**
 * MCP Marketplace / Discovery Hub Component
 * Browse and install MCP servers with one-click
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Icon } from './Icons';
import './MCPMarketplace.css';

interface MCPServer {
    id: number;
    name: string;
    description: string;
    url: string;
    sponsor?: boolean;
    category?: string;
    installMethod?: "npx" | "pip" | "manual";
    command?: string;
    isInstalled?: boolean;
}

interface MCPCategory {
    id: string;
    name: string;
    icon: string;
    count: number;
}

interface Props {
    onToast: (message: React.ReactNode) => void;
}

export const MCPMarketplace: React.FC<Props> = ({ onToast }) => {
    const [servers, setServers] = useState<MCPServer[]>([]);
    const [categories, setCategories] = useState<MCPCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [installing, setInstalling] = useState<number | null>(null);
    const [uninstalling, setUninstalling] = useState<number | null>(null);

    // Load servers data
    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [serversData, categoriesData] = await Promise.all([
                window.electronAPI.getMCPMarketplaceServers(),
                window.electronAPI.getMCPCategories(),
            ]);
            setServers(serversData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Failed to load MCP marketplace:', error);
            onToast('Failed to load MCP marketplace');
        } finally {
            setLoading(false);
        }
    }, [onToast]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Filter servers based on category and search
    const filteredServers = useMemo(() => {
        let result = servers;

        // Filter by category
        if (selectedCategory !== 'all') {
            const categoryName = selectedCategory.toLowerCase().replace(/-/g, ' ');
            result = result.filter(
                server =>
                    server.category?.toLowerCase().replace(/\s+/g, ' ') === categoryName ||
                    server.category?.toLowerCase().replace(/\s+/g, '-') === selectedCategory
            );
        }

        // Filter by search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                server =>
                    server.name.toLowerCase().includes(query) ||
                    server.description.toLowerCase().includes(query) ||
                    server.category?.toLowerCase().includes(query)
            );
        }

        return result;
    }, [servers, selectedCategory, searchQuery]);

    // Install server
    const handleInstall = async (server: MCPServer) => {
        setInstalling(server.id);
        try {
            const result = await window.electronAPI.installMCPServer(server);
            if (result.success) {
                onToast(<><Icon name="checkCircle" size={14} color="black" /> Installed {server.name}</>);
                await loadData();
            } else {
                onToast(<><Icon name="xCircle" size={14} color="black" /> {result.error || 'Install failed'}</>);
            }
        } catch (error: any) {
            console.error('Install failed:', error);
            onToast(`Install failed: ${error.message}`);
        } finally {
            setInstalling(null);
        }
    };

    // Uninstall server
    const handleUninstall = async (server: MCPServer) => {
        setUninstalling(server.id);
        try {
            const result = await window.electronAPI.uninstallMCPServer(server.name);
            if (result.success) {
                onToast(<><Icon name="checkCircle" size={14} color="black" /> Removed {server.name}</>);
                await loadData();
            } else {
                onToast(<><Icon name="xCircle" size={14} color="black" /> {result.error || 'Uninstall failed'}</>);
            }
        } catch (error: any) {
            console.error('Uninstall failed:', error);
            onToast(`Uninstall failed: ${error.message}`);
        } finally {
            setUninstalling(null);
        }
    };

    // Open server documentation
    const handleOpenDocs = (url: string) => {
        window.electronAPI.openExternal(url);
    };

    if (loading) {
        return (
            <div className="mcp-marketplace-loading">
                <div className="loading-spinner"></div>
                <p>Loading MCP marketplace...</p>
            </div>
        );
    }

    const installedCount = servers.filter(s => s.isInstalled).length;

    return (
        <div className="mcp-marketplace">
            {/* Header */}
            <div className="marketplace-header">
                <div className="marketplace-header-info">
                    <h3 className="marketplace-title">
                        <Icon name="box" size={20} />
                        MCP Marketplace
                    </h3>
                    <p className="marketplace-subtitle">
                        Discover and install MCP servers with one click
                    </p>
                </div>
                <div className="marketplace-stats">
                    <span className="stat-badge">
                        <Icon name="box" size={14} />
                        {servers.length} Available
                    </span>
                    <span className="stat-badge installed">
                        <Icon name="check" size={14} />
                        {installedCount} Installed
                    </span>
                </div>
            </div>

            {/* Search */}
            <div className="marketplace-search">
                <Icon name="search" size={16} />
                <input
                    type="text"
                    placeholder="Search servers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                {searchQuery && (
                    <button
                        className="search-clear"
                        onClick={() => setSearchQuery('')}
                    >
                        <Icon name="close" size={14} />
                    </button>
                )}
            </div>

            {/* Categories */}
            <div className="marketplace-categories">
                {categories.map(category => (
                    <button
                        key={category.id}
                        className={`category-chip ${selectedCategory === category.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category.id)}
                    >
                        <span className="category-icon">{category.icon}</span>
                        <span className="category-name">{category.name}</span>
                        <span className="category-count">{category.count}</span>
                    </button>
                ))}
            </div>

            {/* Results count */}
            <div className="marketplace-results-count">
                Showing {filteredServers.length} server{filteredServers.length !== 1 ? 's' : ''}
                {selectedCategory !== 'all' && ` in ${selectedCategory.replace(/-/g, ' ')}`}
                {searchQuery && ` matching "${searchQuery}"`}
            </div>

            {/* Server Grid */}
            <div className="marketplace-grid">
                {filteredServers.length === 0 ? (
                    <div className="marketplace-empty">
                        <Icon name="search" size={32} />
                        <p>No servers found</p>
                        <span>Try adjusting your search or category filter</span>
                    </div>
                ) : (
                    filteredServers.map(server => (
                        <div
                            key={server.id}
                            className={`server-card ${server.isInstalled ? 'installed' : ''} ${server.sponsor ? 'sponsored' : ''}`}
                        >
                            <div className="server-header">
                                <div className="server-title-row">
                                    <h4 className="server-name">{server.name}</h4>
                                    {server.sponsor && (
                                        <span className="sponsor-badge">⭐ Featured</span>
                                    )}
                                </div>
                                {server.category && (
                                    <span className="server-category">{server.category}</span>
                                )}
                            </div>

                            <p className="server-description">{server.description}</p>

                            <div className="server-meta">
                                {server.installMethod && (
                                    <span className="install-method">
                                        {server.installMethod === 'npx' && '📦 NPX'}
                                        {server.installMethod === 'pip' && '🐍 Pip'}
                                        {server.installMethod === 'manual' && '⚙️ Manual'}
                                    </span>
                                )}
                            </div>

                            <div className="server-actions">
                                <button
                                    className="server-docs-btn"
                                    onClick={() => handleOpenDocs(server.url)}
                                    title="View Documentation"
                                >
                                    <Icon name="launch" size={14} />
                                    Docs
                                </button>

                                {server.isInstalled ? (
                                    <button
                                        className="server-uninstall-btn"
                                        onClick={() => handleUninstall(server)}
                                        disabled={uninstalling === server.id}
                                        title="Remove from config"
                                    >
                                        {uninstalling === server.id ? (
                                            <>
                                                <span className="btn-spinner"></span>
                                                Removing...
                                            </>
                                        ) : (
                                            <>
                                                <Icon name="delete" size={14} />
                                                Remove
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        className="server-install-btn"
                                        onClick={() => handleInstall(server)}
                                        disabled={installing === server.id}
                                        title="Add to master config"
                                    >
                                        {installing === server.id ? (
                                            <>
                                                <span className="btn-spinner"></span>
                                                Installing...
                                            </>
                                        ) : (
                                            <>
                                                <Icon name="download" size={14} />
                                                Install
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {server.isInstalled && (
                                <div className="installed-indicator">
                                    <Icon name="check" size={12} />
                                    Installed
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="marketplace-footer">
                <p>
                    <Icon name="info" size={14} />
                    Servers are added to your master MCP config. Use "Sync All" to push to your IDEs.
                </p>
            </div>
        </div>
    );
};

export default MCPMarketplace;
