// Preload script - must use require for Electron compatibility
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods for renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  // Get all IDEs with their installation status
  getIDEs: () => ipcRenderer.invoke("get-ides"),
  refreshIDEs: () => ipcRenderer.invoke("refresh-ides"),

  // Launch an IDE by name, optionally with a project path
  launchIDE: (ideName: string, projectPath?: string) =>
    ipcRenderer.invoke("launch-ide", ideName, projectPath),

  // Open download URL in browser
  openDownload: (url: string) => ipcRenderer.invoke("open-download", url),

  // Project Management
  getProjects: () => ipcRenderer.invoke("get-projects"),
  addProject: () => ipcRenderer.invoke("add-project"),
  deleteProject: (projectId: string) =>
    ipcRenderer.invoke("delete-project", projectId),
  updateProjectIDE: (projectId: string, ideName: string) =>
    ipcRenderer.invoke("update-project-ide", projectId, ideName),

  // Settings
  getSettings: () => ipcRenderer.invoke("get-settings"),
  saveSettings: (settings: any) =>
    ipcRenderer.invoke("save-settings", settings),
  onShowSettings: (callback: () => void) =>
    ipcRenderer.on("show-settings", callback),

  // Window controls
  minimize: () => ipcRenderer.send("window-minimize"),
  maximize: () => ipcRenderer.send("window-maximize"),
  close: () => ipcRenderer.send("window-close"),
});
