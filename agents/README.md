# SalamiPay Agent Directory

This directory contains 10 specialized agent markdown files for SalamiPay - an event-based group contribution platform built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Supabase (PostgreSQL).

## Agent Overview

All agents report to **Master Agent (master-001)** and serve **Owner: Imtiaz (haxoman22@gmail.com)**

| Agent ID     | Agent Name                    | Focus Area                              | Lines | Key Responsibilities                    |
|--------------|-------------------------------|----------------------------------------|-------|------------------------------------------|
| sec-001      | Security Agent                | Authentication, RLS, OWASP Top 10      | 192   | Auth auditing, vulnerability scanning   |
| test-001     | Test Coverage Agent           | Unit/Integration/E2E testing            | 262   | 80% coverage, 5+ E2E flows              |
| devops-001   | DevOps Agent                  | CI/CD, deployments, monitoring          | 285   | Vercel, uptime monitoring, error tracking |
| perf-001     | Performance Agent             | Core Web Vitals, bundle optimization    | 334   | LCP <2.5s, bundle <200KB                |
| db-001       | Database Agent                | Schema, migrations, indexes, RLS        | 401   | PostgreSQL design, query optimization   |
| ux-001       | UX Audit Agent                | WCAG 2.1 AA, mobile, responsive        | 391   | Accessibility, Bangladesh market focus  |
| analytics-001 | Analytics Agent              | KPI tracking, funnels, cohorts          | 414   | DAU/MAU, events/day, completion rates   |
| growth-001   | Growth Agent                  | Viral loops, funnel analysis, SEO       | 482   | K-factor >1.3, share optimization      |
| feat-001     | Feature Planning Agent        | ICE scoring, roadmaps, dependencies     | 447   | User stories, acceptance criteria      |
| i18n-001     | Localization Agent            | Bangla support, currency, formatting    | 505   | বাংলা translation, BDT currency       |

**Total: 3,713 lines of specialized agent documentation**

## Quick Navigation

### Critical Infrastructure (Security, DevOps, Performance)
- [Security_Agent.md](Security_Agent.md) - Auth, RLS policies, OWASP compliance, Turnstile CAPTCHA
- [DevOps_Agent.md](DevOps_Agent.md) - Vercel CI/CD, uptime monitoring, Sentry error tracking
- [Performance_Agent.md](Performance_Agent.md) - Core Web Vitals, Lighthouse audits, bundle size

### Data & Storage (Database)
- [Database_Agent.md](Database_Agent.md) - PostgreSQL via Supabase, migrations (001-006+), indexes, RLS

### Quality Assurance (Testing, UX)
- [Test_Coverage_Agent.md](Test_Coverage_Agent.md) - Jest, React Testing Library, Playwright E2E
- [UX_Audit_Agent.md](UX_Audit_Agent.md) - WCAG 2.1 AA, mobile responsive, WhatsApp/Facebook optimization

### Business Intelligence (Analytics, Growth)
- [Analytics_Agent.md](Analytics_Agent.md) - KPI dashboards, cohort analysis, anomaly detection
- [Growth_Agent.md](Growth_Agent.md) - Viral loops, K-factor tracking, SEO, social sharing

### Product Development (Feature Planning, Localization)
- [Feature_Planning_Agent.md](Feature_Planning_Agent.md) - ICE scoring, user stories, roadmaps
- [Localization_Agent.md](Localization_Agent.md) - Bangla translation, next-intl, BDT formatting

## Technology Stack Summary

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, TypeScript, Tailwind CSS 4
- **Testing:** Jest, React Testing Library, Playwright

### Backend & Data
- **Database:** Supabase (PostgreSQL 13+)
- **Authentication:** Supabase Auth (email/password, email verification)
- **Realtime:** Supabase Realtime channels (for contribution updates)

### Infrastructure
- **Hosting:** Vercel (production & staging)
- **CI/CD:** GitHub Actions + Vercel deployments
- **Monitoring:** Sentry (error tracking), Vercel Analytics (RUM)
- **Security:** Cloudflare WAF, Turnstile CAPTCHA, RLS policies

### Localization
- **Framework:** next-intl
- **Target Languages:** English (en), Bangla (bn)
- **Currency:** BDT (Bangladeshi Taka)
- **Timezone:** Asia/Dhaka (GMT+6)

## Key Business Metrics

### Platform Metrics
- **DAU Target:** 1,000+ daily active users
- **Events/Day:** 50+ new events
- **Contributions/Day:** 500+ contributions
- **Completion Rate:** 10+ contributions per event
- **K-Factor Target:** >1.3 (viral growth)

### Quality Metrics
- **Test Coverage:** 80% utilities, 60% components
- **Uptime SLA:** 99.5%+
- **Lighthouse Score:** ≥90 (performance)
- **WCAG Compliance:** 2.1 AA level
- **Core Web Vitals:** LCP <2.5s, FID <100ms, CLS <0.1

### Business Metrics
- **Conversion Rate:** Landing → Signup: 15%+
- **Signup → Event Creator:** 60%+
- **Share → Contribution:** 30%+
- **Monthly Growth:** 15-20% MoM
- **Translation Completeness:** 100% (EN + BN)

## Agent Reporting Cadence

- **Daily:** Test results (test-001), DevOps deployments (devops-001)
- **Weekly:** Security audit (sec-001), Performance report (perf-001), Analytics KPIs (analytics-001)
- **Monthly:** Database health (db-001), Growth trends (growth-001), UX compliance (ux-001)
- **Quarterly:** Feature planning roadmap (feat-001), Localization progress (i18n-001)

## Key Procedures

### Deployment Pipeline (DevOps)
```
Push to feature branch → Automated tests → Vercel preview → Manual QA → Merge to main → Production deploy → Monitoring
```

### Feature Development Workflow (Feature Planning + Growth)
```
Ideate → ICE Score → User Story → Acceptance Criteria → Pre-Mortem → Build → Test → Analytics tracking → Launch
```

### Localization Workflow (Localization Agent)
```
Extract strings → Translate (Bangla) → Review by native speaker → Format/currency tests → QA across locales → Deploy
```

## Access & Invocation

All agents can be invoked via their invocation commands documented in each file. Example:

```bash
# Security audit
sec-001 --audit-checklist --output=json

# Test coverage report
test-001 --scenario="full_journey" --verbose

# Deploy to production
devops-001 --rollback --version=v1.2.2 --confirm

# Growth analysis
growth-001 --k-factor --period=week --output=chart
```

## Domain Information

| Domain             | Purpose                              |
|--------------------|--------------------------------------|
| `salamipay.com`    | Homepage, landing page, public events |
| `salamipay.app`    | Owned domain (redirects)             |
| `app.salamipay.com`| Next.js application (Vercel hosted)  |

## Contact

**Owner:** Imtiaz (haxoman22@gmail.com)  
**Master Agent:** master-001  
**Support Email:** support@salamipay.com  
**Privacy Email:** privacy@salamipay.com  

---

Last Updated: 2026-03-08
