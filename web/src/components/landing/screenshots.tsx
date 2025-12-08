'use client';

import Image from "next/image";

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

export function Screenshots() {
    return (
        <section className="py-24 px-6 bg-background" id="screenshots">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-primary font-semibold text-sm mb-3 uppercase tracking-wider">Product view</p>
                    <h2 className="text-3xl md:text-4xl font-black mb-3">
                        Looks and feels like the desktop app
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        A curated peek at the electron experience—now mirrored on the web.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {screenshots.map((shot) => (
                        <div
                            key={shot.title}
                            className="group relative overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur shadow-lg shadow-primary/10 transition-transform hover:-translate-y-1"
                        >
                            <div className="relative aspect-4/3">
                                <Image
                                    src={shot.path}
                                    alt={shot.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                    priority={shot.title === "Home Overview"}
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/20 to-transparent pointer-events-none" />
                            </div>
                            <div className="p-4 space-y-1">
                                <p className="text-sm uppercase tracking-wide text-primary font-semibold">
                                    {shot.title}
                                </p>
                                <p className="text-foreground font-medium">{shot.caption}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
