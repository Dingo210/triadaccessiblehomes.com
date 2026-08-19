import { headers } from 'next/headers';

export const SITE_NAME = 'Triad Accessible Homes';
export const SITE_TAGLINE = 'Disability-Accessible Home Services in the Piedmont Triad';
export const SITE_DESCRIPTION =
  'Find trusted, disability-accessible home service providers in the Piedmont Triad area of North Carolina — wheelchair ramps, stair lifts, accessible bathroom remodels, aging-in-place modifications, and more.';

/** Derive the public site URL from request headers, falling back to the live domain. */
export function getSiteUrl(): string {
  const h = headers();
  const host =
    h.get('x-forwarded-host') || h.get('host') || 'triadaccessiblehomes.com';
  const protocol = h.get('x-forwarded-proto') || 'https';
  return `${protocol}://${host}`;
}

interface BusinessLike {
  id: string;
  name: string;
  category: string;
  description: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  photoUrl?: string;
}

/** LocalBusiness schema for an individual provider listing. */
export function localBusinessSchema(biz: BusinessLike, siteUrl: string) {
  const data: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/listing/${biz.id}`,
    name: biz.name,
    description: biz.description,
    url: `${siteUrl}/listing/${biz.id}`,
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Piedmont Triad, North Carolina',
    },
  };
  if (biz.photoUrl) data.image = biz.photoUrl;
  if (biz.phone) data.telephone = biz.phone;
  if (biz.email) data.email = biz.email;
  if (biz.website) data.sameAs = [biz.website];
  if (biz.address) {
    data.address = { '@type': 'PostalAddress', streetAddress: biz.address, addressRegion: 'NC', addressCountry: 'US' };
  } else {
    data.address = { '@type': 'PostalAddress', addressRegion: 'NC', addressCountry: 'US' };
  }
  return data;
}

/** Website + SearchAction schema for the homepage. */
export function websiteSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Organization schema. */
export function organizationSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: SITE_DESCRIPTION,
    areaServed: 'Piedmont Triad, North Carolina',
  };
}

/** BreadcrumbList schema. items: [{name, url}] where url is a path like '/guides'. */
export function breadcrumbSchema(items: { name: string; path: string }[], siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${siteUrl}${it.path}`,
    })),
  };
}

/** Article schema for guide pages. */
export function articleSchema(
  guide: { title: string; description: string; slug: string; heroImage: string; updated: string },
  siteUrl: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    image: guide.heroImage,
    datePublished: guide.updated,
    dateModified: guide.updated,
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/guides/${guide.slug}` },
  };
}

/** FAQPage schema. */
export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** ItemList schema for a collection of listings (category / city pages). */
export function itemListSchema(
  items: { id: string; name: string }[],
  siteUrl: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${siteUrl}/listing/${it.id}`,
      name: it.name,
    })),
  };
}
