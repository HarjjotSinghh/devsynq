'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSequentialReveal } from "@/hooks/use-gsap-reveal";

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const lastScrollY = useRef(0);
    const headerRef = useSequentialReveal({ y: -12, duration: 0.45, itemDuration: 0.35, gap: 0.08 });

    useEffect(() => {
        const onScroll = () => {
            const current = window.scrollY;
            const delta = current - lastScrollY.current;
            const threshold = 12;

            setHasScrolled(current > 6);

            if (current < 80) {
                setIsHidden(false);
            } else if (delta > threshold) {
                setIsHidden(true);
            } else if (delta < -threshold) {
                setIsHidden(false);
            }

            lastScrollY.current = current;
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const headerClass =
        "fixed inset-x-0 top-4 z-50 flex justify-center px-4 transition-transform duration-300 " +
        (isHidden ? "-translate-y-[120%]" : "translate-y-0");

    const surfaceClass = hasScrolled
        ? "bg-background/70 border border-border/70 shadow-[0_20px_70px_-50px_rgba(0,0,0,0.7)] backdrop-blur-xl"
        : "bg-background/60 border border-border/50 shadow-[0_15px_60px_-50px_rgba(0,0,0,0.65)] backdrop-blur-lg";

    return (
        <header ref={headerRef} className={`${headerClass}`}>
            <nav
                data-animate
                data-animate-order="1"
                className={`w-full max-w-6xl h-16 px-6 flex items-center justify-between transition-colors duration-200 rounded-3xl ${surfaceClass}`}
            >
                {/* Logo */}
                <Link data-animate data-animate-order="2" href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-linear-to-br from-primary to-cyan-500 flex items-center justify-center shadow shadow-primary/10">
                        <span className="text-[#022c22] font-black text-sm">D</span>
                    </div>
                    <span className="font-black text-xl tracking-tight text-foreground">DevSynq</span>
                </Link>

                {/* Desktop Navigation */}
                <div data-animate data-animate-order="3" className="hidden md:flex items-center gap-8">
                    <Link
                        href="/#features"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Features
                    </Link>
                    <Link
                        href="/download"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Download
                    </Link>
                    <Link
                        href="/#faq"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        FAQ
                    </Link>
                    <Link
                        href="https://github.com/HarjjotSinghh/devsynq"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                        <Github className="w-4 h-4" />
                        Star on GitHub
                    </Link>
                    <Link href="/#waitlist">
                        <Button className="bg-linear-to-r from-primary to-cyan-500 hover:brightness-110 text-[#022c22] font-semibold px-4 py-2 rounded-2xl transition-all shadow-lg shadow-primary/10">
                            Join Waitlist
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    data-animate
                    data-animate-order="4"
                    className="md:hidden p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden px-4 pt-2">
                    <div className="w-full max-w-6xl mx-auto border border-border bg-background/95 backdrop-blur-lg rounded-2xl shadow-[0_18px_60px_-55px_rgba(0,0,0,0.75)] px-6 py-4 space-y-4">
                        <Link
                            href="/#features"
                            className="block text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Features
                        </Link>
                        <Link
                            href="/download"
                            className="block text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Download
                        </Link>
                        <Link
                            href="/#faq"
                            className="block text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            FAQ
                        </Link>
                        <Link
                            href="https://github.com/HarjjotSinghh/devsynq"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            Star on GitHub
                        </Link>
                        <Link href="/#waitlist" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full bg-linear-to-r from-primary to-cyan-500 text-[#022c22] font-semibold">
                                Join Waitlist
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
