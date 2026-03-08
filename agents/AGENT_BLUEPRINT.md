# SalamiPay Agent Blueprint

> The complete agent ecosystem required to build, ship, scale, and operate SalamiPay as a world-class startup.

---

## Agent Architecture Overview

```
                              ┌─────────────────────────┐
                              │    MASTER AGENT         │
                              │    (Orchestrator)       │
                              │    master-001           │
                              └───────────┬─────────────┘
                                          │
                ┌─────────────────────────┼─────────────────────────┐
                │                         │                         │
      ┌─────────┴──────────┐   ┌─────────┴──────────┐   ┌─────────┴──────────┐
      │  ENGINEERING LAYER │   │  PRODUCT LAYER     │   │  BUSINESS LAYER    │
      │                    │   │                    │   │                    │
      │  • CI Agent        │   │  • UX Agent        │   │  • Growth Agent    │
      │  • Security Agent  │   │  • Feature Agent   │   │  • Analytics Agent │
      │  • Performance     │   │  • Localization    │   │  • Compliance Agent│
      │  • Test Agent      │   │                    │   │  • DevOps Agent    │
      │  • Database Agent  │   │                    │   │                    │
      └────────────────────┘   └────────────────────┘   └────────────────────┘
```

---

## Complete Agent Registry

### LAYER 1 — ENGINEERING (Build it right)

These agents ensure the codebase is solid, secure, fast, and well-tested.

---

#### 1. Continuous Improvement Agent `ci-001` — ACTIVE
- **File:** `Continuous_Improvement_Agent.md`
- **Domain:** Code quality, patterns, tech debt, learning
- **Why SalamiPay needs it:** Your 555-line EventPageClient.tsx and 5 open tech debt items need a system that tracks and reduces debt over time, not just one-off fixes.
- **Key actions:** Post-session analysis, tech debt register, pattern library, trend tracking

---

#### 2. Security Agent `sec-001` — TO BUILD
- **File:** `Security_Agent.md`
- **Domain:** Authentication, authorization, input sanitization, RLS policies, vulnerability scanning
- **Why SalamiPay needs it:** You handle user auth, financial pledges, and personal data. Your launch checklist already flagged missing CSRF tokens. As a payments-adjacent platform, security is existential.
- **Key responsibilities:**
  - Audit Supabase RLS policies on every migration
  - Scan for XSS vectors in contribution messages and event names
  - Validate that `created_by` ownership is enforced on all admin actions
  - Monitor auth flows (signup, login, password reset, email verification)
  - Check for exposed environment variables or API keys
  - Ensure rate limiting (5/event/min DB trigger, 30s client cooldown) is not bypassable
  - OWASP Top 10 checklist against the SalamiPay surface area
- **Triggered by:** Any change to `components/AuthButton.tsx`, `components/AuthProvider.tsx`, `lib/supabase.ts`, `docs/migrations/`, or RLS policies

---

#### 3. Performance Agent `perf-001` — TO BUILD
- **File:** `Performance_Agent.md`
- **Domain:** Page load speed, bundle size, database query efficiency, Core Web Vitals
- **Why SalamiPay needs it:** Your launch checklist flagged that all data is fetched client-side with `select("*")` — this will collapse at scale. Event pages with 500+ contributions will crawl.
- **Key responsibilities:**
  - Monitor bundle size after each build (`npm run build` output)
  - Flag N+1 query patterns in Supabase calls
  - Audit `select("*")` usage — recommend column-specific selects
  - Track Lighthouse scores (Performance, Accessibility, Best Practices, SEO)
  - Recommend pagination for events list and contribution lists
  - Monitor Supabase Realtime subscription efficiency
  - Identify render-blocking resources and unnecessary re-renders
- **Metrics tracked:** First Contentful Paint, Largest Contentful Paint, Time to Interactive, bundle size (KB), Supabase query count per page

---

#### 4. Test Coverage Agent `test-001` — TO BUILD
- **File:** `Test_Coverage_Agent.md`
- **Domain:** Unit tests, integration tests, E2E tests, coverage metrics
- **Why SalamiPay needs it:** Your launch score was 5/10 on testing. You have unit tests for `formatAmount`, `generateSlug`, `buildCSV` — but zero component tests, zero integration tests, zero E2E tests. Any refactor of EventPageClient.tsx is a minefield without tests.
- **Key responsibilities:**
  - Track test coverage percentage after each session
  - Identify untested code paths (especially in `app/create/page.tsx`, `EventPageClient.tsx`)
  - Generate test scaffolds for new components and functions
  - Ensure critical user flows have E2E coverage:
    - Sign up → verify email → sign in
    - Create event → share link → receive contribution
    - Contribution submission → realtime update → progress bar
    - Owner: edit event → delete event → export CSV
  - Recommend test framework setup (Playwright/Cypress for E2E)
  - Flag regressions when test counts drop
- **Minimum targets:** 80% utility coverage, 60% component coverage, 5+ E2E flows

---

#### 5. Database Agent `db-001` — TO BUILD
- **File:** `Database_Agent.md`
- **Domain:** Schema design, migrations, indexes, RLS policies, query optimization
- **Why SalamiPay needs it:** You have 6 migrations already. As you add features (receipts, notifications, analytics, payment gateway), the schema will grow. Bad migrations are catastrophic in production.
- **Key responsibilities:**
  - Review every new migration for backward compatibility
  - Ensure migration numbering is sequential and gap-free
  - Audit indexes on high-query columns (`events.slug`, `contributions.event_id`)
  - Validate RLS policies match business logic (owner-only admin actions)
  - Monitor table growth patterns (is `contributions` growing faster than expected?)
  - Recommend schema changes for planned features (payments table, users table, event_admins)
  - Check for missing foreign keys, orphaned records, constraint gaps
  - Audit `ON DELETE CASCADE` implications before schema changes
- **Triggered by:** Any change to `docs/migrations/`, new feature requiring DB changes

---

### LAYER 2 — PRODUCT (Build the right thing)

These agents ensure SalamiPay delivers a great user experience and evolves based on real needs.

---

#### 6. UX Audit Agent `ux-001` — TO BUILD
- **File:** `UX_Audit_Agent.md`
- **Domain:** Accessibility, mobile responsiveness, user flows, design consistency
- **Why SalamiPay needs it:** Your target users share event links on WhatsApp and Facebook in Bangladesh — mobile-first is non-negotiable. Your launch checklist noted missing favicon and toast notifications.
- **Key responsibilities:**
  - Audit every page for WCAG 2.1 AA compliance (color contrast, keyboard nav, screen readers)
  - Test responsive layouts at key breakpoints (320px, 375px, 768px, 1024px, 1440px)
  - Map and validate all user flows end-to-end:
    - First-time visitor flow (land → understand → contribute)
    - Organizer flow (sign up → create → share → manage)
    - Return visitor flow (sign in → my events → manage)
  - Audit loading states (skeleton screens, spinners, disabled buttons during async)
  - Check error states (what does the user see when things fail?)
  - Audit share experience (Open Graph previews, WhatsApp/Facebook rendering)
  - Review form UX (validation feedback, field ordering, mobile keyboard types)
  - Recommend toast notifications, success animations, empty states

---

#### 7. Feature Planning Agent `feat-001` — TO BUILD
- **File:** `Feature_Planning_Agent.md`
- **Domain:** Feature prioritization, requirements, user stories, roadmap
- **Why SalamiPay needs it:** Your AI_TASKS.md has 9 items with no clear prioritization framework. Which feature will move the needle most? PDF receipts? Email notifications? Payment gateway? You need a system to decide.
- **Key responsibilities:**
  - Maintain a prioritized feature backlog with impact/effort scores
  - Write user stories for each feature before implementation
  - Define acceptance criteria so you know when a feature is done
  - Map features to business goals (acquisition, retention, monetization)
  - Identify feature dependencies (e.g., payment gateway needs payments table first)
  - Run pre-mortems: "What could go wrong if we ship this?"
  - Track feature requests and group them into themes
  - Assess build-vs-buy decisions (e.g., build notifications or use a service?)
- **Prioritization framework:** ICE Score (Impact × Confidence × Ease) for every feature

---

#### 8. Localization Agent `i18n-001` — TO BUILD
- **File:** `Localization_Agent.md`
- **Domain:** Internationalization, translation, currency, locale
- **Why SalamiPay needs it:** Your primary market is Bangladesh (bKash, Nagad are Bangladeshi payment methods). The UI should support Bangla (বাংলা). Your AI_TASKS.md already lists "currency selector" as medium priority.
- **Key responsibilities:**
  - Set up i18n framework (next-intl or similar for Next.js App Router)
  - Extract all hardcoded strings into translation files
  - Support BDT (৳) as primary currency with USD/EUR options
  - Handle right-to-left layouts if needed for future markets
  - Localize date formats, number formats, and currency display
  - Ensure `formatAmount()` respects locale settings
  - Translation management workflow (who translates, how to update)

---

### LAYER 3 — BUSINESS (Make it a startup)

These agents handle the non-code aspects that separate a side project from a world-class startup.

---

#### 9. Growth Agent `growth-001` — TO BUILD
- **File:** `Growth_Agent.md`
- **Domain:** User acquisition, retention, viral loops, SEO, conversion
- **Why SalamiPay needs it:** SalamiPay has a natural viral loop (organizer shares event → contributors visit → some become organizers). This needs to be measured and optimized.
- **Key responsibilities:**
  - Define and track the growth funnel:
    - Visit → Contribute (contributor conversion)
    - Visit → Sign Up (organizer conversion)
    - Sign Up → Create Event (activation)
    - Create Event → Share (viral trigger)
    - Shared Link → New Visit (viral loop completion)
  - SEO audit: meta tags, Open Graph, structured data, sitemap
  - Optimize share experience (WhatsApp preview, Facebook card, Twitter card)
  - Recommend referral mechanics (e.g., "Powered by SalamiPay" on event pages)
  - Track K-factor (viral coefficient): how many new users does each user bring?
  - Identify drop-off points in the contribution flow
  - Recommend onboarding improvements for first-time organizers

---

#### 10. Analytics Agent `analytics-001` — TO BUILD
- **File:** `Analytics_Agent.md`
- **Domain:** Product analytics, event tracking, dashboards, metrics
- **Why SalamiPay needs it:** You currently have zero visibility into how people use SalamiPay. How many events are created per day? What's the average contribution? How many events reach their target? You're flying blind.
- **Key responsibilities:**
  - Define key product metrics (KPIs):
    - DAU/MAU, events created/day, contributions/day
    - Average event target, average contribution size
    - Event completion rate (% that reach target)
    - Time to target (how fast events fill up)
    - Contributor-to-organizer conversion rate
  - Set up analytics tracking (Supabase queries, or PostHog/Mixpanel integration)
  - Build an internal analytics dashboard (React artifact or admin page)
  - Define and monitor cohort retention
  - Set up alerts for anomalies (sudden spike in signups, drop in contributions)
  - Provide weekly metrics summary to the Master Agent

---

#### 11. Compliance & Legal Agent `legal-001` — TO BUILD
- **File:** `Compliance_Agent.md`
- **Domain:** Privacy law, financial regulations, terms of service, data handling
- **Why SalamiPay needs it:** You're handling personal names, email addresses, and financial pledges. You already have `/privacy` and `/terms` pages, but as you approach real payment integration (bKash, Nagad, Stripe), regulatory requirements will escalate.
- **Key responsibilities:**
  - Audit data collection against privacy policy claims
  - Ensure GDPR/BDPA compliance (Bangladesh Data Protection Act)
  - Review terms of service when features change
  - Assess regulatory requirements for payment gateway integration
  - Ensure data deletion capabilities exist (user requests to remove their data)
  - Review third-party service agreements (Supabase, Vercel, payment providers)
  - Monitor for changes in fintech regulations relevant to Bangladesh
  - Ensure contribution data visibility rules match privacy commitments

---

#### 12. DevOps & Infrastructure Agent `devops-001` — TO BUILD
- **File:** `DevOps_Agent.md`
- **Domain:** CI/CD, deployment, monitoring, uptime, environment management
- **Why SalamiPay needs it:** You deploy via Vercel auto-deploy from GitHub. But you have no staging environment, no monitoring, no alerting, and no rollback strategy. One bad deploy could take down production.
- **Key responsibilities:**
  - Set up staging/preview environment (Vercel preview deployments)
  - Define deployment checklist (build passes, lint clean, tests pass, migrations applied)
  - Set up uptime monitoring (is salamipay.com and app.salamipay.com responding?)
  - Configure error tracking (Sentry or similar)
  - Set up alerts for 5xx errors, Supabase downtime, auth failures
  - Manage environment variables across environments (dev, staging, prod)
  - Document rollback procedure (how to revert a bad deploy)
  - Monitor Supabase usage limits (API calls, storage, bandwidth)
  - Ensure `.env.example` stays current with required variables

---

## Build Priority & Phasing

Based on where SalamiPay is today (86/100 launch score, live on Vercel, core features working), here's the recommended build order:

```
PHASE 1 — Foundation (Week 1-2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Already built:
  ✅ Master Agent (master-001)
  ✅ Continuous Improvement Agent (ci-001)

Build next (critical for stability):
  🔴 Security Agent (sec-001)         — you handle auth + financial data
  🔴 Test Coverage Agent (test-001)   — you're at 5/10, need safety net
  🔴 DevOps Agent (devops-001)        — one bad deploy = downtime

PHASE 2 — Quality (Week 3-4)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🟡 Performance Agent (perf-001)     — select("*") will break at scale
  🟡 Database Agent (db-001)          — new features need schema changes
  🟡 UX Audit Agent (ux-001)          — mobile-first for BD market

PHASE 3 — Growth (Week 5-6)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🟢 Analytics Agent (analytics-001)  — can't grow what you can't measure
  🟢 Growth Agent (growth-001)        — optimize the viral loop
  🟢 Feature Planning Agent (feat-001)— prioritize what to build next

PHASE 4 — Scale (Week 7-8)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🔵 Localization Agent (i18n-001)    — Bangla support for BD market
  🔵 Compliance Agent (legal-001)     — needed before payment integration
```

---

## Agent Interaction Map

```
Growth ──────────▶ Analytics ─────────▶ Feature Planning
  │                    │                       │
  │                    ▼                       ▼
  │              Master Agent ◀──────── Continuous Improvement
  │                    │
  ▼                    ├──────────▶ Security
UX Audit               ├──────────▶ Performance
  │                    ├──────────▶ Test Coverage
  │                    ├──────────▶ Database
  ▼                    ├──────────▶ DevOps
Localization           └──────────▶ Compliance
```

**Key feedback loops:**
- **Security ↔ Database** — RLS policies depend on schema design
- **Performance ↔ Database** — Slow queries need index/schema fixes
- **Test Coverage ↔ CI Agent** — Tests validate improvements, CI tracks coverage trends
- **Growth ↔ Analytics** — Growth experiments need analytics to measure impact
- **Feature Planning ↔ UX Audit** — Features must pass UX review before shipping
- **Compliance ↔ Security** — Legal requirements drive security controls
- **DevOps ↔ All** — Every agent's recommendations get deployed through DevOps

---

## Summary

| #  | Agent                      | ID           | Layer       | Status    | Priority |
|----|----------------------------|--------------|-------------|-----------|----------|
| 1  | Master Agent               | master-001   | Core        | ACTIVE    | —        |
| 2  | Continuous Improvement     | ci-001       | Engineering | ACTIVE    | —        |
| 3  | Security Agent             | sec-001      | Engineering | TO BUILD  | Phase 1  |
| 4  | Test Coverage Agent        | test-001     | Engineering | TO BUILD  | Phase 1  |
| 5  | DevOps Agent               | devops-001   | Business    | TO BUILD  | Phase 1  |
| 6  | Performance Agent          | perf-001     | Engineering | TO BUILD  | Phase 2  |
| 7  | Database Agent             | db-001       | Engineering | TO BUILD  | Phase 2  |
| 8  | UX Audit Agent             | ux-001       | Product     | TO BUILD  | Phase 2  |
| 9  | Analytics Agent            | analytics-001| Business    | TO BUILD  | Phase 3  |
| 10 | Growth Agent               | growth-001   | Business    | TO BUILD  | Phase 3  |
| 11 | Feature Planning Agent     | feat-001     | Product     | TO BUILD  | Phase 3  |
| 12 | Localization Agent         | i18n-001     | Product     | TO BUILD  | Phase 4  |
| 13 | Compliance Agent           | legal-001    | Business    | TO BUILD  | Phase 4  |

**Total: 13 agents across 3 layers to run SalamiPay as a world-class startup.**

---

*This blueprint is a living document. As agents are built, update the Status column and register them in the Master Agent.*
