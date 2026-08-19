import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { CATEGORIES } from '@/lib/categories';
import { GUIDES } from '@/lib/guides';
import { LOCATIONS } from '@/lib/locations';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

function getSiteUrl(): string {
  const headersList = headers();
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || 'triadaccessiblehomes.com';
  const protocol = headersList.get('x-forwarded-proto') || 'https';
  return `${protocol}://${host}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/locations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Guide articles
  const guidePages: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: `${siteUrl}/guides/${g.slug}`,
    lastModified: new Date(g.updated),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // City landing pages
  const locationPages: MetadataRoute.Sitemap = LOCATIONS.map((l) => ({
    url: `${siteUrl}/locations/${l.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${siteUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Individual listing pages
  const businesses = await prisma.business.findMany({
    select: { id: true, updatedAt: true },
  });

  const listingPages: MetadataRoute.Sitemap = businesses.map((biz) => ({
    url: `${siteUrl}/listing/${biz.id}`,
    lastModified: biz.updatedAt ?? new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...guidePages, ...locationPages, ...listingPages];
}
