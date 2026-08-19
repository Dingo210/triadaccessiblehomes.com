# Triad Accessible Homes — Technical Handoff

> A production directory website for **disability-accessible home service providers** in the
> Piedmont Triad area of North Carolina. This document is a complete technical handoff so that
> another developer or AI agent can understand, run, and deploy the project from scratch.

Live site: **https://triadaccessiblehomes.com**

---

## 1. Tech Stack Overview

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) + React 18 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui (Radix primitives) |
| Icons | lucide-react |
| Animation | framer-motion |
| Data layer | Prisma ORM 6.x → PostgreSQL |
| Payments | Stripe (subscriptions) — `stripe` Node SDK |
| Analytics | Google Analytics 4 (gtag.js) |
| Theming | next-themes (light/dark) |
| Toasts | sonner |
| Auth (admin) | Custom cookie-based password gate (NOT next-auth) |
| Package manager | **yarn** (never npm) |

> Note: `next-auth`, `redux`/`zustand`/`jotai`-style libs may appear in `package.json` as
> template leftovers, but the app does **not** use them. Auth is a simple cookie; state is React
> `useState` + server components. See §6.

---

## 2. Directory Tree

The application lives entirely inside `nextjs_space/`. (Standard build/dependency folders
`node_modules`, `.next`, `.build`, `.git` are omitted.)

```
accesshome_directory/
├── HANDOFF.md                      # this document
└── nextjs_space/
    ├── .env                        # secrets & config (NOT committed — see §7)
    ├── .yarnrc.yml                 # yarn (node-modules linker)
    ├── components.json             # shadcn/ui config
    ├── eslint.ssr.config.mjs       # SSR-safety lint rules
    ├── next.config.js              # Next.js config
    ├── next-env.d.ts
    ├── postcss.config.js
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── package.json
    │
    ├── prisma/
    │   └── schema.prisma           # single `Business` model
    │
    ├── scripts/
    │   ├── seed.ts                 # seeds 20 Triad businesses (idempotent upsert)
    │   └── safe-seed.ts
    │
    ├── lib/
    │   ├── db.ts                   # Prisma singleton
    │   ├── stripe.ts               # Stripe singleton
    │   ├── categories.ts           # 8 service categories + matching logic
    │   ├── seo.ts                  # JSON-LD schema builders + site URL helper
    │   ├── guides.ts               # 4 long-form SEO guide articles
    │   ├── locations.ts            # 3 city landing pages (Greensboro, W-S, High Point)
    │   ├── utils.ts                # cn() classname helper
    │   └── types.ts                # (template leftover — unused)
    │
    ├── app/
    │   ├── layout.tsx              # root layout: fonts, theme, GA, metadata
    │   ├── page.tsx                # homepage (server component)
    │   ├── globals.css             # design tokens (HSL CSS vars) + Tailwind layers
    │   ├── robots.ts               # dynamic robots.txt
    │   ├── sitemap.ts              # dynamic sitemap.xml
    │   │
    │   ├── _components/            # homepage-scoped UI
    │   │   ├── header.tsx
    │   │   ├── footer.tsx
    │   │   ├── home-client.tsx     # hero, category grid, listings
    │   │   ├── business-card.tsx
    │   │   └── search-bar.tsx
    │   │
    │   ├── category/[slug]/
    │   │   ├── page.tsx            # category listing (server)
    │   │   └── _components/category-client.tsx
    │   │
    │   ├── listing/[id]/
    │   │   ├── page.tsx            # single business (server)
    │   │   └── _components/listing-client.tsx  # includes 'Get Featured' checkout
    │   │
    │   ├── search/
    │   │   ├── page.tsx
    │   │   └── _components/search-results.tsx
    │   │
    │   ├── guides/
    │   │   ├── page.tsx            # guides index
    │   │   └── [slug]/page.tsx     # article page
    │   │
    │   ├── locations/
    │   │   ├── page.tsx            # locations index
    │   │   └── [city]/page.tsx     # city landing page
    │   │
    │   ├── admin/
    │   │   ├── page.tsx
    │   │   └── _components/admin-client.tsx     # password gate + featured toggle
    │   │
    │   └── api/
    │       ├── checkout/route.ts               # POST — create Stripe Checkout session
    │       ├── webhooks/stripe/route.ts        # POST — Stripe webhook handler
    │       └── admin/
    │           ├── auth/route.ts               # POST/GET/DELETE — admin login/status/logout
    │           ├── businesses/route.ts         # GET — list all (admin only)
    │           └── toggle-featured/route.ts    # POST — toggle featured (admin only)
    │
    ├── components/
    │   ├── json-ld.tsx             # renders <script type=application/ld+json>
    │   ├── google-analytics.tsx    # GA4 loader + SPA pageview tracker
    │   ├── safe-format.tsx         # SSR-safe date/number formatters
    │   ├── client-only.tsx         # useMounted / ClientOnly wrapper
    │   ├── chunk-load-error-handler.tsx
    │   ├── theme-provider.tsx
    │   ├── theme-toggle.tsx
    │   ├── layouts/                # app-shell, container, section, page-header
    │   └── ui/                     # ~60 shadcn/ui primitives
    │
    ├── hooks/use-toast.ts
    ├── types/next-auth.d.ts        # (template leftover)
    └── public/
        ├── favicon.svg
        ├── logo.png
        ├── hero-image.png
        └── og-image.png
```

---

## 3. Database Schema

PostgreSQL accessed through Prisma. A single model powers the whole directory.

```prisma
// prisma/schema.prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-arm64-openssl-3.0.x"] // native (dev) + deploy target
  output        = "/home/ubuntu/accesshome_directory/nextjs_space/node_modules/.prisma/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")   // connection string from .env
}

model Business {
  id                   String    @id @default(cuid()) // seed overrides with a slug of the name
  name                 String
  category             String                          // human-readable label from source data
  categorySlug         String                          // normalized slug → maps to CATEGORIES
  description          String
  address              String    @default("")          // mostly empty in current data
  phone                String    @default("")
  email                String    @default("")
  website              String    @default("")
  photoUrl             String    @default("")          // category banner image URL
  featured             Boolean   @default(false)        // paid Featured Listing flag
  featuredUntil        DateTime?                         // when the featured period ends
  stripeSubscriptionId String?                           // active Stripe subscription
  stripeCustomerId     String?
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  @@index([categorySlug]) // fast category page queries
  @@index([featured])     // fast featured lookups on homepage
}
```

Key points:
- **One table.** All listings are `Business` rows. There is no user table — the site is a public directory.
- **`categorySlug`** is the join key to the static `CATEGORIES` array in `lib/categories.ts` (icons, banner images, matching keywords). Categories are code, not DB rows.
- **Featured state** (`featured`, `featuredUntil`, `stripeSubscriptionId`, `stripeCustomerId`) is driven by Stripe webhooks (§5) and by the admin toggle.
- Seed IDs are **slugified business names** (e.g. `medsource-inc`) so re-seeding is idempotent via `upsert`.

---

## 4. Core Source Files (annotated)

### 4.1 `lib/db.ts` — Prisma singleton
```ts
import { PrismaClient } from '@prisma/client'

// Reuse one PrismaClient across hot reloads / serverless invocations to avoid
// exhausting the connection pool (the DB allows only a small number of connections).
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 4.2 `lib/stripe.ts` — Stripe singleton
```ts
import Stripe from 'stripe';

// Lazily instantiate a single Stripe client using the secret key from the env.
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-04-30.basil' as any,
    });
  }
  return stripeInstance;
}
```

### 4.3 `app/api/checkout/route.ts` — create a Stripe Checkout session
```ts
export const dynamic = 'force-dynamic'; // needs runtime request origin, never static

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getStripe } from '@/lib/stripe';

// Find or lazily create the single "Featured Listing" product + $40/mo recurring price.
// The product is identified by a metadata tag so we never create duplicates.
async function getOrCreatePrice(): Promise<string> {
  const stripe = getStripe();
  const products = await stripe.products.search({
    query: \"metadata['app']:'accesshome_featured'\",
  });

  let productId: string;
  if ((products?.data?.length ?? 0) > 0) {
    productId = products.data[0].id;
  } else {
    const product = await stripe.products.create({
      name: 'Featured Listing — AccessHome Directory',
      description: 'Monthly featured listing in the AccessHome Directory...',
      metadata: { app: 'accesshome_featured' },
    });
    productId = product.id;
  }

  // Reuse an existing recurring price if present, else create one.
  const prices = await stripe.prices.list({ product: productId, active: true, type: 'recurring', limit: 1 });
  if ((prices?.data?.length ?? 0) > 0) return prices.data[0].id;

  const price = await stripe.prices.create({
    product: productId,
    unit_amount: 4000,          // $40.00 in cents
    currency: 'usd',
    recurring: { interval: 'month' },
  });
  return price.id;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const businessId = body?.businessId;
    if (!businessId) return NextResponse.json({ error: 'Missing businessId' }, { status: 400 });

    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    if (business.featured) return NextResponse.json({ error: 'Business is already featured' }, { status: 400 });

    const stripe = getStripe();
    const priceId = await getOrCreatePrice();
    const origin = request.headers.get('origin') ?? 'http://localhost:3000';

    // subscription-mode Checkout Session; businessId travels in metadata so the
    // webhook can mark the right row featured after payment succeeds.
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/listing/${businessId}?featured=success`,
      cancel_url: `${origin}/listing/${businessId}?featured=cancelled`,
      metadata: { businessId },
      client_reference_id: businessId,
    });

    return NextResponse.json({ url: session?.url ?? '' });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err?.message ?? 'Internal error' }, { status: 500 });
  }
}
```

### 4.4 `app/api/webhooks/stripe/route.ts` — subscription lifecycle
```ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getStripe } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const rawBody = await request.text();                       // raw body required for signature check
  const sig = request.headers.get('stripe-signature') ?? '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret); // verify authenticity
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err?.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        // Payment succeeded → mark business featured for 1 month, store Stripe ids.
        const session = event.data.object as Stripe.Checkout.Session;
        const businessId = session?.metadata?.businessId ?? session?.client_reference_id;
        if (businessId) {
          const subscriptionId = typeof session?.subscription === 'string'
            ? session.subscription : (session?.subscription as any)?.id ?? '';
          const featuredUntil = new Date();
          featuredUntil.setMonth(featuredUntil.getMonth() + 1);
          await prisma.business.update({
            where: { id: businessId },
            data: { featured: true, featuredUntil, stripeSubscriptionId: subscriptionId,
                    stripeCustomerId: typeof session?.customer === 'string' ? session.customer : (session?.customer as any)?.id ?? '' },
          });
        }
        break;
      }
      case 'customer.subscription.updated': {
        // Renewal / status change → keep featured flag & expiry in sync.
        const subscription = event.data.object as Stripe.Subscription;
        const business = await prisma.business.findFirst({ where: { stripeSubscriptionId: subscription?.id ?? '' } });
        if (business) {
          const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';
          const periodEnd = (subscription as any)?.current_period_end
            ? new Date(((subscription as any).current_period_end as number) * 1000) : null;
          await prisma.business.update({ where: { id: business.id }, data: { featured: isActive, featuredUntil: periodEnd } });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        // Cancellation → clear featured status.
        const subscription = event.data.object as Stripe.Subscription;
        const business = await prisma.business.findFirst({ where: { stripeSubscriptionId: subscription?.id ?? '' } });
        if (business) {
          await prisma.business.update({ where: { id: business.id }, data: { featured: false, featuredUntil: null, stripeSubscriptionId: null } });
        }
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err: any) {
    console.error('Webhook handler error:', err);
  }

  return NextResponse.json({ received: true });
}
```

### 4.5 `app/api/admin/auth/route.ts` — cookie-based admin gate
```ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_PASSWORD = 'admin123';        // ⚠️ change this before/after handoff (see §7)
const COOKIE_NAME = 'admin_auth';
const COOKIE_VALUE = 'authenticated';

export async function POST(request: NextRequest) {          // login
  const body = await request.json().catch(() => ({}));
  if ((body?.password ?? '') === ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, COOKIE_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,               // 24 hours
      path: '/',
    });
    return response;
  }
  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}

export async function GET() {                               // status check
  const auth = cookies().get(COOKIE_NAME);
  return NextResponse.json({ authenticated: auth?.value === COOKIE_VALUE });
}

export async function DELETE() {                            // logout
  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
```
The other two admin routes (`businesses/route.ts`, `toggle-featured/route.ts`) both begin by
reading the `admin_auth` cookie and returning `401` unless it equals `authenticated`, then
query/update `Business` rows via Prisma.

### 4.6 `lib/seo.ts` — structured data (JSON-LD) builders
Exports `getSiteUrl()` (derives the public origin from request headers, falling back to the live
domain) plus schema builder functions: `localBusinessSchema`, `websiteSchema`,
`organizationSchema`, `breadcrumbSchema`, `articleSchema`, `faqSchema`, `itemListSchema`. Each
returns a plain schema.org object rendered into the page via `components/json-ld.tsx`:
```tsx
export function JsonLd({ data }: { data: Record<string, any> | Record<string, any>[] }) {
  return <script type=\"application/ld+json\" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
```

### 4.7 `components/google-analytics.tsx` — GA4
Client component. Loads `gtag.js` via `next/script` (`afterInteractive`) using
`NEXT_PUBLIC_GA_MEASUREMENT_ID`, and a `<Suspense>`-wrapped `PageViewTracker` fires a `config`
pageview on every App-Router navigation. It renders nothing if the ID is missing or a placeholder.
Mounted in the `<head>` of `app/layout.tsx`.

### 4.8 `app/layout.tsx` — root layout (excerpt)
```tsx
export const dynamic = 'force-dynamic'; // ensures runtime NEXTAUTH_URL for metadataBase

export const metadata: Metadata = {
  title: 'Triad Accessible Homes — Disability-Accessible Home Services',
  description: '...',
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: { title: '...', description: '...', images: ['/og-image.png'] },
  verification: { google: 'IGa1YmMYc3SM2MKi_phMx0MiGydsHxkzA9MnV8XpDzw' },
};
// <head> mounts the Abacus chat lib + <GoogleAnalytics/>; <body> wraps children in
// <ThemeProvider defaultTheme=\"light\"> + <Toaster/> + <ChunkLoadErrorHandler/>.
```

### 4.9 `app/page.tsx` — homepage (server component)
Queries featured businesses, a preview of all businesses, and per-category counts
(`prisma.business.groupBy`), then renders `<JsonLd>` (WebSite + Organization) + `<Header>` +
`<HomeClient>` + `<Footer>`. Prisma objects are passed to client components via
`JSON.parse(JSON.stringify(...))` to strip non-serializable Date fields.

### 4.10 `scripts/seed.ts`
Idempotent seed of the 20 Triad businesses. `slugify(name)` becomes the row `id`; `mapCategorySlug`
maps free-text categories to one of the 8 slugs; a `categoryImages` map assigns each row a banner.
Uses `prisma.business.upsert` (create-or-update) so it is safe to re-run and never deletes data.

---

## 5. API & Integrations

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/checkout` | POST | public | Create a Stripe subscription Checkout session for a Featured Listing |
| `/api/webhooks/stripe` | POST | Stripe signature | Sync `featured` state on payment / renewal / cancellation |
| `/api/admin/auth` | POST / GET / DELETE | cookie | Admin login / status / logout |
| `/api/admin/businesses` | GET | cookie | List all businesses (admin dashboard) |
| `/api/admin/toggle-featured` | POST | cookie | Manually toggle a business's featured flag |

**Stripe (payments).** Product *\"Featured Listing — AccessHome Directory\"*, price **$40/month
recurring (USD)**, created lazily on first checkout and reused thereafter (identified by
`metadata.app = 'accesshome_featured'`). The checkout route stores `businessId` in session
metadata; the webhook uses it to set `featured=true` and record the Stripe subscription/customer
IDs. Webhook must be configured in the Stripe dashboard for events
`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`,
pointing at `https://<your-domain>/api/webhooks/stripe`, and its signing secret placed in
`STRIPE_WEBHOOK_SECRET`. **Keys are currently LIVE mode → real charges.**

**Google Analytics 4.** gtag.js via `NEXT_PUBLIC_GA_MEASUREMENT_ID` (currently `G-9Y9C5TK4MR`).

**SEO.** Dynamic `sitemap.ts` (homepage, search, guides, locations, all categories, all guide &
city slugs, all listing pages) and `robots.ts` (disallows `/admin` and `/api/`). JSON-LD on every
page type. Google Search Console verification token lives in `layout.tsx` metadata.

---

## 6. State Management & Rendering Model

- **Data fetching:** Server Components query Prisma directly (`app/page.tsx`, `category/[slug]/page.tsx`,
  `listing/[id]/page.tsx`, `sitemap.ts`). No REST/GraphQL layer for reads — pages hit the DB.
- **Interactivity:** Client Components (`*-client.tsx`, `search-bar.tsx`) use React `useState`
  for filters, admin login, and the checkout button. There is **no** Redux/Zustand/Jotai/Context
  global store.
- **Theming:** `next-themes` (`ThemeProvider` in the root layout, `defaultTheme=\"light\"`,
  `enableSystem`), toggled by `components/theme-toggle.tsx`.
- **Serialization:** Server → Client props are passed through `JSON.parse(JSON.stringify(...))`
  to drop non-serializable Prisma `Date` objects.
- **SSR safety:** `components/safe-format.tsx` + `components/client-only.tsx` guard against
  hydration mismatches; `eslint.ssr.config.mjs` enforces the rules at build time.
- **`export const dynamic = 'force-dynamic'`** is set on layout, API routes, sitemap and robots so
  they read the runtime request/host and env (rather than build-time values).

---

## 7. Environment Variables

Create `nextjs_space/.env` with the following keys. **Replace every `<...>` placeholder with a real
value — do not commit real secrets.**

| Variable | Example / Format | How to obtain |
|----------|------------------|---------------|
| `DATABASE_URL` | `postgresql://USER:PASSWORD@HOST:5432/DBNAME` | Your PostgreSQL provider's connection string |
| `STRIPE_SECRET_KEY` | `sk_live_<...>` (or `sk_test_<...>`) | Stripe Dashboard → Developers → API keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_<...>` (or `pk_test_<...>`) | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | `whsec_<...>` | Stripe Dashboard → Developers → Webhooks → your endpoint → Signing secret |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Google Analytics 4 property → Admin → Data streams |

Notes:
- **`NEXTAUTH_URL` is injected automatically by the hosting platform** at build & runtime (preview
  vs production). Do **not** hardcode it in `.env`.
- `NEXT_PUBLIC_*` vars are exposed to the browser (safe by design). All others are server-only.
- **Admin password** is currently hardcoded as `admin123` in `app/api/admin/auth/route.ts`.
  For any real deployment, change it there (ideally move it to an env var like `ADMIN_PASSWORD`
  and read `process.env.ADMIN_PASSWORD`).

Example `.env` template:
```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME
STRIPE_SECRET_KEY=sk_live_<your-secret-key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_<your-publishable-key>
STRIPE_WEBHOOK_SECRET=whsec_<your-webhook-signing-secret>
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 8. Local Setup — spin it up from scratch

```bash
# 1. Install dependencies (yarn only — never npm)
cd accesshome_directory/nextjs_space
yarn install

# 2. Create .env (see §7) with your DATABASE_URL and keys

# 3. Generate the Prisma client
yarn prisma generate

# 4. Create/upgrade the database schema (safe, additive)
yarn prisma db push

# 5. Seed the 20 Triad businesses (idempotent — safe to re-run)
set -a && . ./.env && set +a && npx tsx scripts/seed.ts

# 6. Start the dev server → http://localhost:3000
yarn dev
```

Useful scripts (from `package.json`):

| Command | Action |
|---------|--------|
| `yarn dev` | Start Next.js dev server (port 3000) |
| `yarn build` | Production build |
| `yarn start` | Serve the production build |
| `yarn lint` | Run Next.js/ESLint |
| `yarn prisma generate` | Regenerate the Prisma client after schema edits |
| `yarn prisma db push` | Apply schema to the database (additive) |

> ⚠️ Never run `prisma db push --force-reset` / `--accept-data-loss` against a database with real
> data — it wipes tables. Keep schema changes additive/backward-compatible.

---

## 9. Deployment

The site is hosted on the **Abacus.AI app platform** and served at
**https://triadaccessiblehomes.com**.

Build model (standalone Next.js output):
- Build command: `yarn build` with `NEXT_OUTPUT_MODE=standalone` (config reads
  `process.env.NEXT_OUTPUT_MODE` in `next.config.js`).
- `public/` assets are copied into the standalone bundle. `images.unoptimized = true` is set, so
  external image URLs and `next/image` work without an optimizer in the minimal runtime.
- Environment variables are loaded from `.env` at build & deploy time.
- `NEXTAUTH_URL` is set to the correct domain automatically per environment.

To deploy on a generic host (self-managed), the equivalent is:
```bash
cd nextjs_space
yarn install
yarn prisma generate
NEXT_OUTPUT_MODE=standalone yarn build
# serve .next/standalone (node .next/standalone/server.js) behind your reverse proxy,
# copying `public/` and `.next/static` alongside the standalone server per Next.js docs.
```

Post-deploy checklist:
1. Set all env vars (§7) in the host, with **production** Stripe keys.
2. In Stripe → Webhooks, add an endpoint `https://<domain>/api/webhooks/stripe` subscribed to
   `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`;
   copy its signing secret into `STRIPE_WEBHOOK_SECRET` and redeploy.
3. Run the seed once against the production database (§8 step 5) if starting fresh.
4. Verify `/sitemap.xml`, `/robots.txt`, and the Google Search Console verification.
5. Change the admin password (§7).

Deployment constraints specific to the platform:
- Framework is pinned to **Next.js 14** (do not upgrade to 15 / React 19-only APIs).
- The production runtime is minimal: rely only on `package.json` dependencies (no system binaries
  like ffmpeg/python). Use relative paths; only files inside the project are packaged.
- Do not connect the project to a remote git repository — it uses an internal versioning/checkpoint
  system.

---

## 10. Content & Data Notes

- **8 service categories** (code, `lib/categories.ts`): home-modifications, mobility-accessibility,
  stair-platform-lifts, bathroom-remodeling, kitchen-bath-remodeling, general-contractors,
  handyman-services, aging-in-place.
- **20 seeded businesses** — real Triad-area providers. Their `website` links point to the
  businesses' own sites; some may return 4xx to automated crawlers (they block bots) — this is
  expected, not an app bug.
- Business `address` fields are largely empty, so **city landing pages** (`/locations/*`) honestly
  present all providers as *serving* that city and the greater Triad rather than filtering by a
  stored address.
- **4 SEO guides** (`lib/guides.ts`): wheelchair-accessible-bathroom-nc,
  aging-in-place-home-modifications, choosing-a-stair-lift, wheelchair-ramps-costs-codes-nc.
- **3 city pages** (`lib/locations.ts`): greensboro, winston-salem, high-point.

---

## 11. Route Map

| Route | Type | Description |
|-------|------|-------------|
| `/` | Server | Homepage: hero, search, category grid, featured + preview listings |
| `/category/[slug]` | Server | All providers in a category (with client-side filter) |
| `/listing/[id]` | Server | Single business detail + \"Get Featured\" checkout CTA |
| `/search?q=` | Server | Keyword search across name/description/category |
| `/guides` + `/guides/[slug]` | Server | SEO guide index + articles |
| `/locations` + `/locations/[city]` | Server | City landing index + pages |
| `/admin` | Client-gated | Password login + featured-toggle dashboard |
| `/sitemap.xml`, `/robots.txt` | Dynamic | SEO |
"}