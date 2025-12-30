import type { Metadata } from 'next';
import { Header, Footer } from '@/components/landing';
import { DownloadSection } from '@/components/download/download-section';

export const metadata: Metadata = {
    title: 'Download DevSynq - Windows, macOS, Linux',
    description:
        'Download DevSynq for your operating system. Available for Windows, macOS, and Linux.',
};

export default function DownloadPage() {
    return (
        <main className="relative isolate min-h-screen overflow-hidden bg-linear-to-b from-[#030a08]/10 via-[#040c09]/20 to-[#010605]/20">
            {/* <div className="absolute inset-x-0 -bottom-12 h-20 bg-linear-to-t from-[#010605] via-[#040c09]/45 to-transparent pointer-events-none" /> */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(90,230,187,0.08),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(34,197,235,0.08),transparent_40%)]" />
            <div className="absolute inset-x-16 top-12 h-24 rounded-[32px] border border-white/5 bg-white/5 blur-3xl" />

            <div className="relative z-10">
                <Header />
                <DownloadSection />
                <Footer />
            </div>
        </main>
    );
}
