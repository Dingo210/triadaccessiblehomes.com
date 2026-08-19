export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/db';
import { Header } from '@/app/_components/header';
import { Footer } from '@/app/_components/footer';
import { SearchResults } from './_components/search-results';

interface Props {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: Props) {
  const q = (searchParams?.q ?? '').trim();

  let businesses: any[] = [];
  if (q) {
    businesses = await prisma.business.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { category: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: [{ featured: 'desc' }, { name: 'asc' }],
    });
  }

  return (
    <>
      <Header />
      <SearchResults
        query={q}
        businesses={JSON.parse(JSON.stringify(businesses ?? []))}
      />
      <Footer />
    </>
  );
}
