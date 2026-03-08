-- Enable RLS on both tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- Events: anyone can read
CREATE POLICY "events_select" ON events
  FOR SELECT USING (true);

-- Events: anyone can insert (anonymous event creation allowed)
CREATE POLICY "events_insert" ON events
  FOR INSERT WITH CHECK (true);

-- Events: only the creator can update their own events
CREATE POLICY "events_update" ON events
  FOR UPDATE USING (auth.uid() = created_by);

-- Events: only the creator can delete their own events
CREATE POLICY "events_delete" ON events
  FOR DELETE USING (auth.uid() = created_by);

-- Contributions: anyone can read
CREATE POLICY "contributions_select" ON contributions
  FOR SELECT USING (true);

-- Contributions: anyone can insert (public contribution form)
CREATE POLICY "contributions_insert" ON contributions
  FOR INSERT WITH CHECK (true);

-- Contributions: only the event creator can update contributions (e.g. payment status)
CREATE POLICY "contributions_update" ON contributions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = contributions.event_id
        AND events.created_by = auth.uid()
    )
  );

-- Contributions: only the event creator can delete contributions
CREATE POLICY "contributions_delete" ON contributions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = contributions.event_id
        AND events.created_by = auth.uid()
    )
  );
