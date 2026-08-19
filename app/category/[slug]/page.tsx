export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/db';
import { getCategoryBySlug, CATEGORIES } from '@/lib/categories';
import { Header } from '@/app/_components/header';
import { Footer } from '@/app/_components/footer';
import { CategoryClient } from './_components/category-client';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';
import { itemListSchema, breadcrumbSchema, getSiteUrl } from '@/lib/seo';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategoryBySlug(params?.slug ?? '');
  return {
    title: category ? `${category.name} in the Piedmont Triad — Triad Accessible Homes` : 'Category — Triad Accessible Homes',
    description: category ? `Find trusted ${category.name.toLowerCase()} providers serving Greensboro, Winston-Salem, High Point and the Piedmont Triad area of North Carolina.` : '',
  };
}

export default async function CategoryPage({ params }: Props) {
  const category = getCategoryBySlug(params?.slug ?? '');
  if (!category) return notFound();

  const businesses = await prisma.business.findMany({
    where: { categorySlug: params?.slug ?? '' },
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
  });

  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd data={itemListSchema(businesses, siteUrl)} />
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: 'Home', path: '/' },
            { name: category.name, path: `/category/${category.slug}` },
          ],
          siteUrl,
        )}
      />
      <Header />
      <CategoryClient
        category={{
          name: category.name,
          slug: category.slug,
          imageUrl: category.imageUrl,
        }}
        businesses={JSON.parse(JSON.stringify(businesses ?? []))}
      />
      <Footer />
    </>
  );
}
