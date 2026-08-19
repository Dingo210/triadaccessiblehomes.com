export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/db';
import { Header } from '@/app/_components/header';
import { Footer } from '@/app/_components/footer';
import { ListingClient } from './_components/listing-client';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';
import { localBusinessSchema, breadcrumbSchema, getSiteUrl } from '@/lib/seo';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const business = await prisma.business.findUnique({ where: { id: params?.id ?? '' } });
  return {
    title: business ? `${business.name} — Triad Accessible Homes` : 'Listing — Triad Accessible Homes',
    description: business?.description ?? '',
  };
}

export default async function ListingPage({ params }: Props) {
  const business = await prisma.business.findUnique({
    where: { id: params?.id ?? '' },
  });

  if (!business) return notFound();

  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd data={localBusinessSchema(business, siteUrl)} />
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: 'Home', path: '/' },
            { name: business.category, path: `/category/${business.categorySlug}` },
            { name: business.name, path: `/listing/${business.id}` },
          ],
          siteUrl,
        )}
      />
      <Header />
      <ListingClient business={JSON.parse(JSON.stringify(business))} />
      <Footer />
    </>
  );
}
