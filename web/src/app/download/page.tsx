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
        <main className="min-h-screen">
            <Header />
            <DownloadSection />
            <Footer />
        </main>
    );
}
