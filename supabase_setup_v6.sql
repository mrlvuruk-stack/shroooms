-- ============================================================
--  SHROOOMS — Supabase Setup Version 6 (Email OTP Integration)
--  Paste this in: SQL Editor → New Query → Run
-- ============================================================

CREATE TABLE IF NOT EXISTS public.email_otps (
  id         BIGSERIAL PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  otp        TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.email_otps ENABLE ROW LEVEL SECURITY;

-- Recreate policies for email_otps
DROP POLICY IF EXISTS "Public read email_otps"  ON public.email_otps;
DROP POLICY IF EXISTS "Public write email_otps" ON public.email_otps;
CREATE POLICY "Public read email_otps"  ON public.email_otps FOR SELECT USING (true);
CREATE POLICY "Public write email_otps" ON public.email_otps FOR ALL    USING (true) WITH CHECK (true);
