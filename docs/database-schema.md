SalamiPay Database Schema
Overview

SalamiPay uses PostgreSQL hosted on Supabase as the primary database.

The database stores:

Event information

Contribution records

Payment information (future)

Event analytics (future)

The system currently revolves around two main entities:

Events
Contributions
Entity Relationship Diagram
Events
  │
  │ 1
  │
  └───────────────∞
           Contributions

Meaning:

One event
can have many contributions
Table: events

Stores information about each event created in the system.

Example:

33rd Batch Reunion 2026
Target Amount: 38000
Participants: 38
Schema
Column	Type	Description
id	uuid / serial	Unique event identifier
title	text	Event name
target_amount	integer	Contribution target
participants	integer	Expected participants
created_at	timestamp	Event creation time
Example Record
id: 1
title: 33rd Batch Reunion 2026
target_amount: 38000
participants: 38
created_at: 2026-03-05
Table: contributions

Stores every contribution submitted by participants.

Each record represents one Salami contribution.

Schema
Column	Type	Description
id	uuid / serial	Contribution identifier
event_id	integer	Linked event
name	text	Contributor name
amount	integer	Contribution amount
message	text	Optional message
created_at	timestamp	Contribution time
Example Record
id: 21
event_id: 1
name: Rahim
amount: 1000
message: Best wishes!
created_at: 2026-03-05
Relationship
events.id
     │
     │
     ▼
contributions.event_id

Meaning:

One event → multiple contributions
Query Examples
Fetch Event
SELECT * FROM events
WHERE id = 1
Fetch Contributions for Event
SELECT * FROM contributions
WHERE event_id = 1
Calculate Total Collected
SELECT SUM(amount)
FROM contributions
WHERE event_id = 1
Calculate Remaining Amount
remaining = target_amount - collected_amount

Example:

Target: 38000
Collected: 12500
Remaining: 25500
Future Tables (Planned)

The system may expand with additional tables.

payments

Used when integrating payment gateways.

id
contribution_id
payment_method
transaction_id
payment_status
created_at
users

If authentication is added.

id
name
email
role
created_at
event_admins

Defines event organizers.

id
event_id
user_id
role
Data Integrity

The system enforces:

Foreign keys
Event → Contributions

Example:

contributions.event_id
references events.id

This ensures every contribution belongs to a valid event.

Indexing (Recommended)

Indexes improve performance for large datasets.

Recommended indexes:

events.id
contributions.event_id
Scalability

The database design supports:

Millions of events
Millions of contributions

Supabase PostgreSQL provides:

Automatic scaling
Backup
Replication
Security policies
Summary

The SalamiPay database currently includes:

events
contributions

Future expansions will add:

payments
users
event_admins

This schema supports the core MVP functionality of the SalamiPay platform.

After this step

Your repo will now look like this:

salamipay
│
├── README.md
│
├── docs
│   ├── architecture.md
│   └── database-schema.md
│
├── app
├── lib
├── public