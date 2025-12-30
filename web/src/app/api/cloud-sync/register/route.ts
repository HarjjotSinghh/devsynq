/**
 * Cloud Sync API - User Registration
 * POST /api/cloud-sync/register
 * 
 * Creates a new cloud sync user account and returns an access key
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cloudSyncUsers, cloudSyncLogs } from '@/lib/db/schema';
import { generateAccessKey, generateEncryptionSalt } from '@/lib/cloud-sync/crypto';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    displayName: z.string().min(1).max(100).optional(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = registerSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid request', details: validation.error.issues },
                { status: 400 }
            );
        }

        const { email, displayName } = validation.data;

        // Check if user already exists
        const existingUser = await db
            .select()
            .from(cloudSyncUsers)
            .where(eq(cloudSyncUsers.email, email.toLowerCase()))
            .limit(1);

        if (existingUser.length > 0) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        // Generate access key and encryption salt
        const { accessKey, accessKeyHash } = generateAccessKey();
        const encryptionSalt = generateEncryptionSalt();

        // Create the user
        const [newUser] = await db
            .insert(cloudSyncUsers)
            .values({
                email: email.toLowerCase(),
                accessKeyHash,
                encryptionSalt,
                displayName: displayName || email.split('@')[0],
            })
            .returning({
                id: cloudSyncUsers.id,
                email: cloudSyncUsers.email,
                displayName: cloudSyncUsers.displayName,
                encryptionSalt: cloudSyncUsers.encryptionSalt,
                createdAt: cloudSyncUsers.createdAt,
            });

        // Log the registration
        await db.insert(cloudSyncLogs).values({
            userId: newUser.id,
            action: 'register',
            success: true,
            metadata: { email: newUser.email },
        });

        return NextResponse.json({
            success: true,
            user: {
                id: newUser.id,
                email: newUser.email,
                displayName: newUser.displayName,
            },
            // IMPORTANT: This is the only time the access key is returned
            // The client must store this securely
            accessKey,
            // Salt for client-side encryption key derivation
            encryptionSalt: newUser.encryptionSalt,
            message: 'Account created successfully. Save your access key - it will not be shown again.',
        });
    } catch (error) {
        console.error('Cloud sync registration error:', error);
        return NextResponse.json(
            { error: 'Failed to create account' },
            { status: 500 }
        );
    }
}
