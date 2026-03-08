-- Migration 006: Input validation constraints + require auth for event creation
-- Run in Supabase SQL Editor

-- 1. Input length and value constraints on events
ALTER TABLE events
  ADD CONSTRAINT events_name_length CHECK (char_length(name) <= 200),
  ADD CONSTRAINT events_target_amount_range CHECK (target_amount > 0 AND target_amount <= 10000000),
  ADD CONSTRAINT events_participants_range CHECK (participants > 0 AND participants <= 10000);

-- 2. Input length and value constraints on contributions
ALTER TABLE contributions
  ADD CONSTRAINT contributions_name_length CHECK (char_length(name) <= 100),
  ADD CONSTRAINT contributions_amount_range CHECK (amount > 0 AND amount <= 10000000),
  ADD CONSTRAINT contributions_message_length CHECK (char_length(message) <= 500);

-- 3. Require authentication for event creation (update INSERT policy)
-- Drop the old public insert policy and replace with auth-required
DROP POLICY IF EXISTS "Anyone can insert events" ON events;
CREATE POLICY "Authenticated users can insert events" ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- 4. Rate limiting on contributions: max 5 per event per minute
-- Uses a trigger to reject rapid-fire submissions
CREATE OR REPLACE FUNCTION check_contribution_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT count(*)
    FROM contributions
    WHERE event_id = NEW.event_id
      AND created_at > now() - interval '1 minute'
  ) >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before submitting another contribution.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS contribution_rate_limit ON contributions;
CREATE TRIGGER contribution_rate_limit
  BEFORE INSERT ON contributions
  FOR EACH ROW
  EXECUTE FUNCTION check_contribution_rate_limit();

-- IMPORTANT: Email verification
-- In the Supabase Dashboard, go to:
--   Authentication > Settings > Email Auth
--   Enable "Confirm email" (requires users to verify email before signing in)
-- This cannot be done via SQL — it's a dashboard configuration.
