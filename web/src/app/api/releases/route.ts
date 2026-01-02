import { NextResponse } from 'next/server';

const GITHUB_OWNER = 'HarjjotSinghh';
const GITHUB_REPO = 'devsynq';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases`;

export interface GitHubAsset {
    name: string;
    browser_download_url: string;
    size: number;
    download_count: number;
    content_type: string;
}

export interface GitHubRelease {
    id: number;
    tag_name: string;
    name: string;
    body: string;
    draft: boolean;
    prerelease: boolean;
    published_at: string;
    assets: GitHubAsset[];
    html_url: string;
}

export interface PlatformAssets {
    exe?: { url: string; name: string; size: number };
    zip?: { url: string; name: string; size: number };
    dmg?: { url: string; name: string; size: number };
    appimage?: { url: string; name: string; size: number };
}

export interface ParsedRelease {
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

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function parseRelease(release: GitHubRelease): ParsedRelease {
    const assets = release.assets;

    const windows: PlatformAssets = {};
    const macos: PlatformAssets = {};
    const linux: PlatformAssets = {};

    let totalDownloads = 0;

    for (const asset of assets) {
        const name = asset.name.toLowerCase();
        totalDownloads += asset.download_count;

        const assetInfo = {
            url: asset.browser_download_url,
            name: asset.name,
            size: asset.size,
        };

        // Windows assets
        if (name.endsWith('.exe')) {
            windows.exe = assetInfo;
        } else if (name.includes('win') && name.endsWith('.zip')) {
            windows.zip = assetInfo;
        }
        // macOS assets
        else if (name.endsWith('.dmg')) {
            macos.dmg = assetInfo;
        } else if ((name.includes('mac') || name.includes('darwin')) && name.endsWith('.zip')) {
            macos.zip = assetInfo;
        }
        // Linux assets
        else if (name.endsWith('.appimage')) {
            linux.appimage = assetInfo;
        }
    }

    return {
        version: release.tag_name.replace(/^v/, ''),
        tagName: release.tag_name,
        name: release.name || release.tag_name,
        date: formatDate(release.published_at),
        publishedAt: release.published_at,
        isPrerelease: release.prerelease,
        releaseUrl: release.html_url,
        windows,
        macos,
        linux,
        totalDownloads,
        body: release.body || '',
    };
}

export async function GET() {
    try {
        const headers: HeadersInit = {
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'DevSynq-Website',
        };

        // Use GitHub token if available to increase rate limit
        if (process.env.GITHUB_TOKEN) {
            headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
        }

        const response = await fetch(GITHUB_API_URL, {
            headers,
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!response.ok) {
            if (response.status === 404) {
                // No releases yet
                return NextResponse.json({
                    latest: null,
                    previous: [],
                    hasReleases: false,
                });
            }
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const releases: GitHubRelease[] = await response.json();

        // Filter out drafts
        const publishedReleases = releases.filter((r) => !r.draft);

        if (publishedReleases.length === 0) {
            return NextResponse.json({
                latest: null,
                previous: [],
                hasReleases: false,
            });
        }

        // Parse all releases
        const parsedReleases = publishedReleases.map(parseRelease);

        // Find latest stable release (non-prerelease)
        const latestStable = parsedReleases.find((r) => !r.isPrerelease);
        const latest = latestStable || parsedReleases[0];

        // Get previous releases (excluding the latest)
        const previous = parsedReleases
            .filter((r) => r.tagName !== latest.tagName)
            .slice(0, 5); // Limit to 5 previous releases

        return NextResponse.json({
            latest,
            previous,
            hasReleases: true,
            formatBytes, // Expose utility function
        });
    } catch (error) {
        console.error('Error fetching GitHub releases:', error);
        return NextResponse.json(
            { error: 'Failed to fetch releases' },
            { status: 500 }
        );
    }
}
