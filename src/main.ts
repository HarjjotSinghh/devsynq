// Main process - must use require for Electron compatibility
const {
  app,
  BrowserWindow,
  ipcMain,
  shell,
  Tray,
  Menu,
  nativeImage,
} = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { spawn } = require("child_process");
const { exec } = require("child_process");

// IDE Configuration

import { IDE, Project, Settings } from "./types";

// Helper to expand paths with environment variables
function expandPath(pathStr: string): string {
  return pathStr.replace(/%([^%]+)%/g, (_, n) => process.env[n] || "");
}

const username = os.userInfo().username;
const userDataPath = app.getPath("userData");
const projectsFile = path.join(userDataPath, "projects.json");
const settingsFile = path.join(userDataPath, "settings.json");

const defaultSettings: Settings = {
  defaultIDE: "Cursor",
  launchAtStartup: false,
  theme: "dark",
  autoDetectIDEs: true,
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
    name: "Cursor",
    icon: "⚡",
    macPaths: ["/Applications/Cursor.app"],
    winPaths: [
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\Cursor\\Cursor.exe`,
      `C:\\Program Files\\Cursor\\Cursor.exe`,
      `C:\\Program Files (x86)\\Cursor\\Cursor.exe`,
      expandPath("%LOCALAPPDATA%\\Programs\\Cursor\\Cursor.exe"),
    ],
    linuxPaths: ["/usr/share/cursor/cursor", "/usr/bin/cursor"],
    downloadUrl: "https://cursor.sh/",
    color: "#7c3aed",
  },
  {
    name: "Windsurf",
    icon: "🏄",
    macPaths: ["/Applications/Windsurf.app"],
    winPaths: [
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\Windsurf\\Windsurf.exe`,
      `C:\\Program Files\\Windsurf\\Windsurf.exe`,
      expandPath("%LOCALAPPDATA%\\Programs\\Windsurf\\Windsurf.exe"),
    ],
    linuxPaths: ["/usr/share/windsurf/windsurf"],
    downloadUrl: "https://codeium.com/windsurf",
    color: "#06b6d4",
  },
  {
    name: "VS Code",
    icon: "💻",
    macPaths: ["/Applications/Visual Studio Code.app"],
    winPaths: [
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe`,
      `C:\\Program Files\\Microsoft VS Code\\Code.exe`,
      expandPath("%LOCALAPPDATA%\\Programs\\Microsoft VS Code\\Code.exe"),
    ],
    linuxPaths: ["/usr/share/code/code", "/usr/bin/code"],
    downloadUrl: "https://code.visualstudio.com/",
    color: "#0078d4",
  },
  {
    name: "Zed",
    icon: "⚡",
    macPaths: ["/Applications/Zed.app"],
    winPaths: [
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\Zed\\Zed.exe`,
      `C:\\Program Files\\Zed\\Zed.exe`,
    ],
    linuxPaths: ["/usr/bin/zed"],
    downloadUrl: "https://zed.dev/",
    color: "#f59e0b",
  },
  {
    name: "WebStorm",
    icon: "🌐",
    macPaths: ["/Applications/WebStorm.app"],
    winPaths: [
      `C:\\Program Files\\JetBrains\\WebStorm\\bin\\webstorm64.exe`,
      `C:\\Users\\${username}\\AppData\\Local\\JetBrains\\WebStorm\\bin\\webstorm64.exe`,
    ],
    linuxPaths: ["/usr/share/webstorm/bin/webstorm.sh"],
    downloadUrl: "https://www.jetbrains.com/webstorm/",
    color: "#00d8ff",
  },
  {
    name: "Trae",
    icon: "🚀",
    macPaths: ["/Applications/Trae.app"],
    winPaths: [
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\Trae\\Trae.exe`,
      `C:\\Program Files\\Trae\\Trae.exe`,
    ],
    linuxPaths: ["/usr/bin/trae"],
    downloadUrl: "https://www.trae.ai/",
    color: "#1e1e1e",
  },
  {
    name: "Replit",
    icon: "🌀",
    macPaths: ["/Applications/Replit.app"],
    winPaths: [
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\Replit\\Replit.exe`,
      `C:\\Program Files\\Replit\\Replit.exe`,
    ],
    linuxPaths: ["/usr/bin/replit"],
    downloadUrl: "https://replit.com/desktop",
    color: "#f26207",
  },
  {
    name: "Cody",
    icon: "🤖",
    macPaths: ["/Applications/Cody.app"],
    winPaths: [
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\Cody\\Cody.exe`,
      `C:\\Program Files\\Cody\\Cody.exe`,
      expandPath("%LOCALAPPDATA%\\Programs\\Cody\\Cody.exe"),
    ],
    linuxPaths: ["/usr/bin/cody"],
    downloadUrl: "https://sourcegraph.com/cody",
    color: "#ff5b4d",
  },
  {
    name: "Continue",
    icon: "🔗",
    macPaths: ["/Applications/Continue.app"],
    winPaths: [
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\Continue\\Continue.exe`,
      `C:\\Program Files\\Continue\\Continue.exe`,
    ],
    linuxPaths: ["/usr/bin/continue"],
    downloadUrl: "https://continue.dev",
    color: "#4ade80",
  },
  {
    name: "IntelliJ IDEA",
    icon: "💡",
    macPaths: ["/Applications/IntelliJ IDEA.app"],
    winPaths: [
      `C:\\Program Files\\JetBrains\\IntelliJ IDEA 2024.2\\bin\\idea64.exe`,
      `C:\\Program Files\\JetBrains\\IntelliJ IDEA\\bin\\idea64.exe`,
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\IntelliJ IDEA\\bin\\idea64.exe`,
    ],
    linuxPaths: ["/usr/bin/idea", "/usr/local/bin/idea"],
    downloadUrl: "https://www.jetbrains.com/idea/download/",
    color: "#ff4081",
  },
  {
    name: "PyCharm",
    icon: "🐍",
    macPaths: ["/Applications/PyCharm.app"],
    winPaths: [
      `C:\\Program Files\\JetBrains\\PyCharm 2024.2\\bin\\pycharm64.exe`,
      `C:\\Program Files\\JetBrains\\PyCharm\\bin\\pycharm64.exe`,
      `C:\\Users\\${username}\\AppData\\Local\\Programs\\PyCharm\\bin\\pycharm64.exe`,
    ],
    linuxPaths: ["/usr/bin/pycharm", "/usr/local/bin/pycharm"],
    downloadUrl: "https://www.jetbrains.com/pycharm/download/",
    color: "#21d19f",
  },
];

function getIDEPath(ide: IDE): string | null {
  const platform = os.platform();
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

  for (const p of paths) {
    if (fs.existsSync(p)) {
      return p;
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

function createWindow(): void {
  const appPath = app.getAppPath();
  const preloadPath = path.join(appPath, "dist", "preload.js");
  const indexPath = path.join(appPath, "dist", "index.html");

  console.log("App path:", appPath);
  console.log("Preload path:", preloadPath);
  console.log("Index path:", indexPath);

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    // Disable transparency for now to fix "stuck" issues on some Windows configs
    transparent: false,
    backgroundColor: "#0a0a0f", // Match CSS bg-primary
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath,
    },
  });

  mainWindow.loadFile(indexPath);

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
    const ide = IDEs.find((i) => i.name === ideName);
    if (!ide) {
      return { success: false, error: "IDE not found" };
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
      project.preferredIDE = ideName;
      saveProjects(projects);
    }
    return projects;
  }
);

// Settings IPC Handlers
ipcMain.handle("get-settings", () => {
  return loadSettings();
});

ipcMain.handle("save-settings", (_event: unknown, settings: Settings) => {
  saveSettings(settings);
  return { success: true };
});

app.whenReady().then(() => {
  createWindow();
  getIDEsWithStatus(true);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

