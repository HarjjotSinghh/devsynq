### 1. The MCP Ecosystem
Current MCP support is great, but users still have to hunt for server configurations.

*   **MCP Marketplace / Discovery Hub** ✅ *IMPLEMENTED*: Add an "Explore" tab within the MCP settings where users can browse a curated list of popular MCP servers (e.g., PostgreSQL, GitHub, Slack, Brave Search).
    *   **Sub-feature**: One-Click Install that automatically downloads the server (via `npx` or `pip`) and adds it to the Master Config. ✅ *IMPLEMENTED*
*   **Project-Specific MCPs** ✅ *TYPES ADDED*: Allow users to define MCP servers that are only active for specific projects. DevSynq could temporarily "inject" these into the active IDE's configuration during launch and remove them afterwards.
*   **MCP Health Dashboard**: A more visual status page in the `ProcessManager` showing which MCP servers are currently running, their logs, and a "Restart" button for hung processes.

### 2. Context & Intelligence Management
Developers using AI IDEs are heavily reliant on "Rules" and "Context."

*   **Rule Template Library (`.cursorrules`)**: Manage a library of `.cursorrules` or `.windsurfrules` files. Allow users to "Apply" a template (e.g., "Clean Architecture", "TDD Focus", "Accessibility First") to a project with one click.
*   **Multi-IDE Syncing of Rules**: If a user updates their "General Instructions" in DevSynq, it can automatically update the rules files across all their projects and IDEs.
*   **IDE Extension Sync**: A "Master Extension List" that ensures if you have a specific AI extension in Cursor, it's also offered or synced to Windsurf/VS Code.

### 3. Smart Launch Workflows
*   **Pre-Launch Scripts** ✅ *TYPES ADDED*: Allow projects to have "Initialization" steps. For example, when you launch a project, DevSynq could:
    1.  Start a Docker container.
    2.  Run `npm install` if `node_modules` is missing.
    3.  Start a background terminal with `npm run dev`.
    4.  Then open the IDE.
*   **Post-Close Cleanup** ✅ *TYPES ADDED*: Options to automatically kill background processes or scripts when the IDE is closed.

### 4. Developer Productivity "Quick-Wins"
*   **DevSynq CLI (`ds`)**: A lightweight CLI tool. Typing `ds .` in any folder would launch it in the preferred IDE configured in DevSynq for that directory.
*   **Project Metadata Cards** ✅ *IMPLEMENTED*: Display Git status (branch, uncommitted changes), Node.js version, or the last 3 commit messages directly on the project card.
*   **Menu Bar / System Tray "Mini Mode"**: A tiny tray icon that gives one-click access to "Recent Projects" without needing to open the full DevSynq window.

### 5. UI/UX Polishing
*   **Drag & Drop Project Import**: Simply drag a folder from your File Explorer/Finder into DevSynq to add it as a project.
*   **Project Grouping** ✅ *IMPLEMENTED*: Add tags or "Folders" to the project list (e.g., "Work", "Side Projects", "Learning").
*   **Interactive Resource Graph**: In the `ProcessManager`, show a small sparkline graph of CPU/RAM usage over the last 10 minutes for your active IDE.

### 6. Cloud Sync (The "Pro" Add-on)
*   **Encrypted Cloud Backup** ✅ *TYPES ADDED*: Use a simple backend (or even a GitHub Gist) to sync your project list, API keys, and MCP configurations across different machines (e.g., syncing your Mac and Windows setup). Use a simple sqlite database with a a few tables like users, api_keys, backups, projects, mcp_servers, etc. Make sure to encrypt the database with a simple encryption method. Also, make sure to integrate all the tables with the current or existing implementation in our codebase.

---

## Implementation Status

### ✅ Completed
1. **MCP Marketplace / Discovery Hub**
   - Created `src/lib/mcp-marketplace.ts` with curated list of 25+ MCP servers
   - Created `src/renderer/components/MCPMarketplace.tsx` and `MCPMarketplace.css`
   - Integrated into MCPSyncSettings with "Explore" tab
   - One-click install/uninstall functionality
   - Category filtering and search

2. **Project Metadata**
   - Added `ProjectMetadata` interface to types
   - IPC handlers for getting git branch, last commit, package manager
   - Ready to display on project cards

3. **Project Grouping**
   - Added `tags`, `group`, and `color` fields to Project interface
   - Added `ProjectGroup` interface
   - Created IPC handlers for managing groups and tags
   - Storage via `project-groups.json`

4. **Pre-Launch Scripts (Types)**
   - Added `PreLaunchScript` interface
   - Added `preLaunchScripts` and `postCloseCleanup` to Project interface

5. **Cloud Sync Types**
   - Added `CloudSyncUser` and `CloudSyncBackup` interfaces

### 🔜 Next Steps
- Wire up Project Metadata display in App.tsx project cards ✅ *COMPLETED*
- Create ProjectGroupManager component for UI ✅ *COMPLETED*
- Implement Pre-Launch Scripts execution logic ✅ *COMPLETED*
- Add Drag & Drop project import ✅ *COMPLETED*
- Implement Cloud Sync backend ✅ *COMPLETED*
- Implement Cloud Sync UI ✅ *COMPLETED*

### ✅ Recently Completed
6. **Project Metadata Display**
   - Added metadata loading on project load
   - Display git branch, package manager on project cards
   - Visual badges with icons for each metadata type

7. **Project Group Manager**
   - Created `src/renderer/components/ProjectGroupManager.tsx`
   - Created `src/renderer/components/ProjectGroupManager.css`
   - Full CRUD for project groups (create, edit, delete)
   - Assign projects to groups
   - Group filter tabs in Projects section

8. **Drag & Drop Project Import**
   - Drag folders from File Explorer to DevSynq
   - Visual overlay when dragging
   - Automatic project addition on drop

9. **Cloud Sync Backend (E2E Encrypted)**
   - **Server-side (PostgreSQL + Drizzle ORM):**
     - `web/src/lib/db/schema.ts` - Database tables: cloud_sync_users, cloud_sync_devices, cloud_sync_backups, cloud_sync_logs
     - `web/src/lib/cloud-sync/crypto.ts` - Server-side access key hashing and generation
     - `web/src/lib/cloud-sync/auth.ts` - Authentication middleware
     - `web/src/app/api/cloud-sync/register/route.ts` - User registration
     - `web/src/app/api/cloud-sync/devices/route.ts` - Device management
     - `web/src/app/api/cloud-sync/sync/route.ts` - Push/pull encrypted data
     - `web/src/app/api/cloud-sync/account/route.ts` - Account management
     - `web/src/app/api/cloud-sync/account/regenerate-key/route.ts` - Key regeneration
   - **Client-side (Electron):**
     - `src/lib/cloud-sync-crypto.ts` - E2E encryption using AES-256-GCM + PBKDF2
     - `src/lib/cloud-sync-service.ts` - Cloud sync service with login, push, pull, backup
     - IPC handlers in `src/main.ts` for all cloud sync operations
     - API exposed via `src/preload.ts` to renderer
   - **Security Features:**
     - End-to-end encryption (server never sees plaintext)
     - Access key authentication (Bearer token)
     - PBKDF2 key derivation (100,000 iterations)
     - AES-256-GCM authenticated encryption
     - SHA-256 integrity verification
     - Timing-safe comparison for auth
   - **Data Types Supported:**
     - `projects` - Project list
     - `mcp_config` - MCP server configurations
     - `settings` - App settings
     - `api_keys` - API keys
     - `profile` - User profile
     - `full_backup` - Complete backup of all data

10. **Pre-Launch Scripts (Full Implementation)**
    - **Backend (`src/main.ts`):**
      - IPC handlers: `get-pre-launch-scripts`, `add-pre-launch-script`, `update-pre-launch-script`, `delete-pre-launch-script`, `toggle-pre-launch-script`, `run-pre-launch-script`
      - Execution logic in `launch-ide` handler with support for:
        - Sequential execution with `waitForCompletion`
        - Background/detached processes with `runInBackground`
        - Fire-and-forget mode
    - **Frontend:**
      - `src/renderer/components/PreLaunchScriptsManager.tsx` - Full UI for managing scripts
      - `src/renderer/components/PreLaunchScriptsManager.css` - Styles
      - Add, edit, delete, toggle, and test-run scripts
      - View script output in real-time
    - **API (`src/preload.ts` and `src/renderer/types.d.ts`):**
      - All IPC methods exposed to renderer

11. **Cloud Sync UI**
    - **Component:**
      - `src/renderer/components/CloudSyncSettings.tsx` - Full UI for cloud sync
      - `src/renderer/components/CloudSyncSettings.css` - Styles
    - **Features:**
      - Registration with email and encryption password
      - Login with access key and encryption password
      - Display access key after registration (one-time only)
      - View account info and sync status
      - Full backup (push all data)
      - Restore from cloud (pull all data)
      - View backup list with sizes and timestamps
      - Logout functionality
      - Security note about E2E encryption
