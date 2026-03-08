-- Migration 000: Initial schema for SalamiPay
-- Run this FIRST in Supabase SQL Editor before any other migrations

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  target_amount numeric NOT NULL,
  participants integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Index for slug lookups (the primary query pattern)
CREATE INDEX IF NOT EXISTS idx_events_slug ON events (slug);

-- Contributions table
CREATE TABLE IF NOT EXISTS contributions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid NOT NULL REFERENCES events(id),
  name text NOT NULL,
  amount numeric NOT NULL,
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Index for fetching contributions by event
CREATE INDEX IF NOT EXISTS idx_contributions_event_id ON contributions (event_id);
