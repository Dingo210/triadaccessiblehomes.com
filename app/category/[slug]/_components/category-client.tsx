'use client';

import { useState } from 'react';
import { SearchBar } from '@/app/_components/search-bar';
import { BusinessCard } from '@/app/_components/business-card';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Image from 'next/image';

interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  phone: string;
  photoUrl: string;
  featured: boolean;
}

interface CategoryClientProps {
  category: { name: string; slug: string; imageUrl: string };
  businesses: Business[];
}

export function CategoryClient({ category, businesses }: CategoryClientProps) {
  const [filter, setFilter] = useState('');

  const filtered = (businesses ?? []).filter((b: Business) => {
    const q = (filter ?? '').toLowerCase();
    if (!q) return true;
    return (
      (b?.name ?? '').toLowerCase().includes(q) ||
      (b?.description ?? '').toLowerCase().includes(q)
    );
  });

  const featuredBiz = filtered.filter((b: Business) => b?.featured);
  const regularBiz = filtered.filter((b: Business) => !b?.featured);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-48 sm:h-64 bg-muted overflow-hidden">
        <Image
          src={category?.imageUrl ?? ''}
          alt={category?.name ?? 'Category'}
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/30" />
        <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 h-full flex items-end pb-6">
          <FadeIn>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              {category?.name ?? ''}
            </h1>
            <p className="text-muted-foreground mt-1">
              {(businesses?.length ?? 0)} {(businesses?.length ?? 0) === 1 ? 'provider' : 'providers'} found
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Filter + list */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8">
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter providers..."
            value={filter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter(e?.target?.value ?? '')}
            className="pl-10"
          />
        </div>

        {(featuredBiz?.length ?? 0) > 0 && (
          <>
            <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              ⭐ Featured Providers
            </h2>
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredBiz.map((biz: Business) => (
                <StaggerItem key={biz?.id ?? ''}>
                  <BusinessCard {...biz} />
                </StaggerItem>
              ))}
            </Stagger>
          </>
        )}

        <h2 className="font-display text-xl font-semibold mb-4">
          {(featuredBiz?.length ?? 0) > 0 ? 'All Providers' : 'Providers'}
        </h2>
        {(regularBiz?.length ?? 0) > 0 ? (
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularBiz.map((biz: Business) => (
              <StaggerItem key={biz?.id ?? ''}>
                <BusinessCard {...biz} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <p className="text-muted-foreground py-8 text-center">
            {filter ? 'No providers match your filter.' : 'No providers in this category yet.'}
          </p>
        )}
      </section>
    </main>
  );
}
