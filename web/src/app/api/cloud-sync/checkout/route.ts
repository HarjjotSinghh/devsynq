import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/cloud-sync/auth';
import { dodo } from '@/lib/dodopayments';

export async function POST(request: NextRequest) {
    // 1. Authenticate the user
    const auth = await authenticateRequest(request);

    if (!auth.authenticated) {
        return auth.error;
    }

    const { context: user } = auth;

    try {
        // 2. Create a checkout session
        const session = await dodo.checkoutSessions.create({
            product_cart: [{
                product_id: process.env.DODO_PRODUCT_ID || '',
                quantity: 1,
            }],
            billing_address: {
                country: 'US', // Default, user can change
            },
            customer: {
                email: user.email,
                name: user.email.split('@')[0], // Basic name inference
            },
            metadata: {
                userId: user.userId,
            },
            return_url: process.env.DODO_PAYMENTS_RETURN_URL,
        });

        return NextResponse.json({ checkout_url: session.checkout_url });
    } catch (error: any) {
        console.error('Failed to create checkout session:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
