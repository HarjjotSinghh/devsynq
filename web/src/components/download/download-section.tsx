'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, Github, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { FaWindows, FaApple, FaLinux } from 'react-icons/fa6';
import { useSequentialReveal } from '@/hooks/use-gsap-reveal';

interface AssetInfo {
    url: string;
    name: string;
    size: number;
}

interface PlatformAssets {
    exe?: AssetInfo;
    zip?: AssetInfo;
    dmg?: AssetInfo;
    appimage?: AssetInfo;
}

interface ParsedRelease {
    version: string;
    tagName: string;
    name: string;
    date: string;
    publishedAt: string;
    isPrerelease: boolean;
    releaseUrl: string;
    windows: PlatformAssets;
    macos: PlatformAssets;
    linux: PlatformAssets;
    totalDownloads: number;
    body: string;
}

interface ReleasesResponse {
    latest: ParsedRelease | null;
    previous: ParsedRelease[];
    hasReleases: boolean;
    error?: string;
}

type OS = 'windows' | 'macos' | 'linux' | 'unknown';

function detectOS(): OS {
    if (typeof window === 'undefined') return 'unknown';
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('win')) return 'windows';
    if (ua.includes('mac')) return 'macos';
    if (ua.includes('linux')) return 'linux';
    return 'unknown';
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function DownloadSection() {
    const [detectedOS, setDetectedOS] = useState<OS>('unknown');
    const [releases, setReleases] = useState<ReleasesResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const sectionRef = useSequentialReveal({ y: 24, itemDuration: 0.5, gap: 0.08 });

    const fetchReleases = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/releases');
            if (!response.ok) {
                throw new Error('Failed to fetch releases');
            }
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setReleases(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setDetectedOS(detectOS());
        }, 100);
        fetchReleases();
    }, []);

    const latest = releases?.latest;
    const hasWindows = latest?.windows.exe || latest?.windows.zip;
    const hasMacos = latest?.macos.dmg || latest?.macos.zip;
    const hasLinux = latest?.linux.appimage;

    return (
        <section className="py-36 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div data-animate data-animate-order="1" className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black mb-4">
                        Download <span className="text-gradient">DevSynq</span>
                    </h1>
                    {loading ? (
                        <div className="flex items-center justify-center gap-2 text-[#888]">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading release info...
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center gap-2 text-red-400">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={fetchReleases}
                                className="ml-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : latest ? (
                                <p className="text-xl text-[#888]">
                                    v{latest.version}
                                    {latest.isPrerelease && (
                                        <span className="ml-2 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-sm rounded">
                                            Pre-release
                                        </span>
                                    )}{' '}
                                    • Released {latest.date}
                                    {latest.totalDownloads > 0 && (
                                        <span className="ml-2 text-sm">
                                            ({latest.totalDownloads.toLocaleString()} downloads)
                                        </span>
                                    )}
                                </p>
                    ) : (
                        <p className="text-xl text-[#888]">
                            No releases available yet. Check back soon!
                        </p>
                    )}
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
                                <FaWindows className="w-7 h-7 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Windows</h3>
                                <p className="text-sm text-[#888]">Windows 10 or later</p>
                            </div>
                        </div>
                        <div className="space-y-3 mb-6">
                            {hasWindows ? (
                                <>
                                    {latest?.windows.exe && (
                                        <a href={latest.windows.exe.url} download>
                                            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 border-none">
                                                <Download className="w-5 h-5 mr-2" />
                                                Download .exe
                                                <span className="ml-auto text-xs opacity-75">
                                                    {formatBytes(latest.windows.exe.size)}
                                                </span>
                                            </Button>
                                        </a>
                                    )}
                                    {latest?.windows.zip && (
                                        <a href={latest.windows.zip.url} download>
                                            <Button
                                                variant="outline"
                                                className="w-full border-white/10 hover:bg-white/5 h-12"
                                            >
                                                Download .zip (portable)
                                                <span className="ml-auto text-xs opacity-75">
                                                    {formatBytes(latest.windows.zip.size)}
                                                </span>
                                            </Button>
                                        </a>
                                    )}
                                </>
                            ) : (
                                <Button
                                    disabled
                                    className="w-full h-12 opacity-50"
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    Coming Soon
                                </Button>
                            )}
                        </div>
                        {hasWindows && latest?.windows.exe && (
                            <div className="text-sm text-[#888] space-y-1">
                                <p>File: {latest.windows.exe.name}</p>
                            </div>
                        )}
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
                                <FaApple className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">macOS</h3>
                                <p className="text-sm text-[#888]">Intel & Apple Silicon</p>
                            </div>
                        </div>
                        <div className="space-y-3 mb-6">
                            {hasMacos ? (
                                <>
                                    {latest?.macos.dmg && (
                                        <a href={latest.macos.dmg.url} download>
                                            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 border-none">
                                                <Download className="w-5 h-5 mr-2" />
                                                Download .dmg
                                                <span className="ml-auto text-xs opacity-75">
                                                    {formatBytes(latest.macos.dmg.size)}
                                                </span>
                                            </Button>
                                        </a>
                                    )}
                                    {latest?.macos.zip && (
                                        <a href={latest.macos.zip.url} download>
                                            <Button
                                                variant="outline"
                                                className="w-full border-white/10 hover:bg-white/5 h-12"
                                            >
                                                Download .zip
                                                <span className="ml-auto text-xs opacity-75">
                                                    {formatBytes(latest.macos.zip.size)}
                                                </span>
                                            </Button>
                                        </a>
                                    )}
                                </>
                            ) : (
                                <Button
                                    disabled
                                    className="w-full h-12 opacity-50"
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    Coming Soon
                                </Button>
                            )}
                        </div>
                        {hasMacos && latest?.macos.dmg && (
                            <div className="text-sm text-[#888] space-y-1">
                                <p>File: {latest.macos.dmg.name}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Linux */}
                <div
                    data-animate
                    data-animate-order="4"
                    className={`bg-card border rounded-2xl p-8 mb-16 ${hasLinux
                        ? detectedOS === 'linux'
                            ? 'border-primary/50 ring-2 ring-primary/20'
                            : 'border-white/10 hover:border-white/20'
                        : 'border-white/10'
                        } ${hasLinux ? '' : 'text-center'}`}
                >
                    {detectedOS === 'linux' && hasLinux && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                            Recommended for you
                        </div>
                    )}
                    {hasLinux ? (
                        <>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
                                    <FaLinux className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">Linux</h3>
                                    <p className="text-sm text-[#888]">AppImage (Universal)</p>
                                </div>
                            </div>
                            <div className="space-y-3 mb-6">
                                <a href={latest?.linux.appimage?.url} download>
                                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 border-none">
                                        <Download className="w-5 h-5 mr-2" />
                                        Download .AppImage
                                        <span className="ml-auto text-xs opacity-75">
                                            {latest?.linux.appimage && formatBytes(latest.linux.appimage.size)}
                                        </span>
                                    </Button>
                                </a>
                            </div>
                            {latest?.linux.appimage && (
                                <div className="text-sm text-[#888] space-y-1">
                                    <p>File: {latest.linux.appimage.name}</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="w-14 h-14 mx-auto rounded-xl bg-secondary flex items-center justify-center mb-4">
                                    <FaLinux className="w-7 h-7" />
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
                        </>
                    )}
                </div>

                {/* Previous Versions */}
                {releases?.previous && releases.previous.length > 0 && (
                    <div data-animate data-animate-order="5">
                        <h3 className="text-xl font-bold mb-6">Previous Versions</h3>
                        <div className="space-y-3">
                            {releases.previous.map((release) => (
                                <a
                                    key={release.tagName}
                                    href={release.releaseUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 bg-card border border-white/10 rounded-xl hover:border-white/20 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono font-semibold">
                                            v{release.version}
                                        </span>
                                        <span className="text-sm text-[#888]">{release.date}</span>
                                        {release.isPrerelease && (
                                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded">
                                                Pre-release
                                            </span>
                                        )}
                                        {release.totalDownloads > 0 && (
                                            <span className="text-xs text-[#888]">
                                                {release.totalDownloads.toLocaleString()} downloads
                                            </span>
                                        )}
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
                )}

                {/* No Releases Yet */}
                {!loading && releases?.hasReleases === false && (
                    <div data-animate data-animate-order="5" className="text-center py-12">
                        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Github className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Releases Yet</h3>
                        <p className="text-[#888] mb-6 max-w-md mx-auto">
                            DevSynq is still in development. Star our repository to get notified when we publish the first release!
                        </p>
                        <a
                            href="https://github.com/HarjjotSinghh/devsynq"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                                <Github className="w-4 h-4 mr-2" />
                                Star on GitHub
                            </Button>
                        </a>
                    </div>
                )}

                {/* View All Releases Link */}
                {!loading && releases?.hasReleases && !releases?.previous?.length && (
                    <div data-animate data-animate-order="5" className="mt-8 text-center">
                        <a
                            href="https://github.com/HarjjotSinghh/devsynq/releases"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm"
                        >
                            View all releases on GitHub →
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}
