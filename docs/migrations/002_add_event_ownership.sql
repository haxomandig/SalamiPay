-- Add created_by column to events (references Supabase auth.users)
ALTER TABLE events
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

-- Index for looking up events by creator
CREATE INDEX IF NOT EXISTS idx_events_created_by
ON events (created_by);
