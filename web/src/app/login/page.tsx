'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [key, setKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!key.trim()) {
            setError('Please enter your access key');
            return;
        }

        try {
            // Manually set token for the request
            localStorage.setItem('cloud_sync_key', key);

            await apiRequest('/account');

            // If successful, redirect
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Invalid access key');
            localStorage.removeItem('cloud_sync_key');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500 blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500 blur-[100px]" />
            </div>

            <Card className="w-full max-w-md border-border bg-card/50 backdrop-blur-xl relative z-10 shadow-2xl">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Logo size={32} withText={false} />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
                    <CardDescription className="text-center">
                        Enter your Access Key to manage your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="key" className="text-sm font-medium">Access Key</label>
                            <Input
                                id="key"
                                type="password"
                                placeholder="ds_..."
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                className="font-mono bg-background/50"
                            />
                        </div>
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-sm text-red-500 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                {error}
                            </div>
                        )}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                        <div className="text-xs text-muted-foreground text-center pt-2">
                            <p>Don't have an access key?</p>
                            <a href="/#download" className="text-primary hover:underline">Download DevSynq</a>
                            {' '}to create an account.
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
