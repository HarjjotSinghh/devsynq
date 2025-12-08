'use client';

import { Github, Download, Users } from "lucide-react";
import { IDE_LIST } from "@/lib/ides";

interface SocialProofProps {
    spotsClaimed?: number;
    githubStars?: number;
    totalDownloads?: number;
}

export function SocialProof({
    spotsClaimed = 319,
    githubStars = 128,
    totalDownloads = 1240,
}: SocialProofProps) {
    return (
        <section className="py-20 px-6 border-y border-border bg-background">
            <div className="max-w-7xl mx-auto">
                {/* Stats */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{spotsClaimed}+</p>
                            <p className="text-sm text-muted-foreground">Developers</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-400/10 flex items-center justify-center">
                            <Github className="w-5 h-5 text-indigo-300" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{githubStars}+</p>
                            <p className="text-sm text-muted-foreground">GitHub Stars</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center">
                            <Download className="w-5 h-5 text-emerald-300" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">
                                {totalDownloads.toLocaleString()}+
                            </p>
                            <p className="text-sm text-muted-foreground">Downloads</p>
                        </div>
                    </div>
                </div>

                {/* Supported IDEs */}
                <p className="text-center text-muted-foreground text-sm mb-6">
                    Syncs seamlessly with your favorite AI IDEs
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    {IDE_LIST.map((ide) => (
                        <div
                            key={ide.name}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/40 transition-colors"
                        >
                            <span className="text-lg">{ide.icon}</span>
                            <span className="text-sm text-muted-foreground">{ide.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
