'use client';

import { Check, Clock, Sparkles } from "lucide-react";
import { IDE_LIST } from "@/lib/ides";
import { IdeIcon } from "@/components/icons";
import { useSequentialReveal } from "@/hooks/use-gsap-reveal";

export function SupportedIDEs() {
    const ides = IDE_LIST;
    const availableCount = ides.filter((ide) => (ide.status ?? "available") === "available").length;
    const comingSoonCount = ides.length - availableCount;
    const sectionRef = useSequentialReveal({ y: 24, itemDuration: 0.45, gap: 0.06 });

    return (
        <section ref={sectionRef} className="relative isolate -mt-px py-28 px-6 bg-background">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(93,233,182,0.05),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(93,233,182,0.05),transparent_38%)]" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 scale-y-[-1]"
            >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(93,233,182,0.05),transparent_40%),radial-gradient(circle_at_30%_20%,rgba(93,233,182,0.05),transparent_35%),radial-gradient(circle_at_70%_10%,rgba(93,233,182,0.05),transparent_30%)]" />
            </div>

            <div className="relative max-w-6xl mx-auto">
                <div className="text-center space-y-5">
                    <div data-animate data-animate-order="1" className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">
                        <Sparkles className="h-4 w-4" />
                        Real IDE coverage
                    </div>
                    <h2 data-animate data-animate-order="2" className="text-4xl md:text-5xl font-black leading-tight">
                        Works with your{" "}
                        <span className="text-gradient">favorite AI IDEs</span>
                    </h2>
                    <p data-animate data-animate-order="3" className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Native logos, availability, and quick links to download. DevSynq keeps you in sync across every IDE you use.
                    </p>
                    <div data-animate data-animate-order="4" className="flex flex-wrap justify-center gap-3 text-sm">
                        <div className="flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-primary">
                            <Check className="h-4 w-4" />
                            {availableCount} available now
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-muted-foreground/25 bg-muted/10 px-3 py-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {comingSoonCount} coming soon
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-foreground/80">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Fresh logos pulled from the app
                        </div>
                    </div>
                </div>

                <div className="mt-14 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ides.map((ide, index) => {
                        const status = ide.status ?? "available";
                        const isAvailable = status === "available";
                        return (
                            <div
                                key={ide.name}
                                data-animate
                                data-animate-order={index + 2}
                                className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_80px_-40px_rgba(0,0,0,0.7)]"
                                style={{
                                    borderColor: `rgba(255,255,255,0.1)`,
                                    // boxShadow: `0 18px 55px -40px ${ide.color}80`,
                                }}
                            >
                                <div
                                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                    style={{
                                        background: `radial-gradient(circle at 20% 15%, rgba(255,255,255,0.05), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.05), transparent 45%)`,
                                    }}
                                />
                                <div className="relative flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-secondary/70"
                                            style={{
                                                // boxShadow: `0 10px 30px -18px ${ide.color}a0`,
                                            }}
                                        >
                                            <IdeIcon ide={ide.name} size={26} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">{ide.name}</p>
                                            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                                                AI-ready workspace
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-medium border ${isAvailable
                                            ? "border-primary/30 bg-primary/15 text-primary"
                                            : "border-muted-foreground/30 bg-muted/15 text-muted-foreground"
                                            }`}
                                    >
                                        {isAvailable ? "Available" : "Coming soon"}
                                    </span>
                                </div>

                                <div className="relative mt-4 flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="h-2.5 w-2.5 rounded-full"
                                            style={{ backgroundColor: isAvailable ? "currentColor" : "#525252" }}
                                        />
                                        <span className="uppercase tracking-wide text-[11px]">
                                            {isAvailable ? "Live" : "On the roadmap"}
                                        </span>
                                    </div>
                                    {ide.downloadUrl ? (
                                        <a
                                            href={ide.downloadUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center gap-1 font-medium ${isAvailable
                                                ? "text-primary hover:underline"
                                                : "text-muted-foreground pointer-events-none opacity-60"
                                                }`}
                                        >
                                            {isAvailable ? "Download" : "Notify me"}
                                        </a>
                                    ) : (
                                        <span className="text-muted-foreground">No link yet</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div data-animate data-animate-order={ides.length + 3} className="mt-12 text-center">
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
