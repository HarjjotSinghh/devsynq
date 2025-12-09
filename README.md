# DevSynq - AI IDE Launcher

A sleek, modern Electron application to launch your favorite AI-powered development environments.

![DevSynq](https://img.shields.io/badge/version-1.0.1-purple)
![Electron](https://img.shields.io/badge/Electron-39.2.6-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Bun](https://img.shields.io/badge/Bun-1.3.2-orange)

## Features

- **Smart Launch**: One-click launch for your projects in their preferred AI IDE
- **Project Management**: Organize your local projects and define IDE preferences per project
- **Auto-Detect**: Automatically scans your directories to find projects and installs
- **API Key Management**: Centralized storage for your AI API keys
- **Easy Install**: Links to download pages for IDEs not yet installed
- **Premium UI**: Beautiful dark theme with glassmorphism effects
- **Fast**: Built with Bun for lightning-fast build times
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Supported IDEs

| IDE | Windows | macOS | Linux |
|-----|---------|-------|-------|
| Cursor | Yes | Yes | Yes |
| Windsurf | Yes | Yes | Yes |
| VS Code | Yes | Yes | Yes |
| Zed | Yes | Yes | Yes |
| WebStorm | Yes | Yes | Yes |

## Prerequisites

- [Bun](https://bun.sh) (v1.0.0 or higher)
- [Node.js](https://nodejs.org) (v18 or higher)

## Getting Started

### Installation

**Method 1: Download Installer**
Download the latest release for your operating system from the [Releases](https://github.com/HarjjotSinghh/devsynq/releases) page.

**Method 2: Build from Source**

```bash
# Clone the repository
git clone https://github.com/HarjjotSinghh/devsynq.git
cd devsynq

# Install dependencies
bun install
```

### Development

```bash
# Build and run the app
bun run start

# Or use dev mode
bun run dev
```

### Building for Distribution

```bash
# Build unpacked
bun run pack

# Build installer
bun run dist
```

## Marketing Website

The source code for the DevSynq marketing website is included in this repository.
Located in the `web/` directory, it is a Next.js 16 application built with Tailwind CSS and shadcn/ui.

See `web/README.md` for more details.

## Project Structure

```
devsynq/
├── src/
│   ├── main.ts         # Electron main process
│   ├── preload.ts      # Preload script for IPC
│   └── renderer/       # Renderer process (React App)
├── web/                # Marketing Website (Next.js)
├── dist/               # Compiled Electron Output
├── release/            # Built Installers
├── package.json
└── README.md
```

## How It Works

1. **Main Process** (`main.ts`): Creates the Electron window and handles IPC communication
2. **Preload Script** (`preload.ts`): Safely exposes limited Node.js APIs to the renderer
3. **Renderer Process** (`src/renderer/`): Handles UI logic, IDE detection, and launching

### IDE Detection

The app checks standard installation paths for each IDE:

**Windows:**
- Cursor: `C:\Users\{username}\AppData\Local\Programs\Cursor\Cursor.exe`
- VS Code: `C:\Users\{username}\AppData\Local\Programs\Microsoft VS Code\Code.exe`
- Windsurf: `C:\Users\{username}\AppData\Local\Programs\Windsurf\Windsurf.exe`

**macOS:**
- Cursor: `/Applications/Cursor.app`
- VS Code: `/Applications/Visual Studio Code.app`
- Windsurf: `/Applications/Windsurf.app`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Built with [Electron](https://electronjs.org/)
- Bundled with [Bun](https://bun.sh/)
- UI Components by [shadcn/ui](https://ui.shadcn.com/)
- Designed with love by the DevSynq team
