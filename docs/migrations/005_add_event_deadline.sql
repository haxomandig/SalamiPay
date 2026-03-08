-- Add optional deadline column to events
ALTER TABLE events
ADD COLUMN IF NOT EXISTS deadline timestamptz;
