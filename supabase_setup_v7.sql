-- ============================================================
--  SHROOOMS — Supabase Setup Version 7 (User Profile Fields)
--  Paste this in: SQL Editor → New Query → Run
-- ============================================================

-- Add address and photo columns to public.users table if they don't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS photo TEXT;
