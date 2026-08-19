# Triad Accessible Homes — Technical Handoff

> A production directory website for **disability-accessible home service providers** in the
> Piedmont Triad area of North Carolina. This document is a complete technical handoff so that
> another developer or AI agent can understand, run, and deploy the project from scratch.

Live site: **https://triadaccessiblehomes.com**
Repository: **github.com/Dingo210/triadaccessiblehomes.com** (public — see §7 before committing)

> **Migrated off the Abacus.AI platform to Vercel on 2026-08-18.** Any older documentation
> referring to Abacus hosting, an Abacus-hosted database, internal checkpoint versioning, or a
> hardcoded admin password is obsolete. This document reflects the current deployment.

---

## 1. Tech Stack Overview

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) + React 18 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui (Radix primitives) |
| Icons | lucide-react |
| Animation | framer-motion |
| Data layer | Prisma ORM 6.x → PostgreSQL (**Neon**) |
| Payments | Stripe (subscriptions) — `stripe` Node SDK |
| Analytics | Google Analytics 4 (gtag.js) |
| Theming | next-themes (light/dark) |
| Toasts | sonner |
| Auth (admin) | Custom HMAC-signed session cookie (NOT next-auth) — see §4.5 |
| Hosting | **Vercel** (GitHub `main` → production) |
| Runtime | **Node 22.x** (pinned in `engines` and in Vercel project settings) |
| Package manager | **yarn 4.18.0** via corepack (pinned in `packageManager`) |

> `next-auth`, `redux`/`zustand`/`jotai`-style libs and various charting/map libraries appear in
> `package.json` as template leftovers, but the app does **not** use them. Auth is a signed
> cookie; state is React `useState` + server components. See §6.

---

## 2. Repository Layout

**The repository root is the Next.js application itself** — `package.json` sits at the top level,
so Vercel's Root Directory setting is the default (`./`). There is no wrapper directory in git.

(Standard build/dependency folders `node_modules`, `.next` are omitted.)

```
triadaccessiblehomes.com/          # repo root == the Next.js app
├── HANDOFF.md                     # this document
├── STYLE_GUIDE.md
├── .env                           # secrets & config (gitignored — see §7)
├── .env.example                   # committed template, no real values
├── .gitignore
├── .nvmrc                         # 22
├── .yarnrc.yml                    # nodeLinker: node-modules
├── components.json                # shadcn/ui config
├── eslint.ssr.config.mjs          # SSR-safety lint rules
├── next.config.js                 # Next.js config
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json                   # engines.node 22.x, packageManager yarn@4.18.0
├── yarn.lock                      # committed — Vercel installs from this
│
├── prisma/
│   └── schema.prisma              # single `Business` model
│
├── scripts/
│   ├── seed.ts                    # seeds the 20 Triad businesses (idempotent upsert)
│   └── safe-seed.ts               # guard wrapper; aborts if seed.ts contains deletes
│
├── lib/
│   ├── db.ts                      # Prisma singleton
│   ├── stripe.ts                  # Stripe singleton
│   ├── admin-auth.ts              # signed admin sessions (§4.5)
│   ├── categories.ts              # 8 service categories + matching logic
│   ├── seo.ts                     # JSON-LD schema builders + site URL helper
│   ├── guides.ts                  # 4 long-form SEO guide articles
│   ├── locations.ts               # 3 city landing pages
│   ├── utils.ts                   # cn() classname helper
│   └── types.ts                   # (template leftover — unused)
│
├── app/
│   ├── layout.tsx                 # root layout: fonts, theme, GA, metadata
│   ├── page.tsx                   # homepage (server component)
│   ├── globals.css                # design tokens (HSL CSS vars) + Tailwind layers
│   ├── robots.ts                  # dynamic robots.txt
│   ├── sitemap.ts                 # dynamic sitemap.xml
│   │
│   ├── _components/               # homepage-scoped UI
│   │   ├── header.tsx  footer.tsx  home-client.tsx
│   │   ├── business-card.tsx  search-bar.tsx
│   │
│   ├── category/[slug]/           # page.tsx + _components/category-client.tsx
│   ├── listing/[id]/              # page.tsx + _components/listing-client.tsx
│   ├── search/                    # page.tsx + _components/search-results.tsx
│   ├── guides/                    # page.tsx + [slug]/page.tsx
│   ├── locations/                 # page.tsx + [city]/page.tsx
│   ├── admin/                     # page.tsx + _components/admin-client.tsx
│   │
│   └── api/
│       ├── checkout/route.ts               # POST — create Stripe Checkout session
│       ├── webhooks/stripe/route.ts        # POST — Stripe webhook handler
│       └── admin/
│           ├── auth/route.ts               # POST/GET/DELETE — login/status/logout
│           ├── businesses/route.ts         # GET — list all (admin only)
│           └── toggle-featured/route.ts    # POST — toggle featured (admin only)
│
├── components/
│   ├── json-ld.tsx  google-analytics.tsx  safe-format.tsx  client-only.tsx
│   ├── chunk-load-error-handler.tsx  theme-provider.tsx  theme-toggle.tsx
│   ├── layouts/                   # app-shell, container, section, page-header
│   └── ui/                        # ~60 shadcn/ui primitives
│
├── hooks/use-toast.ts
├── types/next-auth.d.ts           # (template leftover)
└── public/
    ├── favicon.svg  logo.png  hero-image.png  og-image.png
```

---

## 3. Database Schema

PostgreSQL on **Neon**, accessed through Prisma. A single model powers the whole directory.

```prisma
generator client {
    provider = "prisma-client-js"
    // "native" covers local dev; "rhel-openssl-3.0.x" is the Vercel serverless
    // (AWS Lambda / Amazon Linux) runtime target.
    binaryTargets = ["native", "rhel-openssl-3.0.x"]
}

datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
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
- **`categorySlug`** is the join key to the static `CATEGORIES` array in `lib/categories.ts`. Categories are code, not DB rows.
- **Featured state** is driven by Stripe webhooks (§5) and by the admin toggle.
- Seed IDs are **slugified business names** (e.g. `medsource-inc`) so re-seeding is idempotent via `upsert`.
- **The seed reproduces production exactly.** Verified by diffing the live sitemap's 20 listing IDs
  against the slugified seed names — zero drift. If the database is ever lost, `scripts/seed.ts`
  fully rebuilds it.

**Do not point `DATABASE_URL` at the pooled connection for schema changes.** Neon exposes a pooled
URL (PgBouncer) and `DATABASE_URL_UNPOOLED` (direct). The app runs fine on the pooled URL; DDL
(`prisma db push`) should use the unpooled one.

---

## 4. Core Source Files (annotated)

### 4.1 `lib/db.ts` — Prisma singleton
```ts
import { PrismaClient } from '@prisma/client'

// Reuse one PrismaClient across hot reloads / serverless invocations to avoid
// exhausting the connection pool.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 4.2 `lib/stripe.ts` — Stripe singleton
Lazily instantiates a single `Stripe` client from `STRIPE_SECRET_KEY`.

### 4.3 `app/api/checkout/route.ts` — create a Stripe Checkout session
Finds or lazily creates the single "Featured Listing" product and its **$40/month recurring
price**, identified by `metadata.app = 'accesshome_featured'` so duplicates are never created.
Creates a `mode: 'subscription'` Checkout Session with `businessId` in `metadata` and
`client_reference_id`, so the webhook can mark the right row featured after payment.
`export const dynamic = 'force-dynamic'` — it needs the runtime request origin.

### 4.4 `app/api/webhooks/stripe/route.ts` — subscription lifecycle
Verifies the signature with `stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET)`
and handles three events:

| Event | Effect |
|-------|--------|
| `checkout.session.completed` | set `featured = true`, `featuredUntil = +1 month`, store Stripe subscription + customer IDs |
| `customer.subscription.updated` | sync `featured` to subscription status, refresh `featuredUntil` from `current_period_end` |
| `customer.subscription.deleted` | clear `featured`, `featuredUntil`, `stripeSubscriptionId` |

**All three must be enabled on the Stripe endpoint.** They were not historically — only
`checkout.session.completed` was, which meant a cancelled subscription never revoked featured
status and the business kept paid placement indefinitely. Fixed 2026-08-18; if you ever recreate
the endpoint, enable all three.

### 4.5 `lib/admin-auth.ts` + `app/api/admin/*` — admin gate

The admin session cookie is a **stateless HMAC-signed token**, not a constant:

```
admin_auth = <expiryMillis>.<hmac-sha256(expiryMillis, ADMIN_SESSION_SECRET)>
```

- `verifySessionToken()` compares the signature in **constant time**, then enforces the expiry —
  so editing the timestamp forward invalidates the signature, and a correctly signed but expired
  token is still rejected.
- `verifyPassword()` compares against `ADMIN_PASSWORD` in constant time.
- Both **fail closed**: if `ADMIN_PASSWORD` or `ADMIN_SESSION_SECRET` is unset, login returns
  `503` rather than authenticating.
- All three admin routes share `isAuthenticated()` — do not re-implement the cookie check inline.

> **Historical note.** Before 2026-08-18 the password was hardcoded in the route file and the cookie
> was the constant string `authenticated`, which every admin route compared against. Anyone who
> read the source could authenticate by setting that cookie. Both are gone. **Never reintroduce a
> constant session value** — this repository is public.

### 4.6 `lib/seo.ts` — structured data (JSON-LD) builders
Exports `getSiteUrl()` — which derives the public origin **from the request headers**
(`x-forwarded-host` / `host`), falling back to the live domain — plus `localBusinessSchema`,
`websiteSchema`, `organizationSchema`, `breadcrumbSchema`, `articleSchema`, `faqSchema`,
`itemListSchema`. Rendered via `components/json-ld.tsx`.

> Because `getSiteUrl()` follows the request host, **the hostname visitors arrive on becomes the
> canonical URL** in the sitemap, JSON-LD and OG tags. This is why the apex must stay the primary
> domain — see §9.

### 4.7 `components/google-analytics.tsx` — GA4
Client component. Loads `gtag.js` via `next/script` using `NEXT_PUBLIC_GA_MEASUREMENT_ID`, with a
`<Suspense>`-wrapped `PageViewTracker` firing a `config` pageview on every App-Router navigation.
Renders nothing if the ID is missing. Mounted in `<head>` of `app/layout.tsx`.

### 4.8 `app/layout.tsx` — root layout
```tsx
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Triad Accessible Homes — Disability-Accessible Home Services',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
      `http://localhost:3000`
  ),
  verification: { google: 'IGa1YmMYc3SM2MKi_phMx0MiGydsHxkzA9MnV8XpDzw' },
  // ...icons, openGraph
};
```

### 4.9 `app/page.tsx` — homepage (server component)
Queries featured businesses, a preview of all businesses, and per-category counts
(`prisma.business.groupBy`), then renders `<JsonLd>` (WebSite + Organization) + `<Header>` +
`<HomeClient>` + `<Footer>`. Prisma objects are passed to client components via
`JSON.parse(JSON.stringify(...))` to strip non-serializable `Date` fields.

### 4.10 `scripts/seed.ts` / `safe-seed.ts`
Idempotent `upsert` seed of the 20 Triad businesses. `slugify(name)` becomes the row `id`.
`safe-seed.ts` refuses to run if `seed.ts` contains `prisma.*.delete`/`deleteMany`, so the seed can
never destroy data. `package.json` wires `prisma.seed` to `safe-seed.ts`.

---

## 5. API & Integrations

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/checkout` | POST | public | Create a Stripe subscription Checkout session |
| `/api/webhooks/stripe` | POST | Stripe signature | Sync `featured` state on payment / renewal / cancellation |
| `/api/admin/auth` | POST / GET / DELETE | signed cookie | Admin login / status / logout |
| `/api/admin/businesses` | GET | signed cookie | List all businesses |
| `/api/admin/toggle-featured` | POST | signed cookie | Manually toggle a business's featured flag |

**Stripe.** Product *"Featured Listing — AccessHome Directory"*, **$40/month recurring (USD)**,
created lazily on first checkout and reused (`metadata.app = 'accesshome_featured'`).
**Keys are LIVE mode → real charges.**

The webhook endpoint is configured at `https://triadaccessiblehomes.com/api/webhooks/stripe`.
Because the endpoint is tied to the **URL**, and the domain did not change during the Vercel
migration, the endpoint and its signing secret carried over untouched.

**Google Analytics 4.** gtag.js via `NEXT_PUBLIC_GA_MEASUREMENT_ID` (currently `G-9Y9C5TK4MR`).

**SEO.** Dynamic `sitemap.ts` (39 URLs: homepage, search, guides, locations, all categories, all
guide & city slugs, all 20 listings) and `robots.ts` (disallows `/admin` and `/api/`). JSON-LD on
every page type. Google Search Console verification token lives in `layout.tsx` metadata and is
registered against the **apex** domain.

---

## 6. State Management & Rendering Model

- **Data fetching:** Server Components query Prisma directly. No REST/GraphQL layer for reads.
- **Interactivity:** Client Components (`*-client.tsx`, `search-bar.tsx`) use React `useState`.
  There is **no** Redux/Zustand/Jotai/Context global store.
- **Theming:** `next-themes` (`defaultTheme="light"`, `enableSystem`).
- **Serialization:** Server → Client props pass through `JSON.parse(JSON.stringify(...))`.
- **SSR safety:** `components/safe-format.tsx` + `components/client-only.tsx` guard against
  hydration mismatches; `eslint.ssr.config.mjs` enforces the rules.
- **`export const dynamic = 'force-dynamic'`** is set on layout, API routes, sitemap and robots, so
  they read the runtime request/host. Consequently **every route is server-rendered on demand** —
  nothing is statically prerendered, and the build does not need database access.

---

## 7. Environment Variables

Create `.env` locally (it is gitignored). Set the same keys in **Vercel → Settings → Environment
Variables** for Production, Preview and Development.

| Variable | Format | How to obtain |
|----------|--------|---------------|
| `DATABASE_URL` | `postgresql://…` | **Injected automatically by the Neon integration** — do not set by hand |
| `DATABASE_URL_UNPOOLED` | `postgresql://…` | Also injected by Neon. Use for `prisma db push` |
| `NEXT_PUBLIC_SITE_URL` | `https://triadaccessiblehomes.com` | The canonical public origin |
| `STRIPE_SECRET_KEY` | `sk_live_…` | Stripe Dashboard → Developers → API keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_…` | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` | Stripe → Webhooks → endpoint → Signing secret |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | GA4 property → Admin → Data streams |
| `ADMIN_PASSWORD` | any strong string | Chosen by you; store in a password manager |
| `ADMIN_SESSION_SECRET` | 64-char hex | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

Notes:
- **This repository is public. Never commit real secrets.** `.env` is gitignored; `.env.example`
  holds placeholders only. Verify with `git check-ignore -v .env` before any first push from a
  fresh clone.
- `NEXT_PUBLIC_*` vars are **inlined into the client bundle at build time**. Changing one in Vercel
  has no effect until you **redeploy** — saving alone is not enough.
- All other vars are server-only and read at runtime.
- `NEXTAUTH_URL` is no longer used anywhere. It was an Abacus-injected variable; `metadataBase`
  now reads `NEXT_PUBLIC_SITE_URL` / `VERCEL_URL`.

---

## 8. Local Setup — spin it up from scratch

Requires **Node 22.x**. `corepack` provides yarn 4.18.0 from the `packageManager` field.

```bash
# 1. Clone and install (yarn only — never npm; the lockfile is yarn's)
git clone https://github.com/Dingo210/triadaccessiblehomes.com.git
cd triadaccessiblehomes.com
corepack enable
yarn install            # postinstall runs `prisma generate`

# 2. Create .env (see §7). Use DATABASE_URL_UNPOOLED for schema work.

# 3. Apply the schema (safe, additive)
yarn prisma db push

# 4. Seed the 20 Triad businesses (idempotent — safe to re-run)
yarn prisma db seed

# 5. Start the dev server → http://localhost:3000
yarn dev
```

| Command | Action |
|---------|--------|
| `yarn dev` | Start Next.js dev server (port 3000) |
| `yarn build` | Production build |
| `yarn start` | Serve the production build |
| `yarn lint` | Run Next.js/ESLint |
| `yarn prisma generate` | Regenerate the Prisma client after schema edits |
| `yarn prisma db push` | Apply schema to the database (additive) |
| `yarn prisma db seed` | Run the guarded seed |

> ⚠️ Never run `prisma db push --force-reset` / `--accept-data-loss` against the production
> database — it wipes tables. Keep schema changes additive/backward-compatible.

---

## 9. Deployment

Hosted on **Vercel**, deployed from GitHub. Pushing to **`main`** triggers a production build.

**Project settings that matter** (Vercel → Settings):

| Setting | Value | Why |
|---------|-------|-----|
| Framework Preset | **Next.js** | If this is unset, Vercel publishes `public/` as a static site and **every route 404s while the build still reports success**. This exact failure occurred during the migration. |
| Root Directory | `./` | The repo root *is* the app |
| Node.js Version | **22.x** | Must match `engines.node`; Node 24 is not tested with Next 14 |
| Build / Install / Output | defaults | No overrides needed |

`package.json` includes `"postinstall": "prisma generate"` — **required**, otherwise Vercel's build
cache can ship a stale or missing Prisma client.

### Domains & DNS

DNS is served by **Vercel's own nameservers** (`ns1/ns2.vercel-dns.com`). The record editor is at
the **team** scope (`vercel.com/<team>/~/domains`), **not** the project's Domains page.

```
@     A   216.198.79.1
www   A   216.198.79.1
```

| Hostname | Role |
|----------|------|
| `triadaccessiblehomes.com` | **Production (canonical)** |
| `www.triadaccessiblehomes.com` | 308 redirect → apex |

> **Keep the apex canonical.** `getSiteUrl()` derives URLs from the request host, so serving on
> `www` would silently rewrite every canonical URL, OG tag and all 39 sitemap entries to a hostname
> Google has not indexed, and the Search Console property is registered against the apex.

### Post-deploy checklist
1. Set all env vars (§7) for all environments; **redeploy** so `NEXT_PUBLIC_*` are inlined.
2. Confirm the Stripe webhook endpoint exists and has **all three** events (§4.4).
3. Verify `/sitemap.xml` emits **apex** URLs, and `/robots.txt` resolves.
4. Confirm the admin gate: a forged `admin_auth=authenticated` cookie must return **401**.
5. Confirm all 15 routes return 200 and TLS is valid on both apex and `www`.

---

## 10. Content & Data Notes

- **8 service categories** (`lib/categories.ts`): home-modifications, mobility-accessibility,
  stair-platform-lifts, bathroom-remodeling, kitchen-bath-remodeling, general-contractors,
  handyman-services, aging-in-place.
- **20 seeded businesses** — real Triad-area providers. Their `website` links point to the
  businesses' own sites; some return 4xx to automated crawlers (they block bots) — expected, not
  an app bug.
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
| `/listing/[id]` | Server | Single business detail + "Get Featured" checkout CTA |
| `/search?q=` | Server | Keyword search across name/description/category |
| `/guides` + `/guides/[slug]` | Server | SEO guide index + articles |
| `/locations` + `/locations/[city]` | Server | City landing index + pages |
| `/admin` | Client-gated | Password login + featured-toggle dashboard |
| `/sitemap.xml`, `/robots.txt` | Dynamic | SEO |

---

## 12. Known Open Items

- **Stripe keys are LIVE and were previously stored in plaintext on the Abacus platform.**
  Rotating them in the Stripe dashboard is advisable; update Vercel env vars and redeploy after.
- **The old Abacus deployment and its database still exist** at time of writing. The Abacus
  database is unreachable from outside their network (its host resolves to RFC1918 private space),
  so no data can be recovered from it — but `scripts/seed.ts` reproduces it exactly (§3).
- `package.json` carries substantial unused dependencies (plotly, maplibre, chart.js, next-auth,
  jotai, zustand, formik…) from the original template. Pruning them would cut install time.
- Prisma 6.7 warns that an implicit generator `output` path is deprecated in Prisma 7. Do not
  upgrade to Prisma 7 casually — it is a breaking major.
