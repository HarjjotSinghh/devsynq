/**
 * Client-side E2E Encryption Utilities for Cloud Sync
 * 
 * All encryption/decryption happens on the client side.
 * The server NEVER sees plaintext user data.
 * 
 * Uses:
 * - AES-256-GCM for symmetric encryption (with authentication)
 * - PBKDF2 for key derivation from password + salt
 * - SHA-256 for integrity verification
 */

import * as crypto from 'crypto';

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_DIGEST = 'sha256';

export interface EncryptedData {
    encryptedData: string; // Base64 encoded
    iv: string; // Base64 encoded
    authTag: string; // Base64 encoded
    plaintextHash: string; // Hex encoded SHA-256 of plaintext
    plaintextSize: number;
}

export interface CloudSyncConfig {
    syncServerUrl: string;
    accessKey: string;
    encryptionSalt: string;
    encryptionPassword: string; // User's local encryption password
    deviceId: string;
    deviceName: string;
}

/**
 * Derives an encryption key from a password and salt using PBKDF2
 */
export function deriveKey(password: string, salt: string): Buffer {
    const saltBuffer = Buffer.from(salt, 'hex');
    return crypto.pbkdf2Sync(password, saltBuffer, PBKDF2_ITERATIONS, KEY_LENGTH, PBKDF2_DIGEST);
}

/**
 * Encrypts data using AES-256-GCM
 */
export function encrypt(plaintext: string, key: Buffer): EncryptedData {
    // Generate random IV
    const iv = crypto.randomBytes(IV_LENGTH);

    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
        authTagLength: AUTH_TAG_LENGTH,
    });

    // Encrypt
    const plaintextBuffer = Buffer.from(plaintext, 'utf8');
    let encrypted = cipher.update(plaintextBuffer);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Get auth tag
    const authTag = cipher.getAuthTag();

    // Calculate plaintext hash for integrity verification
    const plaintextHash = crypto.createHash('sha256').update(plaintextBuffer).digest('hex');

    return {
        encryptedData: encrypted.toString('base64'),
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        plaintextHash,
        plaintextSize: plaintextBuffer.length,
    };
}

/**
 * Decrypts data using AES-256-GCM
 */
export function decrypt(
    encryptedData: string,
    iv: string,
    authTag: string,
    key: Buffer
): string {
    // Create decipher
    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        key,
        Buffer.from(iv, 'base64'),
        { authTagLength: AUTH_TAG_LENGTH }
    );

    // Set auth tag
    decipher.setAuthTag(Buffer.from(authTag, 'base64'));

    // Decrypt
    let decrypted = decipher.update(Buffer.from(encryptedData, 'base64'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString('utf8');
}

/**
 * Verifies the integrity of decrypted data
 */
export function verifyIntegrity(plaintext: string, expectedHash: string): boolean {
    const actualHash = crypto.createHash('sha256').update(Buffer.from(plaintext, 'utf8')).digest('hex');
    return actualHash === expectedHash;
}

/**
 * Encrypts data for cloud sync using the user's password and salt
 */
export function encryptForSync(
    data: unknown,
    password: string,
    salt: string
): EncryptedData {
    const key = deriveKey(password, salt);
    const plaintext = JSON.stringify(data);
    return encrypt(plaintext, key);
}

/**
 * Decrypts data from cloud sync using the user's password and salt
 */
export function decryptFromSync<T = unknown>(
    encryptedData: string,
    iv: string,
    authTag: string,
    plaintextHash: string,
    password: string,
    salt: string
): T {
    const key = deriveKey(password, salt);
    const plaintext = decrypt(encryptedData, iv, authTag, key);

    // Verify integrity
    if (!verifyIntegrity(plaintext, plaintextHash)) {
        throw new Error('Data integrity check failed. The data may have been tampered with.');
    }

    return JSON.parse(plaintext) as T;
}

/**
 * Generates a unique device ID based on hardware info
 */
export function generateDeviceId(): string {
    const os = require('os');
    const components = [
        os.hostname(),
        os.platform(),
        os.arch(),
        os.cpus()[0]?.model || 'unknown',
        os.totalmem().toString(),
    ];
    return crypto.createHash('sha256').update(components.join('|')).digest('hex');
}

/**
 * Gets the operating system name for device registration
 */
export function getOSName(): 'windows' | 'macos' | 'linux' {
    const platform = process.platform;
    switch (platform) {
        case 'win32':
            return 'windows';
        case 'darwin':
            return 'macos';
        default:
            return 'linux';
    }
}
