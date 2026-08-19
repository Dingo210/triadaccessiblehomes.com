'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { FadeIn } from '@/components/ui/animate';
import { Lock, LogOut, Star, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { SafeDate } from '@/components/safe-format';

interface Business {
  id: string;
  name: string;
  category: string;
  featured: boolean;
  featuredUntil: string | null;
  stripeSubscriptionId: string | null;
}

export function AdminClient() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loadingBiz, setLoadingBiz] = useState(false);

  const fetchBusinesses = useCallback(async () => {
    setLoadingBiz(true);
    try {
      const res = await fetch('/api/admin/businesses');
      if (res?.ok) {
        const data = await res.json();
        setBusinesses(data ?? []);
      } else if (res?.status === 401) {
        setAuthenticated(false);
      }
    } catch (err: any) {
      console.error('Failed to fetch businesses:', err);
    } finally {
      setLoadingBiz(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchBusinesses();
    }
  }, [authenticated, fetchBusinesses]);

  // Check if already authenticated via cookie
  useEffect(() => {
    fetch('/api/admin/auth').then(async (res) => {
      if (res?.ok) {
        const data = await res.json().catch(() => ({}));
        if (data?.authenticated) setAuthenticated(true);
      }
    }).catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res?.ok) {
        setAuthenticated(true);
        setPassword('');
        toast.success('Logged in successfully');
      } else {
        toast.error('Invalid password');
      }
    } catch (err: any) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' }).catch(() => {});
    setAuthenticated(false);
    setBusinesses([]);
    toast.success('Logged out');
  };

  const toggleFeatured = async (businessId: string, featured: boolean) => {
    try {
      const res = await fetch('/api/admin/toggle-featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, featured }),
      });
      if (res?.ok) {
        toast.success(featured ? 'Business featured!' : 'Featured status removed');
        fetchBusinesses();
      } else {
        toast.error('Failed to update');
      }
    } catch (err: any) {
      toast.error('Failed to update');
    }
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <FadeIn>
          <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Shield className="h-6 w-6" />
              </div>
              <CardTitle className="font-display text-2xl">Admin Access</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Enter the admin password to continue.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e?.target?.value ?? '')}
                    className="pl-10"
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full" loading={loading}>
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </FadeIn>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8">
        <FadeIn>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage all business listings and featured status.</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </FadeIn>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-semibold">Business Name</th>
                    <th className="text-left p-4 font-semibold">Category</th>
                    <th className="text-center p-4 font-semibold">Featured</th>
                    <th className="text-left p-4 font-semibold">Featured Until</th>
                    <th className="text-center p-4 font-semibold">Toggle</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingBiz ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        Loading...
                      </td>
                    </tr>
                  ) : (businesses ?? []).map((biz: Business) => (
                    <tr key={biz?.id ?? ''} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium">{biz?.name ?? ''}</td>
                      <td className="p-4">
                        <Badge variant="secondary" className="text-xs">{biz?.category ?? ''}</Badge>
                      </td>
                      <td className="p-4 text-center">
                        {biz?.featured ? (
                          <Badge className="bg-amber-500 text-white border-0 gap-1">
                            <Star className="h-3 w-3 fill-current" /> Yes
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {biz?.featuredUntil ? (
                          <SafeDate date={biz.featuredUntil} />
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <Switch
                          checked={biz?.featured ?? false}
                          onCheckedChange={(checked: boolean) => toggleFeatured(biz?.id ?? '', checked)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
