import type { Metadata } from 'next';
import { ChangelogContent } from '@/components/changelog/changelog-content';

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
    return <ChangelogContent changelog={changelog} />;
}
