'use client';

import { SearchBar } from '@/app/_components/search-bar';
import { BusinessCard } from '@/app/_components/business-card';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { Search } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  phone: string;
  photoUrl: string;
  featured: boolean;
}

export function SearchResults({ query, businesses }: { query: string; businesses: Business[] }) {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8">
        <FadeIn>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-muted-foreground mb-6">
              {businesses?.length ?? 0} result{(businesses?.length ?? 0) !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </p>
          )}
        </FadeIn>

        <SearchBar className="mb-8 max-w-xl" />

        {(businesses?.length ?? 0) > 0 ? (
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(businesses ?? []).map((biz: Business) => (
              <StaggerItem key={biz?.id ?? ''}>
                <BusinessCard {...biz} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <div className="text-center py-16">
            <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              {query ? 'No providers found matching your search.' : 'Enter a search term to find providers.'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
