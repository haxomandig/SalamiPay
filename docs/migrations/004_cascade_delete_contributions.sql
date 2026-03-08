-- Drop existing foreign key and re-add with CASCADE on delete
-- so deleting an event automatically removes its contributions
ALTER TABLE contributions
DROP CONSTRAINT IF EXISTS contributions_event_id_fkey;

ALTER TABLE contributions
ADD CONSTRAINT contributions_event_id_fkey
FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;
