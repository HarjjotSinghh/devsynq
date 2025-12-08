import React, { JSX } from 'react';
import { IDEType } from '../../types';
import {
    Command,
    Settings,
    RefreshCw,
    Rocket,
    Download,
    X,
    Minus,
    Square,
    Search,
    Plus,
    Trash2,
    RotateCw,
    ArrowLeft,
    Keyboard,
    AppWindow,
    Folder,
    Palette,
    LucideIcon,
    Zap,
    AlertTriangle,
    Monitor,
    HardDrive,
    BarChart2,
    Clock,
    Moon,
    Eye,
    CheckCircle,
    XCircle,
    Check,
    Circle,
    FileText,
    Slash,
    Lightbulb,
    Key,
    Edit2
} from 'lucide-react';

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
    | 'download'
    | 'zap'
    | 'alert'
    | 'monitor'
    | 'hardDrive'
    | 'barChart'
    | 'clock'
    | 'moon'
    | 'eye'
    | 'checkCircle'
    | 'xCircle'
    | 'check'
    | 'circle'
    | 'fileText'
    | 'slash'
    | 'lightbulb'
    | 'key'
    | 'edit'
    | 'folder';

interface IconProps {
    name: IconName;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

const iconMap: Record<IconName, LucideIcon> = {
    logo: Command,
    settings: Settings,
    refresh: RefreshCw,
    launch: Rocket,
    install: Download,
    close: X,
    minimize: Minus,
    maximize: Square,
    search: Search,
    add: Plus,
    delete: Trash2,
    sync: RotateCw,
    arrowLeft: ArrowLeft,
    keyboard: Keyboard,
    window: AppWindow,
    project: Folder,
    theme: Palette,
    download: Download,
    zap: Zap,
    alert: AlertTriangle,
    monitor: Monitor,
    hardDrive: HardDrive,
    barChart: BarChart2,
    clock: Clock,
    moon: Moon,
    eye: Eye,
    checkCircle: CheckCircle,
    xCircle: XCircle,
    check: Check,
    circle: Circle,
    fileText: FileText,
    slash: Slash,
    lightbulb: Lightbulb,
    key: Key,
    edit: Edit2,
    folder: Folder,
};

export const Icon: React.FC<IconProps> = ({
    name,
    size = 18,
    strokeWidth = 1.6,
    className,
}) => {
    const LucideComponent = iconMap[name];
    if (!LucideComponent) return null;
    return <LucideComponent size={size} strokeWidth={strokeWidth} className={className} />;
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
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
        </svg>
    ),
    'VS Code': (
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
        </svg>
    ),
    Windsurf: (
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" d="M23.78 5.004h-.228a2.187 2.187 0 00-2.18 2.196v4.912c0 .98-.804 1.775-1.76 1.775a1.818 1.818 0 01-1.472-.773L13.168 5.95a2.197 2.197 0 00-1.81-.95c-1.134 0-2.154.972-2.154 2.173v4.94c0 .98-.797 1.775-1.76 1.775-.57 0-1.136-.289-1.472-.773L.408 5.098C.282 4.918 0 5.007 0 5.228v4.284c0 .216.066.426.188.604l5.475 7.889c.324.466.8.812 1.351.938 1.377.316 2.645-.754 2.645-2.117V11.89c0-.98.787-1.775 1.76-1.775h.002c.586 0 1.135.288 1.472.773l4.972 7.163a2.15 2.15 0 001.81.95c1.158 0 2.151-.973 2.151-2.173v-4.939c0-.98.787-1.775 1.76-1.775h.194c.122 0 .22-.1.22-.222V5.225a.221.221 0 00-.22-.222z" />
        </svg>
    ),
    Zed: (
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.25 1.5a.75.75 0 0 0-.75.75v16.5H0V2.25A2.25 2.25 0 0 1 2.25 0h20.095c1.002 0 1.504 1.212.795 1.92L10.764 14.298h3.486V12.75h1.5v1.922a1.125 1.125 0 0 1-1.125 1.125H9.264l-2.578 2.578h11.689V9h1.5v9.375a1.5 1.5 0 0 1-1.5 1.5H5.185L2.562 22.5H21.75a.75.75 0 0 0 .75-.75V5.25H24v16.5A2.25 2.25 0 0 1 21.75 24H1.655C.653 24 .151 22.788.86 22.08L13.19 9.75H9.75v1.5h-1.5V9.375A1.125 1.125 0 0 1 9.375 8.25h5.314l2.625-2.625H5.625V15h-1.5V5.625a1.5 1.5 0 0 1 1.5-1.5h13.19L21.438 1.5z" />
        </svg>
    ),
    WebStorm: (
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0v24h24V0H0zm17.889 2.889c1.444 0 2.667.444 3.667 1.278l-1.111 1.667c-.889-.611-1.722-1-2.556-1s-1.278.389-1.278.889v.056c0 .667.444.889 2.111 1.333 2 .556 3.111 1.278 3.111 3v.056c0 2-1.5 3.111-3.611 3.111-1.5-.056-3-.611-4.167-1.667l1.278-1.556c.889.722 1.833 1.222 2.944 1.222.889 0 1.389-.333 1.389-.944v-.056c0-.556-.333-.833-2-1.278-2-.5-3.222-1.056-3.222-3.056v-.056c0-1.833 1.444-3 3.444-3zm-16.111.222h2.278l1.5 5.778 1.722-5.778h1.667l1.667 5.778 1.5-5.778h2.333l-2.833 9.944H9.723L8.112 7.277l-1.667 5.778H4.612L1.779 3.111zm.5 16.389h9V21h-9v-1.5z" />
        </svg>
    ),
    Trae: (
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 20.541H3.428v-3.426H0V3.4h24V20.54zM3.428 17.115h17.144V6.827H3.428v10.288zm8.573-5.196l-2.425 2.424-2.424-2.424 2.424-2.424 2.425 2.424zm6.857-.001l-2.424 2.423-2.425-2.423 2.425-2.425 2.424 2.425z" />
        </svg>
    ),
    Replit: (
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 1.5A1.5 1.5 0 0 1 3.5 0h7A1.5 1.5 0 0 1 12 1.5V8H3.5A1.5 1.5 0 0 1 2 6.5ZM12 8h8.5A1.5 1.5 0 0 1 22 9.5v5a1.5 1.5 0 0 1-1.5 1.5H12ZM2 17.5A1.5 1.5 0 0 1 3.5 16H12v6.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 2 22.5Z" />
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
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0v24h24V0zm3.723 3.111h5v1.834h-1.39v6.277h1.39v1.834h-5v-1.834h1.444V4.945H3.723zm11.055 0H17v6.5c0 .612-.055 1.111-.222 1.556-.167.444-.39.777-.723 1.11-.277.279-.666.557-1.11.668a3.933 3.933 0 0 1-1.445.278c-.778 0-1.444-.167-1.944-.445a4.81 4.81 0 0 1-1.279-1.056l1.39-1.555c.277.334.555.555.833.722.277.167.611.278.945.278.389 0 .721-.111 1-.389.221-.278.333-.667.333-1.278zM2.222 19.5h9V21h-9z" />
        </svg>
    ),
    'PyCharm': (
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.833 6.666v-.055c0-1-.667-1.5-1.778-1.5H4.389v3.055h1.723c1.111 0 1.721-.666 1.721-1.5zM0 0v24h24V0H0zm2.223 3.167h4c2.389 0 3.833 1.389 3.833 3.445v.055c0 2.278-1.778 3.5-4.001 3.5H4.389v2.945H2.223V3.167zM11.277 21h-9v-1.5h9V21zm4.779-7.777c-2.944.055-5.111-2.223-5.111-5.057C10.944 5.333 13.056 3 16.111 3c1.889 0 3 .611 3.944 1.556l-1.389 1.61c-.778-.722-1.556-1.111-2.556-1.111-1.658 0-2.873 1.375-2.887 3.084.014 1.709 1.174 3.083 2.887 3.083 1.111 0 1.833-.445 2.61-1.167l1.39 1.389c-.999 1.112-2.166 1.779-4.054 1.779z" />
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
