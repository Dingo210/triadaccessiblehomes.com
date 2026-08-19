'use client';

import { SearchBar } from './search-bar';
import { BusinessCard } from './business-card';
import Link from 'next/link';
import Image from 'next/image';
import { FadeIn, SlideIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accessibility, ArrowRight, Star,
  Home, Bath, ChefHat, Hammer, Wrench, Heart, ArrowUpDown,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Home, House: Home, Accessibility, Bath, ChefHat, Hammer, Wrench, Heart, ArrowUpDown,
};

interface Business {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  phone: string;
  photoUrl: string;
  featured: boolean;
}

interface CategoryWithCount {
  name: string;
  slug: string;
  iconName: string;
  imageUrl: string;
  count: number;
}

interface HomeClientProps {
  featuredBusinesses: Business[];
  allBusinesses: Business[];
  categories: CategoryWithCount[];
}

export function HomeClient({ featuredBusinesses, allBusinesses, categories }: HomeClientProps) {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/hero-image.png"
            alt="Collage of accessible home services including wheelchair ramps, stairlifts, accessible bathrooms, kitchens, platform lifts, and grab bar installations"
            fill
            className="object-cover opacity-30"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-slate-900/40" />
        </div>

        <div className="relative mx-auto max-w-[1200px] px-4 py-20 sm:px-6 sm:py-28 lg:py-32 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-sm font-medium text-white mb-6">
              <Accessibility className="h-4 w-4" />
              Piedmont Triad Area
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-white">
              Find <span className="text-emerald-400">Accessible</span> Home Services
            </h1>
            <p className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto mb-8">
              Connecting families with trusted disability-accessible home service providers — ramps, stairlifts, bathroom remodels, and more.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <SearchBar className="max-w-xl mx-auto" />
          </FadeIn>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <FadeIn>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-center">
            Browse by Category
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Explore service providers organized by specialty.
          </p>
        </FadeIn>

        <Stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {(categories ?? []).map((cat: CategoryWithCount) => {
            const IconComponent = ICON_MAP[cat?.iconName ?? ''] ?? Accessibility;
            return (
              <StaggerItem key={cat?.slug ?? ''}>
                <Link href={`/category/${cat?.slug ?? ''}`}>
                  <Card className="group cursor-pointer transition-all duration-normal hover:shadow-md hover:-translate-y-1 h-full">
                    <CardContent className="p-5 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-sm sm:text-base mb-1">{cat?.name ?? ''}</h3>
                      <p className="text-xs text-muted-foreground">
                        {cat?.count ?? 0} {(cat?.count ?? 0) === 1 ? 'provider' : 'providers'}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* Featured Listings */}
      {(featuredBusinesses?.length ?? 0) > 0 && (
        <section id="featured" className="bg-secondary/30 py-16">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <FadeIn>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                  Featured Providers
                </h2>
              </div>
              <p className="text-muted-foreground mb-8">
                Premium service providers highlighted for their quality and accessibility commitment.
              </p>
            </FadeIn>
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(featuredBusinesses ?? []).map((biz: Business) => (
                <StaggerItem key={biz?.id ?? ''}>
                  <BusinessCard
                    id={biz?.id ?? ''}
                    name={biz?.name ?? ''}
                    category={biz?.category ?? ''}
                    description={biz?.description ?? ''}
                    phone={biz?.phone ?? ''}
                    photoUrl={biz?.photoUrl ?? ''}
                    featured={biz?.featured ?? false}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* All Listings Preview */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <FadeIn>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            All Providers
          </h2>
          <p className="text-muted-foreground mb-8">
            Browse the full directory of accessible home service professionals.
          </p>
        </FadeIn>
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(allBusinesses ?? []).map((biz: Business) => (
            <StaggerItem key={biz?.id ?? ''}>
              <BusinessCard
                id={biz?.id ?? ''}
                name={biz?.name ?? ''}
                category={biz?.category ?? ''}
                description={biz?.description ?? ''}
                phone={biz?.phone ?? ''}
                photoUrl={biz?.photoUrl ?? ''}
                featured={biz?.featured ?? false}
              />
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-8 text-center">
          <Link href="/#categories">
            <Button variant="outline" size="lg" className="gap-2">
              View All Categories <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
