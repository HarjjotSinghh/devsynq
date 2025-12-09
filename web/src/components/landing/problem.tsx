'use client';

import { AlertTriangle, X } from "lucide-react";
import { useSequentialReveal } from "@/hooks/use-gsap-reveal";

const painPoints = [
    "Copy mcp.json to 4 different IDEs",
    "Update API keys 4 times",
    "Forget which IDE you used",
    "Manually track 12 MCP servers",
    "Reconfigure on every new installation",
    "Lose settings when switching machines",
];

export function Problem() {
    const sectionRef = useSequentialReveal({ y: 24, itemDuration: 0.45, gap: 0.08 });
    return (
        <section
            ref={sectionRef}
            className="relative isolate -mt-px py-28 px-6 bg-background"
            id="problem"
        >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(127,29,29,0.15),transparent_42%),radial-gradient(circle_at_85%_5%,rgba(127,29,29,0.12),transparent_38%)]" />
            <div className="absolute inset-x-12 top-14 h-24 rounded-[32px] border border-white/5 bg-white/5 blur-3xl" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 scale-y-[-1]"
            >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(93,233,182,0.05),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(93,233,182,0.05),transparent_38%)]" />
                <div className="absolute inset-x-12 top-16 h-24 rounded-[32px] border border-white/5 bg-white/5 blur-3xl" />
            </div>

            <div className="relative max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Pain points */}
                    <div className="space-y-6">
                        <div data-animate data-animate-order="1" className="inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-sm text-destructive-foreground">
                            <AlertTriangle className="h-4 w-4" />
                            The problem
                        </div>
                        <h2 data-animate data-animate-order="2" className="text-4xl md:text-5xl font-black leading-tight">
                            The AI IDE
                            <span className="block text-gradient-destructive">configuration hell</span>
                        </h2>
                        <p data-animate data-animate-order="3" className="text-lg text-muted-foreground leading-relaxed">
                            You&apos;re using <span className="text-foreground">Cursor</span> for React.{" "}
                            <span className="text-foreground">Windsurf</span> for Python.{" "}
                            <span className="text-foreground">VS Code</span> for everything else.
                        </p>
                        <p data-animate data-animate-order="4" className="text-lg text-muted-foreground leading-relaxed">
                            Each one needs your 12 MCP servers configured, API keys for Anthropic, OpenAI, Gemini,
                            project associations, and keyboard shortcuts.
                        </p>
                        <div data-animate data-animate-order="5" className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive-foreground shadow-[0_18px_60px_-40px_rgba(248,113,113,0.55)]">
                            <p className="text-xl font-semibold">
                                That&apos;s 4 × 12 = <span className="text-destructive">48 manual configurations</span>.
                            </p>
                            <p className="text-sm text-destructive-foreground/80">Before you even write a line of code.</p>
                        </div>
                        <p data-animate data-animate-order="6" className="text-muted-foreground">
                            And you do it <span className="text-foreground font-semibold">EVERY TIME</span> you try a new IDE.
                        </p>
                    </div>

                    {/* Right: Visual pain list */}
                    <div data-animate data-animate-order="7" className="relative">
                        <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-destructive/15 to-transparent blur-3xl" />
                        <div className="relative bg-card/80 border border-border rounded-3xl p-8 shadow-[0_22px_90px_-55px_rgba(0,0,0,0.9)] backdrop-blur">
                            <p className="text-muted-foreground text-sm font-medium mb-6 uppercase tracking-wider">
                                Before DevSynq
                            </p>
                            <div className="space-y-4">
                                {painPoints.map((point, index) => (
                                    <div
                                        key={index}
                                        data-animate
                                        data-animate-order={`${8 + index}`}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-secondary border border-destructive/25"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
                                            <X className="w-3 h-3 text-destructive" />
                                        </div>
                                        <span className="text-foreground">{point}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-border/70">
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
