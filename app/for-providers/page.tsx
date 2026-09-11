export const dynamic = 'force-dynamic';

import { Header } from '@/app/_components/header';
import { Footer } from '@/app/_components/footer';
import { FeaturedCheckout } from './_components/featured-checkout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { JsonLd } from '@/components/json-ld';
import { breadcrumbSchema, faqSchema, getSiteUrl } from '@/lib/seo';
import { prisma } from '@/lib/db';
import { Check, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Featured Listings for Providers — Triad Accessible Homes',
  description:
    'Optional Featured Listing for disability-accessible home service providers in the Piedmont Triad. $40/month. Your free listing stays either way.',
};

const FAQS = [
  {
    q: 'Is the free listing going away?',
    a: 'No. Featured is optional.',
  },
  {
    q: 'Do I have to be listed first?',
    a: 'Yes. Featured is an upgrade to an existing listing.',
  },
  {
    q: 'Can I cancel?',
    a: "Yes. It's $40/month, cancel anytime. When you cancel, the badge and extra placement come off. The free listing stays.",
  },
  {
    q: 'Does paying change how you describe my company?',
    a: "No. We don't write fake reviews or paid \"best of\" copy.",
  },
];

const INCLUDES = [
  'A Featured badge on your listing',
  'Top placement on your category page',
  'Homepage placement',
  'The same contact details families already see — phone and website',
];

const STEPS = [
  'Confirm your listing is accurate (name, phone, service area, website).',
  'Subscribe to Featured at $40/month.',
  'Badge and placement go on. Month to month. Cancel anytime.',
];

export default async function ForProvidersPage() {
  const siteUrl = getSiteUrl();
  const listings = await prisma.business.findMany({
    select: { id: true, name: true, featured: true },
    orderBy: { name: 'asc' },
  });

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: 'Home', path: '/' },
            { name: 'For Providers', path: '/for-providers' },
          ],
          siteUrl,
        )}
      />
      <JsonLd data={faqSchema(FAQS)} />
      <Header />
      <main className="min-h-screen">
        <section className="bg-gradient-to-br from-primary/10 via-background to-emerald-500/10 border-b border-border">
          <div className="mx-auto max-w-[800px] px-4 sm:px-6 py-14 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <Sparkles className="h-4 w-4" /> For Providers
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Be easier to find for Triad families looking for accessible home help
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              If you already do ramps, stair lifts, accessible bathrooms, or aging-in-place work
              in Greensboro, Winston-Salem, or High Point, you can have a free listing in this
              directory. Featured is optional. It&apos;s a $40/month upgrade that puts your listing
              first where families are already looking.
            </p>
            <p className="mt-3 text-base text-muted-foreground">
              This is not a requirement to be listed. Free listings stay free.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <a href="#get-featured">
                  <Star className="h-4 w-4" />
                  Get Featured — $40/month
                </a>
              </Button>
              <p className="text-sm text-muted-foreground">Month to month. Cancel anytime.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[800px] px-4 sm:px-6 py-12 space-y-10">
          <div>
            <h2 className="font-display text-2xl font-semibold mb-4">What Featured includes</h2>
            <ul className="space-y-3">
              {INCLUDES.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              We don&apos;t sell reviews, ratings, or &quot;recommended&quot; language. Featured is
              visibility, not an endorsement.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-4">Who it&apos;s for</h2>
            <p className="text-muted-foreground leading-relaxed">
              Contractors, mobility dealers, remodelers, and handypersons who already serve the
              Piedmont Triad and are listed (or about to be listed) on triadaccessiblehomes.com.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              If you&apos;re not listed yet, start with a free listing. Featured is an upgrade on
              top of that.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-4">How it works</h2>
            <ol className="space-y-3">
              {STEPS.map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5 shrink-0">
                    {i + 1}
                  </Badge>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-4">Why it exists</h2>
            <p className="text-muted-foreground leading-relaxed">
              Families searching for a wheelchair ramp in Greensboro or a stair lift in
              Winston-Salem usually land on a national dealer page. This directory is meant to be
              the local alternative — one place to compare people who actually work in the Triad.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Featured helps a listed provider show up first here, without changing anyone&apos;s
              free listing.
            </p>
          </div>

          <FeaturedCheckout listings={listings} />

          <div>
            <h2 className="font-display text-2xl font-semibold mb-4">FAQ</h2>
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <Card key={faq.q}>
                  <CardContent className="p-5">
                    <h3 className="font-display font-semibold mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 sm:p-8 text-center space-y-3">
              <h2 className="font-display text-2xl font-semibold">Get Featured — $40/month</h2>
              <p className="text-muted-foreground">
                Stand out at the top of your category and on the homepage. Your free listing stays
                either way.
              </p>
              <Button asChild size="lg" className="gap-2">
                <a href="#get-featured">
                  <Star className="h-4 w-4" />
                  Get Featured — $40/month
                </a>
              </Button>
              <p className="text-sm text-muted-foreground">
                Not listed yet?{' '}
                <Link href="/" className="text-primary underline-offset-4 hover:underline">
                  Browse the directory
                </Link>{' '}
                — a free listing comes first.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
}
