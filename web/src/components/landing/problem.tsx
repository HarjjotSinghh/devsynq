'use client';

import { X } from "lucide-react";

const painPoints = [
    'Copy mcp.json to 4 different IDEs',
    'Update API keys 4 times',
    'Forget which IDE you used',
    'Manually track 12 MCP servers',
    'Reconfigure on every new installation',
    'Lose settings when switching machines',
];

export function Problem() {
    return (
        <section className="py-32 px-6 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Pain points */}
                    <div>
                        <p className="text-primary font-semibold text-sm mb-4 uppercase tracking-wider">
                            The Problem
                        </p>
                        <h2 className="text-4xl md:text-5xl font-black mb-6">
                            The AI IDE
                            <span className="block text-gradient">Configuration Hell</span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            You&apos;re using <span className="text-foreground">Cursor</span> for React.{" "}
                            <span className="text-foreground">Windsurf</span> for Python.{" "}
                            <span className="text-foreground">VS Code</span> for everything else.
                        </p>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            Each one needs your 12 MCP servers configured, API keys for
                            Anthropic, OpenAI, Gemini, project associations, and keyboard
                            shortcuts.
                        </p>
                        <p className="text-xl text-foreground font-semibold mb-4">
                            That&apos;s 4 × 12 ={' '}
                            <span className="text-destructive">48 manual configurations</span>.
                        </p>
                        <p className="text-muted-foreground">
                            And you do it{' '}
                            <span className="text-foreground">EVERY TIME</span> you try a new IDE.
                        </p>
                    </div>

                    {/* Right: Visual pain list */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-linear-to-br from-destructive/15 to-transparent rounded-2xl" />
                        <div className="relative bg-card border border-border rounded-2xl p-8 shadow-lg shadow-destructive/10">
                            <p className="text-muted-foreground text-sm font-medium mb-6 uppercase tracking-wider">
                                Before DevSynq:
                            </p>
                            <div className="space-y-4">
                                {painPoints.map((point, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary border border-destructive/20"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
                                            <X className="w-3 h-3 text-destructive" />
                                        </div>
                                        <span className="text-foreground">{point}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-border">
                                <p className="text-center text-muted-foreground italic">
                                    &quot;We felt that pain. So we built DevSynq.&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
