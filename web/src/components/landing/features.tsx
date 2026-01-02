'use client';

import Image from "next/image";
import { Check, RefreshCw, Key, Command, Activity, Sparkles, Package, FileText } from "lucide-react";
import { useSequentialReveal } from "@/hooks/use-gsap-reveal";

const features = [
    {
        title: "Master MCP Config → All IDEs",
        description:
            "Edit your mcp.json once. Click Sync. Every IDE gets updated—or override per-project for specialized setups. The choice is yours.",
        icon: RefreshCw,
        benefits: ["Sync to unlimited IDEs", "Per-project custom configs", "Automatic backup on sync"],
        screenshot: "/screenshots/MCP Configuration Sync.png",
        gradient: "from-primary to-primary/80",
    },
    {
        title: "Store API Keys Once",
        description:
            "Add your Anthropic, OpenAI, or Gemini keys. DevSynq automatically injects them into each IDE's config. No more copy-pasting keys 5 times.",
        icon: Key,
        benefits: ["Secure local storage", "Auto-inject to configs", "Never leaves your machine"],
        screenshot: "/screenshots/API Keys Sync.png",
        gradient: "from-primary to-primary/80",
    },
    {
        title: "Launch Anything, Instantly",
        description:
            "Alt+Shift+Space anywhere on your computer. Type 3 letters. Launch any project in any IDE. Faster than Alt+Tab.",
        icon: Command,
        benefits: ["Global keyboard shortcut", "Fuzzy search projects", "IDE preference per project"],
        screenshot: "/screenshots/Command Pallete IDE Manager.png",
        gradient: "from-primary to-primary/80",
    },
    {
        title: "See What's Running",
        description:
            "Monitor CPU and memory per IDE. Focus or quit with one click. Kill all when your machine is dying.",
        icon: Activity,
        benefits: ["Real-time CPU/Memory stats", "One-click focus or kill", "Batch close all IDEs"],
        screenshot: "/screenshots/IDE Process Manager.png",
        gradient: "from-primary to-primary/80",
    },
    {
        title: "Discover & Install Servers",
        description:
            "Browse the built-in MCP Marketplace. One-click install for PostgreSQL, Google Drive, Slack, and 100+ other agents. We handle the config.",
        icon: Package,
        benefits: ["Centralized catalog", "One-click installation", "Auto-updates"],
        screenshot: "/screenshots/MCP Configuration Sync.png", // Placeholder
        gradient: "from-primary to-primary/80",
    },
    {
        title: "Enforce Coding Standards",
        description:
            "Define global rules for your AI agents. 'Always use TypeScript', 'No console.log'. Syncs to every project automatically.",
        icon: FileText,
        benefits: ["Global rule sets", "Project-specific overrides", "Consistent code quality"],
        screenshot: "/screenshots/General App Settings.png", // Placeholder
        gradient: "from-primary to-primary/80",
    },
];

export function Features() {
    const sectionRef = useSequentialReveal({ y: 26, itemDuration: 0.5, gap: 0.1 });
    return (
        <section
            ref={sectionRef}
            className="relative isolate -mt-px overflow-hidden bg-background py-28 px-6"
            id="features"
        >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(93,233,182,0.05),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(93,233,182,0.05),transparent_38%)]" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 scale-y-[-1]"
            >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(93,233,182,0.05),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(93,233,182,0.05),transparent_38%)]" />
            </div>

            <div className="relative max-w-6xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-18 space-y-4">
                    <div data-animate data-animate-order="1" className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">
                        <Sparkles className="h-4 w-4" />
                        Feature deep dive
                    </div>
                    <h2 data-animate data-animate-order="2" className="text-4xl md:text-5xl font-black leading-tight">
                        Everything you need to
                        <span className="block text-gradient">master your AI IDEs</span>
                    </h2>
                    <p data-animate data-animate-order="3" className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        DevSynq is the control center for all your AI-powered development environments. Simple, fast,
                        and just works.
                    </p>
                    <div data-animate data-animate-order="4" className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-primary">
                            <Check className="h-4 w-4" />
                            Sync, launch, observe
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="space-y-28">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        const isReversed = index % 2 === 1;

                        return (
                            <div
                                key={feature.title}
                                data-animate
                                data-animate-order={index + 2}
                                className={`relative grid items-center gap-14 lg:grid-cols-2 ${isReversed ? "lg:flex-row-reverse" : ""}`}
                            >
                                <div className="absolute inset-0 rounded-[32px] bg-card/50 blur-3xl" />
                                {/* Text content */}
                                <div className={`relative ${isReversed ? "lg:order-2" : ""}`}>
                                    <div
                                        className={`w-12 h-12 rounded-xl bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-[0_12px_35px_-20px_rgba(93,233,182,0.6)]`}
                                    >
                                        <Icon className="w-6 h-6 text-primary-foreground" />
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                                        {feature.title}
                                    </h3>
                                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                        {feature.description}
                                    </p>
                                    <ul className="space-y-3">
                                        {feature.benefits.map((benefit) => (
                                            <li key={benefit} className="flex items-center gap-3 text-foreground">
                                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                    <Check className="w-3 h-3 text-primary" />
                                                </div>
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Image/Screenshot */}
                                <div className={`relative ${isReversed ? "lg:order-1" : ""}`}>
                                    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-[0_22px_90px_-55px_rgba(0,0,0,0.9)] transition-all duration-200 hover:-translate-y-1 hover:border-primary/40">
                                        {/* Glow overlay */}
                                        <div
                                            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
                                            style={{
                                                background: `radial-gradient(circle at 20% 15%, rgba(90,230,187,0.18), transparent 45%), radial-gradient(circle at 80% 0%, rgba(34,197,235,0.15), transparent 45%)`,
                                            }}
                                        />
                                        {/* Window chrome */}
                                        <div className="bg-secondary/80 px-4 py-3 flex items-center gap-2 border-b border-border/60">
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                                                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                                                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                                            </div>
                                            <span className="text-xs text-muted-foreground ml-4">
                                                {feature.title}
                                            </span>
                                        </div>
                                        <div className="bg-card aspect-4/3 relative overflow-hidden">
                                            <Image
                                                src={feature.screenshot}
                                                alt={`${feature.title} screenshot`}
                                                fill
                                                className="object-cover transition-transform duration-500 select-none"
                                                draggable={false}
                                            />
                                            <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-transparent to-background/60" />
                                            <div className="absolute right-4 bottom-4 rounded-full border border-white/15 bg-background/70 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                                Actual UI
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
