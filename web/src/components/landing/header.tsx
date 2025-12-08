'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-border bg-background/80">
            <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-cyan-500 flex items-center justify-center shadow shadow-primary/20">
                        <span className="text-[#022c22] font-black text-sm">D</span>
                    </div>
                    <span className="font-black text-xl tracking-tight text-foreground">DevSynq</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <a
                        href="#features"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Features
                    </a>
                    <Link
                        href="/download"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Download
                    </Link>
                    <a
                        href="#faq"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        FAQ
                    </a>
                    <a
                        href="https://github.com/HarjjotSinghh/devsynq"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                        <Github className="w-4 h-4" />
                        Star on GitHub
                    </a>
                    <a href="#waitlist">
                        <Button className="bg-linear-to-r from-primary to-cyan-500 hover:brightness-110 text-[#022c22] font-semibold px-4 py-2 rounded-lg transition-all shadow-lg shadow-primary/20">
                            Join Waitlist
                        </Button>
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
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
                <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg">
                    <div className="px-6 py-4 space-y-4">
                        <a
                            href="#features"
                            className="block text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Features
                        </a>
                        <Link
                            href="/download"
                            className="block text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Download
                        </Link>
                        <a
                            href="#faq"
                            className="block text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            FAQ
                        </a>
                        <a
                            href="https://github.com/HarjjotSinghh/devsynq"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            Star on GitHub
                        </a>
                        <a href="#waitlist" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full bg-linear-to-r from-primary to-cyan-500 text-[#022c22] font-semibold">
                                Join Waitlist
                            </Button>
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
