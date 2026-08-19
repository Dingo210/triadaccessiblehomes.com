export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/db';
import { CATEGORIES } from '@/lib/categories';
import { Header } from './_components/header';
import { Footer } from './_components/footer';
import { HomeClient } from './_components/home-client';
import { JsonLd } from '@/components/json-ld';
import { websiteSchema, organizationSchema, getSiteUrl } from '@/lib/seo';

export default async function HomePage() {
  const featuredBusinesses = await prisma.business.findMany({
    where: { featured: true },
    orderBy: { name: 'asc' },
    take: 6,
  });

  const allBusinesses = await prisma.business.findMany({
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
    take: 8,
  });

  // count per category
  const categoryCounts = await prisma.business.groupBy({
    by: ['categorySlug'],
    _count: { id: true },
  });

  const countMap: Record<string, number> = {};
  for (const c of categoryCounts ?? []) {
    countMap[c?.categorySlug ?? ''] = c?._count?.id ?? 0;
  }

  const categoriesWithCounts = CATEGORIES.map((cat) => ({
    name: cat.name,
    slug: cat.slug,
    imageUrl: cat.imageUrl,
    iconName: cat.icon.displayName ?? cat.name,
    count: countMap[cat.slug] ?? 0,
  }));

  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd data={[websiteSchema(siteUrl), organizationSchema(siteUrl)]} />
      <Header />
      <HomeClient
        featuredBusinesses={JSON.parse(JSON.stringify(featuredBusinesses ?? []))}
        allBusinesses={JSON.parse(JSON.stringify(allBusinesses ?? []))}
        categories={categoriesWithCounts}
      />
      <Footer />
    </>
  );
}
