-- ============================================================
--  SHROOOMS — Supabase Setup Version 5 (Truecaller Integration)
--  Paste this in: SQL Editor → New Query → Run
-- ============================================================

CREATE TABLE IF NOT EXISTS public.truecaller_sessions (
  id         BIGSERIAL PRIMARY KEY,
  request_id TEXT UNIQUE NOT NULL,
  user_data  JSONB,
  token      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.truecaller_sessions ENABLE ROW LEVEL SECURITY;

-- Recreate policies for truecaller_sessions
DROP POLICY IF EXISTS "Public read truecaller_sessions"  ON public.truecaller_sessions;
DROP POLICY IF EXISTS "Public write truecaller_sessions" ON public.truecaller_sessions;
CREATE POLICY "Public read truecaller_sessions"  ON public.truecaller_sessions FOR SELECT USING (true);
CREATE POLICY "Public write truecaller_sessions" ON public.truecaller_sessions FOR ALL    USING (true) WITH CHECK (true);
