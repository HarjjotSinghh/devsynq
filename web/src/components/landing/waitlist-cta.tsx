'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useSequentialReveal } from "@/hooks/use-gsap-reveal";

const schema = z.object({
    email: z.email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

interface WaitlistCtaProps {
    spotsClaimed?: number;
}

export function WaitlistCta({ spotsClaimed = 219 }: WaitlistCtaProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentSpots, setCurrentSpots] = useState(spotsClaimed);
    const totalSpots = 500;
    const progress = Math.min((currentSpots / totalSpots) * 100, 100);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });
    const sectionRef = useSequentialReveal({ y: 26, itemDuration: 0.5, gap: 0.08 });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: data.email }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Something went wrong");
            }

            setIsSuccess(true);
            setCurrentSpots(500 - result.spotsRemaining);
            reset();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section
            ref={sectionRef}
            className="relative isolate -mt-px py-24 sm:py-28 bg-background"
            id="waitlist"
        >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(93,233,182,0.05),transparent_40%),radial-gradient(circle_at_30%_20%,rgba(93,233,182,0.05),transparent_35%),radial-gradient(circle_at_70%_10%,rgba(93,233,182,0.05),transparent_30%)]" />
            <div className="absolute inset-16 rounded-[32px] border border-white/5 bg-linear-to-b from-white/5 via-transparent to-transparent blur-3xl" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 scale-y-[-1]"
            >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(93,233,182,0.05),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(93,233,182,0.05),transparent_38%)]" />
                {/* <div className="absolute inset-x-12 top-14 h-24 rounded-[32px] border border-white/5 bg-white/5 blur-3xl" /> */}
            </div>

            <div className="mx-auto max-w-6xl px-6">
                <div className="relative grid items-center gap-10 rounded-3xl border border-border/70 bg-card/80 p-8 backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
                    <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-primary/10 via-primary/5 to-primary/10 opacity-60 blur-3xl" />

                    <div className="relative space-y-8">
                        <div data-animate data-animate-order="1" className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">
                            <Sparkles className="h-4 w-4" />
                            First 500 get lifetime free access
                        </div>

                        <div data-animate data-animate-order="2" className="space-y-4">
                            {/* <p className="text-sm uppercase tracking-[0.35em] text-primary/80">
                                Waitlist
                            </p> */}
                            <h2 className="text-4xl font-black leading-tight sm:text-5xl">
                                Claim your{" "}
                                <span className="text-gradient">lifetime membership</span> before
                                the seats are gone.
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                DevSynq syncs your AI coding experience across every IDE. Join the
                                early adopters and lock in forever-free access plus priority
                                support.
                            </p>
                        </div>

                        <div data-animate data-animate-order="3" className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-border/60 bg-secondary/40 p-4">
                                <p className="text-sm text-muted-foreground">Spots claimed</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-semibold text-gradient">
                                        {currentSpots}/{totalSpots}
                                    </span>
                                    <span className="text-xs uppercase tracking-wide text-primary">
                                        filling fast
                                    </span>
                                </div>
                                <div className="mt-3 h-2 rounded-full bg-border/60">
                                    <div
                                        className="h-2 rounded-full bg-primary transition-[width]"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border/60 bg-secondary/40 p-4">
                                <p className="text-sm text-muted-foreground">Why join now?</p>
                                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        Lifetime pricing locked
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        VIP onboarding support
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        Early feature previews
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div data-animate data-animate-order="4" className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2 rounded-full border border-border/80 px-3 py-1">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                Secure & spam-free
                            </div>
                            <span className="text-border">•</span>
                            <span>No credit card required</span>
                            <span className="text-border">•</span>
                            <span>Cancel anytime with one click</span>
                        </div>
                    </div>

                    <div data-animate data-animate-order="5" className="relative">
                        {/* <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-2xl" /> */}
                        <div className="relative rounded-2xl border border-border/80 bg-secondary/60 p-6 backdrop-blur">
                            {isSuccess ? (
                                <div className="text-center space-y-4 py-8">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                        <Check className="h-8 w-8 text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-semibold">You&apos;re on the list!</h3>
                                        <p className="text-muted-foreground">
                                            Check your inbox for confirmation and next steps. Welcome to
                                            DevSynq. 🎉
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-border/80 bg-card/70 px-4 py-3 text-sm text-muted-foreground">
                                        Tip: Share your referral link after onboarding to unlock early
                                        feature drops.
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="space-y-2 text-center">
                                        <p className="text-sm uppercase tracking-[0.35em] text-primary/80">
                                            Reserve your spot
                                        </p>
                                        <h3 className="text-2xl font-semibold">
                                            Join {currentSpots}+ developers today
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Instant confirmation. No spam guaranteed.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex flex-col gap-2">
                                            <Input
                                                type="email"
                                                placeholder="Your email (no spam guaranteed)"
                                                className="h-12 bg-card border-border focus:border-primary text-base px-4 rounded-xl"
                                                {...register("email")}
                                            />
                                            {errors.email && (
                                                <p className="text-destructive text-sm">
                                                    {errors.email.message}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="h-12 w-full bg-primary text-primary-foreground font-semibold rounded-xl transition-all hover:-translate-y-px disabled:opacity-60"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Joining...
                                                </>
                                            ) : (
                                                "Claim Your Spot"
                                            )}
                                        </Button>
                                        {error && (
                                            <p className="text-center text-destructive text-sm">
                                                {error}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid gap-3 rounded-xl border border-border/60 bg-card/70 p-4 text-sm text-muted-foreground sm:grid-cols-2">
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-primary" />
                                            Unlimited IDE sync
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-primary" />
                                            Cloud backups on autopilot
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-primary" />
                                            Priority support lane
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-primary" />
                                            Lifetime updates included
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
