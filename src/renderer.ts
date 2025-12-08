// Type definitions for the electron API exposed via preload
interface IDE {
    name: string;
    icon: string;
    macPath: string;
    winPath: string;
    linuxPath: string;
    downloadUrl: string;
    color: string;
    installed: boolean;
}

interface ElectronAPI {
    getIDEs: () => Promise<IDE[]>;
    launchIDE: (ideName: string) => Promise<{ success: boolean; error?: string }>;
    openDownload: (url: string) => Promise<{ success: boolean }>;
    minimize: () => void;
    maximize: () => void;
    close: () => void;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

// Initialize the app
async function init(): Promise<void> {
    console.log('Init called');
    console.log('window.electronAPI:', window.electronAPI);

    if (!window.electronAPI) {
        console.error('electronAPI is not available! Preload script may not be loading.');
        // Show error in UI
        const grid = document.getElementById('ide-grid');
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

    // Load and render IDEs
    await loadIDEs();
}

function setupWindowControls(): void {
    const minimizeBtn = document.getElementById('minimize-btn');
    const maximizeBtn = document.getElementById('maximize-btn');
    const closeBtn = document.getElementById('close-btn');

    minimizeBtn?.addEventListener('click', () => window.electronAPI.minimize());
    maximizeBtn?.addEventListener('click', () => window.electronAPI.maximize());
    closeBtn?.addEventListener('click', () => window.electronAPI.close());
}

async function loadIDEs(): Promise<void> {
    const grid = document.getElementById('ide-grid');
    const installedCount = document.getElementById('installed-count');
    const totalCount = document.getElementById('total-count');

    if (!grid) return;

    // Show loading state
    grid.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Scanning for installed IDEs...</p>
    </div>
  `;

    try {
        const ides = await window.electronAPI.getIDEs();
        const installed = ides.filter(ide => ide.installed).length;

        // Update stats
        if (installedCount) installedCount.textContent = installed.toString();
        if (totalCount) totalCount.textContent = ides.length.toString();

        // Render IDE cards
        grid.innerHTML = '';
        ides.forEach(ide => {
            const card = createIDECard(ide);
            grid.appendChild(card);
        });

    } catch (error) {
        grid.innerHTML = `
      <div class="error-state">
        <p>Failed to load IDEs. Please restart the app.</p>
      </div>
    `;
        console.error('Failed to load IDEs:', error);
    }
}

function createIDECard(ide: IDE): HTMLDivElement {
    const card = document.createElement('div');
    card.className = `ide-card ${ide.installed ? 'installed' : 'not-installed'}`;
    card.style.setProperty('--accent-color', ide.color);

    card.innerHTML = `
    <div class="card-glow"></div>
    <div class="card-content">
      <div class="ide-icon">${ide.icon}</div>
      <h3 class="ide-name">${ide.name}</h3>
      <div class="ide-status">
        <span class="status-dot ${ide.installed ? 'active' : 'inactive'}"></span>
        <span class="status-text">${ide.installed ? 'Installed' : 'Not Installed'}</span>
      </div>
      <button class="ide-action-btn ${ide.installed ? 'launch-btn' : 'install-btn'}">
        ${ide.installed ? '🚀 Launch' : '📥 Install'}
      </button>
    </div>
  `;

    const actionBtn = card.querySelector('.ide-action-btn');
    actionBtn?.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (ide.installed) {
            await handleLaunch(ide, actionBtn as HTMLButtonElement);
        } else {
            await handleInstall(ide);
        }
    });

    // Also allow clicking the entire card
    card.addEventListener('click', async () => {
        if (ide.installed) {
            await handleLaunch(ide, card.querySelector('.ide-action-btn') as HTMLButtonElement);
        } else {
            await handleInstall(ide);
        }
    });

    return card;
}

async function handleLaunch(ide: IDE, btn: HTMLButtonElement): Promise<void> {
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Launching...';
    btn.disabled = true;

    try {
        const result = await window.electronAPI.launchIDE(ide.name);
        if (result.success) {
            btn.innerHTML = '✅ Launched!';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 2000);
        } else {
            btn.innerHTML = '❌ Failed';
            console.error('Launch failed:', result.error);
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 2000);
        }
    } catch (error) {
        btn.innerHTML = '❌ Error';
        console.error('Launch error:', error);
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 2000);
    }
}

async function handleInstall(ide: IDE): Promise<void> {
    showToast(`Opening ${ide.name} download page...`);
    await window.electronAPI.openDownload(ide.downloadUrl);
}

function showToast(message: string): void {
    // Remove existing toasts
    const existingToast = document.querySelector('.toast');
    existingToast?.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Refresh button functionality
document.getElementById('refresh-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('refresh-btn') as HTMLButtonElement;
    btn.disabled = true;
    btn.style.transform = 'rotate(360deg)';

    await loadIDEs();

    setTimeout(() => {
        btn.disabled = false;
        btn.style.transform = '';
    }, 500);
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
