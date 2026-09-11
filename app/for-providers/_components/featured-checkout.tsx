'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

interface ListingOption {
  id: string;
  name: string;
  featured: boolean;
}

export function FeaturedCheckout({ listings }: { listings: ListingOption[] }) {
  const [businessId, setBusinessId] = useState('');
  const [loading, setLoading] = useState(false);
  const selected = listings.find((l) => l.id === businessId);

  const handleCheckout = async () => {
    if (!businessId) {
      toast.error('Choose your listing first.');
      return;
    }
    if (selected?.featured) {
      toast.error('That listing is already featured.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error(data?.error ?? 'Failed to create checkout session');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card id="get-featured" className="border-primary/20 scroll-mt-24">
      <CardContent className="p-6 sm:p-8 space-y-4">
        <h2 className="font-display text-2xl font-semibold">Get Featured — $40/month</h2>
        <p className="text-muted-foreground">
          Choose your existing listing, then continue to checkout. This uses the same Stripe
          subscription as the button on listing pages.
        </p>
        <label htmlFor="listing-select" className="block text-sm font-medium">
          Your listing
        </label>
        <select
          id="listing-select"
          className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm"
          value={businessId}
          onChange={(e) => setBusinessId(e.target.value)}
        >
          <option value="">Choose your listing</option>
          {listings.map((l) => (
            <option key={l.id} value={l.id} disabled={l.featured}>
              {l.name}
              {l.featured ? ' (already featured)' : ''}
            </option>
          ))}
        </select>
        {selected && !selected.featured && (
          <p className="text-sm text-muted-foreground">
            Review your listing first:{' '}
            <Link
              href={`/listing/${selected.id}`}
              className="text-primary underline-offset-4 hover:underline"
            >
              {selected.name}
            </Link>
          </p>
        )}
        <Button
          onClick={handleCheckout}
          size="lg"
          className="w-full sm:w-auto gap-2"
          loading={loading}
          disabled={!businessId || !!selected?.featured}
        >
          <Star className="h-4 w-4" />
          Get Featured — $40/month
        </Button>
        <p className="text-xs text-muted-foreground">
          Month to month. Cancel anytime. If you&apos;re not listed yet, a free listing comes first.
        </p>
      </CardContent>
    </Card>
  );
}
