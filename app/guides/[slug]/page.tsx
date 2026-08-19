export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/app/_components/header';
import { Footer } from '@/app/_components/footer';
import { getGuideBySlug, GUIDES } from '@/lib/guides';
import { getCategoryBySlug } from '@/lib/categories';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { JsonLd } from '@/components/json-ld';
import { articleSchema, faqSchema, breadcrumbSchema, getSiteUrl } from '@/lib/seo';
import { SafeDate } from '@/components/safe-format';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuideBySlug(params?.slug ?? '');
  return {
    title: guide ? `${guide.title} — Triad Accessible Homes` : 'Guide — Triad Accessible Homes',
    description: guide?.description ?? '',
  };
}

export default function GuidePage({ params }: Props) {
  const guide = getGuideBySlug(params?.slug ?? '');
  if (!guide) return notFound();

  const siteUrl = getSiteUrl();
  const relatedCategory = guide.relatedCategorySlug
    ? getCategoryBySlug(guide.relatedCategorySlug)
    : undefined;
  const otherGuides = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 2);

  return (
    <>
      <JsonLd data={articleSchema(guide, siteUrl)} />
      <JsonLd data={faqSchema(guide.faqs)} />
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: 'Home', path: '/' },
            { name: 'Guides', path: '/guides' },
            { name: guide.title, path: `/guides/${guide.slug}` },
          ],
          siteUrl,
        )}
      />
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <div className="relative h-64 sm:h-80 bg-muted">
          <Image src={guide.heroImage} alt={guide.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        </div>

        <div className="mx-auto max-w-[820px] px-4 sm:px-6 -mt-24 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/guides" className="hover:text-primary">Guides</Link>
          </nav>

          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <Clock className="h-3.5 w-3.5" /> {guide.readTime}
            <span className="mx-1">·</span>
            Updated <SafeDate date={guide.updated} options={{ year: 'numeric', month: 'long', day: 'numeric' }} />
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {guide.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">{guide.intro}</p>

          {/* Body */}
          <article className="space-y-8">
            {guide.sections.map((section, i) => (
              <section key={i}>
                <h2 className="font-display text-2xl font-semibold tracking-tight mb-3">
                  {section.heading}
                </h2>
                {section.paragraphs.map((p, j) => (
                  <p key={j} className="text-base leading-relaxed text-foreground/90 mb-3">
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-2 space-y-2">
                    {section.bullets.map((b, k) => (
                      <li key={k} className="flex items-start gap-2 text-foreground/90">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>

          {/* Related category CTA */}
          {relatedCategory && (
            <Card className="mt-10 border-primary/20 bg-primary/5">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-semibold text-lg">
                    Find {relatedCategory.name.toLowerCase()} providers
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Browse trusted specialists serving the Piedmont Triad.
                  </p>
                </div>
                <Link href={`/category/${relatedCategory.slug}`}>
                  <Button className="gap-2 whitespace-nowrap">
                    View providers <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* FAQ */}
          {guide.faqs.length > 0 && (
            <section className="mt-12">
              <h2 className="font-display text-2xl font-semibold tracking-tight mb-5">
                Frequently asked questions
              </h2>
              <div className="space-y-4">
                {guide.faqs.map((f, i) => (
                  <Card key={i}>
                    <CardContent className="p-5">
                      <h3 className="font-semibold mb-1.5">{f.q}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Other guides */}
          <section className="mt-14 mb-4">
            <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> More guides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherGuides.map((g) => (
                <Link key={g.slug} href={`/guides/${g.slug}`} className="group">
                  <Card className="h-full transition-all hover:shadow-md hover:-translate-y-0.5">
                    <CardContent className="p-5">
                      <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors mb-1">
                        {g.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{g.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <div className="pb-16">
            <Link href="/guides">
              <Button variant="ghost" className="gap-1">
                <ArrowLeft className="h-4 w-4" /> All guides
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
