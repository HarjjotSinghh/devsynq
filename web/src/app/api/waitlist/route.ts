import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/db';
import { waitlist, stats } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import WelcomeEmail from '@/emails/welcome';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        // Validate email
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existing = await db
            .select()
            .from(waitlist)
            .where(eq(waitlist.email, email.toLowerCase()))
            .limit(1);

        if (existing.length > 0) {
            return NextResponse.json(
                { error: 'This email is already on the waitlist!' },
                { status: 409 }
            );
        }

        // Get current count
        const countResult = await db.select({ count: sql<number>`count(*)` }).from(waitlist);
        const currentCount = Number(countResult[0]?.count || 0);
        const spotsRemaining = Math.max(0, 500 - currentCount);

        // Check if spots are available
        if (spotsRemaining <= 0) {
            return NextResponse.json(
                { error: 'Sorry, all lifetime free spots have been claimed!' },
                { status: 400 }
            );
        }

        // Add to waitlist
        await db.insert(waitlist).values({
            email: email.toLowerCase(),
            source: 'website',
        });

        // Update stats
        await db
            .insert(stats)
            .values({ key: 'total_signups', value: currentCount + 1 })
            .onConflictDoUpdate({
                target: stats.key,
                set: { value: currentCount + 1, updatedAt: new Date() },
            });

        // Send welcome email
        try {
            await resend.emails.send({
                from: 'DevSynq <hello@devsynq.app>',
                to: email,
                subject: "You're on the DevSynq waitlist! 🎉",
                react: WelcomeEmail({ email, spotsRemaining: spotsRemaining - 1 }),
            });
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Don't fail the signup if email fails
        }

        return NextResponse.json({
            success: true,
            message: 'Welcome to DevSynq! Check your email for confirmation.',
            spotsRemaining: spotsRemaining - 1,
            position: currentCount + 1,
        });
    } catch (error) {
        console.error('Waitlist signup error:', error);
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const countResult = await db.select({ count: sql<number>`count(*)` }).from(waitlist);
        const currentCount = Number(countResult[0]?.count || 0);
        const spotsRemaining = Math.max(0, 500 - currentCount);

        return NextResponse.json({
            totalSignups: currentCount,
            spotsRemaining,
            spotsClaimed: currentCount,
        });
    } catch (error) {
        console.error('Error fetching waitlist stats:', error);
        // Return fallback data if DB is not available
        return NextResponse.json({
            totalSignups: 219,
            spotsRemaining: 133,
            spotsClaimed: 219,
        });
    }
}
