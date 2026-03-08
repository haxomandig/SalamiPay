-- Migration 008: Add guest tracking, update payment methods, make target_amount optional
-- Run in Supabase SQL Editor

-- 1. Add guest_tracking toggle to events
ALTER TABLE events ADD COLUMN IF NOT EXISTS guest_tracking boolean DEFAULT false;

-- 2. Make target_amount nullable (optional)
ALTER TABLE events ALTER COLUMN target_amount DROP NOT NULL;

-- 3. Add guest breakdown columns to contributions (self and spouse separate)
ALTER TABLE contributions ADD COLUMN IF NOT EXISTS guests_self integer DEFAULT 0;
ALTER TABLE contributions ADD COLUMN IF NOT EXISTS guests_spouse integer DEFAULT 0;
ALTER TABLE contributions ADD COLUMN IF NOT EXISTS guests_child_under12 integer DEFAULT 0;
ALTER TABLE contributions ADD COLUMN IF NOT EXISTS guests_child_over12 integer DEFAULT 0;
ALTER TABLE contributions ADD COLUMN IF NOT EXISTS guests_other integer DEFAULT 0;

-- 4. Drop old constraints if they exist, then re-add with updated limits
ALTER TABLE contributions DROP CONSTRAINT IF EXISTS chk_guests_self;
ALTER TABLE contributions DROP CONSTRAINT IF EXISTS chk_guests_spouse;
ALTER TABLE contributions DROP CONSTRAINT IF EXISTS chk_guests_child_under12;
ALTER TABLE contributions DROP CONSTRAINT IF EXISTS chk_guests_child_over12;
ALTER TABLE contributions DROP CONSTRAINT IF EXISTS chk_guests_other;

ALTER TABLE contributions ADD CONSTRAINT chk_guests_self CHECK (guests_self >= 0 AND guests_self <= 10000);
ALTER TABLE contributions ADD CONSTRAINT chk_guests_spouse CHECK (guests_spouse >= 0 AND guests_spouse <= 10000);
ALTER TABLE contributions ADD CONSTRAINT chk_guests_child_under12 CHECK (guests_child_under12 >= 0 AND guests_child_under12 <= 10000);
ALTER TABLE contributions ADD CONSTRAINT chk_guests_child_over12 CHECK (guests_child_over12 >= 0 AND guests_child_over12 <= 10000);
ALTER TABLE contributions ADD CONSTRAINT chk_guests_other CHECK (guests_other >= 0 AND guests_other <= 10000);

-- 5. Update payment_method constraint to allow new values
-- First drop old constraint if exists (may fail if not present, that's OK)
ALTER TABLE contributions DROP CONSTRAINT IF EXISTS chk_payment_method;
-- Add updated constraint with new payment methods
ALTER TABLE contributions ADD CONSTRAINT chk_payment_method CHECK (payment_method IN ('bkash', 'nagad', 'cash', 'bank_transfer', 'other'));
