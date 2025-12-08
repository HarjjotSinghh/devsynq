# Release & Code Signing Guide

This document explains how to build, sign, and release DevSynq for Windows, macOS, and Linux.

## Quick Start (No Code Signing)

### Build Locally

```bash
# Build for current platform
bun run dist

# Build for specific platform
bun run dist --win      # Windows (.exe + .zip)
bun run dist --mac      # macOS (.dmg + .zip)
bun run dist --linux    # Linux (.AppImage)
```

### Create a GitHub Release

1. **Update version** in `package.json`
2. **Commit changes**: `git add . && git commit -m "Release v1.0.1"`
3. **Create tag**: `git tag v1.0.1`
4. **Push tag**: `git push origin v1.0.1`
5. GitHub Actions will automatically build and create a release

---

## Code Signing Setup (Recommended for Production)

Code signing removes security warnings when users download and install your app.

### Windows Code Signing

#### Option 1: Self-Signed Certificate (For Testing)

```powershell
# Create a self-signed certificate (testing only)
$cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=DevSynq" -CertStoreLocation "Cert:\CurrentUser\My"
$password = ConvertTo-SecureString -String "YourPassword" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath "devsynq-signing.pfx" -Password $password
```

#### Option 2: Commercial Certificate (Recommended)

Purchase from trusted CAs:
- [DigiCert](https://www.digicert.com/signing/code-signing-certificates)
- [Sectigo](https://sectigo.com/ssl-certificates-tls/code-signing)
- [GlobalSign](https://www.globalsign.com/en/code-signing-certificate)

**EV (Extended Validation) certificates** are recommended as they don't trigger SmartScreen warnings.

#### Configure GitHub Secrets for Windows

1. Convert your `.pfx` file to Base64:
   ```bash
   base64 -i certificate.pfx -o certificate-base64.txt
   ```
2. Add GitHub Secrets:
   - `WIN_CSC_LINK`: The Base64-encoded certificate
   - `WIN_CSC_KEY_PASSWORD`: The certificate password

---

### macOS Code Signing & Notarization

#### Requirements

1. **Apple Developer Account** ($99/year): [developer.apple.com](https://developer.apple.com)
2. **Developer ID Application Certificate**

#### Step 1: Create Certificates

1. Open **Keychain Access** → **Certificate Assistant** → **Request a Certificate from a Certificate Authority**
2. Go to [developer.apple.com/account/resources/certificates](https://developer.apple.com/account/resources/certificates)
3. Create a **Developer ID Application** certificate
4. Download and install it

#### Step 2: Export Certificate

```bash
# Find your certificate identity
security find-identity -v -p codesigning

# Export to .p12 (will prompt for password)
security export -k ~/Library/Keychains/login.keychain-db -t identities -f pkcs12 -P "YourPassword" -o developer-id.p12
```

#### Step 3: Create App-Specific Password

1. Go to [appleid.apple.com](https://appleid.apple.com)
2. **Sign In** → **Security** → **App-Specific Passwords**
3. Generate a password for "DevSynq Notarization"

#### Step 4: Configure GitHub Secrets for macOS

Add these GitHub Secrets:

| Secret | Description |
|--------|-------------|
| `MACOS_CERTIFICATE` | Base64-encoded .p12 certificate |
| `MACOS_CERTIFICATE_PWD` | Certificate export password |
| `MACOS_KEYCHAIN_PASSWORD` | Any strong password (for temp keychain) |
| `APPLE_ID` | Your Apple ID email |
| `APPLE_APP_SPECIFIC_PASSWORD` | App-specific password from Step 3 |
| `APPLE_TEAM_ID` | Your 10-character Team ID |

**Convert certificate to Base64:**
```bash
base64 -i developer-id.p12 -o certificate-base64.txt
```

**Find your Team ID:**
```bash
security find-identity -v -p codesigning | grep "Developer ID"
# Look for the 10-character code in parentheses
```

#### Enable Notarization

After setting up secrets, enable notarization in `package.json`:

```json
"mac": {
  "notarize": {
    "teamId": "YOUR_TEAM_ID"
  }
}
```

---

## GitHub Secrets Summary

### Required (for unsigned builds)
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions

### Windows Signing (Optional)
- `WIN_CSC_LINK` - Base64 certificate
- `WIN_CSC_KEY_PASSWORD` - Certificate password

### macOS Signing (Optional)
- `MACOS_CERTIFICATE` - Base64 .p12 certificate
- `MACOS_CERTIFICATE_PWD` - Certificate password
- `MACOS_KEYCHAIN_PASSWORD` - Temporary keychain password

### macOS Notarization (Optional)
- `APPLE_ID` - Apple account email
- `APPLE_APP_SPECIFIC_PASSWORD` - App-specific password
- `APPLE_TEAM_ID` - 10-char Team ID

---

## Release Files

After a successful build, releases include:

### Windows
- `DevSynq-{version}-win-x64.exe` - NSIS installer
- `DevSynq-{version}-win-x64.zip` - Portable version

### macOS
- `DevSynq-{version}-mac-x64.dmg` - Intel installer
- `DevSynq-{version}-mac-arm64.dmg` - Apple Silicon installer
- `DevSynq-{version}-mac-x64.zip` - Intel portable
- `DevSynq-{version}-mac-arm64.zip` - Apple Silicon portable

### Linux
- `DevSynq-{version}-linux-x64.AppImage` - Universal Linux package

---

## Troubleshooting

### Windows: SmartScreen Warning
- Use an EV code signing certificate
- Or: Users can click "More info" → "Run anyway"

### macOS: "App is damaged" or "Unidentified developer"
- Ensure notarization is complete
- Or: Users can right-click → Open → Open

### Build Fails Locally
```bash
# Clean previous builds
rm -rf release/ dist/

# Rebuild everything
bun run build
bun run dist
```

### GitHub Actions Fails
- Check that all required secrets are set
- Verify certificate hasn't expired
- Review the Actions log for specific errors
