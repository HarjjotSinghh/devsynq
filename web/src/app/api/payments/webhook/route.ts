import { NextRequest, NextResponse } from 'next/server';
import { dodo } from '@/lib/dodopayments';
import { db } from '@/lib/db';
import { cloudSyncUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
    const body = await req.text();

    // Convert headers to a plain object
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
        headers[key] = value;
    });

    let event;
    try {
        event = dodo.webhooks.unwrap(body, {
            headers,
            key: process.env.DODO_PAYMENTS_WEBHOOK_KEY || '',
        });
    } catch (err: any) {
        console.error('Webhook signature verification failed.', err.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const { type, data } = event;
    console.log(`Received event: ${type}`);

    try {
        // Handle events
        switch (type) {
            case 'subscription.active':
            case 'subscription.renewed':
            case 'subscription.updated':
                await handleSubscriptionActive(data);
                break;
            case 'subscription.cancelled':
            case 'subscription.expired':
            case 'subscription.failed':
            case 'subscription.on_hold':
                await handleSubscriptionInactive(data);
                break;
            default:
                console.log(`Unhandled event type: ${type}`);
        }
    } catch (error) {
        console.error('Error handling webhook event:', error);
        return NextResponse.json({ error: 'Error handling event' }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}

async function handleSubscriptionActive(subscription: any) {
    // Try to get userId from metadata
    let userId = subscription.metadata?.userId;

    // If no userId in metadata, try to find user by email
    if (!userId && subscription.customer?.email) {
        const user = await db.query.cloudSyncUsers.findFirst({
            where: eq(cloudSyncUsers.email, subscription.customer.email),
        });
        if (user) {
            userId = user.id;
        }
    }

    if (!userId) {
        console.warn('No userId found for subscription:', subscription.subscription_id);
        return;
    }

    await db.update(cloudSyncUsers)
        .set({
            planType: 'pro',
            subscriptionId: subscription.subscription_id,
            subscriptionStatus: 'active',
            customerId: subscription.customer?.customer_id,
            updatedAt: new Date(),
        })
        .where(eq(cloudSyncUsers.id, userId));

    console.log(`Updated user ${userId} to pro plan`);
}

async function handleSubscriptionInactive(subscription: any) {
    let userId = subscription.metadata?.userId;

    if (!userId && subscription.customer?.email) {
        const user = await db.query.cloudSyncUsers.findFirst({
            where: eq(cloudSyncUsers.email, subscription.customer.email),
        });
        if (user) {
            userId = user.id;
        }
    }

    if (!userId) {
        console.warn('No userId found for subscription:', subscription.subscription_id);
        return;
    }

    await db.update(cloudSyncUsers)
        .set({
            planType: 'free',
            subscriptionStatus: subscription.status,
            updatedAt: new Date(),
        })
        .where(eq(cloudSyncUsers.id, userId));

    console.log(`Updated user ${userId} to free plan (status: ${subscription.status})`);
}
