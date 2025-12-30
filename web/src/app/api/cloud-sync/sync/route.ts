/**
 * Cloud Sync API - Sync Data
 * POST /api/cloud-sync/sync - Push encrypted data
 * GET /api/cloud-sync/sync - Pull encrypted data
 * DELETE /api/cloud-sync/sync - Delete backup data
 * 
 * All data is E2E encrypted - the server never sees plaintext
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cloudSyncBackups, cloudSyncDevices, cloudSyncUsers } from '@/lib/db/schema';
import { authenticateRequest, logSyncAction } from '@/lib/cloud-sync/auth';
import { hashDeviceId } from '@/lib/cloud-sync/crypto';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';

// Valid data types that can be synced
const DATA_TYPES = ['projects', 'mcp_config', 'settings', 'api_keys', 'profile', 'full_backup'] as const;
type DataType = typeof DATA_TYPES[number];

// Size limits (in bytes) - for free tier
const FREE_TIER_MAX_SIZE = 5 * 1024 * 1024; // 5MB total
const FREE_TIER_MAX_PER_BACKUP = 1 * 1024 * 1024; // 1MB per backup

const pushSchema = z.object({
    deviceId: z.string().min(1),
    dataType: z.enum(DATA_TYPES),
    // E2E encrypted data (Base64 encoded)
    encryptedData: z.string().min(1),
    // Initialization vector (Base64 encoded)
    iv: z.string().min(1),
    // Auth tag for AEAD (Base64 encoded)
    authTag: z.string().min(1),
    // SHA-256 hash of plaintext for integrity (hex encoded)
    plaintextHash: z.string().length(64),
    // Size of plaintext in bytes
    plaintextSize: z.number().int().positive(),
});

const pullSchema = z.object({
    dataType: z.enum(DATA_TYPES).optional(),
});

const deleteSchema = z.object({
    dataType: z.enum(DATA_TYPES).optional(), // If not provided, deletes all
});

/**
 * POST - Push encrypted data to the cloud
 */
export async function POST(request: NextRequest) {
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
        return authResult.error;
    }

    const { context } = authResult;

    try {
        const body = await request.json();
        const validation = pushSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid request', details: validation.error.issues },
                { status: 400 }
            );
        }

        const { deviceId, dataType, encryptedData, iv, authTag, plaintextHash, plaintextSize } = validation.data;

        // Verify device is registered
        const deviceIdHash = hashDeviceId(deviceId);
        const devices = await db
            .select({ id: cloudSyncDevices.id })
            .from(cloudSyncDevices)
            .where(
                and(
                    eq(cloudSyncDevices.userId, context.userId),
                    eq(cloudSyncDevices.deviceIdHash, deviceIdHash)
                )
            )
            .limit(1);

        if (devices.length === 0) {
            return NextResponse.json(
                { error: 'Device not registered. Please register this device first.' },
                { status: 403 }
            );
        }

        const device = devices[0];

        // Check size limits for free tier
        if (context.planType === 'free') {
            if (plaintextSize > FREE_TIER_MAX_PER_BACKUP) {
                return NextResponse.json(
                    {
                        error: 'Data too large for free tier',
                        maxSize: FREE_TIER_MAX_PER_BACKUP,
                        yourSize: plaintextSize,
                    },
                    { status: 413 }
                );
            }

            // Calculate total storage used
            const allBackups = await db
                .select({ plaintextSize: cloudSyncBackups.plaintextSize })
                .from(cloudSyncBackups)
                .where(eq(cloudSyncBackups.userId, context.userId));

            const currentUsage = allBackups.reduce((sum, b) => sum + b.plaintextSize, 0);

            // Subtract existing backup of same type if updating
            const existingBackup = await db
                .select({ plaintextSize: cloudSyncBackups.plaintextSize })
                .from(cloudSyncBackups)
                .where(
                    and(
                        eq(cloudSyncBackups.userId, context.userId),
                        eq(cloudSyncBackups.dataType, dataType)
                    )
                )
                .limit(1);

            const existingSize = existingBackup.length > 0 ? existingBackup[0].plaintextSize : 0;
            const newTotal = currentUsage - existingSize + plaintextSize;

            if (newTotal > FREE_TIER_MAX_SIZE) {
                return NextResponse.json(
                    {
                        error: 'Storage quota exceeded for free tier',
                        maxTotal: FREE_TIER_MAX_SIZE,
                        currentUsage: currentUsage - existingSize,
                        newDataSize: plaintextSize,
                    },
                    { status: 413 }
                );
            }
        }

        // Upsert the backup data
        const existingBackups = await db
            .select({ id: cloudSyncBackups.id, version: cloudSyncBackups.version })
            .from(cloudSyncBackups)
            .where(
                and(
                    eq(cloudSyncBackups.userId, context.userId),
                    eq(cloudSyncBackups.dataType, dataType)
                )
            )
            .limit(1);

        let backupId: string;
        let version: number;

        if (existingBackups.length > 0) {
            // Update existing backup
            const newVersion = existingBackups[0].version + 1;
            const [updated] = await db
                .update(cloudSyncBackups)
                .set({
                    deviceId: device.id,
                    encryptedData,
                    iv,
                    authTag,
                    plaintextHash,
                    plaintextSize,
                    version: newVersion,
                    updatedAt: new Date(),
                })
                .where(eq(cloudSyncBackups.id, existingBackups[0].id))
                .returning({ id: cloudSyncBackups.id, version: cloudSyncBackups.version });

            backupId = updated.id;
            version = updated.version;
        } else {
            // Create new backup
            const [created] = await db
                .insert(cloudSyncBackups)
                .values({
                    userId: context.userId,
                    deviceId: device.id,
                    dataType,
                    encryptedData,
                    iv,
                    authTag,
                    plaintextHash,
                    plaintextSize,
                })
                .returning({ id: cloudSyncBackups.id, version: cloudSyncBackups.version });

            backupId = created.id;
            version = created.version;
        }

        // Update user's last sync time
        await db
            .update(cloudSyncUsers)
            .set({ lastSyncAt: new Date() })
            .where(eq(cloudSyncUsers.id, context.userId));

        // Update device's last seen time
        await db
            .update(cloudSyncDevices)
            .set({ lastSeenAt: new Date() })
            .where(eq(cloudSyncDevices.id, device.id));

        await logSyncAction(
            context.userId,
            device.id,
            'push',
            dataType,
            true,
            undefined,
            { version, plaintextSize }
        );

        return NextResponse.json({
            success: true,
            backupId,
            version,
            dataType,
            message: 'Data synced successfully',
        });
    } catch (error) {
        console.error('Push sync error:', error);
        return NextResponse.json(
            { error: 'Failed to sync data' },
            { status: 500 }
        );
    }
}

/**
 * GET - Pull encrypted data from the cloud
 */
export async function GET(request: NextRequest) {
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
        return authResult.error;
    }

    const { context } = authResult;

    try {
        const { searchParams } = new URL(request.url);
        const dataType = searchParams.get('dataType') as DataType | null;

        let query = db
            .select({
                id: cloudSyncBackups.id,
                dataType: cloudSyncBackups.dataType,
                encryptedData: cloudSyncBackups.encryptedData,
                iv: cloudSyncBackups.iv,
                authTag: cloudSyncBackups.authTag,
                plaintextHash: cloudSyncBackups.plaintextHash,
                plaintextSize: cloudSyncBackups.plaintextSize,
                version: cloudSyncBackups.version,
                updatedAt: cloudSyncBackups.updatedAt,
            })
            .from(cloudSyncBackups)
            .where(eq(cloudSyncBackups.userId, context.userId));

        if (dataType && DATA_TYPES.includes(dataType)) {
            const backups = await db
                .select({
                    id: cloudSyncBackups.id,
                    dataType: cloudSyncBackups.dataType,
                    encryptedData: cloudSyncBackups.encryptedData,
                    iv: cloudSyncBackups.iv,
                    authTag: cloudSyncBackups.authTag,
                    plaintextHash: cloudSyncBackups.plaintextHash,
                    plaintextSize: cloudSyncBackups.plaintextSize,
                    version: cloudSyncBackups.version,
                    updatedAt: cloudSyncBackups.updatedAt,
                })
                .from(cloudSyncBackups)
                .where(
                    and(
                        eq(cloudSyncBackups.userId, context.userId),
                        eq(cloudSyncBackups.dataType, dataType)
                    )
                )
                .orderBy(desc(cloudSyncBackups.updatedAt))
                .limit(1);

            if (backups.length === 0) {
                return NextResponse.json({
                    success: true,
                    backup: null,
                    message: 'No backup found for this data type',
                });
            }

            await logSyncAction(
                context.userId,
                null,
                'pull',
                dataType,
                true
            );

            return NextResponse.json({
                success: true,
                backup: backups[0],
            });
        } else {
            // Get all backups
            const backups = await db
                .select({
                    id: cloudSyncBackups.id,
                    dataType: cloudSyncBackups.dataType,
                    encryptedData: cloudSyncBackups.encryptedData,
                    iv: cloudSyncBackups.iv,
                    authTag: cloudSyncBackups.authTag,
                    plaintextHash: cloudSyncBackups.plaintextHash,
                    plaintextSize: cloudSyncBackups.plaintextSize,
                    version: cloudSyncBackups.version,
                    updatedAt: cloudSyncBackups.updatedAt,
                })
                .from(cloudSyncBackups)
                .where(eq(cloudSyncBackups.userId, context.userId))
                .orderBy(desc(cloudSyncBackups.updatedAt));

            await logSyncAction(
                context.userId,
                null,
                'pull_all',
                null,
                true
            );

            return NextResponse.json({
                success: true,
                backups,
                encryptionSalt: context.encryptionSalt,
            });
        }
    } catch (error) {
        console.error('Pull sync error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve data' },
            { status: 500 }
        );
    }
}

/**
 * DELETE - Delete backup data
 */
export async function DELETE(request: NextRequest) {
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
        return authResult.error;
    }

    const { context } = authResult;

    try {
        const { searchParams } = new URL(request.url);
        const dataType = searchParams.get('dataType') as DataType | null;

        if (dataType && DATA_TYPES.includes(dataType)) {
            // Delete specific data type
            await db
                .delete(cloudSyncBackups)
                .where(
                    and(
                        eq(cloudSyncBackups.userId, context.userId),
                        eq(cloudSyncBackups.dataType, dataType)
                    )
                );

            await logSyncAction(
                context.userId,
                null,
                'delete_backup',
                dataType,
                true
            );

            return NextResponse.json({
                success: true,
                message: `Deleted backup for ${dataType}`,
            });
        } else {
            // Delete all backups
            await db
                .delete(cloudSyncBackups)
                .where(eq(cloudSyncBackups.userId, context.userId));

            await logSyncAction(
                context.userId,
                null,
                'delete_all_backups',
                null,
                true
            );

            return NextResponse.json({
                success: true,
                message: 'All backups deleted',
            });
        }
    } catch (error) {
        console.error('Delete sync error:', error);
        return NextResponse.json(
            { error: 'Failed to delete data' },
            { status: 500 }
        );
    }
}
