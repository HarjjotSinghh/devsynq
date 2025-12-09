// Main process - must use require for Electron compatibility
const {
  app,
  BrowserWindow,
  ipcMain,
  shell,
  Tray,
  Menu,
  nativeImage,
  globalShortcut,
  screen,
} = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { spawn } = require("child_process");
const { exec } = require("child_process");

// IDE Configuration

import { IDE, IDEType, Project, Settings } from "./types";

// Import MCP sync functions
import {
  getMCPSyncStatus,
  loadSyncSettings,
  saveSyncSettings,
  toggleIDESync,
  syncMCPConfigs,
  importFromIDE,
  createOverride,
  deleteOverride,
  getMasterConfigPath,
  loadSyncLog,
} from "./lib/mcp-sync";

// Import process manager functions
import {
  getRunningIDEs,
  getProcessStats,
  focusIDE,
  killIDE,
  killAllIDEs,
  getResourceUsage,
} from "./lib/process-manager";

// Import API keys sync functions
import {
  loadAPIKeysSettings,
  saveAPIKeysSettings,
  updateAPIKey,
  deleteAPIKey,
  syncToIDE,
  syncToAllIDEs,
  toggleIDEKeySync,
  getAPIKeyTypes,
  getAPIKeySyncStatus,
  maskAPIKey,
  validateAPIKey,
} from "./lib/api-keys-sync";
import {
  getProfileSyncStatus as getProfileSyncStatusLib,
  loadProfileSyncSettings,
  saveProfileSyncSettings,
  toggleProfileIDESync,
  syncProfiles,
  getMasterProfilePath,
} from "./lib/profile-sync";

// Helper to expand paths with environment variables
function expandPath(pathStr: string): string {
  return pathStr.replace(/%([^%]+)%/g, (_, n) => process.env[n] || "");
}

const username = os.userInfo().username;
const userDataPath = app.getPath("userData");
const projectsFile = path.join(userDataPath, "projects.json");
const settingsFile = path.join(userDataPath, "settings.json");

const defaultSettings: Settings = {
  defaultIDE: IDEType.Cursor,
  launchAtStartup: false,
  theme: "dark",
  autoDetectIDEs: true,
  shortcutBindings: {},
};

let idesCache: Array<IDE & { installed: boolean }> = [];
let tray: typeof Tray | null = null;
const trayImage = nativeImage.createFromDataURL(
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAALElEQVR42mNgoBvg////fwYsgAmGkYGB4T8jAxoYhkGEQ0kwGo0GQymGoQEAXsUKfb9J2cAAAAASUVORK5CYII="
);
trayImage.setTemplateImage(true);

function loadSettings(): Settings {
  try {
    if (fs.existsSync(settingsFile)) {
      return {
        ...defaultSettings,
        ...JSON.parse(fs.readFileSync(settingsFile, "utf8")),
      };
    }
  } catch (error) {
    console.error("Error loading settings:", error);
  }
  return defaultSettings;
}

function saveSettings(settings: Settings): void {
  try {
    fs.mkdirSync(userDataPath, { recursive: true });
    fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));

    // Apply system settings
    app.setLoginItemSettings({
      openAtLogin: settings.launchAtStartup,
      path: app.getPath("exe"),
    });
  } catch (error) {
    console.error("Error saving settings:", error);
  }
}

// Helper to load projects
function loadProjects(): Project[] {
  try {
    if (fs.existsSync(projectsFile)) {
      const data = fs.readFileSync(projectsFile, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading projects:", error);
  }
  return [];
}

// Helper to save projects
function saveProjects(projects: Project[]): void {
  try {
    fs.mkdirSync(userDataPath, { recursive: true });
    fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2));
  } catch (error) {
    console.error("Error saving projects:", error);
  }
}

console.log("username:", username);
const IDEs: IDE[] = [
  {
    name: IDEType.Cursor,
    icon: "⚡",
    macPaths: ["/Applications/Cursor.app"],
    winPaths: [
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\Cursor\\Cursor.exe`,
      `C:\\Program Files\\Cursor\\Cursor.exe`,
      `C:\\Program Files (x86)\\Cursor\\Cursor.exe`,
      expandPath("%LOCALAPPDATA%\\Programs\\Cursor\\Cursor.exe"),
    ],
    linuxPaths: ["/usr/local/bin/cursor", "/usr/bin/cursor", "$HOME/.local/bin/cursor"],
    downloadUrl: "https://cursor.sh/",
    color: "#fff1bb",
  },
  {
    name: IDEType.Windsurf,
    icon: "🏄",
    macPaths: ["/Applications/Windsurf.app"],
    winPaths: [
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\Windsurf\\Windsurf.exe`,
      `C:\\Program Files\\Windsurf\\Windsurf.exe`,
      expandPath("%LOCALAPPDATA%\\Programs\\Windsurf\\Windsurf.exe"),
    ],
    linuxPaths: ["/usr/local/bin/windsurf", "/opt/Windsurf/windsurf", "$HOME/.local/bin/windsurf"],
    downloadUrl: "https://codeium.com/windsurf",
    color: "#06b6d4",
  },
  {
    name: IDEType.VSCode,
    icon: "💻",
    macPaths: ["/Applications/Visual Studio Code.app"],
    winPaths: [
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe`,
      `C:\\Program Files\\Microsoft VS Code\\Code.exe`,
      expandPath("%LOCALAPPDATA%\\Programs\\Microsoft VS Code\\Code.exe"),
    ],
    linuxPaths: ["/usr/bin/code", "/usr/local/bin/code", "$HOME/.local/bin/code"],
    downloadUrl: "https://code.visualstudio.com/",
    color: "#0078d4",
  },
  {
    name: IDEType.Zed,
    icon: "⚡",
    macPaths: ["/Applications/Zed.app", "/Applications/Zed.app/Contents/MacOS/cli"],
    winPaths: [
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\Zed\\Zed.exe`,
      `C:\\Program Files\\Zed\\Zed.exe`,
    ],
    linuxPaths: ["/usr/bin/zed", "/usr/local/bin/zed"],
    downloadUrl: "https://zed.dev/",
    color: "#f59e0b",
  },
  {
    name: IDEType.WebStorm,
    icon: "🌐",
    macPaths: ["/Applications/WebStorm.app"],
    winPaths: [
      `C:\\Program Files\\JetBrains\\WebStorm\\bin\\webstorm64.exe`,
      `C:\\Users\\${username}\\AppData\\Local\\JetBrains\\WebStorm\\bin\\webstorm64.exe`,
    ],
    linuxPaths: ["/opt/WebStorm/bin/webstorm.sh", "/usr/local/bin/webstorm"],
    downloadUrl: "https://www.jetbrains.com/webstorm/",
    color: "#00d8ff",
  },
  {
    name: IDEType.Trae,
    icon: "🚀",
    macPaths: ["/Applications/Trae.app"],
    winPaths: [
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\Trae\\Trae.exe`,
      `C:\\Program Files\\Trae\\Trae.exe`,
    ],
    linuxPaths: ["/usr/local/bin/trae", "/opt/trae/trae"],
    downloadUrl: "https://www.trae.ai/",
    color: "#1e1e1e",
  },
  {
    name: IDEType.Antigravity,
    icon: "🛰️",
    macPaths: ["/Applications/Antigravity.app"],
    winPaths: [
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\Antigravity\\Antigravity.exe`,
      `C:\\Program Files\\Antigravity\\Antigravity.exe`,
      expandPath("%LOCALAPPDATA%\\Programs\\Antigravity\\Antigravity.exe"),
    ],
    linuxPaths: ["/usr/bin/antigravity"],
    downloadUrl: "https://www.google.com/antigravity",
    color: "#4285f4",
  },
  {
    name: IDEType.Kiro,
    icon: "👻",
    macPaths: ["/Applications/Kiro.app"],
    winPaths: [
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\Kiro\\Kiro.exe`,
      `C:\\Program Files\\Kiro\\Kiro.exe`,
      expandPath("%LOCALAPPDATA%\\Programs\\Kiro\\Kiro.exe"),
    ],
    linuxPaths: ["/usr/local/bin/kiro", "/opt/kiro/kiro"],
    downloadUrl: "https://aws.amazon.com/kiro",
    color: "#8e48ff",
  },
  {
    name: IDEType.Qoder,
    icon: "🟢",
    macPaths: ["/Applications/Qoder.app"],
    winPaths: [
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\Qoder\\Qoder.exe`,
      `C:\\Program Files\\Qoder\\Qoder.exe`,
      expandPath("%LOCALAPPDATA%\\Programs\\Qoder\\Qoder.exe"),
    ],
    linuxPaths: ["/usr/local/bin/qoder", "/opt/qoder/qoder"],
    downloadUrl: "https://qoder.com",
    color: "#18d16f",
  },
  {
    name: IDEType.Replit,
    icon: "🌀",
    macPaths: ["/Applications/Replit.app"],
    winPaths: [
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\Replit\\Replit.exe`,
      `C:\\Program Files\\Replit\\Replit.exe`,
    ],
    linuxPaths: ["/usr/local/bin/replit", "/opt/replit/replit"],
    downloadUrl: "https://replit.com/desktop",
    color: "#f26207",
  },
  {
    name: IDEType.Cody,
    icon: "🤖",
    macPaths: ["/Applications/Cody.app"],
    winPaths: [
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\Cody\\Cody.exe`,
      `C:\\Program Files\\Cody\\Cody.exe`,
      expandPath("%LOCALAPPDATA%\\Programs\\Cody\\Cody.exe"),
    ],
    linuxPaths: ["~/.local/share/code/extensions/Cody*"],
    downloadUrl: "https://sourcegraph.com/cody",
    color: "#ff5b4d",
  },
  {
    name: IDEType.Continue,
    icon: "🔗",
    macPaths: ["/Applications/Continue.app"],
    winPaths: [
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\Continue\\Continue.exe`,
      `C:\\Program Files\\Continue\\Continue.exe`,
    ],
    linuxPaths: ["~/.local/share/code/extensions/Continue*"],
    downloadUrl: "https://continue.dev",
    color: "#4ade80",
  },
  {
    name: IDEType.IntelliJIDEA,
    icon: "💡",
    macPaths: ["/Applications/IntelliJ IDEA.app"],
    winPaths: [
      `C:\\Program Files\\JetBrains\\IntelliJ IDEA 2024.2\\bin\\idea64.exe`,
      `C:\\Program Files\\JetBrains\\IntelliJ IDEA\\bin\\idea64.exe`,
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\IntelliJ IDEA\\bin\\idea64.exe`,
    ],
    linuxPaths: ["/opt/idea-*/bin/idea.sh", "/usr/local/bin/idea"],
    downloadUrl: "https://www.jetbrains.com/idea/download/",
    color: "#ff4081",
  },
  {
    name: IDEType.PyCharm,
    icon: "🐍",
    macPaths: ["/Applications/PyCharm.app"],
    winPaths: [
      `C:\\Program Files\\JetBrains\\PyCharm 2024.2\\bin\\pycharm64.exe`,
      `C:\\Program Files\\JetBrains\\PyCharm\\bin\\pycharm64.exe`,
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\PyCharm\\bin\\pycharm64.exe`,
    ],
    linuxPaths: ["/opt/pycharm-*/bin/pycharm.sh", "/usr/local/bin/pycharm"],
    downloadUrl: "https://www.jetbrains.com/pycharm/download/",
    color: "#21d19f",
  },
];

function getIDEPath(ide: IDE): string | null {
  const platform = os.platform();
  const homedir = os.homedir();
  let paths: string[] = [];

  switch (platform) {
    case "darwin":
      paths = ide.macPaths;
      break;
    case "win32":
      paths = ide.winPaths;
      break;
    case "linux":
      paths = ide.linuxPaths;
      break;
  }

  for (let p of paths) {
    // Expand ~ and $HOME
    if (typeof p === "string") {
      if (p.startsWith("~")) {
        p = path.join(homedir, p.slice(1));
      }
      p = p.replace("$HOME", homedir);
    }

    // Handle wildcards
    if (p.includes("*")) {
      try {
        const parts = p.split(path.sep);
        const wildcardIndex = parts.findIndex((part: string) => part.includes("*"));

        if (wildcardIndex === -1) continue;

        const baseDir = parts.slice(0, wildcardIndex).join(path.sep) || "/";
        const pattern = parts[wildcardIndex];
        if (!pattern) continue;

        const suffix = parts.slice(wildcardIndex + 1).join(path.sep);

        if (fs.existsSync(baseDir)) {
          const files = fs.readdirSync(baseDir);
          const prefix = pattern.split("*")[0];
          const matches = files.filter((f: string) => f.startsWith(prefix ?? ""));
          if (matches.length > 0) {
            matches.sort();
            const match = matches[matches.length - 1];
            if (match) {
              const resolvedPath = path.join(baseDir, match, suffix);
              if (fs.existsSync(resolvedPath)) {
                return resolvedPath;
              }
            }
          }
        }
      } catch (e) {
        // ignore
      }
    } else {
      if (fs.existsSync(p)) {
        return p;
      }
    }
  }
  return null;
}

function isInstalled(ide: IDE): boolean {
  return getIDEPath(ide) !== null;
}

function launchIDE(
  ide: IDE,
  projectPath?: string
): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    const platform = os.platform();
    const idePath = getIDEPath(ide);

    if (!idePath) {
      resolve({ success: false, error: "IDE not found" });
      return;
    }

    const args = projectPath ? ` "${projectPath}"` : "";

    try {
      if (platform === "darwin") {
        const command = projectPath
          ? `open -a "${idePath}" "${projectPath}"`
          : `open "${idePath}"`;
        exec(command, (error: Error | null) => {
          if (error) {
            resolve({ success: false, error: error.message });
          } else {
            resolve({ success: true });
          }
        });
      } else if (platform === "win32") {
        // For Windows, we need to quote the path if it has spaces
        // spawn is safer for arguments
        const spawnArgs = projectPath ? [projectPath] : [];
        spawn(idePath, spawnArgs, { detached: true, stdio: "ignore" }).unref();
        resolve({ success: true });
      } else {
        const command = projectPath
          ? `"${idePath}" "${projectPath}"`
          : `"${idePath}"`;
        exec(command, (error: Error | null) => {
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

function updateTrayMenu(
  idesWithStatus: Array<IDE & { installed: boolean }>
): void {
  if (!tray) {
    tray = new Tray(trayImage);
    tray.setToolTip("DevSynq");
    tray.on("click", () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });
  }

  const installed = idesWithStatus.filter((ide) => ide.installed).slice(0, 5);
  const quickLaunchItems = installed.map((ide) => ({
    label: `Launch ${ide.name}`,
    click: () => launchIDE(ide),
  }));

  const menu = Menu.buildFromTemplate([
    ...quickLaunchItems,
    ...(quickLaunchItems.length ? [{ type: "separator" } as const] : []),
    {
      label: "Show DevSynq",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    {
      label: "Open Settings",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.webContents.send("show-settings");
        }
      },
    },
    { type: "separator" },
    { role: "quit", label: "Quit" },
  ]);

  tray.setContextMenu(menu);
}

function getIDEsWithStatus(
  forceScan = false
): Array<IDE & { installed: boolean }> {
  const settings = loadSettings();
  const shouldScan =
    forceScan || settings.autoDetectIDEs || idesCache.length === 0;

  if (!shouldScan && idesCache.length > 0) {
    return idesCache;
  }

  idesCache = IDEs.map((ide) => ({
    ...ide,
    installed: isInstalled(ide),
  }));

  updateTrayMenu(idesCache);
  return idesCache;
}

let mainWindow: typeof BrowserWindow | null = null;
let windowStateSaveTimeout: NodeJS.Timeout | null = null;

function persistWindowState(): void {
  if (!mainWindow) return;
  const bounds = mainWindow.getNormalBounds();
  const settings = loadSettings();

  saveSettings({
    ...settings,
    windowState: {
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
      isMaximized: mainWindow.isMaximized(),
    },
  });
}

function schedulePersistWindowState(): void {
  if (windowStateSaveTimeout) {
    clearTimeout(windowStateSaveTimeout);
  }
  windowStateSaveTimeout = setTimeout(persistWindowState, 300);
}

function createWindow(): void {
  const appPath = app.getAppPath();
  const preloadPath = path.join(appPath, "dist", "preload.js");
  const indexPath = path.join(appPath, "dist", "index.html");
  const settings = loadSettings();

  console.log("App path:", appPath);
  console.log("Preload path:", preloadPath);
  console.log("Index path:", indexPath);

  const initialBounds = {
    width: settings.windowState?.width || 1200,
    height: settings.windowState?.height || 800,
    x:
      typeof settings.windowState?.x === "number"
        ? settings.windowState.x
        : undefined,
    y:
      typeof settings.windowState?.y === "number"
        ? settings.windowState.y
        : undefined,
  };

  mainWindow = new BrowserWindow({
    ...initialBounds,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    // Disable transparency for now to fix "stuck" issues on some Windows configs
    transparent: false,
    backgroundColor: settings.theme === "light" ? "#f7f7fb" : "#0a0a0f",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath,
    },
  });

  mainWindow.loadFile(indexPath);

  if (settings.windowState?.isMaximized) {
    mainWindow.maximize();
  }

  // Open DevTools for debugging (remove in production)
  // mainWindow.webContents.openDevTools();

  // Handle window controls
  ipcMain.on("window-minimize", () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.on("window-maximize", () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.on("window-close", () => {
    if (mainWindow) mainWindow.close();
  });

  mainWindow.on("resize", schedulePersistWindowState);
  mainWindow.on("move", schedulePersistWindowState);
  mainWindow.on("close", persistWindowState);
}

// IPC Handlers
ipcMain.handle("get-ides", () => {
  return getIDEsWithStatus(false);
});

ipcMain.handle("refresh-ides", () => {
  return getIDEsWithStatus(true);
});

ipcMain.handle(
  "launch-ide",
  async (_event: unknown, ideName: string, projectPath?: string) => {
    const ide = IDEs.find((i) => i.name === (ideName as IDEType));
    if (!ide) {
      return { success: false, error: "IDE not found" };
    }

    // Auto-sync MCP config before launching if enabled
    try {
      const syncSettings = loadSyncSettings();
      if (syncSettings.autoSyncOnLaunch) {
        // Map IDE name to MCP config IDE ID
        const ideIdMap: Record<string, string> = {
          Cursor: "cursor",
          Windsurf: "windsurf",
          "VS Code": "vscode",
          "Antigravity": "antigravity",
          Kiro: "kiro",
          Qoder: "qoder",
          Trae: "trae",
        };
        const ideId = ideIdMap[ideName];
        if (ideId && syncSettings.enabledIDEs[ideId]) {
          await syncMCPConfigs([ideId]);
          console.log(`Auto-synced MCP config for ${ideName}`);
        }
      }
    } catch (error) {
      console.error("Auto-sync failed:", error);
      // Don't block IDE launch if sync fails
    }

    // Auto-sync Profile before launching if enabled
    try {
      const profileSettings = loadProfileSyncSettings();
      if (profileSettings.autoSyncOnLaunch) {
        const profileIdeMap: Record<string, string> = {
          Cursor: "cursor",
          Windsurf: "windsurf",
          "VS Code": "vscode",
          WebStorm: "webstorm",
          "IntelliJ IDEA": "intellij",
          PyCharm: "pycharm",
        };
        const ideId = profileIdeMap[ideName];
        if (ideId && profileSettings.enabledIDEs[ideId]) {
          await syncProfiles([ideId]);
          console.log(`Auto-synced profile for ${ideName}`);
        }
      }
    } catch (error) {
      console.error("Profile auto-sync failed:", error);
      // Don't block IDE launch if sync fails
    }

    // Update project lastOpened if projectPath is provided
    if (projectPath) {
      const projects = loadProjects();
      const project = projects.find((p) => p.path === projectPath);
      if (project) {
        project.lastOpened = Date.now();
        saveProjects(projects);
      }
    }

    return await launchIDE(ide, projectPath);
  }
);

ipcMain.handle("open-download", async (_event: unknown, url: string) => {
  await shell.openExternal(url);
  return { success: true };
});

// Project IPC Handlers
const { dialog } = require("electron");

ipcMain.handle("get-projects", () => {
  return loadProjects();
});

ipcMain.handle("add-project", async () => {
  if (!mainWindow) return null;

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
    title: "Select Project Folder",
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const projectPath = result.filePaths[0];
  const name = path.basename(projectPath);
  const settings = loadSettings();
  const preferredIDE = settings.defaultIDE || defaultSettings.defaultIDE;

  const newProject: Project = {
    id: Date.now().toString(),
    name,
    path: projectPath,
    preferredIDE,
    lastOpened: Date.now(),
  };

  const projects = loadProjects();
  // Check if already exists
  if (!projects.some((p) => p.path === newProject.path)) {
    projects.push(newProject);
    saveProjects(projects);
    return newProject;
  }

  return projects.find((p) => p.path === newProject.path);
});

ipcMain.handle("delete-project", (_event: unknown, projectId: string) => {
  const projects = loadProjects();
  const filtered = projects.filter((p) => p.id !== projectId);
  saveProjects(filtered);
  return filtered;
});

ipcMain.handle(
  "update-project-ide",
  (_event: unknown, projectId: string, ideName: string) => {
    const projects = loadProjects();
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      project.preferredIDE = ideName as IDEType;
      saveProjects(projects);
    }
    return projects;
  }
);

ipcMain.handle("scan-project-directory", async () => {
  if (!mainWindow) return null;

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
    title: "Select Master Project Directory",
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const masterPath = result.filePaths[0];
  const entries = fs.readdirSync(masterPath, { withFileTypes: true });

  const potentialProjects = entries
    .filter((entry: any) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry: any) => {
      const fullPath = path.join(masterPath, entry.name);
      return {
        name: entry.name,
        path: fullPath,
      };
    });

  return potentialProjects;
});

ipcMain.handle("add-multiple-projects", async (_event: unknown, projectPaths: string[]) => {
  const projects = loadProjects();
  const settings = loadSettings();
  const preferredIDE = settings.defaultIDE || defaultSettings.defaultIDE;
  let addedCount = 0;

  for (const projectPath of projectPaths) {
    // Check if already exists
    if (!projects.some((p) => p.path === projectPath)) {
      const name = path.basename(projectPath);
      const newProject: Project = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name,
        path: projectPath,
        preferredIDE,
        lastOpened: Date.now(),
      };
      projects.push(newProject);
      addedCount++;
    }
  }

  if (addedCount > 0) {
    saveProjects(projects);
  }

  return projects;
});

// Settings IPC Handlers
ipcMain.handle("get-settings", () => {
  return loadSettings();
});

ipcMain.handle("save-settings", (_event: unknown, settings: Settings) => {
  saveSettings({ ...defaultSettings, ...settings });
  return { success: true };
});

// ============================================================================
// MCP Sync IPC Handlers
// ============================================================================

// Get sync status for all IDEs
ipcMain.handle("get-mcp-sync-status", () => {
  return getMCPSyncStatus();
});

// Get sync settings
ipcMain.handle("get-mcp-sync-settings", () => {
  return loadSyncSettings();
});

// Save sync settings
ipcMain.handle("save-mcp-sync-settings", (_event: unknown, settings: any) => {
  saveSyncSettings(settings);
  return { success: true };
});

// Toggle IDE sync enabled/disabled
ipcMain.handle("toggle-mcp-ide-sync", (_event: unknown, ideId: string, enabled: boolean) => {
  return toggleIDESync(ideId, enabled);
});

// Sync MCP configs to IDEs
ipcMain.handle("sync-mcp-configs", async (_event: unknown, ideIds?: string[]) => {
  return await syncMCPConfigs(ideIds);
});

// Import config from an IDE
ipcMain.handle("import-mcp-from-ide", async (_event: unknown, ideId: string) => {
  return await importFromIDE(ideId);
});

// Create IDE-specific override
ipcMain.handle("create-mcp-override", (_event: unknown, ideId: string) => {
  createOverride(ideId);
  return { success: true };
});

// Delete IDE-specific override
ipcMain.handle("delete-mcp-override", (_event: unknown, ideId: string) => {
  deleteOverride(ideId);
  return { success: true };
});

// Open master config in default editor
ipcMain.handle("open-mcp-master-config", async () => {
  const configPath = getMasterConfigPath();
  await shell.openPath(configPath);
  return { success: true };
});

// Get sync log
ipcMain.handle("get-mcp-sync-log", () => {
  return loadSyncLog();
});

// ============================================================================
// Profile Sync IPC Handlers
// ============================================================================

ipcMain.handle("get-profile-sync-status", () => {
  return getProfileSyncStatusLib();
});

ipcMain.handle("get-profile-sync-settings", () => {
  return loadProfileSyncSettings();
});

ipcMain.handle("save-profile-sync-settings", (_event: unknown, settings: any) => {
  saveProfileSyncSettings(settings);
  return { success: true };
});

ipcMain.handle("toggle-profile-ide-sync", (_event: unknown, ideId: string, enabled: boolean) => {
  return toggleProfileIDESync(ideId, enabled);
});

ipcMain.handle("sync-profiles", async (_event: unknown, ideIds?: string[]) => {
  return await syncProfiles(ideIds);
});

ipcMain.handle("open-profile-master", async () => {
  const masterPath = getMasterProfilePath();
  await shell.openPath(masterPath);
  return { success: true };
});

// ============================================================================
// Process Management IPC Handlers
// ============================================================================

// Get running IDEs
ipcMain.handle("get-running-ides", async () => {
  return await getRunningIDEs();
});

// Get process stats
ipcMain.handle("get-process-stats", async () => {
  return await getProcessStats();
});

// Focus an IDE
ipcMain.handle("focus-ide", async (_event: unknown, pid: number) => {
  return await focusIDE(pid);
});

// Kill an IDE
ipcMain.handle("kill-ide", async (_event: unknown, pid: number) => {
  return await killIDE(pid);
});

// Kill all IDEs
ipcMain.handle("kill-all-ides", async () => {
  return await killAllIDEs();
});

// Get resource usage
ipcMain.handle("get-resource-usage", async () => {
  return await getResourceUsage();
});

// ============================================================================
// API Keys Sync IPC Handlers
// ============================================================================

// Get API keys settings
ipcMain.handle("get-api-keys-settings", () => {
  return loadAPIKeysSettings();
});

// Save API keys settings
ipcMain.handle("save-api-keys-settings", (_event: unknown, settings: any) => {
  saveAPIKeysSettings(settings);
  return { success: true };
});

// Update a specific API key
ipcMain.handle("update-api-key", (_event: unknown, keyName: string, value: string | undefined) => {
  updateAPIKey(keyName as any, value);
  return { success: true };
});

// Delete an API key
ipcMain.handle("delete-api-key", (_event: unknown, keyName: string) => {
  deleteAPIKey(keyName as any);
  return { success: true };
});

// Sync API keys to a specific IDE
ipcMain.handle("sync-api-keys-to-ide", async (_event: unknown, ideId: string) => {
  return await syncToIDE(ideId);
});

// Sync API keys to all enabled IDEs
ipcMain.handle("sync-api-keys-to-all", async () => {
  return await syncToAllIDEs();
});

// Toggle IDE key sync
ipcMain.handle("toggle-ide-key-sync", (_event: unknown, ideId: string, enabled: boolean) => {
  toggleIDEKeySync(ideId, enabled);
  return { success: true };
});

// Get API key types
ipcMain.handle("get-api-key-types", () => {
  return getAPIKeyTypes();
});

// Get API key sync status
ipcMain.handle("get-api-key-sync-status", () => {
  return getAPIKeySyncStatus();
});

// Mask an API key
ipcMain.handle("mask-api-key", (_event: unknown, key: string) => {
  return maskAPIKey(key);
});

// Validate an API key
ipcMain.handle("validate-api-key", (_event: unknown, keyName: string, value: string) => {
  return validateAPIKey(keyName as any, value);
});

// ============================================================================
// Command Palette Window
// ============================================================================

let commandPaletteWindow: typeof BrowserWindow | null = null;

function createCommandPaletteWindow(): void {
  if (commandPaletteWindow && !commandPaletteWindow.isDestroyed()) {
    commandPaletteWindow.show();
    commandPaletteWindow.focus();
    return;
  }

  const appPath = app.getAppPath();
  const preloadPath = path.join(appPath, "dist", "preload.js");
  const settings = loadSettings();

  // Get the display where the mouse is
  const { getCursorScreenPoint, getDisplayNearestPoint } = screen;
  const cursor = getCursorScreenPoint();
  const display = getDisplayNearestPoint(cursor);
  const { width: screenWidth, height: screenHeight } = display.workAreaSize;
  const { x: screenX, y: screenY } = display.workArea;

  const windowWidth = 650;
  const windowHeight = 500;

  commandPaletteWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: Math.round(screenX + (screenWidth - windowWidth) / 2),
    y: Math.round(screenY + screenHeight * 0.2),
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    show: false,
    backgroundColor: "#00000000",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath,
    },
  });

  // Load the command palette HTML
  const indexPath = path.join(appPath, "dist", "command-palette.html");
  if (fs.existsSync(indexPath)) {
    commandPaletteWindow.loadFile(indexPath);
  } else {
    // Fallback: load the same index.html but with a query param
    const mainIndexPath = path.join(appPath, "dist", "index.html");
    commandPaletteWindow.loadFile(mainIndexPath, { query: { mode: 'palette' } });
  }

  commandPaletteWindow.once("ready-to-show", () => {
    commandPaletteWindow?.show();
    commandPaletteWindow?.focus();
  });

  // Hide window when it loses focus
  commandPaletteWindow.on("blur", () => {
    if (commandPaletteWindow && !commandPaletteWindow.isDestroyed()) {
      commandPaletteWindow.hide();
    }
  });

  commandPaletteWindow.on("closed", () => {
    commandPaletteWindow = null;
  });
}

function toggleCommandPalette(): void {
  if (commandPaletteWindow && !commandPaletteWindow.isDestroyed() && commandPaletteWindow.isVisible()) {
    commandPaletteWindow.hide();
  } else {
    createCommandPaletteWindow();
  }
}

// IPC handler for hiding the command palette
ipcMain.on("hide-command-palette", () => {
  if (commandPaletteWindow && !commandPaletteWindow.isDestroyed()) {
    commandPaletteWindow.hide();
  }
});

// IPC handler for getting command palette data
ipcMain.handle("get-command-palette-data", async () => {
  const ides = getIDEsWithStatus(false);
  const projects = loadProjects();
  const runningIDEs = await getRunningIDEs();

  return {
    ides: ides.filter((ide: any) => ide.installed),
    projects,
    runningIDEs,
  };
});

// ============================================================================
// App Initialization
// ============================================================================

app.whenReady().then(() => {
  createWindow();
  getIDEsWithStatus(true);

  // Auto-sync profile on app launch if enabled
  try {
    const profileSettings = loadProfileSyncSettings();
    if (profileSettings.autoSyncOnLaunch) {
      syncProfiles().catch((err) =>
        console.error("Profile sync on launch failed:", err)
      );
    }
  } catch (error) {
    console.error("Failed to load profile sync settings:", error);
  }

  // Register global shortcut for command palette
  // Using Alt+Shift+Space to avoid conflicts with other apps like Raycast
  const shortcut = process.platform === "darwin"
    ? "Alt+Shift+Space"
    : "Alt+Shift+Space";

  const registered = globalShortcut.register(shortcut, () => {
    toggleCommandPalette();
  });

  if (!registered) {
    console.error(`Failed to register global shortcut: ${shortcut}`);
  } else {
    console.log(`Global shortcut registered: ${shortcut}`);
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("will-quit", () => {
  // Unregister all shortcuts when app is quitting
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
