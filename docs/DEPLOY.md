# SalamiPay MVP Deployment Guide

**Target:** Live by end of week (March 2026)
**Stack:** Next.js 16 on Vercel + Supabase (PostgreSQL + Auth + Realtime)
**Domains:** `salamipay.com` (homepage + event links), `app.salamipay.com` (Next.js app), `salamipay.app` (redirect)

---

## Step 1: Supabase Setup (15 minutes)

### 1.1 Create Project
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Name: `salamipay-production`
4. Region: Choose closest to Bangladesh (Singapore `ap-southeast-1` recommended)
5. Set a strong database password — save it somewhere secure

### 1.2 Run Migrations
Go to **SQL Editor** in Supabase Dashboard and run these files **in order**, one at a time:

```
docs/migrations/000_initial_schema.sql      ← Creates events + contributions tables
docs/migrations/001_add_payment_fields.sql   ← Adds payment_method, payment_status
docs/migrations/002_add_event_ownership.sql  ← Adds created_by (auth.users FK)
docs/migrations/003_add_rls_policies.sql     ← Enables RLS + access policies
docs/migrations/004_cascade_delete_contributions.sql ← CASCADE delete
docs/migrations/005_add_event_deadline.sql   ← Adds deadline column
docs/migrations/006_add_validation_and_auth_constraints.sql ← CHECK constraints + rate limiting
```

### 1.3 Enable Realtime
1. Go to **Database → Tables**
2. Click on `contributions` table
3. Toggle **Enable Realtime** ON

### 1.4 Configure Auth
1. Go to **Authentication → Settings → Email Auth**
2. Enable **Confirm email** (requires email verification)
3. Under **Email Templates**, customize the confirmation email with SalamiPay branding if desired

### 1.5 Get Credentials
1. Go to **Settings → API**
2. Copy:
   - **Project URL** → this is `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Step 2: Cloudflare Turnstile (5 minutes)

1. Go to [Cloudflare Dashboard → Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
2. Add a new site widget for `salamipay.com` and `app.salamipay.com`
3. Copy:
   - **Site Key** → this is `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - **Secret Key** → this is `TURNSTILE_SECRET_KEY`

---

## Step 3: GitHub Repository (5 minutes)

### 3.1 Create Repo
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `salamipay`
3. Set to **Private**
4. Don't initialize with README (we already have everything)

### 3.2 Push Code
Run in your project folder:
```bash
git init
git add -A
git commit -m "Initial commit: SalamiPay MVP

Event-based group payment platform with:
- Event creation with auth-protected ownership
- Contribution form with Turnstile CAPTCHA
- Realtime progress tracking via Supabase
- Admin dashboard with payment status management
- CSV export, QR codes, OG image generation
- Marketing homepage with pricing and FAQ
- Password reset flow, toast notifications
- 18 AI agents for continuous improvement"

git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/salamipay.git
git push -u origin main
```

---

## Step 4: Vercel Deployment (10 minutes)

### 4.1 Connect Repository
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your `salamipay` GitHub repository
3. Framework: **Next.js** (auto-detected)
4. Root Directory: `.` (default)

### 4.2 Set Environment Variables
In Vercel Project Settings → Environment Variables, add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Your Turnstile site key | Production, Preview, Development |
| `TURNSTILE_SECRET_KEY` | Your Turnstile secret key | Production, Preview, Development |

### 4.3 Deploy
Click **Deploy**. Vercel will build and deploy automatically.

---

## Step 5: Domain Configuration (10 minutes)

### 5.1 Add Domains in Vercel
Go to Vercel Project → Settings → Domains, add:
- `app.salamipay.com` (primary app domain)
- `salamipay.com` (marketing homepage + event links)

### 5.2 Configure DNS in Cloudflare
In Cloudflare DNS settings for `salamipay.com`:

| Type  | Name   | Content                  | Proxy |
|-------|--------|--------------------------|-------|
| CNAME | `app`  | `cname.vercel-dns.com`   | DNS only (grey cloud) |
| CNAME | `@`    | `cname.vercel-dns.com`   | DNS only (grey cloud) |

**Important:** Set Cloudflare proxy to **DNS only** (grey cloud) for Vercel domains. Vercel handles SSL.

### 5.3 Configure `salamipay.app` Redirect
In Cloudflare for `salamipay.app`:
1. Go to **Rules → Redirect Rules**
2. Create rule: All traffic → `https://salamipay.com` (301 permanent redirect)

---

## Step 6: Post-Deployment Verification (10 minutes)

### Smoke Test Checklist
- [ ] Visit `salamipay.com` — marketing homepage loads
- [ ] Visit `app.salamipay.com` — app loads
- [ ] Sign up with email — verification email arrives
- [ ] Verify email — can sign in
- [ ] Create an event — redirects to event page
- [ ] Share event URL — works as `salamipay.com/{slug}`
- [ ] Submit a contribution — appears in realtime
- [ ] QR code works — scans and opens event
- [ ] Copy link button works
- [ ] OG preview — share link on WhatsApp/Facebook, preview card shows
- [ ] Owner controls: edit event, delete event, export CSV, manage payment status
- [ ] Password reset — sends reset email
- [ ] Visit `salamipay.app` — redirects to `salamipay.com`
- [ ] Privacy and Terms pages load
- [ ] 404 page shows for invalid URLs

---

## Estimated Total Time: ~45 minutes

## Quick Reference: Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAA...
TURNSTILE_SECRET_KEY=0x4AAAAAA...
```

---

## Troubleshooting

**Build fails on Vercel:**
- Check that all env vars are set (Supabase URL, anon key, Turnstile keys)
- Verify Node.js version is 18+ (Vercel default is fine)

**Auth not working:**
- Confirm email auth is enabled in Supabase Dashboard
- Check that the Supabase URL and anon key are correct
- Verify the auth redirect URL in Supabase includes your production domain

**Realtime not updating:**
- Enable Realtime on the `contributions` table in Supabase Dashboard
- Check browser console for WebSocket connection errors

**Contributions failing:**
- Verify Turnstile keys are correct and the domain is whitelisted
- Check rate limit: max 5 contributions per event per minute

**OG images not showing:**
- Test the API directly: `https://app.salamipay.com/api/og?title=Test&target=1000&collected=500&contributors=10`
- May take time for social platforms to cache new previews
