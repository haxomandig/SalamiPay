# SalamiPay Development Report

Generated: March 8, 2026

---

## 1. Completed Features

| # | Feature | Status |
|---|---------|--------|
| 1 | Event creation with slug generation (unicode-safe + random suffix) | Done |
| 2 | Event listing — "My Events" (authenticated) + "All Events" | Done |
| 3 | Contribution form with payment method selection (bKash, Nagad, Stripe, Card) | Done |
| 4 | Real-time contribution updates (Supabase Realtime channels) | Done |
| 5 | Progress bar with completed/pending/remaining totals | Done |
| 6 | Fully funded banner | Done |
| 7 | Admin mode — payment status management (pending/completed/failed) | Done |
| 8 | Dashboard summary — totals by status and payment method | Done |
| 9 | Event edit/delete (owner only, two-step delete confirmation) | Done |
| 10 | CSV export of contributions | Done |
| 11 | Search + filter contributions (by name, payment status) | Done |
| 12 | Sort contributions (date, amount, name, status) with asc/desc toggle | Done |
| 13 | Search events on home page | Done |
| 14 | Pagination — contributions (20/page), events (10/page) | Done |
| 15 | Authentication — email/password via Supabase Auth | Done |
| 16 | RLS policies — ownership enforcement on update/delete | Done |
| 17 | Cascade delete — deleting event removes its contributions | Done |
| 18 | Dark mode — class-based toggle, system preference, localStorage, no flash | Done |
| 19 | QR code generation for event sharing | Done |
| 20 | Event deadlines — optional, disables contributions when expired | Done |
| 21 | Open Graph meta tags for event sharing | Done |
| 22 | Responsive design (mobile-first with `sm:` breakpoints) | Done |
| 23 | Loading skeletons (home page + event page) | Done |
| 24 | Error boundaries (root + event-level) | Done |
| 25 | Custom 404 page | Done |
| 26 | Copy event link button | Done |
| 27 | Unsaved form warning (beforeunload) | Done |
| 28 | Deployed to Vercel with auto-deploy on push | Done |

---

## 2. Database Schema

### Table: `events`

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Not null |
| slug | text | Unique |
| target_amount | numeric | Not null |
| participants | integer | Not null |
| created_by | uuid | Nullable, FK → auth.users(id) |
| deadline | timestamptz | Nullable |
| created_at | timestamp | Default now() |

**Indexes:** `idx_events_created_by` on (created_by)

### Table: `contributions`

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | Primary key |
| event_id | uuid | FK → events(id) ON DELETE CASCADE |
| name | text | Not null |
| amount | numeric | Not null |
| message | text | |
| payment_method | text | Default 'bkash' |
| payment_status | text | Default 'pending' |
| created_at | timestamp | Default now() |

**Indexes:** `idx_contributions_payment_status` on (event_id, payment_status)

### RLS Policies

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| events | Public | Public | Creator only (`auth.uid() = created_by`) | Creator only |
| contributions | Public | Public | Event creator only (via FK join) | Event creator only |

### Migrations (docs/migrations/)

1. `001_add_payment_fields.sql` — payment_method + payment_status columns
2. `002_add_event_ownership.sql` — created_by column + index
3. `003_add_rls_policies.sql` — RLS enable + all policies
4. `004_cascade_delete_contributions.sql` — ON DELETE CASCADE
5. `005_add_event_deadline.sql` — deadline column

---

## 3. Pages Implemented

| Route | Type | Description |
|-------|------|-------------|
| `/` | Client | Home page — search, "My Events" (auth), "All Events", pagination |
| `/create` | Client | Event creation form — name, amount, participants, deadline, validation |
| `/event/[slug]` | Server + Client | Server: metadata/OG tags. Client: full event UI with contributions |
| `/not-found` | Server | Custom 404 page |
| `/error` | Client | Root error boundary with retry |
| `/event/[slug]/error` | Client | Event-specific error boundary with retry |
| `/event/[slug]/loading` | Server | Streaming skeleton for event page |

---

## 4. Components Implemented

| Component | File | Purpose |
|-----------|------|---------|
| `AuthProvider` | components/AuthProvider.tsx | Auth context with `useAuth()` hook, wraps entire app |
| `AuthButton` | components/AuthButton.tsx | Sign in/up dropdown form in nav bar |
| `ContributionForm` | components/ContributionForm.tsx | Contribution submission with payment method selector |
| `ThemeToggle` | components/ThemeToggle.tsx | Dark mode toggle using `useSyncExternalStore` |
| `EventPageClient` | app/event/[slug]/EventPageClient.tsx | Main event page UI (progress, contributions, admin, edit, delete, QR, search, filter, sort, pagination, dashboard, CSV export) |

### Utility Modules

| Module | File | Exports |
|--------|------|---------|
| Supabase client | lib/supabase.ts | `supabase` singleton with env var guard |
| Types | lib/types.ts | `Event`, `Contribution`, `PaymentMethod`, `PaymentStatus`, constants + labels |
| Formatting | lib/format.ts | `formatAmount()` — locale-aware number formatting |

---

## 5. Supabase Queries Used

### Events

| Operation | Query | Location |
|-----------|-------|----------|
| List all events | `.from("events").select("*").order("created_at", { ascending: false })` | app/page.tsx |
| List user's events | `.from("events").select("*").eq("created_by", user.id).order("created_at", { ascending: false })` | app/page.tsx |
| Get event by slug | `.from("events").select("*").eq("slug", slug).single()` | app/event/[slug]/page.tsx |
| Create event | `.from("events").insert([{ name, slug, target_amount, participants, created_by, deadline }]).select()` | app/create/page.tsx |
| Update event | `.from("events").update({ name, target_amount, participants, deadline }).eq("id", eventData.id)` | EventPageClient.tsx |
| Delete event | `.from("events").delete().eq("id", eventData.id)` | EventPageClient.tsx |

### Contributions

| Operation | Query | Location |
|-----------|-------|----------|
| Load contributions | `.from("contributions").select("*").eq("event_id", eventData.id).order("created_at", { ascending: false })` | EventPageClient.tsx |
| Insert contribution | `.from("contributions").insert({ event_id, name, amount, message, payment_method, payment_status: "pending" })` | ContributionForm.tsx |
| Update payment status | `.from("contributions").update({ payment_status: status }).eq("id", contributionId)` | EventPageClient.tsx |

### Realtime

| Event | Filter | Handler | Location |
|-------|--------|---------|----------|
| INSERT | `event_id=eq.${eventData.id}` | Prepend new contribution to list | EventPageClient.tsx |
| UPDATE | `event_id=eq.${eventData.id}` | Replace updated contribution in list | EventPageClient.tsx |

### Auth

| Operation | Method | Location |
|-----------|--------|----------|
| Get session | `supabase.auth.getSession()` | AuthProvider.tsx |
| Listen to auth changes | `supabase.auth.onAuthStateChange()` | AuthProvider.tsx |
| Sign up | `supabase.auth.signUp({ email, password })` | AuthButton.tsx |
| Sign in | `supabase.auth.signInWithPassword({ email, password })` | AuthButton.tsx |
| Sign out | `supabase.auth.signOut()` | AuthButton.tsx |

---

## 6. Remaining MVP Features

| Feature | Priority | Effort |
|---------|----------|--------|
| Actual payment gateway integration (bKash/Nagad/Stripe APIs) | High | Large |
| Email notifications on new contributions | Medium | Medium |
| Social auth providers (Google, GitHub) | Medium | Small |
| Server-side pagination (`.range()` queries) | Medium | Medium |
| Contribution receipts (downloadable/printable) | Low | Medium |
| Currency selector (BDT, USD, etc.) | Low | Small |
| Rate limiting on contribution submissions | Low | Small |
| PWA support (service worker, installable) | Low | Medium |

---

## 7. Bugs & Technical Debt

### Bugs

| Issue | Severity | Location |
|-------|----------|----------|
| CSV export doesn't escape newlines in message field — can break CSV format | Low | EventPageClient.tsx:167 |
| Slug collision theoretically possible (6-char suffix = ~2.2B combos, no DB uniqueness check in code) | Low | create/page.tsx:64 |

### Technical Debt

| Issue | Severity | Location |
|-------|----------|----------|
| **EventPageClient.tsx is 560+ lines** — should be decomposed into DashboardSummary, ContributionList, EditForm, DeleteConfirm, ShareTools sub-components | Medium | EventPageClient.tsx |
| **No tests** — no unit, integration, or e2e tests exist | Medium | Entire project |
| **No `.env.example`** — required env vars not documented outside CLAUDE.md | Low | Root |
| **Inconsistent import style** — mix of `@/*` path alias and relative imports | Low | Various |
| **All data fetched client-side** — home page and contributions load all records, no server-side pagination | Low | page.tsx, EventPageClient.tsx |
| **No input length limits** — event name, contribution name, and message have no max length | Low | create/page.tsx, ContributionForm.tsx |
| **`formatAmount()` locale-dependent** — uses browser locale, may show different formats for different users | Low | lib/format.ts |

---

## 8. Production Readiness Score

### Scoring Breakdown

| Category | Score | Max | Notes |
|----------|-------|-----|-------|
| **Core functionality** | 25 | 25 | All CRUD operations, realtime, auth, admin mode working |
| **Security** | 12 | 15 | RLS policies, auth, ownership checks. Missing: rate limiting, input sanitization, CSRF |
| **Error handling** | 8 | 10 | Error boundaries, loading states. Missing: consistent Supabase error feedback to users |
| **UI/UX** | 13 | 15 | Dark mode, responsive, skeletons, pagination, search/filter/sort. Missing: toast notifications |
| **Testing** | 0 | 15 | No tests exist |
| **Code quality** | 8 | 10 | TypeScript strict, React Compiler compliant, conventions followed. Debt: large component, no .env.example |
| **Deployment** | 9 | 10 | Deployed to Vercel, auto-deploy on push. Missing: staging environment |

### **Total: 75 / 100**

**Assessment:** The application is a functional MVP with a solid feature set, proper auth/RLS security, and good UX polish. The main gaps are the complete absence of tests (0/15), lack of rate limiting, and the need to decompose the large EventPageClient component. Adding a test suite and basic rate limiting would bring the score to 85+.

---

## Appendix: File Inventory

```
app/
├── globals.css              — Tailwind v4 config + dark mode variant
├── layout.tsx               — Root layout (nav, auth, theme, footer)
├── page.tsx                 — Home page (events listing)
├── error.tsx                — Root error boundary
├── not-found.tsx            — Custom 404
├── create/
│   └── page.tsx             — Event creation form
└── event/[slug]/
    ├── page.tsx             — Server component (metadata + fetch)
    ├── EventPageClient.tsx  — Client component (all event UI)
    ├── loading.tsx          — Streaming skeleton
    └── error.tsx            — Event error boundary

components/
├── AuthProvider.tsx          — Auth context + useAuth hook
├── AuthButton.tsx            — Sign in/up dropdown
├── ContributionForm.tsx      — Contribution submission form
└── ThemeToggle.tsx           — Dark mode toggle

lib/
├── supabase.ts              — Supabase client singleton
├── types.ts                 — Shared TypeScript types
└── format.ts                — Number formatting utility

docs/
├── AI_WORKFLOW.md           — Development process documentation
└── migrations/
    ├── 001_add_payment_fields.sql
    ├── 002_add_event_ownership.sql
    ├── 003_add_rls_policies.sql
    ├── 004_cascade_delete_contributions.sql
    └── 005_add_event_deadline.sql
```
