SalamiPay System Architecture
Overview

SalamiPay is an event-based contribution platform that allows users to collect monetary contributions (“Salami”) through a shareable event page.

The platform enables event organizers to create an event, share a link, and allow participants to contribute money toward a target amount.

Example event page:

salamipay.com/{event-slug}

Example: salamipay.com/batch-iftar-52

Application hosted at: app.salamipay.com
Domains owned: salamipay.com, salamipay.app

Visitors can open the page and submit contributions.

System Architecture

SalamiPay follows a modern full-stack architecture built using serverless and managed infrastructure.

User Browser
     ↓
Next.js Frontend (Vercel)
     ↓
Supabase API
     ↓
PostgreSQL Database
High-Level Architecture Diagram
                ┌─────────────────┐
                │   User Browser  │
                │  (Mobile/Web)   │
                └─────────┬───────┘
                          │
                          ▼
                ┌─────────────────┐
                │   Next.js App   │
                │   (Frontend)    │
                │   Vercel Host   │
                └─────────┬───────┘
                          │
                          ▼
                ┌─────────────────┐
                │    Supabase     │
                │  REST + Auth    │
                └─────────┬───────┘
                          │
                          ▼
                ┌─────────────────┐
                │  PostgreSQL DB  │
                │  Event Records  │
                │ Contributions   │
                └─────────────────┘
Core Components
1. Frontend (Next.js)

The frontend application is built with:

Next.js 16
React
TypeScript

Responsibilities:

Render event pages

Handle contribution form submission

Fetch event data from Supabase

Display contribution progress

Example route:

/event/[slug]
2. Backend (Supabase)

Supabase provides the backend services:

Database
REST API
Authentication (future)
Realtime updates (future)

Supabase automatically exposes database tables through an API.

Example query:

SELECT * FROM events WHERE id = {slug}
3. Database (PostgreSQL)

SalamiPay uses a PostgreSQL database hosted on Supabase.

Primary tables:

events

Stores event information.

id
title
target_amount
participants
created_at

Example record:

Title: 33rd Batch Reunion 2026
Target Amount: 38000
Participants: 38
contributions

Stores participant contributions.

id
event_id
name
amount
message
created_at

Each contribution references an event.

Event Flow
Event Creation

Organizer creates an event.

Event record is stored in the events table.

System generates event link.

Example:

salamipay.com/batch-reunion-x7k2m9
Event Page Access

When a user opens an event page:

User opens event page
      ↓
Next.js reads route slug
      ↓
Supabase fetches event
      ↓
Event details rendered

Displayed information:

Event title
Target amount
Participants
Contribution button
Contribution Flow

When a user submits a contribution:

User enters name and amount
       ↓
Frontend sends request
       ↓
Contribution stored in database
       ↓
Event totals recalculated
       ↓
Updated totals displayed

Example:

Target: 38000
Collected: 12500
Remaining: 25500
Deployment Architecture

SalamiPay will be deployed using:

Frontend → Vercel (app.salamipay.com)
Homepage → salamipay.com
Backend → Supabase
Database → PostgreSQL (Supabase)

Domains:

salamipay.com — Homepage and public event links (e.g. salamipay.com/batch-iftar-52)
salamipay.app — Owned domain (redirects to salamipay.com)
app.salamipay.com — Next.js application

Deployment flow:

GitHub Repository
        ↓
Vercel Deployment
        ↓
app.salamipay.com (Production)
Security Considerations (Future)

Future versions will implement:

Authentication
Event owner permissions
Secure payment verification
API rate limiting

Payment integrations will include:

bKash
Nagad
Stripe
Scalability

SalamiPay is designed to scale using serverless infrastructure.

Advantages:

Automatic scaling
Low infrastructure management
High availability
Global CDN delivery
Future Architecture Enhancements

Planned system improvements:

Realtime Contribution Updates

Using Supabase Realtime.

Live contribution updates
Auto refresh totals
Payment Gateway Integration

External payment services will be integrated.

Example flow:

User contribution
       ↓
Payment gateway
       ↓
Payment verification
       ↓
Database update
Event Dashboard

Organizers will have access to:

Contributor list
Contribution analytics
Event progress
Withdrawal management
Summary

SalamiPay architecture is built on a modern serverless stack combining:

Next.js
Supabase
PostgreSQL
Vercel

This approach provides:

Fast development
Low infrastructure complexity
High scalability
Global deployment capability

The system is currently focused on rapid MVP delivery and will evolve as the product grows.

After this, your repo will look very professional:

salamipay
│
├── README.md
│
├── docs
│   └── architecture.md
│
├── app
├── lib
├── public

