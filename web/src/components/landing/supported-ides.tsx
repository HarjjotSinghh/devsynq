'use client';

import { Check, Clock } from "lucide-react";
import { IDE_LIST } from "@/lib/ides";

export function SupportedIDEs() {
    const ides = IDE_LIST;

    return (
        <section className="py-32 px-6 bg-[#0a0a0f] border-y border-border">
            <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <p className="text-primary font-semibold text-sm mb-4 uppercase tracking-wider">
                        Compatibility
                    </p>
                    <h2 className="text-4xl md:text-5xl font-black mb-6">
                        Works with Your
                        <span className="block text-gradient">Favorite AI IDEs</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        DevSynq supports all major AI-powered development environments. More
                        coming soon.
                    </p>
                </div>

                {/* IDE Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {ides.map((ide) => (
                        <div
                            key={ide.name}
                            className={`relative group p-6 rounded-xl border transition-all ${
                                (ide.status ?? "available") === "available"
                                    ? "bg-card border-border hover:border-primary/60 hover:bg-secondary/70"
                                    : "bg-secondary/60 border-border/40 opacity-80"
                            }`}
                        >
                            <div className="text-center">
                                <span className="text-4xl mb-3 block">{ide.icon}</span>
                                <p className="font-medium text-foreground">{ide.name}</p>
                                <div className="mt-2 flex items-center justify-center gap-1">
                                    {(ide.status ?? "available") === "available" ? (
                                        <>
                                            <Check className="w-3 h-3 text-green-400" />
                                            <span className="text-xs text-green-400">Available</span>
                                        </>
                                    ) : (
                                        <>
                                            <Clock className="w-3 h-3 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Coming Soon</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            {(ide.status ?? "available") === "available" && (
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Request IDE */}
                <div className="mt-12 text-center">
                    <p className="text-muted-foreground">
                        Don&apos;t see your IDE?{" "}
                        <a
                            href="https://github.com/HarjjotSinghh/devsynq/issues"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            Request it on GitHub →
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
