'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface HeroProps {
    spotsClaimed?: number;
}

export function Hero({ spotsClaimed = 319 }: HeroProps) {
    return (
        <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden bg-background">
            {/* Background gradient effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-[160px] pointer-events-none" />

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 text-primary text-sm mb-8 animate-pulse-slow">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                🎉 {spotsClaimed}/500 lifetime free spots claimed
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 max-w-4xl">
                <span className="bg-linear-to-r from-primary via-cyan-400 to-emerald-300 bg-clip-text text-transparent">
                    Stop Copy-Pasting
                </span>
                <br />
                <span className="text-foreground">Your MCP Config Across</span>
                <br />
                <span className="text-foreground">5 Different AI IDEs</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
                DevSynq syncs your MCP servers, API keys, and projects across{" "}
                <span className="text-foreground">Cursor</span>,{" "}
                <span className="text-foreground">Windsurf</span>,{" "}
                <span className="text-foreground">VS Code</span>, and more.{" "}
                <span className="text-primary">One config. All your IDEs.</span>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <a href="#waitlist">
                    <Button
                        size="lg"
                        className="bg-linear-to-r from-primary to-cyan-500 hover:brightness-110 text-[#022c22] font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:scale-105"
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

            {/* Hero Screenshot */}
                <div className="relative w-full max-w-5xl mt-8">
                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
                <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl shadow-primary/15 backdrop-blur">
                    {/* Window chrome */}
                    <div className="bg-secondary px-4 py-3 flex items-center gap-2 border-b border-border/60">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-amber-300" />
                            <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        </div>
                        <span className="text-xs text-muted-foreground ml-4">DevSynq</span>
                    </div>
                    <div className="bg-card aspect-video relative">
                        <Image
                            src="/screenshots/Home Page or Landing Application Page.png"
                            alt="DevSynq landing experience"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -left-4 top-1/4 bg-card border border-border rounded-lg p-3 shadow-xl animate-float hidden lg:block">
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
                    className="absolute -right-4 top-1/3 bg-card border border-border rounded-lg p-3 shadow-xl animate-float hidden lg:block"
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
