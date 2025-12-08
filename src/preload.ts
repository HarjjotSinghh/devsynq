// Preload script - must use require for Electron compatibility
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods for renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // Get all IDEs with their installation status
    getIDEs: () => ipcRenderer.invoke('get-ides'),

    // Launch an IDE by name
    launchIDE: (ideName: string) => ipcRenderer.invoke('launch-ide', ideName),

    // Open download URL in browser
    openDownload: (url: string) => ipcRenderer.invoke('open-download', url),

    // Window controls
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close')
});
