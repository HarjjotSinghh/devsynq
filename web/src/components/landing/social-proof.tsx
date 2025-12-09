'use client';

import { Github, Download, Users, Sparkles, ShieldCheck } from "lucide-react";
import { IDE_LIST } from "@/lib/ides";
import { IdeIcon } from "../../../../src/renderer/components/Icons";
import { useSequentialReveal } from "@/hooks/use-gsap-reveal";
import { useEffect, useState } from "react";

interface SocialProofProps {
    spotsClaimed?: number;
    githubStars?: number;
    totalDownloads?: number;
}

export function SocialProof({
    spotsClaimed = 219,
    githubStars = 128,
    totalDownloads = 1240,
}: SocialProofProps) {
    const sectionRef = useSequentialReveal({ itemDuration: 0.45, gap: 0.08 });

    // For SSR, avoid rendering the stats cards until mounted in the browser.
    // SSR = true means we're on the server. React.useEffect only runs on client.
    // We'll use a ready/mounted state.
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setMounted(true);
        }, 100);
    }, []);

    const stats = [
        {
            label: "Developers",
            value: `${spotsClaimed}+`,
            icon: Users,
            tint: "from-emerald-400/30 to-primary/30",
            badge: "Live waitlist momentum",
        },
        {
            label: "GitHub Stars",
            value: `${githubStars}+`,
            icon: Github,
            tint: "from-[#5ae6bb]/30 to-primary/30",
            badge: "Open source trust",
        },
        {
            label: "Downloads",
            value: `${totalDownloads.toLocaleString()}+`,
            icon: Download,
            tint: "from-cyan-400/30 to-emerald-400/30",
            badge: "Shipped to real teams",
        },
    ];

    return (
        <section ref={sectionRef} className="relative isolate -mt-px py-24 px-6 bg-linear-to-b from-[#05060c] via-[#05070d] to-[#020308]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,235,0.12),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(90,230,187,0.1),transparent_38%)]" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 scale-y-[-1]"
            >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(244,63,94,0.15),transparent_42%),radial-gradient(circle_at_85%_5%,rgba(248,113,113,0.12),transparent_38%)]" />
            </div>

            <div className="relative max-w-6xl mx-auto space-y-12">
                <div data-animate data-animate-order="1" className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">
                        <Sparkles className="h-4 w-4" />
                        Social proof
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black leading-tight text-foreground">
                        Trusted by builders shipping with AI IDEs
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Real usage, open-source traction, and installs from teams who need every IDE in sync.
                    </p>
                </div>

                {/* Stats */}
                <div data-animate data-animate-order="2" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {mounted ? (
                        stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={stat.label}
                                    data-animate
                                    data-animate-order={`${10 + index}`}
                                    className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-5 shadow-[0_20px_80px_-55px_rgba(0,0,0,0.9)] transition-all duration-200 hover:-translate-y-1 hover:border-primary/40"
                                >
                                    <div
                                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                        style={{
                                            background: `linear-gradient(135deg, rgba(34,197,235,0.14), transparent 45%)`,
                                        }}
                                    />
                                    <div className="relative flex items-center gap-3">
                                        <div className={`h-12 w-12 rounded-xl bg-linear-to-br ${stat.tint} flex items-center justify-center border border-white/10`}>
                                            <Icon className="h-5 w-5 text-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                                        </div>
                                    </div>
                                    <p className="relative mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                        {stat.badge}
                                    </p>
                                </div>
                            );
                        })
                    ) : (
                        // Don't render anything on server for the stats cards to fix SSR bug
                        null
                    )}
                </div>

                {/* Supported IDEs */}
                <div data-animate data-animate-order="3" className="space-y-3 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-foreground/80">
                        <ShieldCheck className="h-4 w-4 text-emerald-300" />
                        Syncs seamlessly with your favorite AI IDEs
                    </div>
                    <div data-animate data-animate-order="4" className="flex flex-wrap justify-center gap-4">
                        {IDE_LIST.map((ide) => (
                            <div
                                key={ide.name}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/70 bg-card/70 hover:border-primary/40 transition-all"
                                style={{
                                    boxShadow: `0 12px 40px -32px ${ide.color}80`,
                                }}
                            >
                                <div
                                    className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-secondary/70"
                                    style={{ boxShadow: `0 8px 24px -20px ${ide.color}a0` }}
                                >
                                    <IdeIcon ide={ide.name} size={22} />
                                </div>
                                <span className="text-sm text-muted-foreground">{ide.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
