/**
 * Cloud Sync API - Device Registration
 * POST /api/cloud-sync/devices
 * GET /api/cloud-sync/devices
 * DELETE /api/cloud-sync/devices
 * 
 * Manages registered devices for cloud sync
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cloudSyncDevices } from '@/lib/db/schema';
import { authenticateRequest, logSyncAction } from '@/lib/cloud-sync/auth';
import { hashDeviceId } from '@/lib/cloud-sync/crypto';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const registerDeviceSchema = z.object({
    deviceId: z.string().min(1, 'Device ID is required'),
    deviceName: z.string().min(1).max(100),
    os: z.enum(['windows', 'macos', 'linux']),
    appVersion: z.string().optional(),
});

const deleteDeviceSchema = z.object({
    deviceId: z.string().min(1, 'Device ID is required'),
});

/**
 * POST - Register a new device
 */
export async function POST(request: NextRequest) {
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
        return authResult.error;
    }

    const { context } = authResult;

    try {
        const body = await request.json();
        const validation = registerDeviceSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid request', details: validation.error.issues },
                { status: 400 }
            );
        }

        const { deviceId, deviceName, os, appVersion } = validation.data;
        const deviceIdHash = hashDeviceId(deviceId);

        // Check if device already exists
        const existingDevice = await db
            .select()
            .from(cloudSyncDevices)
            .where(
                and(
                    eq(cloudSyncDevices.userId, context.userId),
                    eq(cloudSyncDevices.deviceIdHash, deviceIdHash)
                )
            )
            .limit(1);

        if (existingDevice.length > 0) {
            // Update the existing device's last seen timestamp
            const [updatedDevice] = await db
                .update(cloudSyncDevices)
                .set({
                    deviceName,
                    os,
                    appVersion,
                    lastSeenAt: new Date(),
                })
                .where(eq(cloudSyncDevices.id, existingDevice[0].id))
                .returning();

            await logSyncAction(
                context.userId,
                updatedDevice.id,
                'update_device',
                null,
                true,
                undefined,
                { deviceName, os }
            );

            return NextResponse.json({
                success: true,
                device: {
                    id: updatedDevice.id,
                    deviceName: updatedDevice.deviceName,
                    os: updatedDevice.os,
                    lastSeenAt: updatedDevice.lastSeenAt,
                },
                message: 'Device updated',
            });
        }

        // Register new device
        const [newDevice] = await db
            .insert(cloudSyncDevices)
            .values({
                userId: context.userId,
                deviceIdHash,
                deviceName,
                os,
                appVersion,
            })
            .returning();

        await logSyncAction(
            context.userId,
            newDevice.id,
            'register_device',
            null,
            true,
            undefined,
            { deviceName, os }
        );

        return NextResponse.json({
            success: true,
            device: {
                id: newDevice.id,
                deviceName: newDevice.deviceName,
                os: newDevice.os,
                createdAt: newDevice.createdAt,
            },
            message: 'Device registered successfully',
        });
    } catch (error) {
        console.error('Device registration error:', error);
        return NextResponse.json(
            { error: 'Failed to register device' },
            { status: 500 }
        );
    }
}

/**
 * GET - List all registered devices
 */
export async function GET(request: NextRequest) {
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
        return authResult.error;
    }

    const { context } = authResult;

    try {
        const devices = await db
            .select({
                id: cloudSyncDevices.id,
                deviceName: cloudSyncDevices.deviceName,
                os: cloudSyncDevices.os,
                appVersion: cloudSyncDevices.appVersion,
                createdAt: cloudSyncDevices.createdAt,
                lastSeenAt: cloudSyncDevices.lastSeenAt,
            })
            .from(cloudSyncDevices)
            .where(eq(cloudSyncDevices.userId, context.userId));

        return NextResponse.json({
            success: true,
            devices,
        });
    } catch (error) {
        console.error('List devices error:', error);
        return NextResponse.json(
            { error: 'Failed to list devices' },
            { status: 500 }
        );
    }
}

/**
 * DELETE - Remove a device
 */
export async function DELETE(request: NextRequest) {
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
        return authResult.error;
    }

    const { context } = authResult;

    try {
        const body = await request.json();
        const validation = deleteDeviceSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid request', details: validation.error.issues },
                { status: 400 }
            );
        }

        const { deviceId } = validation.data;
        const deviceIdHash = hashDeviceId(deviceId);

        const deletedDevices = await db
            .delete(cloudSyncDevices)
            .where(
                and(
                    eq(cloudSyncDevices.userId, context.userId),
                    eq(cloudSyncDevices.deviceIdHash, deviceIdHash)
                )
            )
            .returning({ id: cloudSyncDevices.id });

        if (deletedDevices.length === 0) {
            return NextResponse.json(
                { error: 'Device not found' },
                { status: 404 }
            );
        }

        await logSyncAction(
            context.userId,
            null,
            'delete_device',
            null,
            true
        );

        return NextResponse.json({
            success: true,
            message: 'Device removed',
        });
    } catch (error) {
        console.error('Delete device error:', error);
        return NextResponse.json(
            { error: 'Failed to remove device' },
            { status: 500 }
        );
    }
}
