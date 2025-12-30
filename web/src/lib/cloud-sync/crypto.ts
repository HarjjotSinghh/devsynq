/**
 * Server-side crypto utilities for Cloud Sync
 * 
 * IMPORTANT: This module handles server-side hashing only.
 * All E2E encryption/decryption happens on the client side.
 * The server NEVER sees plaintext user data.
 */

import { createHash, randomBytes, timingSafeEqual } from 'crypto';

// Use a constant prefix for all access keys for easy identification
const ACCESS_KEY_PREFIX = 'ds_';

/**
 * Generates a new access key for cloud sync authentication
 * Format: ds_<random 32 bytes as hex>
 * @returns The raw access key (to be stored by the client) and its hash (stored server-side)
 */
export function generateAccessKey(): { accessKey: string; accessKeyHash: string } {
    const randomPart = randomBytes(32).toString('hex');
    const accessKey = `${ACCESS_KEY_PREFIX}${randomPart}`;
    const accessKeyHash = hashAccessKey(accessKey);
    return { accessKey, accessKeyHash };
}

/**
 * Hashes an access key for secure server-side storage
 * Uses SHA-256 for fast comparison during authentication
 */
export function hashAccessKey(accessKey: string): string {
    return createHash('sha256').update(accessKey).digest('hex');
}

/**
 * Verifies an access key against a stored hash
 * Uses timing-safe comparison to prevent timing attacks
 */
export function verifyAccessKey(accessKey: string, storedHash: string): boolean {
    const inputHash = hashAccessKey(accessKey);
    try {
        return timingSafeEqual(Buffer.from(inputHash, 'hex'), Buffer.from(storedHash, 'hex'));
    } catch {
        return false;
    }
}

/**
 * Generates a random salt for client-side encryption key derivation
 * This salt is stored on the server and sent to the client for key derivation
 */
export function generateEncryptionSalt(): string {
    return randomBytes(32).toString('hex');
}

/**
 * Hashes a device ID for privacy
 * We don't store the raw device ID, only its hash
 */
export function hashDeviceId(deviceId: string): string {
    return createHash('sha256').update(deviceId).digest('hex');
}

/**
 * Validates an access key format
 */
export function isValidAccessKeyFormat(accessKey: string): boolean {
    if (!accessKey.startsWith(ACCESS_KEY_PREFIX)) {
        return false;
    }
    // Should be prefix + 64 hex characters
    const expectedLength = ACCESS_KEY_PREFIX.length + 64;
    if (accessKey.length !== expectedLength) {
        return false;
    }
    // Check that the rest is valid hex
    const hexPart = accessKey.slice(ACCESS_KEY_PREFIX.length);
    return /^[a-f0-9]+$/i.test(hexPart);
}

/**
 * Extracts the bearer token from an Authorization header
 */
export function extractBearerToken(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.slice(7);
}
