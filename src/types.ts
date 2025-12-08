export interface IDE {
    name: string;
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
    preferredIDE: string;
    lastOpened?: number;
}

export interface Settings {
    defaultIDE: string;
    launchAtStartup: boolean;
    theme: 'dark' | 'light';
    autoDetectIDEs: boolean;
}
