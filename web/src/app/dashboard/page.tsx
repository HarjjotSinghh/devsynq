'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest, clearAuthToken } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { User, HardDrive, Laptop, LogOut, Loader2, Crown, Package } from 'lucide-react';

interface AccountData {
    account: {
        email: string;
        displayName: string;
        planType: string;
        lastSyncAt: string | null;
    };
    usage: {
        deviceCount: number;
        backupCount: number;
        storageUsed: number;
        storageLimit: number;
    };
}

export default function DashboardPage() {
    const [data, setData] = useState<AccountData | null>(null);
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const result = await apiRequest('/account');
            setData(result);
        } catch (err) {
            console.error('Failed to load account:', err);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        clearAuthToken();
        router.push('/login');
    };

    const handleUpgrade = async () => {
        setUpgrading(true);
        try {
            const result = await apiRequest('/checkout', { method: 'POST' });
            if (result.checkout_url) {
                window.location.href = result.checkout_url;
            }
        } catch (err) {
            console.error('Upgrade failed:', err);
            alert('Failed to start upgrade process. Please try again.');
            setUpgrading(false);
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!data) return null;

    const usedPercentage = Math.min(100, (data.usage.storageUsed / data.usage.storageLimit) * 100);
    const isPro = data.account.planType === 'pro';

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Logo size={24} />
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground hidden sm:block font-medium">
                            {data.account.email}
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-8 max-w-6xl">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground">Manage your DevSynq cloud sync preferences and subscription.</p>
                    </div>
                    {isPro ? (
                        <Badge variant="outline" className="text-sm py-1.5 px-4 bg-primary/10 text-primary border-primary/20 gap-2">
                            <Crown className="h-4 w-4" /> Pro Plan Active
                        </Badge>
                    ) : (
                        <Button
                            onClick={handleUpgrade}
                            disabled={upgrading}
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600 border-none shadow-lg shadow-orange-500/20"
                        >
                            {upgrading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Crown className="mr-2 h-4 w-4" />}
                            Upgrade to Pro
                        </Button>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Account Details */}
                    <Card className="bg-card/50 backdrop-blur border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-5 w-5 text-primary" />
                                Account
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-muted-foreground">Display Name</div>
                                <div className="text-lg font-medium">{data.account.displayName || 'N/A'}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-muted-foreground">Email</div>
                                <div className="text-lg font-medium truncate" title={data.account.email}>{data.account.email}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-muted-foreground">Current Plan</div>
                                <div className="text-lg font-medium capitalize flex items-center gap-2">
                                    {data.account.planType}
                                    {isPro && <Crown className="h-4 w-4 text-yellow-500" />}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Storage Usage */}
                    <Card className="bg-card/50 backdrop-blur border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <HardDrive className="h-5 w-5 text-primary" />
                                Cloud Storage
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>Used Space</span>
                                    <span>{formatBytes(data.usage.storageUsed)} / {formatBytes(data.usage.storageLimit)}</span>
                                </div>
                                <Progress value={usedPercentage} className={isPro ? "bg-primary/20 h-2" : "bg-muted h-2"} />
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground pt-2 border-t border-border/50">
                                <span className="flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    {data.usage.backupCount} backups stored
                                </span>
                            </div>
                            {!isPro && (
                                <div className="bg-primary/5 rounded-md p-3 text-xs text-muted-foreground border border-primary/10">
                                    Free plan is limited to 5MB.
                                    <button onClick={handleUpgrade} className="text-primary hover:underline ml-1 font-medium">Upgrade for 100MB.</button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Devices */}
                    <Card className="bg-card/50 backdrop-blur border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Laptop className="h-5 w-5 text-primary" />
                                Connected Devices
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col justify-between h-[180px]">
                            <div>
                                <div className="text-5xl font-bold tracking-tighter">{data.usage.deviceCount}</div>
                                <p className="text-muted-foreground mt-1 font-medium">Active devices connected</p>
                            </div>
                            <div className="text-sm text-muted-foreground bg-muted/20 p-2 rounded border border-border/50">
                                Last sync: <span className="font-mono">{data.account.lastSyncAt ? new Date(data.account.lastSyncAt).toLocaleString() : 'Never'}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
