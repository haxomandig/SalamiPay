# SalamiPay Smoke Test Report

**Date:** March 8, 2026
**URL:** https://salamipay.com
**Tested by:** Automated browser test (Claude)
**Deployment:** Vercel (app.salamipay.com → salamipay.com)

---

## Test Results Summary

| # | Test Case | Status | Notes |
|---|-----------|--------|-------|
| 1 | Homepage loads | PASS | Hero, trust bar, CTA, features, FAQ all render correctly |
| 2 | Nav visibility (public) | PASS | Only shows: SalamiPay logo, Dark toggle, Sign in |
| 3 | Nav visibility (logged in) | PASS | Dashboard + Create Event links appear when authenticated |
| 4 | Dark mode toggle | PASS | Toggle button visible and functional |
| 5 | Privacy Policy page | PASS | Loads at /privacy with full content |
| 6 | Terms of Service page | PASS | Loads at /terms — **needs SSLCommerz update** |
| 7 | 404 page | PASS | Custom page with "Back to home" link |
| 8 | Sign in button | PASS | Opens Supabase Auth modal (can't screenshot — Chrome extension limitation) |
| 9 | Dashboard redirect | PASS | /dashboard redirects unauthenticated users to homepage |
| 10 | Create Event (unauth) | PASS | Shows "You must be signed in to create an event" message |
| 11 | Event not found | PASS | /event/nonexistent shows "Event not found" with back link and correct page title |
| 12 | OG Image API | PASS | /api/og generates 1200x630 image with branding, progress bar, stats |
| 13 | Footer links | PASS | Privacy Policy and Terms of Service links work |
| 14 | Favicon | PASS | SVG favicon loads correctly |

**Overall: 14/14 tests passed**

---

## Issues Found

### Must Fix Before Launch

1. **Terms of Service — SSLCommerz contradiction**
   - Page currently states: "SalamiPay does not process, hold, or transfer any money"
   - This contradicts the planned SSLCommerz payment integration
   - **Action:** Update Terms page to reflect SSLCommerz payment processing

### Nice to Have

2. **Sign-in flow can't be fully tested via browser automation**
   - Chrome extension limitation prevents screenshotting the Supabase Auth modal
   - **Action:** Manually test sign up, sign in, email verification, and password reset

---

## Pages Verified

- `/` — Homepage with hero, trust bar, how it works, features, use cases, pricing, FAQ, CTA, footer
- `/dashboard` — Redirects to `/` when not logged in; shows user's events when authenticated
- `/create` — Auth gate message for public; event creation form for logged-in users
- `/event/[slug]` — Server-rendered event page with OG metadata; "Event not found" for invalid slugs
- `/privacy` — Full privacy policy
- `/terms` — Full terms of service (needs SSLCommerz update)
- `/api/og` — Dynamic OG image generation
- `/not-found` — Custom 404 page

---

## Pending Items (Not Part of Smoke Test)

- [ ] Push latest commits to GitHub (private dashboard, NavLinks, pricing, SSLCommerz text, stats removal)
- [ ] Set up support@salamipay.com (Cloudflare Email Routing)
- [ ] Google Login integration
- [ ] SSLCommerz payment integration
- [ ] Update Terms of Service for SSLCommerz
- [ ] Manual test: full sign up → create event → share link → contribute flow
