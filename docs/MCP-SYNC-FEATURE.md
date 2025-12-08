# MCP Configuration Sync Feature

DevSynq now includes a powerful **MCP (Model Context Protocol) Configuration Manager** that allows you to sync your MCP server configurations across multiple AI IDEs.

## Overview

Managing MCP servers across Cursor, Windsurf, Trae, VS Code, and other AI-powered IDEs can be tedious. Each IDE stores its MCP configuration in a different location, and keeping them in sync is error-prone. DevSynq solves this by providing:

- **Central Master Config**: One config to rule them all at `C:\Users\{your-username}\.devsynq\mcp.json`
- **One-Click Sync**: Push your master config to all enabled IDEs instantly
- **IDE-Specific Overrides**: Customize configs for specific IDEs when needed
- **Auto-Sync on Launch**: Automatically sync before launching an IDE via DevSynq
- **Backup Management**: Create backups before syncing to prevent data loss

## Configuration Locations

DevSynq manages MCP configs for the following IDEs:

| IDE | Config Path |
|-----|-------------|
| Cursor | `C:\Users\{user}\.cursor\mcp.json` |
| Windsurf | `C:\Users\{user}\.windsurf\mcp.json` |
| Trae | `%APPDATA%\Trae\user\mcp.json` |
| VS Code (Cline) | `%APPDATA%\Code\User\globalStorage\rooveterinaryinc.roo-cline\settings\cline_mcp_settings.json` |
| Qoder | `%APPDATA%\Qoder\SharedClientCache\mcp.json` |
| Antigravity | `C:\Users\{user}\.gemini\settings\mcp_config.json` |
| Kiro | `%APPDATA%\Kiro\mcp.json` |

## Getting Started

### Step 1: Open MCP Sync Settings

1. Click the **Settings** button (⚙️) in DevSynq's title bar
2. Navigate to the **🔄 MCP Sync** tab

### Step 2: Edit Your Master Config

1. Click **"Edit in Editor"** to open `C:\Users\{user}\.devsynq\mcp.json`
2. Add your MCP server configurations:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:/Projects"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token-here"
      }
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    }
  }
}
```

3. Save the file

### Step 3: Sync to IDEs

1. Enable/disable specific IDEs using the checkboxes
2. Click **"🔄 Sync All"** to push your config to all enabled IDEs
3. Or click the sync button (🔄) next to individual IDEs

### Step 4: Restart IDEs

After syncing, restart any running IDEs to pick up the new MCP configuration.

## Features

### Import from IDE

Already have a great MCP setup in Cursor? Click the **📥** button to import that config as your new master config.

### IDE-Specific Overrides

Need different servers for a specific IDE? Click **📝** to create an override:

1. Creates a file like `.devsynq/mcp.cursor.json`
2. Edit this file with IDE-specific settings
3. The override badge shows which IDEs have custom configs

To remove an override and sync from master config, click **🗑️**.

### Auto-Sync on Launch

When enabled (default), DevSynq automatically syncs the MCP config to an IDE before launching it. This ensures your configs are always up-to-date.

### Backups

Enable "Create backups before sync" to keep copies of your IDE configs before overwriting them. Backups are stored in `.devsynq/backups/{ide-name}/`.

## Configuration Structure

```
C:\Users\{user}\.devsynq\
  ├── mcp.json                    ← Master config (synced to all)
  ├── mcp.cursor.json             ← Cursor-specific override (optional)
  ├── mcp.trae.json               ← Trae-specific override (optional)
  ├── sync-settings.json          ← Sync preferences
  ├── sync-log.json               ← History of sync operations
  └── backups/                    ← Config backups
      ├── cursor/
      └── trae/
```

## Sync Log

Click the **"Sync Log"** tab to view a history of all sync operations, including:
- Timestamp
- Action (sync/import)
- Target IDE
- Success/failure status
- Error messages (if any)

## Troubleshooting

### "Config not found" Error

The IDE's config directory may not exist yet. Try:
1. Open the IDE at least once
2. Enable MCP in the IDE's settings
3. Try syncing again

### Changes Not Taking Effect

Most IDEs require a restart to reload MCP configuration. After syncing:
1. Close the IDE completely
2. Reopen it (either via DevSynq or normally)

### Sync Failed

Check the sync log for specific error messages. Common issues:
- File permissions (run DevSynq as administrator if needed)
- Invalid JSON in master config
- IDE config directory doesn't exist

## Tips

1. **Test your config**: After editing the master config, sync to one IDE first and verify it works before syncing to all.

2. **Use environment variables**: For sensitive data like API tokens, use environment variables in your MCP config instead of hardcoding them.

3. **Organize servers**: Group related servers together with comments in your JSON for easier maintenance.

4. **Disable unused servers**: Use the `"disabled": true` property to temporarily disable a server without removing it:

```json
{
  "mcpServers": {
    "experimental-server": {
      "command": "npx",
      "args": ["experimental-mcp"],
      "disabled": true
    }
  }
}
```

## Integration with IDE Launch

When you launch an IDE via DevSynq (either from the IDE grid or the projects section), the MCP config is automatically synced if:

1. Auto-sync is enabled in settings
2. The specific IDE is enabled for sync
3. The IDE has a known MCP config path

This "sync-before-launch" approach ensures your MCP servers are always up-to-date without manual intervention.
