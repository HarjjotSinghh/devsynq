import type { Metadata } from 'next';
import { Header, Footer } from '@/components/landing';

export const metadata: Metadata = {
    title: 'Changelog - DevSynq',
    description: 'See what\'s new in DevSynq. Release notes and version history.',
};

const changelog = [
    {
        version: '1.0.0',
        date: 'December 8, 2025',
        title: 'First Stable Release 🎉',
        added: [
            'MCP configuration sync across all supported IDEs',
            'Secure API key management with local encryption',
            'Global command palette (Alt+Shift+Space)',
            'Process monitoring for all running IDEs',
            'Project management with IDE preferences',
            'Support for Cursor, Windsurf, VS Code, Trae, Antigravity, Kiro, Qoder',
            'Windows and macOS installers',
        ],
        fixed: [],
        changed: [],
    },
    {
        version: '0.9.0',
        date: 'December 1, 2025',
        title: 'Beta Release',
        added: [
            'Initial MCP sync functionality',
            'Basic API key storage',
            'Command palette prototype',
        ],
        fixed: [
            'Fixed config file detection on Windows',
            'Fixed keyboard shortcuts on macOS',
        ],
        changed: [
            'Improved UI performance',
            'Updated Electron to v39',
        ],
    },
    {
        version: '0.8.0',
        date: 'November 25, 2025',
        title: 'Alpha Release',
        added: [
            'Initial prototype with basic IDE launching',
            'Project directory scanning',
        ],
        fixed: [],
        changed: [],
    },
];

export default function ChangelogPage() {
    return (
        <main className="min-h-screen">
            <Header />
            <section className="py-32 px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-black mb-4">
                            <span className="text-gradient">Changelog</span>
                        </h1>
                        <p className="text-xl text-[#888]">
                            See what's new in DevSynq
                        </p>
                    </div>

                    {/* Changelog entries */}
                    <div className="space-y-12">
                        {changelog.map((release, index) => (
                            <article
                                key={release.version}
                                className="relative pl-8 border-l-2 border-white/10"
                            >
                                {/* Version dot */}
                                <div
                                    className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${index === 0
                                            ? 'bg-[#00d9ff] ring-4 ring-[#00d9ff]/20'
                                            : 'bg-[#333]'
                                        }`}
                                />

                                {/* Header */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-mono text-2xl font-bold">
                                            v{release.version}
                                        </span>
                                        {index === 0 && (
                                            <span className="px-2 py-0.5 bg-[#00ff88]/20 text-[#00ff88] text-xs rounded font-semibold">
                                                Latest
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[#888]">{release.date}</p>
                                    <h2 className="text-xl font-semibold mt-2">{release.title}</h2>
                                </div>

                                {/* Added */}
                                {release.added.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="flex items-center gap-2 text-[#00ff88] font-semibold mb-3">
                                            <span>✨</span> Added
                                        </h3>
                                        <ul className="space-y-2">
                                            {release.added.map((item, i) => (
                                                <li key={i} className="text-[#ccc] flex items-start gap-2">
                                                    <span className="text-[#00ff88] mt-1">•</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Fixed */}
                                {release.fixed.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="flex items-center gap-2 text-[#00d9ff] font-semibold mb-3">
                                            <span>🐛</span> Fixed
                                        </h3>
                                        <ul className="space-y-2">
                                            {release.fixed.map((item, i) => (
                                                <li key={i} className="text-[#ccc] flex items-start gap-2">
                                                    <span className="text-[#00d9ff] mt-1">•</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Changed */}
                                {release.changed.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="flex items-center gap-2 text-[#ffd93d] font-semibold mb-3">
                                            <span>🔄</span> Changed
                                        </h3>
                                        <ul className="space-y-2">
                                            {release.changed.map((item, i) => (
                                                <li key={i} className="text-[#ccc] flex items-start gap-2">
                                                    <span className="text-[#ffd93d] mt-1">•</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>

                    {/* GitHub link */}
                    <div className="mt-16 text-center">
                        <a
                            href="https://github.com/HarjjotSinghh/devsynq/releases"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#00d9ff] hover:underline"
                        >
                            View full release history on GitHub →
                        </a>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
