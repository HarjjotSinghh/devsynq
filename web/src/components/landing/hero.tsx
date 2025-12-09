'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Sparkles, ShieldCheck, Gauge } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSequentialReveal } from "@/hooks/use-gsap-reveal";

interface HeroProps {
    spotsClaimed?: number;
}

export function Hero({ spotsClaimed = 219 }: HeroProps) {
    const totalSpots = 500;
    const progress = Math.min((spotsClaimed / totalSpots) * 100, 100);
    const sectionRef = useSequentialReveal({ y: 28, duration: 0.7, itemDuration: 0.5, gap: 0.08 });

    return (
        <section
            ref={sectionRef}
            className="relative flex flex-col items-center justify-center h-fit px-6 py-20 pt-32 pb-0 text-center bg-linear-to-b from-[#03040a] via-[#04060c] to-[#010206]"
        >
            <div className="absolute inset-x-0 -bottom-12 h-16 bg-linear-to-t from-[#010206] via-[#020308]/75 to-transparent pointer-events-none" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(90,230,187,0.16),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(34,197,235,0.12),transparent_35%)]" />
            <div className="absolute inset-x-14 top-12 h-24 rounded-[32px] border border-white/5 bg-white/5 blur-3xl" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 scale-y-[-1]"
            >
                <div className="absolute inset-x-0 -bottom-12 h-16 bg-linear-to-t from-[#020308] via-[#05070d]/75 to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,235,0.12),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(90,230,187,0.1),transparent_38%)]" />
                <div className="absolute inset-x-12 top-14 h-20 rounded-[32px] border border-white/5 bg-white/5 blur-3xl" />
            </div>
            {/* Badge */}
            <div
                data-animate
                data-animate-order="1"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 text-primary text-sm mb-6 animate-pulse-slow"
            >
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <Sparkles className="w-4 h-4" />
                {spotsClaimed}/{totalSpots} lifetime free spots claimed
            </div>

            {/* Headline */}
            <h1
                data-animate
                data-animate-order="2"
                className="text-5xl md:text-7xl font-black leading-tight mb-6 max-w-6xl"
            >
                <span className="bg-linear-to-r from-primary via-cyan-400 to-emerald-300 bg-clip-text text-transparent">
                    Stop Copy-Pasting 
                </span><br />
                <span className="text-foreground">Your MCP Config Across</span>{' '}
                <span className="text-foreground">5 Different AI IDEs</span>
            </h1>

            {/* Subheadline */}
            <p
                data-animate
                data-animate-order="3"
                className="text-lg md:text-xl text-muted-foreground max-w-4xl mb-8 leading-relaxed"
            >
                DevSynq syncs your MCP servers, API keys, and projects across{" "}
                <span className="text-foreground">Cursor</span>,{" "}
                <span className="text-foreground">Windsurf</span>,{" "}
                <span className="text-foreground">VS Code</span>, and more.{" "}
                <span className="text-primary">One config. All your IDEs.</span>
            </p>


            {/* CTAs */}
            <div
                data-animate
                data-animate-order="4"
                className="flex flex-col sm:flex-row gap-4 mb-8"
            >
                <a href="#waitlist">
                    <Button
                        size="lg"
                        className="bg-linear-to-r from-primary to-cyan-500 hover:brightness-110 text-[#022c22] font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-primary/10 transition-all hover:shadow-primary/20 "
                    >
                        Get Lifetime Free Access
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </a>
                <Link href="/download">
                    <Button
                        variant="outline"
                        size="lg"
                        className="border-border hover:bg-secondary/60 px-8 py-6 text-lg rounded-xl"
                    >
                        <Download className="w-5 h-5 mr-2" />
                        Download v1.0
                    </Button>
                </Link>

            </div>

            {/* Highlights */}
            <div
                data-animate
                data-animate-order="5"
                className="flex flex-wrap items-center justify-center gap-3 mb-8 text-sm"
            >
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-emerald-100">
                    <ShieldCheck className="w-4 h-4" />
                    Secure, local-first
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-primary">
                    <Gauge className="w-4 h-4" />
                    Instant IDE sync
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-foreground/80">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Built for AI workflows
                </div>
            </div>



            {/* Progress bar */}
            <div data-animate data-animate-order="6" className="w-full max-w-3xl mb-14">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    <span>Lifetime spots</span>
                    <span className="text-primary font-semibold">{spotsClaimed}/{totalSpots} claimed</span>
                </div>
                <div className="h-2.5 rounded-full bg-border/60 overflow-hidden">
                    <div
                        className="h-2.5 rounded-full bg-linear-to-r from-primary to-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-[width]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Hero Screenshot */}
            <div data-animate data-animate-order="7" className="relative w-full max-w-6xl mt-2">
                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
                <div className="relative rounded-2xl overflow-hidden border border-border/70 bg-card/70 shadow-[0_26px_110px_-60px_rgba(0,0,0,0.9)] backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:border-primary/40">
                    {/* Window chrome */}
                    <div className="bg-secondary/80 px-4 py-3 flex items-center gap-2 border-b border-border/60">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-amber-300" />
                            <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        </div>
                        <span className="text-xs text-muted-foreground ml-4">DevSynq</span>
                    </div>
                    <div className="bg-card aspect-video relative overflow-hidden">
                        <Image
                            src="/screenshots/Home Page or Landing Application Page.png"
                            alt="DevSynq landing experience"
                            fill
                            className="object-cover transition-transform duration-500 select-none"
                            draggable={false}
                            priority
                        />
                        <div className="absolute right-4 bottom-4 rounded-full border border-white/15 bg-background/70 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                            Actual UI
                        </div>
                    </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -left-4 top-1/4 bg-card/85 border border-border rounded-lg p-3 shadow-xl animate-float hidden lg:block">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-primary/15 flex items-center justify-center">
                            <span className="text-primary text-xs">✓</span>
                        </div>
                        <div>
                            <p className="text-xs font-medium">Config synced</p>
                            <p className="text-[10px] text-muted-foreground">5 IDEs updated</p>
                        </div>
                    </div>
                </div>

                <div
                    className="absolute -right-4 top-1/3 bg-card/85 border border-border rounded-lg p-3 shadow-xl animate-float hidden lg:block"
                    style={{ animationDelay: "1s" }}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-emerald-400/15 flex items-center justify-center">
                            <span className="text-emerald-300 text-xs">🔑</span>
                        </div>
                        <div>
                            <p className="text-xs font-medium">API Keys secure</p>
                            <p className="text-[10px] text-muted-foreground">Local storage only</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
