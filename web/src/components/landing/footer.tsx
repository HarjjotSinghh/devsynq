'use client';

import Link from "next/link";
import { Github, Twitter, Heart } from "lucide-react";
import { Logo } from "@/components/logo";
import { useSequentialReveal } from "@/hooks/use-gsap-reveal";

const productLinks = [
    { label: 'Download', href: '/download' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'Roadmap', href: 'https://github.com/HarjjotSinghh/devsynq/projects' },
];

const resourceLinks = [
    { label: 'Documentation', href: 'https://github.com/HarjjotSinghh/devsynq#readme' },
    { label: 'GitHub', href: 'https://github.com/HarjjotSinghh/devsynq' },
    { label: 'Discussions', href: 'https://github.com/HarjjotSinghh/devsynq/discussions' },
    { label: 'Issues', href: 'https://github.com/HarjjotSinghh/devsynq/issues' },
];

const companyLinks = [
    { label: 'About', href: '#' },
    { label: 'Twitter', href: 'https://twitter.com/harjjotsinghh' },
    { label: 'Contact', href: 'mailto:hello@devsynq.app' },
];

export function Footer() {
    const footerRef = useSequentialReveal({ y: 18, itemDuration: 0.45, gap: 0.08 });
    return (
        <footer ref={footerRef} className="relative isolate -mt-px py-16 px-6 border-t border-border bg-background overflow-y-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(93,233,182,0.05),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(93,233,182,0.05),transparent_40%)]" />
            <div className="absolute inset-x-12 top-10 h-16 rounded-[32px] border border-white/5 bg-white/5 blur-3xl" />

            <div className="relative max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Logo & Description */}
                    <div data-animate data-animate-order="1" className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Logo size={32} priority textClassName="text-xl" />
                        </Link>
                        <p className="text-sm text-muted-foreground mb-4">
                            The control center for all your AI-powered development
                            environments.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://github.com/HarjjotSinghh/devsynq"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com/harjjotsinghh"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div data-animate data-animate-order="2">
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-3">
                            {productLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div data-animate data-animate-order="3">
                        <h4 className="font-semibold mb-4">Resources</h4>
                        <ul className="space-y-3">
                            {resourceLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div data-animate data-animate-order="4">
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-3">
                            {companyLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 pb-36">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} DevSynq. Open source under MIT License.
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        Made with <Heart className="w-4 h-4 text-primary" /> for AI
                        developers by{' '}
                        <Link href="https://github.com/HarjjotSinghh" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                            this guy
                        </Link>
                    </p>
                </div>
            </div>

            {/* Big wordmark */}
            <div className="pointer-events-none absolute inset-x-0 -bottom-52 flex justify-center">
                <span className="text-[21dvw] font-black tracking-tight text-white/4">
                    DEVSYNQ
                </span>
            </div>
        </footer>
    );
}
