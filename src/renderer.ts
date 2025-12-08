import { IDE, Project, Settings } from "./types";

interface ElectronAPI {
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

const SETTINGS_DEFAULTS: Settings = {
  defaultIDE: "Cursor",
  launchAtStartup: false,
  theme: "dark",
  autoDetectIDEs: true,
};

let currentIDEs: Array<IDE & { installed?: boolean }> = [];
let currentProjects: Project[] = [];
let currentSettings: Settings = { ...SETTINGS_DEFAULTS };
let projectSearchTerm = "";

// Initialize the app
async function init(): Promise<void> {
  console.log("Init called");
  console.log("window.electronAPI:", window.electronAPI);

  if (!window.electronAPI) {
    console.error(
      "electronAPI is not available! Preload script may not be loading."
    );
    // Show error in UI
    const grid = document.getElementById("ide-grid");
    if (grid) {
      grid.innerHTML = `
                <div class="error-state">
                    <p>Error: electronAPI not available. Check console for details.</p>
                </div>
            `;
    }
    return;
  }

  // Set up window controls
  setupWindowControls();

  setupKeyboardShortcuts();
  setupProjectListeners();
  setupSettingsListeners();

  // Load settings first so theme/defaults are applied
  await loadSettings();

  // Load and render IDEs
  await loadIDEs();

  // Load and render Projects
  await loadProjects();
  renderSettingsUI();
}

function setupWindowControls(): void {
  const minimizeBtn = document.getElementById("minimize-btn");
  const maximizeBtn = document.getElementById("maximize-btn");
  const closeBtn = document.getElementById("close-btn");

  minimizeBtn?.addEventListener("click", () => window.electronAPI.minimize());
  maximizeBtn?.addEventListener("click", () => window.electronAPI.maximize());
  closeBtn?.addEventListener("click", () => window.electronAPI.close());
}

function setupKeyboardShortcuts(): void {
  document.addEventListener("keydown", async (event) => {
    const isCmdOrCtrl = event.metaKey || event.ctrlKey;
    if (!isCmdOrCtrl) return;

    if (event.key === "," && !event.shiftKey) {
      event.preventDefault();
      openSettingsModal();
      return;
    }

    if (event.key.toLowerCase() === "p") {
      event.preventDefault();
      focusProjectSearch();
      return;
    }

    const numeric = Number(event.key);
    if (!Number.isNaN(numeric) && numeric >= 1 && numeric <= 5) {
      event.preventDefault();
      const installed = currentIDEs.filter((ide) => ide.installed);
      const target = installed[numeric - 1];
      if (target) {
        showToast(`Launching ${target.name}...`);
        await window.electronAPI.launchIDE(target.name);
      } else {
        showToast("No IDE in that slot yet");
      }
    }
  });
}

function focusProjectSearch(): void {
  const searchInput = document.getElementById(
    "project-search"
  ) as HTMLInputElement | null;
  if (searchInput) {
    searchInput.focus();
    searchInput.select();
  }
}

function openSettingsModal(): void {
  const modal = document.getElementById("settings-modal");
  if (modal) {
    modal.classList.add("show");
  }
}

function closeSettingsModal(): void {
  const modal = document.getElementById("settings-modal");
  if (modal) {
    modal.classList.remove("show");
  }
}

function setupProjectListeners(): void {
  const addBtn = document.getElementById("add-project-btn");
  addBtn?.addEventListener("click", async () => {
    try {
      const newProject = await window.electronAPI.addProject();
      if (newProject) {
        await loadProjects();
        showToast(`Project "${newProject.name}" added!`);
      }
    } catch (error) {
      console.error("Failed to add project:", error);
      showToast("Failed to add project");
    }
  });

  const searchInput = document.getElementById(
    "project-search"
  ) as HTMLInputElement | null;
  searchInput?.addEventListener("input", () => {
    projectSearchTerm = searchInput.value;
    renderProjects();
  });
}

function setupSettingsListeners(): void {
  const settingsBtn = document.getElementById("settings-btn");
  const modal = document.getElementById("settings-modal");
  const closeBtn = document.querySelector(".close-modal");
  const saveBtn = document.getElementById("save-settings-btn");
  const defaultIDESelect = document.getElementById(
    "default-ide-select"
  ) as HTMLSelectElement | null;
  const launchStartupCheck = document.getElementById(
    "launch-startup-check"
  ) as HTMLInputElement | null;
  const autoDetectCheck = document.getElementById(
    "auto-detect-check"
  ) as HTMLInputElement | null;
  const themeToggle = document.getElementById(
    "theme-toggle"
  ) as HTMLInputElement | null;

  settingsBtn?.addEventListener("click", () => openSettingsModal());
  closeBtn?.addEventListener("click", () => closeSettingsModal());
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeSettingsModal();
    }
  });

  saveBtn?.addEventListener("click", async () => {
    try {
      const updated: Settings = {
        defaultIDE: defaultIDESelect?.value || currentSettings.defaultIDE,
        launchAtStartup: !!launchStartupCheck?.checked,
        autoDetectIDEs: !!autoDetectCheck?.checked,
        theme: themeToggle?.checked ? "light" : "dark",
      };

      currentSettings = updated;
      applyTheme(updated.theme);
      await window.electronAPI.saveSettings(updated);
      showToast("Settings saved");
      closeSettingsModal();
    } catch (error) {
      console.error("Failed to save settings", error);
      showToast("Failed to save settings");
    }
  });

  window.electronAPI.onShowSettings(() => openSettingsModal());
}

async function loadIDEs(forceScan = false): Promise<void> {
  const grid = document.getElementById("ide-grid");
  const installedCount = document.getElementById("installed-count");
  const totalCount = document.getElementById("total-count");

  if (!grid) return;

  // Show loading state
  grid.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Scanning for installed IDEs...</p>
    </div>
  `;

  try {
    const ides = forceScan
      ? await window.electronAPI.refreshIDEs()
      : await window.electronAPI.getIDEs();
    currentIDEs = ides;
    const installed = ides.filter((ide) => ide.installed).length;

    // Update stats
    if (installedCount) installedCount.textContent = installed.toString();
    if (totalCount) totalCount.textContent = ides.length.toString();

    updateDefaultIDEOptions();

    // Render IDE cards
    grid.innerHTML = "";
    ides.forEach((ide) => {
      const card = createIDECard(ide);
      grid.appendChild(card);
    });
  } catch (error) {
    grid.innerHTML = `
      <div class="error-state">
        <p>Failed to load IDEs. Please restart the app.</p>
      </div>
    `;
    console.error("Failed to load IDEs:", error);
  }
}

async function loadSettings(): Promise<void> {
  try {
    const settings = await window.electronAPI.getSettings();
    currentSettings = { ...SETTINGS_DEFAULTS, ...settings };
    applyTheme(currentSettings.theme);
  } catch (error) {
    console.error("Failed to load settings:", error);
    currentSettings = { ...SETTINGS_DEFAULTS };
  }
}

function renderSettingsUI(): void {
  const defaultIDESelect = document.getElementById(
    "default-ide-select"
  ) as HTMLSelectElement | null;
  const launchStartupCheck = document.getElementById(
    "launch-startup-check"
  ) as HTMLInputElement | null;
  const autoDetectCheck = document.getElementById(
    "auto-detect-check"
  ) as HTMLInputElement | null;
  const themeToggle = document.getElementById(
    "theme-toggle"
  ) as HTMLInputElement | null;

  updateDefaultIDEOptions();

  if (defaultIDESelect) {
    defaultIDESelect.value = currentSettings.defaultIDE;
  }
  if (launchStartupCheck) {
    launchStartupCheck.checked = currentSettings.launchAtStartup;
  }
  if (autoDetectCheck) {
    autoDetectCheck.checked = currentSettings.autoDetectIDEs;
  }
  if (themeToggle) {
    themeToggle.checked = currentSettings.theme === "light";
  }
}

function updateDefaultIDEOptions(): void {
  const defaultIDESelect = document.getElementById(
    "default-ide-select"
  ) as HTMLSelectElement | null;
  if (!defaultIDESelect || currentIDEs.length === 0) return;

  const selected = defaultIDESelect.value;
  defaultIDESelect.innerHTML = "";
  currentIDEs.forEach((ide) => {
    const option = document.createElement("option");
    option.value = ide.name;
    option.textContent = ide.name;
    defaultIDESelect.appendChild(option);
  });
  if (selected) {
    defaultIDESelect.value = selected;
  }
}

function applyTheme(theme: Settings["theme"]): void {
  currentSettings.theme = theme;
  document.body.dataset.theme = theme;
}

async function loadProjects(): Promise<void> {
  const grid = document.getElementById("projects-grid");
  const recentsContainer = document.getElementById("recent-projects");
  if (!grid || !recentsContainer) return;

  try {
    currentProjects = await window.electronAPI.getProjects();
    renderProjects();
  } catch (error) {
    console.error("Failed to load projects:", error);
  }
}

function renderProjects(): void {
  const grid = document.getElementById("projects-grid");
  const recentsContainer = document.getElementById("recent-projects");
  if (!grid || !recentsContainer) return;

  const normalizedSearch = projectSearchTerm.trim().toLowerCase();
  const filtered = currentProjects.filter((project) => {
    if (!normalizedSearch) return true;
    return (
      project.name.toLowerCase().includes(normalizedSearch) ||
      project.path.toLowerCase().includes(normalizedSearch)
    );
  });

  const sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  grid.innerHTML = "";

  if (sorted.length === 0) {
    grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 20px;">
                No projects found. Click "Add Project" to get started.
            </div>
        `;
  } else {
    sorted.forEach((project) => {
      const card = createProjectCard(project);
      grid.appendChild(card);
    });
  }

  const recents = [...currentProjects]
    .filter((p) => typeof p.lastOpened === "number")
    .sort((a, b) => (b.lastOpened || 0) - (a.lastOpened || 0))
    .slice(0, 3);

  recentsContainer.innerHTML = "";
  if (recents.length === 0) {
    recentsContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 12px;">
                Launch some projects to see recent items here.
            </div>
        `;
  } else {
    recents.forEach((project) => {
      const card = createProjectCard(project, true);
      recentsContainer.appendChild(card);
    });
  }
}

function createProjectCard(
  project: Project,
  isCompact = false
): HTMLDivElement {
  const card = document.createElement("div");
  card.className = `project-card ${isCompact ? "compact" : ""}`;

  // Determine icon based on preferred IDE
  // Simple mapping for now
  let icon = "📁";
  if (project.preferredIDE.includes("Cursor")) icon = "⚡";
  else if (project.preferredIDE.includes("Code")) icon = "💻";
  else if (project.preferredIDE.includes("Windsurf")) icon = "🏄";

  const lastOpened = project.lastOpened
    ? new Date(project.lastOpened).toLocaleString()
    : "";

  card.innerHTML = `
        <div class="project-info">
            <div class="project-icon">${icon}</div>
            <div class="project-details">
                <div class="project-name">${project.name}</div>
                <div class="project-path" title="${project.path}">${
    project.path
  }</div>
                <div class="project-ide" style="font-size: 11px; color: var(--accent-primary); margin-top: 2px;">${
                  project.preferredIDE
                }</div>
                ${
                  lastOpened && isCompact
                    ? `<div class="project-meta">Last opened ${lastOpened}</div>`
                    : ""
                }
            </div>
        </div>
        <div class="project-actions">
            <button class="project-action-btn launch" title="Open in ${
              project.preferredIDE
            }">🚀</button>
            <button class="project-action-btn delete" title="Remove Project">🗑️</button>
        </div>
    `;

  // Launch handler
  card.querySelector(".launch")?.addEventListener("click", async (e) => {
    e.stopPropagation();
    await handleLaunchProject(project);
  });

  // Delete handler
  card.querySelector(".delete")?.addEventListener("click", async (e) => {
    e.stopPropagation();
    if (confirm(`Remove "${project.name}" from list?`)) {
      await window.electronAPI.deleteProject(project.id);
      await loadProjects();
    }
  });

  // Card click launches
  card.addEventListener("click", async () => {
    await handleLaunchProject(project);
  });

  return card;
}

function resolveIDEForProject(project: Project): string {
  const preferred =
    project.preferredIDE ||
    currentSettings.defaultIDE ||
    SETTINGS_DEFAULTS.defaultIDE;
  const installedPreferred = currentIDEs.find(
    (ide) => ide.name === preferred && ide.installed
  );
  if (installedPreferred) return installedPreferred.name;

  const installedDefault = currentIDEs.find(
    (ide) => ide.name === currentSettings.defaultIDE && ide.installed
  );
  if (installedDefault) return installedDefault.name;

  const firstInstalled = currentIDEs.find((ide) => ide.installed);
  return firstInstalled?.name || preferred;
}

async function handleLaunchProject(project: Project): Promise<void> {
  const ideName = resolveIDEForProject(project);
  showToast(`Opening ${project.name} in ${ideName}...`);
  try {
    const result = await window.electronAPI.launchIDE(ideName, project.path);
    if (!result.success) {
      showToast(`Failed: ${result.error}`);
    } else {
      await loadProjects();
    }
  } catch (error) {
    showToast("Error launching project");
    console.error(error);
  }
}

function createIDECard(ide: IDE): HTMLDivElement {
  const card = document.createElement("div");
  card.className = `ide-card ${ide.installed ? "installed" : "not-installed"}`;
  card.style.setProperty("--accent-color", ide.color);

  card.innerHTML = `
    <div class="card-glow"></div>
    <div class="card-content">
      <div class="ide-icon">${ide.icon}</div>
      <h3 class="ide-name">${ide.name}</h3>
      <div class="ide-status">
        <span class="status-dot ${
          ide.installed ? "active" : "inactive"
        }"></span>
        <span class="status-text">${
          ide.installed ? "Installed" : "Not Installed"
        }</span>
      </div>
      <button class="ide-action-btn ${
        ide.installed ? "launch-btn" : "install-btn"
      }">
        ${ide.installed ? "🚀 Launch" : "📥 Install"}
      </button>
    </div>
  `;

  const actionBtn = card.querySelector(".ide-action-btn");
  actionBtn?.addEventListener("click", async (e) => {
    e.stopPropagation();
    if (ide.installed) {
      await handleLaunch(ide, actionBtn as HTMLButtonElement);
    } else {
      await handleInstall(ide);
    }
  });

  // Also allow clicking the entire card
  card.addEventListener("click", async () => {
    if (ide.installed) {
      await handleLaunch(
        ide,
        card.querySelector(".ide-action-btn") as HTMLButtonElement
      );
    } else {
      await handleInstall(ide);
    }
  });

  return card;
}

async function handleLaunch(ide: IDE, btn: HTMLButtonElement): Promise<void> {
  const originalText = btn.innerHTML;
  btn.innerHTML = "⏳ Launching...";
  btn.disabled = true;

  try {
    const result = await window.electronAPI.launchIDE(ide.name);
    if (result.success) {
      btn.innerHTML = "✅ Launched!";
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 2000);
    } else {
      btn.innerHTML = "❌ Failed";
      console.error("Launch failed:", result.error);
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 2000);
    }
  } catch (error) {
    btn.innerHTML = "❌ Error";
    console.error("Launch error:", error);
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 2000);
  }
}

async function handleInstall(ide: IDE): Promise<void> {
  showToast(
    `Opening ${ide.name} download page... Click refresh after install.`
  );
  await window.electronAPI.openDownload(ide.downloadUrl);
}

function showToast(message: string): void {
  // Remove existing toasts
  const existingToast = document.querySelector(".toast");
  existingToast?.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add("show"), 10);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Refresh button functionality
document.getElementById("refresh-btn")?.addEventListener("click", async () => {
  const btn = document.getElementById("refresh-btn") as HTMLButtonElement;
  btn.disabled = true;
  btn.style.transform = "rotate(360deg)";

  await loadIDEs(true);

  setTimeout(() => {
    btn.disabled = false;
    btn.style.transform = "";
  }, 500);
});

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", init);
