export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { Header } from '@/app/_components/header';
import { Footer } from '@/app/_components/footer';
import { BusinessCard } from '@/app/_components/business-card';
import { getLocationBySlug } from '@/lib/locations';
import { CATEGORIES } from '@/lib/categories';
import { Card, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { MapPin, ChevronRight, ArrowRight } from 'lucide-react';
import { JsonLd } from '@/components/json-ld';
import { itemListSchema, breadcrumbSchema, getSiteUrl } from '@/lib/seo';
import type { Metadata } from 'next';

interface Props {
  params: { city: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loc = getLocationBySlug(params?.city ?? '');
  return {
    title: loc
      ? `Accessible Home Services in ${loc.city}, NC — Triad Accessible Homes`
      : 'Location — Triad Accessible Homes',
    description: loc?.blurb ?? '',
  };
}

export default async function LocationPage({ params }: Props) {
  const loc = getLocationBySlug(params?.city ?? '');
  if (!loc) return notFound();

  const siteUrl = getSiteUrl();

  const businesses = await prisma.business.findMany({
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
  });

  const featuredBiz = businesses.filter((b) => b.featured);
  const regularBiz = businesses.filter((b) => !b.featured);

  return (
    <>
      <JsonLd data={itemListSchema(businesses, siteUrl)} />
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: 'Home', path: '/' },
            { name: 'Locations', path: '/locations' },
            { name: loc.city, path: `/locations/${loc.slug}` },
          ],
          siteUrl,
        )}
      />
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative h-56 sm:h-72 bg-muted overflow-hidden">
          <Image
            src={loc.heroImage}
            alt={`${loc.city}, North Carolina`}
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 h-full flex flex-col justify-end pb-6">
            <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <Link href="/" className="hover:text-primary">Home</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href="/locations" className="hover:text-primary">Locations</Link>
            </nav>
            <div className="inline-flex items-center gap-1.5 text-sm font-medium text-primary mb-1">
              <MapPin className="h-4 w-4" /> {loc.county}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Accessible Home Services in {loc.city}, NC
            </h1>
          </div>
        </section>

        {/* Intro copy */}
        <section className="mx-auto max-w-[820px] px-4 sm:px-6 py-10">
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">{loc.intro}</p>
          {loc.body.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-foreground/90 mb-4">
              {p}
            </p>
          ))}
          <div className="mt-4">
            <h2 className="font-display text-lg font-semibold mb-2">Areas covered in and around {loc.city}</h2>
            <div className="flex flex-wrap gap-2">
              {loc.neighborhoods.map((n) => (
                <span key={n} className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                  {n}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 pb-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight mb-5">
            Services available in {loc.city}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className="group">
                <Card className="h-full transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-primary/40">
                  <CardContent className="p-4 flex items-center gap-3">
                    <cat.icon className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
                      {cat.name}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Providers */}
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10">
          <h2 className="font-display text-2xl font-semibold tracking-tight mb-2">
            Providers serving {loc.city}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            These accessibility specialists serve {loc.city} and the surrounding {loc.county} area.
          </p>

          {featuredBiz.length > 0 && (
            <>
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                ⭐ Featured Providers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredBiz.map((biz) => (
                  <BusinessCard key={biz.id} {...biz} />
                ))}
              </div>
            </>
          )}

          <h3 className="font-display text-lg font-semibold mb-4">
            {featuredBiz.length > 0 ? 'All Providers' : 'Providers'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularBiz.map((biz) => (
              <BusinessCard key={biz.id} {...biz} />
            ))}
          </div>
        </section>

        {/* Cross-links to other cities */}
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 pb-14">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold mb-3">Serving the whole Piedmont Triad</h2>
              <div className="flex flex-wrap gap-3">
                <Link href="/locations/greensboro" className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline">
                  Greensboro <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/locations/winston-salem" className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline">
                  Winston-Salem <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/locations/high-point" className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline">
                  High Point <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
}
