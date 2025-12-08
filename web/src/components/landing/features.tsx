'use client';

import Image from "next/image";
import { Check, RefreshCw, Key, Command, Activity } from "lucide-react";

const features = [
    {
        title: "Master MCP Config → All IDEs",
        description:
            "Edit your mcp.json once. Click Sync. Every IDE gets updated. Cursor, Windsurf, Trae, Qoder—all in sync.",
        icon: RefreshCw,
        benefits: ["Sync to unlimited IDEs", "Per-IDE overrides available", "Automatic backup on sync"],
        screenshot: "/screenshots/MCP Configuration Sync.png",
        gradient: "from-primary to-cyan-500",
    },
    {
        title: "Store API Keys Once",
        description:
            "Add your Anthropic, OpenAI, or Gemini keys. DevSynq automatically injects them into each IDE's config. No more copy-pasting keys 5 times.",
        icon: Key,
        benefits: ["Secure local storage", "Auto-inject to configs", "Never leaves your machine"],
        screenshot: "/screenshots/API Keys Sync.png",
        gradient: "from-emerald-400 to-primary",
    },
    {
        title: "Launch Anything, Instantly",
        description:
            "Alt+Shift+Space anywhere on your computer. Type 3 letters. Launch any project in any IDE. Faster than Alt+Tab.",
        icon: Command,
        benefits: ["Global keyboard shortcut", "Fuzzy search projects", "IDE preference per project"],
        screenshot: "/screenshots/Command Pallete IDE Manager.png",
        gradient: "from-primary to-indigo-400",
    },
    {
        title: "See What's Running",
        description:
            "Monitor CPU and memory per IDE. Focus or quit with one click. Kill all when your machine is dying.",
        icon: Activity,
        benefits: ["Real-time CPU/Memory stats", "One-click focus or kill", "Batch close all IDEs"],
        screenshot: "/screenshots/IDE Process Manager.png",
        gradient: "from-amber-400 to-rose-400",
    },
];

export function Features() {
    return (
        <section className="py-32 px-6 bg-background" id="features">
            <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-20">
                    <p className="text-primary font-semibold text-sm mb-4 uppercase tracking-wider">Features</p>
                    <h2 className="text-4xl md:text-5xl font-black mb-6">
                        Everything You Need to
                        <span className="block text-gradient">Master Your AI IDEs</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        DevSynq is the control center for all your AI-powered development environments. Simple, fast,
                        and just works.
                    </p>
                </div>

                {/* Features */}
                <div className="space-y-32">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        const isReversed = index % 2 === 1;

                        return (
                            <div
                                key={feature.title}
                                className={`grid lg:grid-cols-2 gap-16 items-center ${isReversed ? "lg:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Text content */}
                                <div className={isReversed ? "lg:order-2" : ""}>
                                    <div
                                        className={`w-12 h-12 rounded-xl bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-6`}
                                    >
                                        <Icon className="w-6 h-6 text-[#022c22]" />
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
                                                <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0">
                                                    <Check className="w-3 h-3 text-emerald-300" />
                                                </div>
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Image/Screenshot */}
                                <div className={isReversed ? "lg:order-1" : ""}>
                                    <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl shadow-primary/15 backdrop-blur">
                                        {/* Window chrome */}
                                        <div className="bg-secondary px-4 py-3 flex items-center gap-2 border-b border-border/60">
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                                <div className="w-3 h-3 rounded-full bg-amber-300" />
                                                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                            </div>
                                            <span className="text-xs text-muted-foreground ml-4">
                                                {feature.title}
                                            </span>
                                        </div>
                                        <div className="bg-card aspect-4/3 relative">
                                            <Image
                                                src={feature.screenshot}
                                                alt={`${feature.title} screenshot`}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-transparent to-background/40" />
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
