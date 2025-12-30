import React from 'react';
import { Header, Footer } from '@/components/landing';
import MCPMarketplace from '@/components/marketplace/MCPMarketplace';
import { Toaster } from 'sonner';

export default function MarketplacePage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="pt-24 min-h-screen">
                <React.Suspense fallback={<div className="flex h-[50vh] items-center justify-center">Loading marketplace...</div>}>
                    <MCPMarketplace />
                </React.Suspense>
            </div>
            <Footer />
            <Toaster theme="dark" position="bottom-right" />
        </main>
    );
}
