// Main process - must use require for Electron compatibility
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');
const { exec } = require('child_process');

// IDE Configuration
interface IDE {
    name: string;
    icon: string;
    macPath: string;
    winPath: string;
    linuxPath: string;
    downloadUrl: string;
    color: string;
}

const username = os.userInfo().username;

const IDEs: IDE[] = [
    {
        name: 'Cursor',
        icon: '⚡',
        macPath: '/Applications/Cursor.app',
        winPath: `C:\\Users\\${username}\\AppData\\Local\\Programs\\Cursor\\Cursor.exe`,
        linuxPath: '/usr/share/cursor/cursor',
        downloadUrl: 'https://cursor.sh/',
        color: '#7c3aed'
    },
    {
        name: 'Windsurf',
        icon: '🏄',
        macPath: '/Applications/Windsurf.app',
        winPath: `C:\\Users\\${username}\\AppData\\Local\\Programs\\Windsurf\\Windsurf.exe`,
        linuxPath: '/usr/share/windsurf/windsurf',
        downloadUrl: 'https://codeium.com/windsurf',
        color: '#06b6d4'
    },
    {
        name: 'VS Code',
        icon: '💻',
        macPath: '/Applications/Visual Studio Code.app',
        winPath: `C:\\Users\\${username}\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe`,
        linuxPath: '/usr/share/code/code',
        downloadUrl: 'https://code.visualstudio.com/',
        color: '#0078d4'
    },
    {
        name: 'Zed',
        icon: '⚡',
        macPath: '/Applications/Zed.app',
        winPath: `C:\\Users\\${username}\\AppData\\Local\\Programs\\Zed\\Zed.exe`,
        linuxPath: '/usr/bin/zed',
        downloadUrl: 'https://zed.dev/',
        color: '#f59e0b'
    },
    {
        name: 'WebStorm',
        icon: '🌐',
        macPath: '/Applications/WebStorm.app',
        winPath: `C:\\Program Files\\JetBrains\\WebStorm\\bin\\webstorm64.exe`,
        linuxPath: '/usr/share/webstorm/bin/webstorm.sh',
        downloadUrl: 'https://www.jetbrains.com/webstorm/',
        color: '#00d8ff'
    }
];

function getIDEPath(ide: IDE): string {
    const platform = os.platform();
    switch (platform) {
        case 'darwin':
            return ide.macPath;
        case 'win32':
            return ide.winPath;
        case 'linux':
            return ide.linuxPath;
        default:
            return '';
    }
}

function isInstalled(ide: IDE): boolean {
    const idePath = getIDEPath(ide);
    try {
        return fs.existsSync(idePath);
    } catch {
        return false;
    }
}

function launchIDE(ide: IDE): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
        const platform = os.platform();
        const idePath = getIDEPath(ide);

        if (!fs.existsSync(idePath)) {
            resolve({ success: false, error: 'IDE not found at path: ' + idePath });
            return;
        }

        try {
            if (platform === 'darwin') {
                exec(`open "${idePath}"`, (error: Error | null) => {
                    if (error) {
                        resolve({ success: false, error: error.message });
                    } else {
                        resolve({ success: true });
                    }
                });
            } else if (platform === 'win32') {
                spawn(idePath, [], { detached: true, stdio: 'ignore' }).unref();
                resolve({ success: true });
            } else {
                exec(`"${idePath}"`, (error: Error | null) => {
                    if (error) {
                        resolve({ success: false, error: error.message });
                    } else {
                        resolve({ success: true });
                    }
                });
            }
        } catch (error) {
            resolve({ success: false, error: String(error) });
        }
    });
}

let mainWindow: typeof BrowserWindow | null = null;

function createWindow(): void {
    const appPath = app.getAppPath();
    const preloadPath = path.join(appPath, 'dist', 'preload.js');
    const indexPath = path.join(appPath, 'dist', 'index.html');

    console.log('App path:', appPath);
    console.log('Preload path:', preloadPath);
    console.log('Index path:', indexPath);

    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        minWidth: 800,
        minHeight: 600,
        frame: false,
        transparent: true,
        backgroundColor: '#00000000',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: preloadPath
        }
    });

    mainWindow.loadFile(indexPath);

    // Open DevTools for debugging (remove in production)
    // mainWindow.webContents.openDevTools();

    // Handle window controls
    ipcMain.on('window-minimize', () => {
        if (mainWindow) mainWindow.minimize();
    });

    ipcMain.on('window-maximize', () => {
        if (mainWindow) {
            if (mainWindow.isMaximized()) {
                mainWindow.unmaximize();
            } else {
                mainWindow.maximize();
            }
        }
    });

    ipcMain.on('window-close', () => {
        if (mainWindow) mainWindow.close();
    });
}

// IPC Handlers
ipcMain.handle('get-ides', () => {
    console.log('get-ides called');
    const result = IDEs.map((ide) => ({
        ...ide,
        installed: isInstalled(ide)
    }));
    console.log('IDEs:', result);
    return result;
});

ipcMain.handle('launch-ide', async (_event: unknown, ideName: string) => {
    const ide = IDEs.find((i) => i.name === ideName);
    if (!ide) {
        return { success: false, error: 'IDE not found' };
    }
    return await launchIDE(ide);
});

ipcMain.handle('open-download', async (_event: unknown, url: string) => {
    await shell.openExternal(url);
    return { success: true };
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
