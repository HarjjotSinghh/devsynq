/**
 * Cloud Sync Authentication Middleware
 * 
 * Verifies access keys and provides user context for API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cloudSyncUsers, cloudSyncLogs } from '@/lib/db/schema';
import { verifyAccessKey, extractBearerToken, isValidAccessKeyFormat, hashAccessKey } from './crypto';
import { eq, and } from 'drizzle-orm';

export interface AuthContext {
    userId: string;
    email: string;
    encryptionSalt: string;
    planType: string;
}

export type AuthResult =
    | { authenticated: true; context: AuthContext }
    | { authenticated: false; error: NextResponse };

/**
 * Authenticates a request using the Bearer token (access key)
 */
export async function authenticateRequest(request: NextRequest): Promise<AuthResult> {
    const authHeader = request.headers.get('Authorization');
    const accessKey = extractBearerToken(authHeader);

    if (!accessKey) {
        return {
            authenticated: false,
            error: NextResponse.json(
                { error: 'Missing or invalid Authorization header' },
                { status: 401 }
            ),
        };
    }

    if (!isValidAccessKeyFormat(accessKey)) {
        return {
            authenticated: false,
            error: NextResponse.json(
                { error: 'Invalid access key format' },
                { status: 401 }
            ),
        };
    }

    // Look up user by access key hash
    const accessKeyHash = hashAccessKey(accessKey);
    const users = await db
        .select({
            id: cloudSyncUsers.id,
            email: cloudSyncUsers.email,
            accessKeyHash: cloudSyncUsers.accessKeyHash,
            encryptionSalt: cloudSyncUsers.encryptionSalt,
            planType: cloudSyncUsers.planType,
            isActive: cloudSyncUsers.isActive,
        })
        .from(cloudSyncUsers)
        .where(
            and(
                eq(cloudSyncUsers.accessKeyHash, accessKeyHash),
                eq(cloudSyncUsers.isActive, true)
            )
        )
        .limit(1);

    if (users.length === 0) {
        return {
            authenticated: false,
            error: NextResponse.json(
                { error: 'Invalid access key' },
                { status: 401 }
            ),
        };
    }

    const user = users[0];

    // Verify the access key (timing-safe)
    if (!verifyAccessKey(accessKey, user.accessKeyHash)) {
        return {
            authenticated: false,
            error: NextResponse.json(
                { error: 'Invalid access key' },
                { status: 401 }
            ),
        };
    }

    return {
        authenticated: true,
        context: {
            userId: user.id,
            email: user.email,
            encryptionSalt: user.encryptionSalt,
            planType: user.planType,
        },
    };
}

/**
 * Logs a sync action
 */
export async function logSyncAction(
    userId: string,
    deviceId: string | null,
    action: string,
    dataType: string | null,
    success: boolean,
    errorMessage?: string,
    metadata?: Record<string, unknown>
) {
    try {
        await db.insert(cloudSyncLogs).values({
            userId,
            deviceId,
            action,
            dataType,
            success,
            errorMessage,
            metadata,
        });
    } catch (error) {
        console.error('Failed to log sync action:', error);
    }
}
