'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn, SlideIn } from '@/components/ui/animate';
import {
  Phone, Mail, Globe, MapPin, Star, ArrowLeft, Sparkles, ExternalLink,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Business {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  photoUrl: string;
  featured: boolean;
  featuredUntil: string | null;
  stripeSubscriptionId: string | null;
}

export function ListingClient({ business }: { business: Business }) {
  const [loading, setLoading] = useState(false);
  const biz = business ?? ({} as Business);

  const handleGetFeatured = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: biz.id }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error(data?.error ?? 'Failed to create checkout session');
      }
    } catch (err: any) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero image */}
      <div className="relative h-64 sm:h-80 bg-muted">
        {biz.photoUrl && (
          <Image
            src={biz.photoUrl}
            alt={`Photo of ${biz.name}`}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 -mt-20 relative z-10">
        <FadeIn>
          <div className="flex items-center gap-2 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1 bg-background/80 backdrop-blur-sm">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            </Link>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-6">
            <SlideIn from="left">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-start gap-2 mb-3">
                    <Badge variant="secondary">{biz.category}</Badge>
                    {biz.featured && (
                      <Badge className="bg-amber-500 text-white border-0 gap-1">
                        <Star className="h-3 w-3 fill-current" /> Featured
                      </Badge>
                    )}
                  </div>
                  <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                    {biz.name}
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {biz.description}
                  </p>
                </CardContent>
              </Card>
            </SlideIn>

            {/* Details */}
            <SlideIn from="left" delay={0.1}>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="font-display text-xl font-semibold">Contact Information</h2>

                  {biz.phone && (
                    <a href={`tel:${biz.phone}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium" suppressHydrationWarning>{biz.phone}</p>
                      </div>
                    </a>
                  )}

                  {biz.email && (
                    <a href={`mailto:${biz.email}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium" suppressHydrationWarning>{biz.email}</p>
                      </div>
                    </a>
                  )}

                  {biz.website && (
                    <a href={biz.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <p className="font-medium flex items-center gap-1">
                          Visit Website <ExternalLink className="h-3 w-3" />
                        </p>
                      </div>
                    </a>
                  )}

                  {biz.address && (
                    <div className="flex items-center gap-3 p-3 rounded-lg">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{biz.address}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </SlideIn>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <SlideIn from="right">
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center">
                  {biz.featured ? (
                    <>
                      <div className="flex items-center justify-center gap-2 text-amber-500 mb-3">
                        <Star className="h-6 w-6 fill-current" />
                        <span className="font-display font-bold text-lg">Featured Provider</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This provider has been verified and highlighted for their accessibility commitment.
                      </p>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
                      <h3 className="font-display font-semibold text-lg mb-2">
                        Get Featured
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Stand out in the directory with a Featured badge. Highlighted at the top of category pages and on the homepage.
                      </p>
                      <p className="text-2xl font-bold text-primary mb-4">
                        $40<span className="text-sm font-normal text-muted-foreground">/month</span>
                      </p>
                      <Button
                        onClick={handleGetFeatured}
                        className="w-full gap-2"
                        size="lg"
                        loading={loading}
                      >
                        <Star className="h-4 w-4" />
                        Get Featured Now
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </SlideIn>
          </div>
        </div>
      </div>
    </main>
  );
}
