import { IDE, Project, Settings } from '../types';

export interface ElectronAPI {
    getIDEs: () => Promise<IDE[]>;
    refreshIDEs: () => Promise<IDE[]>;
    launchIDE: (
        ideName: string,
        projectPath?: string
    ) => Promise<{ success: boolean; error?: string }>;
    openDownload: (url: string) => Promise<{ success: boolean }>;

    // Project APIs
    getProjects: () => Promise<Project[]>;
    addProject: () => Promise<Project | null>;
    deleteProject: (projectId: string) => Promise<Project[]>;
    updateProjectIDE: (projectId: string, ideName: string) => Promise<Project[]>;

    // Settings APIs
    getSettings: () => Promise<Settings>;
    saveSettings: (settings: Settings) => Promise<{ success: boolean }>;
    onShowSettings: (callback: () => void) => void;

    minimize: () => void;
    maximize: () => void;
    close: () => void;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
