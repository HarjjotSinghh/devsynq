/**
 * Cloud Sync Service for DevSynq Electron App
 * 
 * Handles all cloud sync operations including:
 * - User registration and authentication
 * - Device registration
 * - Pushing and pulling encrypted data
 * - Account management
 */

import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';
import {
    encryptForSync,
    decryptFromSync,
    generateDeviceId,
    getOSName,
    EncryptedData,
} from './cloud-sync-crypto';

// Cloud sync configuration file
const CLOUD_SYNC_CONFIG_FILE = 'cloud-sync-config.json';

// Default sync server URL (can be customized)
const DEFAULT_SYNC_SERVER = 'https://devsynq.app/api/cloud-sync';

// Data types that can be synced
export type SyncDataType = 'projects' | 'mcp_config' | 'settings' | 'api_keys' | 'profile' | 'full_backup';

export interface CloudSyncConfig {
    syncServerUrl: string;
    accessKey: string;
    encryptionSalt: string;
    userId: string;
    email: string;
    displayName: string;
    deviceId: string;
    lastSyncAt: number | null;
    autoSync: boolean;
    syncInterval: number; // minutes
}

export interface SyncResult {
    success: boolean;
    message: string;
    error?: string;
    data?: unknown;
}

export interface BackupInfo {
    id: string;
    dataType: SyncDataType;
    version: number;
    plaintextSize: number;
    updatedAt: string;
}

/**
 * CloudSyncService handles all cloud synchronization operations
 */
export class CloudSyncService {
    private config: CloudSyncConfig | null = null;
    private encryptionPassword: string | null = null;
    private configPath: string;

    constructor() {
        const userDataPath = app.getPath('userData');
        this.configPath = path.join(userDataPath, CLOUD_SYNC_CONFIG_FILE);
        this.loadConfig();
    }

    /**
     * Loads the cloud sync configuration from disk
     */
    private loadConfig(): void {
        try {
            if (fs.existsSync(this.configPath)) {
                const data = fs.readFileSync(this.configPath, 'utf-8');
                this.config = JSON.parse(data);
            }
        } catch (error) {
            console.error('Failed to load cloud sync config:', error);
            this.config = null;
        }
    }

    /**
     * Saves the cloud sync configuration to disk
     */
    private saveConfig(): void {
        try {
            if (this.config) {
                fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
            }
        } catch (error) {
            console.error('Failed to save cloud sync config:', error);
        }
    }

    /**
     * Makes an authenticated API request to the sync server
     */
    private async apiRequest(
        endpoint: string,
        method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
        body?: unknown
    ): Promise<Response> {
        if (!this.config?.accessKey) {
            throw new Error('Not logged in to cloud sync');
        }

        const url = `${this.config.syncServerUrl}${endpoint}`;
        const options: RequestInit = {
            method,
            headers: {
                'Authorization': `Bearer ${this.config.accessKey}`,
                'Content-Type': 'application/json',
            },
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        return fetch(url, options);
    }

    /**
     * Checks if the user is logged in to cloud sync
     */
    isLoggedIn(): boolean {
        return !!(this.config?.accessKey);
    }

    /**
     * Gets the current cloud sync configuration (without sensitive data)
     */
    getConfig(): Partial<CloudSyncConfig> | null {
        if (!this.config) return null;
        return {
            syncServerUrl: this.config.syncServerUrl,
            userId: this.config.userId,
            email: this.config.email,
            displayName: this.config.displayName,
            deviceId: this.config.deviceId,
            lastSyncAt: this.config.lastSyncAt,
            autoSync: this.config.autoSync,
            syncInterval: this.config.syncInterval,
        };
    }

    /**
     * Sets the encryption password (required for sync operations)
     * This should be called when the user unlocks their vault
     */
    setEncryptionPassword(password: string): void {
        this.encryptionPassword = password;
    }

    /**
     * Clears the encryption password from memory
     */
    clearEncryptionPassword(): void {
        this.encryptionPassword = null;
    }

    /**
     * Registers a new cloud sync account
     */
    async register(
        email: string,
        encryptionPassword: string,
        displayName?: string,
        serverUrl?: string
    ): Promise<SyncResult> {
        try {
            const syncServerUrl = serverUrl || DEFAULT_SYNC_SERVER;

            const response = await fetch(`${syncServerUrl}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, displayName }),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.error || 'Registration failed',
                    error: data.error,
                };
            }

            // Save configuration
            this.config = {
                syncServerUrl,
                accessKey: data.accessKey,
                encryptionSalt: data.encryptionSalt,
                userId: data.user.id,
                email: data.user.email,
                displayName: data.user.displayName,
                deviceId: generateDeviceId(),
                lastSyncAt: null,
                autoSync: true,
                syncInterval: 60, // Default: sync every hour
            };

            this.encryptionPassword = encryptionPassword;
            this.saveConfig();

            // Register this device
            await this.registerDevice();

            return {
                success: true,
                message: 'Account created successfully',
                data: {
                    accessKey: data.accessKey,
                    userId: data.user.id,
                },
            };
        } catch (error) {
            console.error('Cloud sync registration error:', error);
            return {
                success: false,
                message: 'Failed to register account',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Logs in with an existing access key
     */
    async login(
        accessKey: string,
        encryptionPassword: string,
        serverUrl?: string
    ): Promise<SyncResult> {
        try {
            const syncServerUrl = serverUrl || DEFAULT_SYNC_SERVER;

            // Verify the access key by fetching account info
            const response = await fetch(`${syncServerUrl}/account`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessKey}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.error || 'Login failed',
                    error: data.error,
                };
            }

            // Save configuration
            this.config = {
                syncServerUrl,
                accessKey,
                encryptionSalt: data.encryptionSalt,
                userId: data.account.id,
                email: data.account.email,
                displayName: data.account.displayName,
                deviceId: generateDeviceId(),
                lastSyncAt: null,
                autoSync: true,
                syncInterval: 60,
            };

            this.encryptionPassword = encryptionPassword;
            this.saveConfig();

            // Register this device
            await this.registerDevice();

            return {
                success: true,
                message: 'Logged in successfully',
                data: {
                    userId: data.account.id,
                    email: data.account.email,
                },
            };
        } catch (error) {
            console.error('Cloud sync login error:', error);
            return {
                success: false,
                message: 'Failed to login',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Logs out and clears cloud sync configuration
     */
    logout(): void {
        this.config = null;
        this.encryptionPassword = null;
        try {
            if (fs.existsSync(this.configPath)) {
                fs.unlinkSync(this.configPath);
            }
        } catch (error) {
            console.error('Failed to delete cloud sync config:', error);
        }
    }

    /**
     * Registers this device with the cloud sync server
     */
    private async registerDevice(): Promise<SyncResult> {
        if (!this.config) {
            return { success: false, message: 'Not logged in' };
        }

        try {
            const os = require('os');
            const response = await this.apiRequest('/devices', 'POST', {
                deviceId: this.config.deviceId,
                deviceName: os.hostname(),
                os: getOSName(),
                appVersion: app.getVersion(),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.error || 'Device registration failed',
                    error: data.error,
                };
            }

            return {
                success: true,
                message: 'Device registered',
                data: data.device,
            };
        } catch (error) {
            console.error('Device registration error:', error);
            return {
                success: false,
                message: 'Failed to register device',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Pushes encrypted data to the cloud
     */
    async push(dataType: SyncDataType, data: unknown): Promise<SyncResult> {
        if (!this.config || !this.encryptionPassword) {
            return {
                success: false,
                message: 'Not logged in or encryption password not set',
            };
        }

        try {
            // Encrypt the data client-side
            const encrypted = encryptForSync(
                data,
                this.encryptionPassword,
                this.config.encryptionSalt
            );

            const response = await this.apiRequest('/sync', 'POST', {
                deviceId: this.config.deviceId,
                dataType,
                ...encrypted,
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: result.error || 'Push failed',
                    error: result.error,
                };
            }

            // Update last sync time
            this.config.lastSyncAt = Date.now();
            this.saveConfig();

            return {
                success: true,
                message: `${dataType} synced successfully`,
                data: {
                    version: result.version,
                    backupId: result.backupId,
                },
            };
        } catch (error) {
            console.error('Push error:', error);
            return {
                success: false,
                message: 'Failed to push data',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Pulls and decrypts data from the cloud
     */
    async pull<T = unknown>(dataType: SyncDataType): Promise<SyncResult & { data?: T }> {
        if (!this.config || !this.encryptionPassword) {
            return {
                success: false,
                message: 'Not logged in or encryption password not set',
            };
        }

        try {
            const response = await this.apiRequest(`/sync?dataType=${dataType}`, 'GET');
            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: result.error || 'Pull failed',
                    error: result.error,
                };
            }

            if (!result.backup) {
                return {
                    success: true,
                    message: 'No backup found',
                    data: undefined,
                };
            }

            // Decrypt the data client-side
            const decrypted = decryptFromSync<T>(
                result.backup.encryptedData,
                result.backup.iv,
                result.backup.authTag,
                result.backup.plaintextHash,
                this.encryptionPassword,
                this.config.encryptionSalt
            );

            // Update last sync time
            this.config.lastSyncAt = Date.now();
            this.saveConfig();

            return {
                success: true,
                message: `${dataType} retrieved successfully`,
                data: decrypted,
            };
        } catch (error) {
            console.error('Pull error:', error);
            return {
                success: false,
                message: 'Failed to pull data',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Gets a list of all backups
     */
    async listBackups(): Promise<SyncResult & { data?: BackupInfo[] }> {
        if (!this.config) {
            return { success: false, message: 'Not logged in' };
        }

        try {
            const response = await this.apiRequest('/sync', 'GET');
            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: result.error || 'Failed to list backups',
                    error: result.error,
                };
            }

            const backups: BackupInfo[] = result.backups.map((b: any) => ({
                id: b.id,
                dataType: b.dataType,
                version: b.version,
                plaintextSize: b.plaintextSize,
                updatedAt: b.updatedAt,
            }));

            return {
                success: true,
                message: 'Backups retrieved',
                data: backups,
            };
        } catch (error) {
            console.error('List backups error:', error);
            return {
                success: false,
                message: 'Failed to list backups',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Deletes a backup
     */
    async deleteBackup(dataType?: SyncDataType): Promise<SyncResult> {
        if (!this.config) {
            return { success: false, message: 'Not logged in' };
        }

        try {
            const endpoint = dataType ? `/sync?dataType=${dataType}` : '/sync';
            const response = await this.apiRequest(endpoint, 'DELETE');
            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: result.error || 'Failed to delete backup',
                    error: result.error,
                };
            }

            return {
                success: true,
                message: result.message || 'Backup deleted',
            };
        } catch (error) {
            console.error('Delete backup error:', error);
            return {
                success: false,
                message: 'Failed to delete backup',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Gets account information from the server
     */
    async getAccountInfo(): Promise<SyncResult> {
        if (!this.config) {
            return { success: false, message: 'Not logged in' };
        }

        try {
            const response = await this.apiRequest('/account', 'GET');
            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: result.error || 'Failed to get account info',
                    error: result.error,
                };
            }

            return {
                success: true,
                message: 'Account info retrieved',
                data: result,
            };
        } catch (error) {
            console.error('Get account info error:', error);
            return {
                success: false,
                message: 'Failed to get account info',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Updates auto-sync settings
     */
    updateSettings(settings: Partial<Pick<CloudSyncConfig, 'autoSync' | 'syncInterval'>>): void {
        if (!this.config) return;

        if (settings.autoSync !== undefined) {
            this.config.autoSync = settings.autoSync;
        }
        if (settings.syncInterval !== undefined) {
            this.config.syncInterval = settings.syncInterval;
        }

        this.saveConfig();
    }
}

// Export a singleton instance
export const cloudSyncService = new CloudSyncService();
