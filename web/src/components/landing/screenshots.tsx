'use client';

import Image from "next/image";
import { Monitor, Sparkles } from "lucide-react";
import { motion, Variants } from "framer-motion";

const screenshots = [
    {
        title: "Home Overview",
        path: "/screenshots/Home Page or Landing Application Page.png",
        caption: "Landing experience matching the desktop UI",
    },
    {
        title: "Projects & IDEs",
        path: "/screenshots/Projects Page or Feature.png",
        caption: "Project list with preferred IDEs",
    },
    {
        title: "API Keys Sync",
        path: "/screenshots/API Keys Sync.png",
        caption: "Store once, sync everywhere",
    },
    {
        title: "MCP Configuration",
        path: "/screenshots/MCP Configuration Sync.png",
        caption: "Single source of truth for MCP servers",
    },
    {
        title: "Command Palette",
        path: "/screenshots/Command Pallete IDE Manager.png",
        caption: "Launch any project or IDE instantly",
    },
    {
        title: "Process Manager",
        path: "/screenshots/IDE Process Manager.png",
        caption: "Monitor and control running IDEs",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

export function Screenshots() {
    return (
        <section
            className="relative isolate -mt-px py-28 px-6 bg-background"
            id="screenshots"
        >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(93,233,182,0.05),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(93,233,182,0.05),transparent_38%)]" />
            <div className="absolute inset-x-12 top-16 h-24 rounded-[32px] border border-white/5 bg-white/5 blur-3xl" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 scale-y-[-1]"
            >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(93,233,182,0.05),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(93,233,182,0.05),transparent_38%)]" />
                <div className="absolute inset-x-10 top-16 h-24 rounded-[32px] border border-white/5 bg-white/5 blur-3xl" />
            </div>

            <motion.div
                className="relative max-w-6xl mx-auto space-y-12"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                <div className="text-center space-y-4">
                    <motion.div variants={itemVariants as Variants} className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">
                        <Sparkles className="h-4 w-4" />
                        Product view
                    </motion.div>
                    <motion.h2 variants={itemVariants as Variants} className="text-3xl md:text-4xl font-black leading-tight">
                        Looks and feels like the desktop app
                    </motion.h2>
                    <motion.p variants={itemVariants as Variants} className="text-muted-foreground max-w-2xl mx-auto">
                        A curated peek at the Electron experience—now mirrored on the web. Pixel-perfect screens that match what you ship.
                    </motion.p>
                    <motion.div variants={itemVariants as Variants} className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-primary">
                            <Monitor className="h-4 w-4" />
                            Live product captures
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-foreground/80">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Hover to zoom & glow
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {screenshots.map((shot) => (
                        <motion.div
                            key={shot.title}
                            variants={itemVariants as Variants}
                            className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 backdrop-blur shadow-[0_20px_80px_-48px_rgba(0,0,0,0.8)] transition-all duration-200 hover:-translate-y-1 hover:border-primary/40"
                        >
                            <div
                                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                style={{
                                    background: `radial-gradient(circle at 20% 15%, rgba(93,233,182,0.1), transparent 40%), radial-gradient(circle at 80% 0%, rgba(93,233,182,0.1), transparent 40%)`,
                                }}
                            />
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <Image
                                    src={shot.path}
                                    alt={shot.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105 select-none"
                                    draggable={false}
                                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-background/85 via-background/25 to-transparent pointer-events-none" />
                                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-foreground">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    {shot.title}
                                </div>
                                <div className="absolute right-4 bottom-4 rounded-full border border-white/15 bg-background/70 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                    Actual UI
                                </div>
                            </div>
                            <div className="p-4 space-y-1">
                                <p className="text-sm uppercase tracking-wide text-primary font-semibold">
                                    {shot.title}
                                </p>
                                <p className="text-foreground font-medium">{shot.caption}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
