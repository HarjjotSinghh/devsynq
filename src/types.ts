export type IDEType =
    | 'Cursor'
    | 'VS Code'
    | 'Windsurf'
    | 'Zed'
    | 'WebStorm'
    | 'Trae'
    | 'Replit'
    | 'Cody'
    | 'Continue'
    | 'IntelliJ IDEA'
    | 'PyCharm';

export interface IDE {
    name: IDEType;
    icon: string;
    macPaths: string[];
    winPaths: string[];
    linuxPaths: string[];
    downloadUrl: string;
    color: string;
    installed?: boolean; // Optional because main process adds this
}

export interface Project {
    id: string;
    name: string;
    path: string;
    preferredIDE: IDEType;
    lastOpened?: number;
}

export interface Settings {
    defaultIDE: IDEType;
    launchAtStartup: boolean;
    theme: 'dark' | 'light';
    autoDetectIDEs: boolean;
}
