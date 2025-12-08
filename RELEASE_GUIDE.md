# Build & Release Guide for DevSynq

This guide explains how to package the DevSynq application for Windows and macOS, and how to publish releases to GitHub.

## 1. Prerequisites

- **Bun**: Ensure you have [Bun](https://bun.sh) installed.
- **ImageMagick** (Optional, for icon conversion): Included in the setup steps if you generated icons automatically.

## 2. Icons

The application uses specific icon formats for different platforms:
- **Windows**: `assets/icon.ico`
- **macOS**: `assets/icon.icns`
- **Linux**: `assets/icon.png`

We have automatically generated these from the logo, but if you update the logo in the future, convert them using:
```bash
magick assets/icon.png -define icon:auto-resize=256,128,64,48,32,16 assets/icon.ico
magick assets/icon.png assets/icon.icns
```

## 3. Building Locally (Windows)

To build the installers for Windows on your local machine:

1.  **Install dependencies**:
    ```bash
    bun install
    ```

2.  **Build the application code**:
    ```bash
    bun run build
    ```

3.  **Package the app**:
    ```bash
    bun run dist
    ```

The artifacts (Setup `.exe`, portable `.zip`, etc.) will be created in the `release/` directory.

## 4. Automated GitHub Releases (Windows & macOS)

We have configured a GitHub Actions workflow (`.github/workflows/release.yml`) to automatically build and release the app for both Windows and macOS whenever you push a new version tag.

### Steps to Release:

1.  **Update Version**:
    Open `package.json` and update the `"version"` field (e.g., from `1.0.0` to `1.0.1`).

2.  **Commit and Tag**:
    ```bash
    git add .
    git commit -m "chore: release v1.0.1"
    git tag v1.0.1
    git push origin v1.0.1
    ```

3.  **Watch CI/CD**:
    Go to your GitHub repository -> **Actions** tab. You will see the "Release" workflow running.

4.  **Download**:
    Once finished, go to the **Releases** page on GitHub. You will see a new "Draft" or "Pre-release" (depending on config) containing:
    - `DevSynq Setup 1.0.1.exe` (Windows)
    - `DevSynq-1.0.1-win.zip` (Windows)
    - `DevSynq-1.0.1.dmg` (macOS)
    - `DevSynq-1.0.1-mac.zip` (macOS)

### macOS Note
The generated macOS `.dmg` and `.zip` are unsigned. Users opening them on macOS will see a security warning ("App cannot be checked for malicious software"). To fix this, you need to sign the app with an Apple Developer ID, which requires an Apple Developer Program membership ($99/year) and specialized configuration in `package.json`.

## 5. Troubleshooting

- **Icon Errors**: If building fails due to icon errors, ensure `assets/icon.ico` and `assets/icon.icns` exist and are valid.
- **Missing Files**: If the installed app is empty or missing features, check the `files` array in `package.json`.
