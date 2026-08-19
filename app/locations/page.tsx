export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/app/_components/header';
import { Footer } from '@/app/_components/footer';
import { LOCATIONS } from '@/lib/locations';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, ArrowRight } from 'lucide-react';
import { JsonLd } from '@/components/json-ld';
import { breadcrumbSchema, getSiteUrl } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Areas We Serve — Triad Accessible Homes',
  description:
    'Accessible home service providers across the Piedmont Triad — Greensboro, Winston-Salem, and High Point. Find ramps, stair lifts, and accessible remodeling near you.',
};

export default function LocationsIndexPage() {
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Locations', path: '/locations' }], siteUrl)}
      />
      <Header />
      <main className="min-h-screen">
        <section className="bg-gradient-to-br from-primary/10 via-background to-emerald-500/10 border-b border-border">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-14 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <MapPin className="h-4 w-4" /> Areas We Serve
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Accessible Home Services Across the Piedmont Triad
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Find trusted, disability-accessible home service providers in your city. Explore
              providers serving the Triad&apos;s three largest communities.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {LOCATIONS.map((loc) => (
              <Link key={loc.slug} href={`/locations/${loc.slug}`} className="group">
                <Card className="overflow-hidden h-full transition-all duration-normal hover:shadow-lg hover:-translate-y-1">
                  <div className="relative aspect-[16/9] bg-muted">
                    <Image
                      src={loc.heroImage}
                      alt={`${loc.city}, North Carolina`}
                      fill
                      className="object-cover transition-transform duration-slow group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4 text-white">
                      <h2 className="font-display text-2xl font-bold">{loc.city}</h2>
                      <p className="text-sm text-white/80">{loc.county}</p>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{loc.blurb}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-primary font-medium">
                      View providers <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
