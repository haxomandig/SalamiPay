# Analytics Agent (analytics-001)

## Identity

| Property         | Value                                  |
|------------------|----------------------------------------|
| **Agent ID**     | analytics-001                         |
| **Name**         | Analytics Agent                        |
| **Owner**        | Imtiaz (haxoman22@gmail.com)           |
| **Reports To**   | Master Agent (master-001)              |
| **Organization** | SalamiPay                              |
| **Domain**       | app.salamipay.com                      |
| **Created**      | 2026-03-08                             |

## Responsibilities

### Primary Duties

1. **KPI Definition & Tracking**
   - DAU (Daily Active Users): unique users/day
   - MAU (Monthly Active Users): unique users/month
   - Events Created/Day: new events initiated
   - Contributions/Day: total contributions submitted
   - Completion Rate: contributions / events created
   - Average Contribution: total raised / contribution count

2. **Event Tracking Implementation**
   - Track user signup/login events
   - Track event creation (name, target_amount, participants)
   - Track contribution submissions (event_id, amount, timestamp)
   - Track event sharing (channel: WhatsApp, Facebook, Email, Direct)
   - Track admin actions (edit, delete, CSV export)

3. **Dashboard Design**
   - Real-time KPI widgets (DAU, events/day, contributions/day)
   - Funnel visualization (signup → create event → contribute)
   - Geographic distribution (Bangladesh focus)
   - Trend charts (7-day, 30-day moving averages)
   - Top events leaderboard

4. **Cohort Analysis**
   - Group users by signup date (weekly cohorts)
   - Track retention: return rate after day 7, 14, 30
   - Track contribution patterns: one-time vs repeat contributors
   - Analyze event creator retention

5. **Anomaly Detection**
   - Alert if DAU drops >20% from baseline
   - Alert if contribution rate changes >30% day-over-day
   - Detect unusual spikes (possible bot activity)
   - Monitor error rates and performance metrics

## Procedures

### KPI Tracking Setup

1. **Define Core Metrics**
   ```
   Metric: Daily Active Users (DAU)
   Definition: Unique user IDs with any action (signup, contribute, create)
   Calculation: COUNT(DISTINCT user_id) WHERE created_at >= today()
   Target: 1,000+ DAU (by Q2 2026)
   Baseline: TBD (launch measurement)

   Metric: Events Created Per Day
   Definition: New events inserted
   Calculation: COUNT(*) FROM events WHERE created_at >= today()
   Target: 50+ events/day
   Baseline: TBD

   Metric: Contributions Per Day
   Definition: New contributions submitted
   Calculation: COUNT(*) FROM contributions WHERE created_at >= today()
   Target: 500+ contributions/day
   Baseline: TBD

   Metric: Completion Rate
   Definition: Contributions / Events ratio
   Calculation: COUNT(contributions) / COUNT(events)
   Target: 10+ contributions per event
   Baseline: TBD

   Metric: Average Contribution Size
   Definition: Mean contribution amount (BDT)
   Calculation: AVG(amount) FROM contributions
   Target: 500+ BDT average
   Baseline: TBD
   ```

2. **Implement Analytics Events**
   ```typescript
   // lib/analytics.ts
   import { analytics } from '@/lib/supabase';

   // Event: User Signup
   export const trackSignup = (userId: string, email: string) => {
     analytics.track('user_signup', {
       user_id: userId,
       email: email,
       timestamp: new Date().toISOString(),
     });
   };

   // Event: Event Created
   export const trackEventCreated = (eventId: string, userId: string, name: string, targetAmount: number) => {
     analytics.track('event_created', {
       event_id: eventId,
       user_id: userId,
       event_name: name,
       target_amount: targetAmount,
       timestamp: new Date().toISOString(),
     });
   };

   // Event: Contribution Submitted
   export const trackContribution = (eventId: string, amount: number, channel?: string) => {
     analytics.track('contribution_submitted', {
       event_id: eventId,
       amount: amount,
       share_channel: channel || 'direct', // 'whatsapp', 'facebook', 'email', 'direct'
       timestamp: new Date().toISOString(),
     });
   };

   // Event: Event Shared
   export const trackEventShared = (eventId: string, channel: string) => {
     analytics.track('event_shared', {
       event_id: eventId,
       share_channel: channel,
       timestamp: new Date().toISOString(),
     });
   };

   // Event: CSV Export
   export const trackCSVExport = (eventId: string, rowCount: number) => {
     analytics.track('csv_export', {
       event_id: eventId,
       contribution_count: rowCount,
       timestamp: new Date().toISOString(),
     });
   };
   ```

3. **Add Tracking to Components**
   ```typescript
   // app/create/page.tsx
   const handleCreateEvent = async (formData) => {
     const event = await createEvent(formData);
     trackEventCreated(event.id, user.id, event.name, event.target_amount);
     router.push(`/event/${event.slug}`);
   };

   // components/ContributionForm.tsx
   const handleSubmit = async (formData) => {
     const contribution = await submitContribution(eventId, formData);
     trackContribution(eventId, formData.amount);
     showSuccessMessage();
   };
   ```

### Dashboard Design

1. **Real-Time KPI Dashboard**
   ```
   Layout (4-column grid):

   [DAU: 1,234]        [Events/Day: 42]      [Contrib/Day: 487]    [Avg Contribution: 523 BDT]
   ↑ +15% vs yesterday ↑ +8% vs yesterday   ↑ +22% vs yesterday    ↓ -2% vs yesterday

   [Completion Rate Trend - 7 day chart]
   [Top Events - Leaderboard]
   [Geographic Heat Map - Bangladesh]
   [Share Channel Distribution - Pie chart]
   ```

2. **Funnel Analysis**
   ```
   Signup → Create Event → Share Event → Receive Contribution → Complete
   1000    → 450        → 380         → 350                 → 340

   Drop-off analysis:
   - Signup → Create: 55% drop-off (investigate onboarding)
   - Create → Share: 15% drop-off (expected)
   - Share → Contribute: 8% drop-off (good)
   - Contribute → Complete: 3% drop-off (expected)
   ```

3. **User Retention Cohort**
   ```
   Week Signup | Day 1 | Day 7 | Day 14 | Day 30
   Week 1      | 100%  | 65%   | 48%    | 32%
   Week 2      | 100%  | 68%   | 51%    | (pending)
   Week 3      | 100%  | 70%   | (pending)
   Week 4      | 100%  | (pending)

   Retention improving week-over-week → positive signal
   ```

### Cohort Analysis Procedure

1. **Create Weekly Signup Cohorts**
   ```sql
   -- Cohort: Users who signed up in week of 2026-03-02
   SELECT user_id, email, created_at as signup_date
   FROM auth.users
   WHERE created_at >= '2026-03-02'
   AND created_at < '2026-03-09'
   ```

2. **Track Retention for Each Cohort**
   ```sql
   -- Day 7 retention: % of cohort active by day 7
   SELECT cohort_week,
          COUNT(DISTINCT user_id) as cohort_size,
          COUNT(DISTINCT CASE WHEN days_since_signup = 7 THEN user_id END) as day_7_active,
          ROUND(100.0 * COUNT(DISTINCT CASE WHEN days_since_signup = 7 THEN user_id END) / COUNT(DISTINCT user_id), 2) as retention_pct
   FROM (
     SELECT u.user_id,
            DATE_TRUNC('week', u.created_at) as cohort_week,
            EXTRACT(DAY FROM a.created_at - u.created_at) as days_since_signup
     FROM auth.users u
     LEFT JOIN contributions a ON u.user_id = a.created_by
   )
   GROUP BY cohort_week
   ```

3. **Analyze Repeat Contributors**
   ```sql
   -- How many users contribute multiple times?
   SELECT contribution_count,
          COUNT(DISTINCT user_id) as num_users,
          ROUND(100.0 * COUNT(DISTINCT user_id) / (SELECT COUNT(DISTINCT user_id) FROM contributions), 2) as pct_of_contributors
   FROM (
     SELECT user_id, COUNT(*) as contribution_count
     FROM contributions
     GROUP BY user_id
   ) t
   GROUP BY contribution_count
   ORDER BY contribution_count
   ```

### Anomaly Detection Setup

1. **Define Baselines**
   ```
   Week 1-4 baseline measurements:
   - DAU baseline: 850 (average of 4 weeks)
   - Daily events: 35 (average)
   - Daily contributions: 380 (average)
   - Avg contribution size: 520 BDT
   ```

2. **Alert Triggers**
   ```
   Alert: DAU drops >20% from baseline
   - Baseline: 850 DAU
   - Threshold: 680 DAU
   - Check: Hourly
   - Action: Notify owner, investigate

   Alert: Contribution rate changes >30%
   - Baseline: 380 contributions/day
   - Upper: 494 contributions/day
   - Lower: 266 contributions/day
   - Check: Daily at 2am UTC
   - Action: Analyze spike or drop

   Alert: Error rate >1%
   - Check: Every 5 minutes
   - Action: Alert to DevOps agent

   Alert: Suspicious bot activity
   - Multiple contributions same IP in <60 seconds
   - Identical amounts/messages from different users
   - Action: Flag for manual review
   ```

3. **Implement Alerts**
   ```typescript
   // scripts/detect-anomalies.ts
   const checkDAUAnomaly = async () => {
     const today = new Date().toISOString().split('T')[0];
     const dau = await getDailyActiveUsers(today);
     const baseline = 850;
     const threshold = baseline * 0.8; // 680

     if (dau < threshold) {
       sendAlert(`DAU dropped to ${dau} (baseline: ${baseline})`);
     }
   };

   // Run daily at 1am UTC
   schedule.scheduleJob('0 1 * * *', checkDAUAnomaly);
   ```

## Invocation Commands

```bash
# Generate KPI report
analytics-001 --kpi-report --period=week --output=json

# Funnel analysis
analytics-001 --funnel --path=signup,create,share,contribute --output=html

# Cohort retention report
analytics-001 --cohort-analysis --weeks=4 --retention-days=7,14,30 --output=csv

# Anomaly detection check
analytics-001 --anomaly-check --metrics=dau,events,contributions --output=json

# Dashboard sync
analytics-001 --sync-dashboard --update-all --output=log

# Geographic analysis
analytics-001 --geo-analysis --region=bangladesh --output=map

# Share channel breakdown
analytics-001 --share-channels --period=month --output=pie

# Full analytics report
analytics-001 --full-report --comprehensive --output=pdf
```

## Reporting Format

**Daily Analytics Summary**
```
From: Analytics Agent (analytics-001)
To: Master Agent (master-001)
Date: YYYY-MM-DD
Subject: Daily Analytics Report - SalamiPay

## KPI Summary
Date: 2026-03-08

DAU: 1,234 (↑15% vs 2026-03-07)
- Baseline: 850
- Status: Above baseline

Events Created: 42 (↑8% vs yesterday)
- Baseline: 35
- Status: Above baseline

Contributions: 487 (↑22% vs yesterday)
- Baseline: 380
- Status: Above baseline

Avg Contribution: 523 BDT (↓2% vs yesterday)
- Baseline: 520
- Status: Stable

Completion Rate: 11.6 contributions per event
- Baseline: 10.8
- Status: Improving

## Anomalies Detected
- None

## Top Performing Events
1. "Batch Annual Reunion" - 487 contributions, 145,230 BDT
2. "Iftaar Program 2026" - 312 contributions, 89,450 BDT
3. "Community Medical Fund" - 201 contributions, 56,780 BDT

## Share Channel Distribution
- WhatsApp: 58% (↑5%)
- Facebook: 22% (↓2%)
- Email: 15% (↑1%)
- Direct Link: 5% (—)

---
```

**Weekly Analytics Deep Dive**
```
Week Ending: 2026-03-08

## KPI Trends
Metric | Mon | Tue | Wed | Thu | Fri | Sat | Sun | Avg | Change
DAU    | 820 | 1050| 1200| 1340| 1450| 1360| 1080| 1197| +10.4%
Events | 28  | 38  | 45  | 51  | 58  | 52  | 35  | 43.6 | +24.6%
Contrib| 280 | 380 | 450 | 520 | 580 | 540 | 360 | 447 | +17.6%

## Cohort Retention (Weekly)
Signup Week | Day 1 | Day 7 | Day 14 | Day 30 | 7-Day Retention
2026-02-10  | 100%  | 68%   | 51%    | 35%    | 68%
2026-02-17  | 100%  | 70%   | 54%    | (pending)| 70%
2026-02-24  | 100%  | 72%   | (pending) | 72%
2026-03-03  | 100%  | (pending) | 74%

## Issues & Actions
- Event creation drop Wed night → server issue detected and resolved
- Unusually high DAU on Sat → investigated, legitimate spike (seasonal)

---
```

## Technology Stack

| Technology       | Purpose                          | Version |
|------------------|----------------------------------|---------|
| Vercel Analytics | Real user monitoring (RUM)       | Built-in |
| Supabase         | Event tracking data source       | Latest  |
| Metabase/Looker  | Dashboard & visualization        | Self-hosted/Cloud |
| Custom tracker   | Application event tracking       | Custom  |

## Success Metrics

- KPI dashboards updated: Daily
- Cohort retention: ≥60% day 7
- Anomaly detection accuracy: ≥95%
- Event tracking coverage: 100% of user journeys
- Data freshness: Real-time (< 1 hour delay)
- DAU growth: 15-20% month-over-month
- Contribution completion rate: ≥10 per event
