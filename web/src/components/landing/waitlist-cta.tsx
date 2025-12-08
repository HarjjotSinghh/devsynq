'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Loader2, Sparkles } from "lucide-react";

const schema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

interface WaitlistCtaProps {
    spotsClaimed?: number;
}

export function WaitlistCta({ spotsClaimed = 319 }: WaitlistCtaProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentSpots, setCurrentSpots] = useState(spotsClaimed);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

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
        <section className="py-32 px-6 bg-background" id="waitlist">
            <div className="max-w-4xl mx-auto">
                <div className="relative">
                    {/* Background glow */}
                    <div className="absolute inset-0 bg-linear-to-r from-primary/25 via-cyan-400/25 to-primary/25 rounded-3xl blur-3xl opacity-30" />

                    {/* Card */}
                    <div className="relative bg-card border border-border rounded-3xl p-8 md:p-16 shadow-xl shadow-primary/10">
                        {/* Badge */}
                        <div className="flex justify-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 text-primary text-sm">
                                <Sparkles className="w-4 h-4" />
                                First 500 get lifetime free access
                            </div>
                        </div>

                        {/* Header */}
                        <div className="text-center mb-10">
                            <h2 className="text-4xl md:text-5xl font-black mb-4">
                                Get <span className="text-gradient">Lifetime Free</span> Access
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Join {currentSpots}+ developers who claimed their spot. Forever
                                free.
                            </p>
                        </div>

                        {/* Form */}
                        {isSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#00ff88]/20 flex items-center justify-center">
                                    <Check className="w-8 h-8 text-[#00ff88]" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">You're on the list!</h3>
                                <p className="text-[#888]">
                                    Check your email for confirmation. Welcome to DevSynq! 🎉
                                </p>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="max-w-md mx-auto"
                            >
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1">
                                        <Input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="h-14 bg-secondary border-border focus:border-primary text-lg px-5 rounded-xl"
                                            {...register("email")}
                                        />
                                        {errors.email && (
                                            <p className="text-destructive text-sm mt-2">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="h-14 bg-linear-to-r from-primary to-cyan-500 hover:brightness-110 text-[#022c22] font-semibold px-8 rounded-xl text-lg shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Joining...
                                            </>
                                        ) : (
                                            "Claim Your Spot"
                                        )}
                                    </Button>
                                </div>
                                {error && (
                                    <p className="text-destructive text-sm mt-3 text-center">
                                        {error}
                                    </p>
                                )}
                            </form>
                        )}

                        {/* Counter */}
                        <div className="mt-8 text-center">
                            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-secondary border border-border/60">
                                <span className="text-2xl font-bold text-gradient">
                                    {currentSpots}/500
                                </span>
                                <span className="text-muted-foreground">spots claimed</span>
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                            {[
                                "Unlimited IDEs",
                                "Cloud backup",
                                "Priority support",
                                "Lifetime updates",
                            ].map((benefit) => (
                                <div key={benefit} className="flex items-center justify-center gap-2 text-muted-foreground">
                                    <Check className="w-4 h-4 text-emerald-300" />
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
