/**
 * MCP Marketplace / Discovery Hub Component
 * Browse MCP servers (Web Version)
 */
'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { Icon } from '@/components/icons';
import { toast } from 'sonner';
import { MCP_SERVERS } from '@/data/mcp-servers';
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
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
}

interface MCPCategory {
    id: string;
    name: string;
    icon: string;
    count: number;
}

const CATEGORY_ICONS: Record<string, string> = {
    'Utilities': '🛠️',
    'Development': '👨‍💻',
    'Database': '🗄️',
    'Media': '🎬',
    'Search': '🔍',
    'Productivity': '⚡',
    'Communication': '💬',
    'Browser Automation': '🤖',
};

const DEFAULT_CATEGORY_ICON = '📦';

export const MCPMarketplace: React.FC = () => {
    const [servers, setServers] = useState<MCPServer[]>([]);
    const [categories, setCategories] = useState<MCPCategory[]>([]);

    // URL State
    const [selectedCategory, setSelectedCategory] = useQueryState('category', parseAsString.withDefault('all'));
    const [searchQuery, setSearchQuery] = useQueryState('q', parseAsString.withDefault(''));
    const [selectedMethod, setSelectedMethod] = useQueryState('method', parseAsString.withDefault('all'));
    const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

    const [loading, setLoading] = useState(true);

    const ITEMS_PER_PAGE = 12;

    // Load servers data
    useEffect(() => {
        // Simulate loading for better UX
        const timer = setTimeout(() => {
            const data = MCP_SERVERS;
            setServers(data);

            // Calculate categories
            const categoryMap = new Map<string, number>();
            data.forEach(server => {
                if (server.category) {
                    const cat = server.category;
                    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
                }
            });

            const cats: MCPCategory[] = [
                {
                    id: 'all',
                    name: 'All Servers',
                    icon: '🌐',
                    count: data.length
                }
            ];

            Array.from(categoryMap.entries()).sort((a, b) => a[0].localeCompare(b[0])).forEach(([name, count]) => {
                cats.push({
                    id: name.toLowerCase().replace(/\s+/g, '-'),
                    name: name,
                    icon: CATEGORY_ICONS[name] || DEFAULT_CATEGORY_ICON,
                    count: count
                });
            });

            setCategories(cats);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Filter servers based on category and search
    const filteredServers = useMemo(() => {
        let result = servers;

        // Filter by category
        if (selectedCategory !== 'all') {
            result = result.filter(server => {
                if (!server.category) return false;
                const catId = server.category.toLowerCase().replace(/\s+/g, '-');
                return catId === selectedCategory;
            });
        }

        // Filter by method
        if (selectedMethod !== 'all') {
            result = result.filter(server => {
                if (selectedMethod === 'manual') return server.installMethod === 'manual';
                if (selectedMethod === 'npx') return server.installMethod === 'npx';
                if (selectedMethod === 'pip') return server.installMethod === 'pip';
                return true;
            });
        }

        // Filter by search
        if (searchQuery && searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                server =>
                    server.name.toLowerCase().includes(query) ||
                    server.description.toLowerCase().includes(query) ||
                    (server.category && server.category.toLowerCase().includes(query))
            );
        }

        return result;
    }, [servers, selectedCategory, searchQuery, selectedMethod]);

    // Pagination
    const totalPages = Math.ceil(filteredServers.length / ITEMS_PER_PAGE);
    const paginatedServers = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return filteredServers.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredServers, page]);

    // Handlers with page reset
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setPage(1);
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query || null); // clear if empty
        setPage(1);
    };

    const handleMethodChange = (method: string) => {
        setSelectedMethod(method);
        setPage(1);
    };

    // Open server documentation
    const handleOpenDocs = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleCopyConfig = (server: MCPServer) => {
        const config = {
            [server.name]: {
                command: server.installMethod === 'npx' ? 'npx' : (server.installMethod === 'pip' ? 'uv' : server.command || ''),
                args: server.installMethod === 'npx' ? ['-y', server.name] : [], // This is a rough guess, real config might need more details
            }
        };
        // Actually better to just copy the install command
        const installCmd = server.installMethod === 'npx' ? `npx -y ${server.name.split('/').pop()}` : // heuristic
            server.installMethod === 'pip' ? `uv pip install ${server.name}` :
                `See docs for ${server.name}`;

        // For now just copy the name or URL
        navigator.clipboard.writeText(server.url);
        toast.success(`Copied URL for ${server.name}`);
    };

    if (loading) {
        return (
            <div className="mcp-marketplace-loading py-20 flex flex-col items-center justify-center">
                <div className="loading-spinner mb-4"></div>
                <p className="text-muted-foreground">Loading MCP marketplace...</p>
            </div>
        );
    }

    return (
        <div className="mcp-marketplace max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="marketplace-header mb-8">
                <div className="marketplace-header-info mb-4">
                    <h1 className="marketplace-title text-3xl font-bold flex items-center gap-2 mb-2">
                        <Icon name="box" size={32} className="text-primary" />
                        MCP Marketplace
                    </h1>
                    <p className="marketplace-subtitle text-muted-foreground text-lg">
                        Discover and explore Model Context Protocol servers
                    </p>
                </div>
                <div className="marketplace-stats flex gap-3">
                    <span className="stat-badge bg-secondary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        <Icon name="box" size={14} />
                        {servers.length} Available
                    </span>
                    <span className="stat-badge bg-secondary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        <Icon name="check" size={14} />
                        Verified Sources
                    </span>
                </div>
            </div>

            {/* Filters Row */}
            <div className="marketplace-filters flex flex-col md:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="marketplace-search relative grow">
                    <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search servers..."
                        value={searchQuery || ''}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="search-input w-full bg-secondary border border-border rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {searchQuery && (
                        <button
                            className="search-clear absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => handleSearchChange('')}
                        >
                            <Icon name="close" size={14} />
                        </button>
                    )}
                </div>

                {/* Method Filter */}
                <div className="flex items-center gap-2 shrank-0">
                    <select
                        value={selectedMethod || 'all'}
                        onChange={(e) => handleMethodChange(e.target.value)}
                        className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-[42px]"
                    >
                        <option value="all">All Install Methods</option>
                        <option value="npx">📦 NPX</option>
                        <option value="pip">🐍 Pip</option>
                        <option value="manual">⚙️ Manual</option>
                    </select>
                </div>
            </div>

            {/* Categories */}
            <div className="marketplace-categories flex flex-wrap gap-2 mb-8">
                {categories.map(category => (
                    <button
                        key={category.id}
                        className={`category-chip px-3 py-1.5 rounded-full text-sm transition-colors border ${selectedCategory === category.id
                            ? 'bg-primary/20 border-primary text-primary'
                            : 'bg-secondary border-transparent hover:bg-secondary/80'
                            } flex items-center gap-2`}
                        onClick={() => handleCategoryChange(category.id)}
                    >
                        <span className="category-icon">{category.icon}</span>
                        <span className="category-name">{category.name}</span>
                        <span className="category-count opacity-60 text-xs bg-black/20 px-1.5 rounded-full">{category.count}</span>
                    </button>
                ))}
            </div>

            {/* Results count */}
            <div className="marketplace-results-count mb-4 text-sm text-muted-foreground">
                Showing {filteredServers.length} server{filteredServers.length !== 1 ? 's' : ''}
                {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
                {searchQuery && ` matching "${searchQuery}"`}
                {selectedMethod !== 'all' && ` with ${selectedMethod}`}
            </div>

            {/* Server Grid */}
            <div className="marketplace-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {filteredServers.length === 0 ? (
                    <div className="marketplace-empty col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Icon name="search" size={48} className="mb-4 opacity-50" />
                        <p className="text-lg">No servers found</p>
                        <span className="text-sm">Try adjusting your search or category filter</span>
                    </div>
                ) : (
                    paginatedServers.map(server => (
                        <div
                            key={server.id}
                            className={`server-card bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors flex flex-col ${server.sponsor ? 'ring-1 ring-yellow-500/20' : ''}`}
                        >
                            <div className="server-header flex justify-between items-start mb-3">
                                <div className="server-title-row">
                                    <h4 className="server-name font-semibold text-lg">{server.name}</h4>
                                    {server.sponsor && (
                                        <span className="sponsor-badge text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded ml-2">⭐ Featured</span>
                                    )}
                                </div>
                                {server.category && (
                                    <span className="server-category text-xs bg-secondary px-2 py-1 rounded text-muted-foreground whitespace-nowrap ml-2">
                                        {server.category}
                                    </span>
                                )}
                            </div>

                            <p className="server-description text-sm text-muted-foreground mb-4 grow line-clamp-3">
                                {server.description}
                            </p>

                            <div className="server-meta mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                                {server.installMethod && (
                                    <span className="install-method flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded">
                                        {server.installMethod === 'npx' && '📦 NPX'}
                                        {server.installMethod === 'pip' && '🐍 Pip'}
                                        {server.installMethod === 'manual' && '⚙️ Manual'}
                                    </span>
                                )}
                            </div>

                            <div className="server-actions flex gap-2 mt-auto pt-4 border-t border-border/50">
                                <button
                                    className="server-docs-btn flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                    onClick={() => handleOpenDocs(server.url)}
                                    title="View Documentation"
                                >
                                    <Icon name="launch" size={14} />
                                    Docs
                                </button>

                                <button
                                    className="server-copy-btn flex-1 bg-primary/10 hover:bg-primary/20 text-primary py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                    onClick={() => handleCopyConfig(server)}
                                    title="Copy Link"
                                >
                                    <Icon name="link" size={14} />
                                    Share
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="marketplace-pagination flex justify-center mt-8">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setPage(Math.max(1, (page || 1) - 1))}
                                    className={(page || 1) <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === totalPages || Math.abs(p - (page || 1)) <= 1)
                                .map((p, i, arr) => (
                                    <React.Fragment key={p}>
                                        {i > 0 && arr[i - 1] !== p - 1 && (
                                            <PaginationItem>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        )}
                                        <PaginationItem>
                                            <PaginationLink
                                                isActive={(page || 1) === p}
                                                onClick={() => setPage(p)}
                                                className="cursor-pointer"
                                            >
                                                {p}
                                            </PaginationLink>
                                        </PaginationItem>
                                    </React.Fragment>
                                ))
                            }

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setPage(Math.min(totalPages, (page || 1) + 1))}
                                    className={(page || 1) >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            {/* Footer */}
            <div className="marketplace-footer mt-12 text-center text-muted-foreground text-sm border-t border-border pt-8">
                <p className="flex items-center justify-center gap-2">
                    <Icon name="info" size={14} />
                    These servers can be installed directly in the DevSynq desktop app.
                </p>
            </div>
        </div>
    );
};

export default MCPMarketplace;
