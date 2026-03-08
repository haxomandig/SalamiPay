-- Migration 007: Fix events with NULL or missing created_at
-- Run in Supabase SQL Editor

-- Update any events that have NULL created_at to use the current timestamp
UPDATE events SET created_at = now() WHERE created_at IS NULL;

-- Ensure created_at column has NOT NULL constraint with default
ALTER TABLE events ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE events ALTER COLUMN created_at SET DEFAULT now();
