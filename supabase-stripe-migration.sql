-- FluoroPath: Stripe billing columns for profiles table
-- Run AFTER supabase-auth-migration.sql

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_period_end TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'free';

-- subscription_status values: 'free', 'pro', 'past_due', 'canceled'
-- plan_type values: 'free', 'pro_lifetime', 'pro_monthly'

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer
  ON profiles(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

COMMENT ON COLUMN profiles.stripe_customer_id IS 'Stripe customer ID (cus_xxx)';
COMMENT ON COLUMN profiles.subscription_status IS 'Current subscription status: free, pro, past_due, canceled';
COMMENT ON COLUMN profiles.subscription_id IS 'Stripe subscription ID (sub_xxx) — null for lifetime';
COMMENT ON COLUMN profiles.subscription_period_end IS 'When the current billing period ends — null for lifetime';
COMMENT ON COLUMN profiles.plan_type IS 'Plan tier: free, pro_lifetime, pro_monthly';
