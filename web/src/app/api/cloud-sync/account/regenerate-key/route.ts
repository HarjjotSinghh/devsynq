/**
 * Cloud Sync API - Regenerate Access Key
 * POST /api/cloud-sync/account/regenerate-key
 * 
 * Generates a new access key, invalidating the old one
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cloudSyncUsers } from '@/lib/db/schema';
import { authenticateRequest, logSyncAction } from '@/lib/cloud-sync/auth';
import { generateAccessKey } from '@/lib/cloud-sync/crypto';
import { eq } from 'drizzle-orm';

/**
 * POST - Regenerate access key
 */
export async function POST(request: NextRequest) {
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
        return authResult.error;
    }

    const { context } = authResult;

    try {
        // Generate new access key
        const { accessKey, accessKeyHash } = generateAccessKey();

        // Update the access key hash
        await db
            .update(cloudSyncUsers)
            .set({
                accessKeyHash,
                updatedAt: new Date(),
            })
            .where(eq(cloudSyncUsers.id, context.userId));

        await logSyncAction(
            context.userId,
            null,
            'regenerate_key',
            null,
            true
        );

        return NextResponse.json({
            success: true,
            // IMPORTANT: This is the only time the new access key is returned
            accessKey,
            message: 'Access key regenerated. Your old key is now invalid. Save your new key - it will not be shown again.',
        });
    } catch (error) {
        console.error('Regenerate key error:', error);
        return NextResponse.json(
            { error: 'Failed to regenerate access key' },
            { status: 500 }
        );
    }
}
