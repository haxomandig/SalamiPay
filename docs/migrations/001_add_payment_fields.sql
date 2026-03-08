-- Add payment_method column to contributions
ALTER TABLE contributions
ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'bkash';

-- Add payment_status column to contributions
ALTER TABLE contributions
ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending';

-- Add index for filtering by payment status
CREATE INDEX IF NOT EXISTS idx_contributions_payment_status
ON contributions (event_id, payment_status);
