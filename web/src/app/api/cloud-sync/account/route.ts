/**
 * Cloud Sync API - Account Management
 * GET /api/cloud-sync/account - Get account info
 * PATCH /api/cloud-sync/account - Update account
 * DELETE /api/cloud-sync/account - Delete account
 * POST /api/cloud-sync/account/regenerate-key - Regenerate access key
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cloudSyncUsers, cloudSyncBackups, cloudSyncDevices, cloudSyncLogs } from '@/lib/db/schema';
import { authenticateRequest, logSyncAction } from '@/lib/cloud-sync/auth';
import { generateAccessKey } from '@/lib/cloud-sync/crypto';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

const updateAccountSchema = z.object({
    displayName: z.string().min(1).max(100).optional(),
});

/**
 * GET - Get account information
 */
export async function GET(request: NextRequest) {
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
        return authResult.error;
    }

    const { context } = authResult;

    try {
        // Get user info
        const users = await db
            .select({
                id: cloudSyncUsers.id,
                email: cloudSyncUsers.email,
                displayName: cloudSyncUsers.displayName,
                planType: cloudSyncUsers.planType,
                createdAt: cloudSyncUsers.createdAt,
                lastSyncAt: cloudSyncUsers.lastSyncAt,
            })
            .from(cloudSyncUsers)
            .where(eq(cloudSyncUsers.id, context.userId))
            .limit(1);

        if (users.length === 0) {
            return NextResponse.json(
                { error: 'Account not found' },
                { status: 404 }
            );
        }

        const user = users[0];

        // Get device count
        const deviceCountResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(cloudSyncDevices)
            .where(eq(cloudSyncDevices.userId, context.userId));
        const deviceCount = Number(deviceCountResult[0]?.count || 0);

        // Get storage usage
        const storageResult = await db
            .select({
                totalSize: sql<number>`coalesce(sum(${cloudSyncBackups.plaintextSize}), 0)`,
                backupCount: sql<number>`count(*)`,
            })
            .from(cloudSyncBackups)
            .where(eq(cloudSyncBackups.userId, context.userId));

        const storageUsed = Number(storageResult[0]?.totalSize || 0);
        const backupCount = Number(storageResult[0]?.backupCount || 0);

        // Define storage limits based on plan
        const storageLimits = {
            free: 5 * 1024 * 1024, // 5MB
            pro: 100 * 1024 * 1024, // 100MB
        };

        return NextResponse.json({
            success: true,
            account: {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
                planType: user.planType,
                createdAt: user.createdAt,
                lastSyncAt: user.lastSyncAt,
            },
            usage: {
                deviceCount,
                backupCount,
                storageUsed,
                storageLimit: storageLimits[user.planType as keyof typeof storageLimits] || storageLimits.free,
            },
            encryptionSalt: context.encryptionSalt,
        });
    } catch (error) {
        console.error('Get account error:', error);
        return NextResponse.json(
            { error: 'Failed to get account info' },
            { status: 500 }
        );
    }
}

/**
 * PATCH - Update account
 */
export async function PATCH(request: NextRequest) {
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
        return authResult.error;
    }

    const { context } = authResult;

    try {
        const body = await request.json();
        const validation = updateAccountSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid request', details: validation.error.issues },
                { status: 400 }
            );
        }

        const { displayName } = validation.data;

        const [updated] = await db
            .update(cloudSyncUsers)
            .set({
                displayName,
                updatedAt: new Date(),
            })
            .where(eq(cloudSyncUsers.id, context.userId))
            .returning({
                id: cloudSyncUsers.id,
                displayName: cloudSyncUsers.displayName,
            });

        await logSyncAction(
            context.userId,
            null,
            'update_account',
            null,
            true
        );

        return NextResponse.json({
            success: true,
            account: updated,
            message: 'Account updated',
        });
    } catch (error) {
        console.error('Update account error:', error);
        return NextResponse.json(
            { error: 'Failed to update account' },
            { status: 500 }
        );
    }
}

/**
 * DELETE - Delete account and all data
 */
export async function DELETE(request: NextRequest) {
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
        return authResult.error;
    }

    const { context } = authResult;

    try {
        // Delete all user data (cascade will handle related tables)
        await db
            .delete(cloudSyncUsers)
            .where(eq(cloudSyncUsers.id, context.userId));

        return NextResponse.json({
            success: true,
            message: 'Account and all data deleted permanently',
        });
    } catch (error) {
        console.error('Delete account error:', error);
        return NextResponse.json(
            { error: 'Failed to delete account' },
            { status: 500 }
        );
    }
}
