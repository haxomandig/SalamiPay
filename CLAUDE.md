# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start development server (http://localhost:3000)
- `npm run build` — Production build
- `npm run lint` — Run ESLint
- `npm run test` — Run Jest unit tests
- `npm run test:watch` — Run tests in watch mode
- `npm start` — Start production server

## Domains & Hosting

| Domain             | Purpose                                      |
|--------------------|----------------------------------------------|
| `salamipay.com`    | Homepage / landing page, public event links  |
| `salamipay.app`    | Owned domain (redirects to salamipay.com)    |
| `app.salamipay.com`| Next.js application (hosted on Vercel)       |

- Public event URLs: `salamipay.com/{event-slug}` (e.g. `salamipay.com/batch-iftar-52`)
- Contact emails: `support@salamipay.com`, `privacy@salamipay.com`

## Architecture

SalamiPay is an event-based group payment platform for collecting contributions ("Salami") through shareable event pages. Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, and Supabase (PostgreSQL).

### Key directories

- `app/page.tsx` — Home page with "My Events" (signed-in) and "All Events" listing
- `app/create/page.tsx` — Event creation form with validation, requires auth (client component)
- `app/event/[slug]/page.tsx` — Server component for metadata (Open Graph) and event fetching
- `app/event/[slug]/EventPageClient.tsx` — Client component with progress bar, realtime contributions, share button, search/filter, owner controls (edit, delete, CSV export, payment admin)
- `app/event/[slug]/loading.tsx` — Streaming skeleton for event page
- `app/event/[slug]/error.tsx` — Event-specific error boundary
- `app/error.tsx` — Root error boundary
- `app/privacy/page.tsx` — Privacy policy (server component)
- `app/terms/page.tsx` — Terms of service (server component)
- `app/not-found.tsx` — Custom 404 page
- `components/AuthProvider.tsx` — Auth context with `useAuth()` hook (wraps app in layout)
- `components/AuthButton.tsx` — Sign in/up dropdown in nav bar
- `components/ContributionForm.tsx` — Contribution submission form
- `lib/supabase.ts` — Supabase client singleton (with env var guard)
- `lib/types.ts` — Shared TypeScript types (`Event`, `Contribution`)
- `lib/format.ts` — Number formatting utility (`formatAmount`)
- `lib/csv.ts` — CSV export builder (`buildCSV`)
- `lib/slug.ts` — Slug generation (`generateSlug`, `generateBaseSlug`)
- `lib/__tests__/` — Unit tests for format, slug, csv utilities
- `docs/migrations/` — SQL migrations (run manually in Supabase dashboard, 001–006)
- `docs/` — Architecture, workflow documentation, and launch checklist

### Data flow

The event page uses a server/client split: `page.tsx` (server) fetches the event for metadata and passes it to `EventPageClient.tsx` (client) for interactive UI. Other pages use client-side Supabase queries directly. Contributions update in realtime via Supabase channel subscriptions (requires Realtime enabled on the `contributions` table in Supabase dashboard).

### Database tables

- **events** — `id`, `name` (max 200), `slug`, `target_amount` (1–10M), `participants` (1–10K), `created_by` (uuid, required for insert), `deadline` (nullable), `created_at`
- **contributions** — `id`, `event_id`, `name` (max 100), `amount` (1–10M), `message` (max 500), `payment_method`, `payment_status`, `created_at`

Events are looked up by `slug` (derived from event name with a random suffix for uniqueness, e.g. `batch-reunion-x7k2m9`). Contributions reference `event_id` with `ON DELETE CASCADE`. Auth uses Supabase Auth (email/password with email verification) — event creators are tracked via `created_by` and only they see admin controls (edit, delete, payment status management, CSV export). RLS policies enforce ownership on the server side. Event creation requires authentication. Contributions have a DB-level rate limit (5/event/minute) and client-side cooldown (30s).

### Environment variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase_anon_key>
```

### Validation constraints

All inputs are validated both client-side (HTML attributes + JS checks) and server-side (DB `CHECK` constraints in migration 006):
- Event name: max 200 chars
- Contributor name: max 100 chars
- Message: max 500 chars
- Amounts: 1–10,000,000
- Participants: 1–10,000

### Conventions

- Styling uses Tailwind CSS utility classes with responsive breakpoints (`p-4 sm:p-10`)
- Navigation uses Next.js `<Link>` and `useRouter` for client-side transitions
- Shared types live in `lib/types.ts` — import from there, don't define inline
- Format amounts with `formatAmount()` from `lib/format.ts`
- React Compiler is enabled — avoid calling setState-wrapping functions directly in useEffect bodies
- Path alias `@/*` maps to project root
- Unit tests live in `lib/__tests__/` — run with `npm test`
- SalamiPay is a pledge-tracking platform, not a payment processor — contributions record intent, not transactions
