import Link from "next/link";
import { Github, Twitter, Heart } from "lucide-react";

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
    { label: 'Contact', href: 'mailto:hello@devsynq.com' },
];

export function Footer() {
    return (
        <footer className="py-16 px-6 border-t border-border bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Logo & Description */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-cyan-500 flex items-center justify-center shadow shadow-primary/20">
                                <span className="text-[#022c22] font-black text-sm">D</span>
                            </div>
                            <span className="font-black text-xl tracking-tight text-foreground">DevSynq</span>
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
                    <div>
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
                    <div>
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
                    <div>
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
                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} DevSynq. Open source under MIT License.
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        Made with <Heart className="w-4 h-4 text-destructive" /> for AI
                        developers
                    </p>
                </div>
            </div>
        </footer>
    );
}
