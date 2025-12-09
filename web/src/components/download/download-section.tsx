'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, Github } from 'lucide-react';
import { WindowsIcon, AppleIcon, LinuxIcon } from '@/components/icons';
import { useSequentialReveal } from '@/hooks/use-gsap-reveal';

interface Release {
    version: string;
    date: string;
    windows: {
        exe: string;
        zip: string;
        sha256: string;
        size: string;
    };
    macos: {
        dmg: string;
        zip: string;
        sha256: string;
        size: string;
    };
    linux: {
        appimage: string;
        sha256: string;
        size: string;
    } | null;
}

const currentRelease: Release = {
    version: '1.0.0',
    date: 'December 8, 2025',
    windows: {
        exe: 'https://github.com/HarjjotSinghh/devsynq/releases/download/v1.0.0/DevSynq-Setup-1.0.0.exe',
        zip: 'https://github.com/HarjjotSinghh/devsynq/releases/download/v1.0.0/DevSynq-1.0.0-win.zip',
        sha256: 'Coming soon',
        size: '~95 MB',
    },
    macos: {
        dmg: 'https://github.com/HarjjotSinghh/devsynq/releases/download/v1.0.0/DevSynq-1.0.0.dmg',
        zip: 'https://github.com/HarjjotSinghh/devsynq/releases/download/v1.0.0/DevSynq-1.0.0-mac.zip',
        sha256: 'Coming soon',
        size: '~87 MB',
    },
    linux: null, // Coming soon
};

const previousReleases = [
    { version: '0.9.0', date: 'December 1, 2025', label: 'Beta' },
    { version: '0.8.0', date: 'November 25, 2025', label: 'Alpha' },
];

type OS = 'windows' | 'macos' | 'linux' | 'unknown';

function detectOS(): OS {
    if (typeof window === 'undefined') return 'unknown';
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('win')) return 'windows';
    if (ua.includes('mac')) return 'macos';
    if (ua.includes('linux')) return 'linux';
    return 'unknown';
}

export function DownloadSection() {
    const [detectedOS, setDetectedOS] = useState<OS>('unknown');
    const sectionRef = useSequentialReveal({ y: 24, itemDuration: 0.5, gap: 0.08 });

    useEffect(() => {
        setTimeout(() => {
            setDetectedOS(detectOS());
        }, 100);
    }, []);

    return (
        <section className="py-36 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div data-animate data-animate-order="1" className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black mb-4">
                        Download <span className="text-gradient">DevSynq</span>
                    </h1>
                    <p className="text-xl text-[#888]">
                        v{currentRelease.version} • Released {currentRelease.date}
                    </p>
                </div>

                {/* Download Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {/* Windows */}
                    <div
                        data-animate
                        data-animate-order="2"
                        className={`relative bg-card border rounded-2xl p-8 transition-all ${detectedOS === 'windows'
                            ? 'border-primary/50 ring-2 ring-primary/20'
                            : 'border-white/10 hover:border-white/20'
                            }`}
                    >
                        {detectedOS === 'windows' && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                                Recommended for you
                            </div>
                        )}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                                <WindowsIcon className="w-7 h-7 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Windows</h3>
                                <p className="text-sm text-[#888]">Windows 10 or later</p>
                            </div>
                        </div>
                        <div className="space-y-3 mb-6">
                            <a href={currentRelease.windows.exe}>
                                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 border-none">
                                    <Download className="w-5 h-5 mr-2" />
                                    Download .exe
                                </Button>
                            </a>
                            <a href={currentRelease.windows.zip}>
                                <Button
                                    variant="outline"
                                    className="w-full border-white/10 hover:bg-white/5 h-12"
                                >
                                    Download .zip (portable)
                                </Button>
                            </a>
                        </div>
                        <div className="text-sm text-[#888] space-y-1">
                            <p>Size: {currentRelease.windows.size}</p>
                            <p className="font-mono text-xs truncate">
                                SHA256: {currentRelease.windows.sha256}
                            </p>
                        </div>
                    </div>

                    {/* macOS */}
                    <div
                        data-animate
                        data-animate-order="3"
                        className={`relative bg-card border rounded-2xl p-8 transition-all ${detectedOS === 'macos'
                            ? 'border-primary/50 ring-2 ring-primary/20'
                            : 'border-white/10 hover:border-white/20'
                            }`}
                    >
                        {detectedOS === 'macos' && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                                Recommended for you
                            </div>
                        )}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
                                <AppleIcon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">macOS</h3>
                                <p className="text-sm text-[#888]">Intel & Apple Silicon</p>
                            </div>
                        </div>
                        <div className="space-y-3 mb-6">
                            <a href={currentRelease.macos.dmg}>
                                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 border-none">
                                    <Download className="w-5 h-5 mr-2" />
                                    Download .dmg
                                </Button>
                            </a>
                            <a href={currentRelease.macos.zip}>
                                <Button
                                    variant="outline"
                                    className="w-full border-white/10 hover:bg-white/5 h-12"
                                >
                                    Download .zip
                                </Button>
                            </a>
                        </div>
                        <div className="text-sm text-[#888] space-y-1">
                            <p>Size: {currentRelease.macos.size}</p>
                            <p className="font-mono text-xs truncate">
                                SHA256: {currentRelease.macos.sha256}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Linux Coming Soon */}
                <div data-animate data-animate-order="4" className="bg-card border border-white/10 rounded-2xl p-8 text-center mb-16">
                    <div className="w-14 h-14 mx-auto rounded-xl bg-secondary flex items-center justify-center mb-4">
                        <LinuxIcon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Linux</h3>
                    <p className="text-[#888] mb-4">
                        Coming soon! Star us on GitHub to get notified.
                    </p>
                    <a
                        href="https://github.com/HarjjotSinghh/devsynq"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            variant="outline"
                            className="border-white/10 hover:bg-white/5"
                        >
                            <Github className="w-4 h-4 mr-2" />
                            Star on GitHub
                        </Button>
                    </a>
                </div>

                {/* Previous Versions */}
                <div data-animate data-animate-order="5">
                    <h3 className="text-xl font-bold mb-6">Previous Versions</h3>
                    <div className="space-y-3">
                        {previousReleases.map((release) => (
                            <a
                                key={release.version}
                                href={`https://github.com/HarjjotSinghh/devsynq/releases/tag/v${release.version}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-card border border-white/10 rounded-xl hover:border-white/20 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="font-mono font-semibold">
                                        v{release.version}
                                    </span>
                                    <span className="text-sm text-[#888]">{release.date}</span>
                                    <span className="px-2 py-0.5 bg-[#888]/20 text-[#888] text-xs rounded">
                                        {release.label}
                                    </span>
                                </div>
                                <ExternalLink className="w-4 h-4 text-[#888]" />
                            </a>
                        ))}
                    </div>
                    <div className="mt-6 text-center">
                        <a
                            href="https://github.com/HarjjotSinghh/devsynq/releases"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm"
                        >
                            View all releases on GitHub →
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
