import React, { JSX } from 'react';
import { IDEType } from '../../types';

type IconName =
    | 'logo'
    | 'settings'
    | 'refresh'
    | 'launch'
    | 'install'
    | 'close'
    | 'minimize'
    | 'maximize'
    | 'search'
    | 'add'
    | 'delete'
    | 'sync'
    | 'arrowLeft'
    | 'keyboard'
    | 'window'
    | 'project'
    | 'theme'
    | 'download';

interface IconProps {
    name: IconName;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export const Icon: React.FC<IconProps> = ({
    name,
    size = 18,
    strokeWidth = 1.6,
    className,
}) => {
    const common = {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        className,
    } as const;

    switch (name) {
        case 'logo':
            return (
                <svg {...common}>
                    <path d="M5 16.5 14 4.5a1 1 0 0 1 1.7.2l3.3 6.6a1 1 0 0 1-.1 1L10 21.5" />
                    <path d="M10.5 11.5 15 13" />
                    <path d="M9 19.5 5 16.5" />
                </svg>
            );
        case 'settings':
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="3.5" />
                    <path d="M19.4 12a7.4 7.4 0 0 0-.1-1l2-.9-1.6-2.7-2 .8a7.4 7.4 0 0 0-1.7-1l-.3-2.1h-3.2l-.3 2.1a7.4 7.4 0 0 0-1.7 1l-2-.8-1.6 2.7 2 .9a7.4 7.4 0 0 0 0 2l-2 .9 1.6 2.7 2-.8a7.4 7.4 0 0 0 1.7 1l.3 2.1h3.2l.3-2.1a7.4 7.4 0 0 0 1.7-1l2 .8 1.6-2.7-2-.9a7.4 7.4 0 0 0 .1-1Z" />
                </svg>
            );
        case 'refresh':
            return (
                <svg {...common}>
                    <path d="M3 12a9 9 0 0 1 14.2-7" />
                    <path d="M17 3v4.5H12.5" />
                    <path d="M21 12a9 9 0 0 1-14.2 7" />
                    <path d="M7 21v-4.5H11.5" />
                </svg>
            );
        case 'launch':
            return (
                <svg {...common}>
                    <path d="M4.5 19.5 19 5" />
                    <path d="M10 5h9v9" />
                </svg>
            );
        case 'install':
            return (
                <svg {...common}>
                    <path d="M12 4v10" />
                    <path d="M8 10l4 4 4-4" />
                    <path d="M5 18h14" />
                </svg>
            );
        case 'close':
            return (
                <svg {...common}>
                    <path d="m5 5 14 14" />
                    <path d="m19 5-14 14" />
                </svg>
            );
        case 'minimize':
            return (
                <svg {...common}>
                    <path d="M5 12h14" />
                </svg>
            );
        case 'maximize':
            return (
                <svg {...common}>
                    <rect x="5" y="5" width="14" height="14" rx="2" />
                </svg>
            );
        case 'search':
            return (
                <svg {...common}>
                    <circle cx="11" cy="11" r="5.5" />
                    <path d="m16 16 3 3" />
                </svg>
            );
        case 'add':
            return (
                <svg {...common}>
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                </svg>
            );
        case 'delete':
            return (
                <svg {...common}>
                    <path d="M6 7h12" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 7V5.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5.5V7" />
                    <path d="M6.5 7 7.5 19a1 1 0 0 0 1 .9h7a1 1 0 0 0 1-.9L17.5 7" />
                </svg>
            );
        case 'sync':
            return (
                <svg {...common}>
                    <path d="M3 14a7.5 7.5 0 0 0 13 3" />
                    <path d="M3 14v4h4" />
                    <path d="M21 10a7.5 7.5 0 0 0-13-3" />
                    <path d="M21 10V6h-4" />
                </svg>
            );
        case 'arrowLeft':
            return (
                <svg {...common}>
                    <path d="M15 5 8 12l7 7" />
                </svg>
            );
        case 'keyboard':
            return (
                <svg {...common}>
                    <rect x="3.5" y="7" width="17" height="10" rx="2" />
                    <path d="M7 10h10" />
                    <path d="M7 13h3.5" />
                    <path d="M13.5 13h3.5" />
                </svg>
            );
        case 'window':
            return (
                <svg {...common}>
                    <rect x="4" y="5" width="16" height="14" rx="2" />
                    <path d="M4 9h16" />
                </svg>
            );
        case 'project':
            return (
                <svg {...common}>
                    <path d="M5 7h6l2 3h6v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" />
                    <path d="M9 14h6" />
                </svg>
            );
        case 'theme':
            return (
                <svg {...common}>
                    <path d="M12 3c-2.5 0-3.5 2.5-3.5 5.5s1 5.5 3.5 5.5 5.5-2.5 5.5-5.5S14.5 3 12 3Z" />
                    <path d="M12 3v18" />
                </svg>
            );
        case 'download':
            return (
                <svg {...common}>
                    <path d="M12 4v10" />
                    <path d="m8 11 4 4 4-4" />
                    <path d="M5 20h14" />
                </svg>
            );
        default:
            return null;
    }
};

const ideColors: Record<IDEType | 'default', string> = {
    Cursor: '#7c3aed',
    'VS Code': '#0078d4',
    Windsurf: '#06b6d4',
    Zed: '#f59e0b',
    WebStorm: '#00d8ff',
    Trae: '#1e1e1e',
    Replit: '#f26207',
    Cody: '#ff5b4d',
    Continue: '#2563eb',
    'IntelliJ IDEA': '#fb7185',
    'PyCharm': '#10b981',
    default: '#64748b',
};

const ideSvgs: Record<IDEType | 'default', JSX.Element> = {
    Cursor: (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4l20 9-9 3 4 10-4.5 2L12 18l-6 3.5L6 4z" fill="url(#cursorGradient)" />
            <defs>
                <linearGradient id="cursorGradient" x1="6" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#a855f7" />
                    <stop offset="1" stopColor="#6d28d9" />
                </linearGradient>
            </defs>
        </svg>
    ),
    'VS Code': (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12.5 19 4v24l-13-8.5 7-3z" fill="#0078d4" />
            <path d="M19 4 26 7.5v17L19 28V4Z" fill="#3ba4f6" />
            <path d="m9 14 10-5v14l-10-5 4-2z" fill="#e5f4ff" />
        </svg>
    ),
    Windsurf: (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="#06b6d4" opacity="0.16" />
            <path d="M10 22c2-4 5-12 10-14l-2 10 4-2-2 8-10-2Z" fill="#0ea5e9" />
            <path d="M12 20c1.5-3.5 4.5-9 8-10" stroke="#ecfeff" strokeWidth="1.5" />
        </svg>
    ),
    Zed: (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="6" width="22" height="20" rx="3" fill="#f59e0b" />
            <path d="M10 10h12l-12 12h12" stroke="#fff7ed" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
    WebStorm: (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="6" width="22" height="20" rx="4" fill="#00d8ff" />
            <path d="M10 11.5h6L13 18h6" stroke="#0b1021" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
    Trae: (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="6" width="22" height="20" rx="4" fill="#111827" />
            <path d="M11 20h10M11 16h10M11 12h6" stroke="#f3f4f6" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
    Replit: (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="11" stroke="#f26207" strokeWidth="3" />
            <circle cx="16" cy="16" r="5" fill="#f26207" />
        </svg>
    ),
    Cody: (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="7" y="7" width="18" height="18" rx="5" fill="#ff5b4d" />
            <path d="M13 12h6M12 16h8M13 20h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
    Continue: (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="#2563eb" />
            <path d="m12 10 8 6-8 6z" fill="#e0e7ff" />
        </svg>
    ),
    'IntelliJ IDEA': (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="6" width="20" height="20" rx="4" fill="#fb7185" />
            <path d="M11 12h2v8h-2zM15 12h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <path d="M15 16h4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
    'PyCharm': (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="6" width="20" height="20" rx="4" fill="#10b981" />
            <path d="M11 12h4a3 3 0 0 1 0 6h-4V12Z" stroke="#ecfdf5" strokeWidth="2" />
            <path d="M17 18h4" stroke="#ecfdf5" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
    default: (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="8" width="20" height="16" rx="3" fill="#0f172a" opacity="0.08" />
            <path d="M10 12h12v8H10z" stroke="#475569" strokeWidth="2" />
        </svg>
    ),
};

interface IdeIconProps {
    ide: IDEType | string;
    size?: number;
    className?: string;
}

export const IdeIcon: React.FC<IdeIconProps> = ({ ide, size = 28, className }) => {
    const normalizedIde = (ide as IDEType) || 'default';
    const icon = ideSvgs[normalizedIde as IDEType] || ideSvgs.default;
    const color = ideColors[normalizedIde as IDEType] || ideColors.default;

    return (
        <span
            className={`ide-icon ${className ?? ''}`}
            style={{ width: size, height: size, color, display: 'inline-flex' }}
        >
            {icon}
        </span>
    );
};
