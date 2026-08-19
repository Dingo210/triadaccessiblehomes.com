export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/app/_components/header';
import { Footer } from '@/app/_components/footer';
import { GUIDES } from '@/lib/guides';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import { JsonLd } from '@/components/json-ld';
import { breadcrumbSchema, getSiteUrl } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessibility Guides & Resources — Triad Accessible Homes',
  description:
    'Practical guides to accessible home modifications in the Piedmont Triad — wheelchair-accessible bathrooms, stair lifts, ramps, and aging-in-place planning.',
};

export default function GuidesIndexPage() {
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Guides', path: '/guides' }], siteUrl)}
      />
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-emerald-500/10 border-b border-border">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-14 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <BookOpen className="h-4 w-4" /> Guides &amp; Resources
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Accessible Home Guides for the Piedmont Triad
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Clear, practical advice on making a home safer and more accessible — from bathroom
              remodels and stair lifts to ramps and aging-in-place planning.
            </p>
          </div>
        </section>

        {/* Guide grid */}
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {GUIDES.map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group">
                <Card className="overflow-hidden h-full transition-all duration-normal hover:shadow-lg hover:-translate-y-1">
                  <div className="relative aspect-[16/9] bg-muted">
                    <Image
                      src={guide.heroImage}
                      alt={guide.title}
                      fill
                      className="object-cover transition-transform duration-slow group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                      <Clock className="h-3.5 w-3.5" /> {guide.readTime}
                    </div>
                    <h2 className="font-display text-xl font-semibold leading-tight mb-2 group-hover:text-primary transition-colors">
                      {guide.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {guide.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm text-primary font-medium">
                      Read guide <ArrowRight className="h-3.5 w-3.5" />
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
