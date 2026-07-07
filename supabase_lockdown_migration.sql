-- ============================================================
--  SHROOOMS — EMERGENCY SECURITY LOCKDOWN MIGRATION
--  SQL Editor → New Query → Run
-- ============================================================

-- ── 1. PRODUCTS TABLE LOCKDOWN ──
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public write products" ON public.products;
DROP POLICY IF EXISTS "Public read products" ON public.products;

CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER, REFERENCES ON public.products FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER, REFERENCES ON public.products FROM authenticated;

GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;


-- ── 2. ORDERS TABLE LOCKDOWN ──
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read orders" ON public.orders;
DROP POLICY IF EXISTS "Public write orders" ON public.orders;

REVOKE ALL PRIVILEGES ON public.orders FROM anon;
REVOKE ALL PRIVILEGES ON public.orders FROM authenticated;
REVOKE ALL PRIVILEGES ON public.orders FROM PUBLIC;


-- ── 3. WISHLISTS TABLE LOCKDOWN ──
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read wishlists" ON public.wishlists;
DROP POLICY IF EXISTS "Public write wishlists" ON public.wishlists;

REVOKE ALL PRIVILEGES ON public.wishlists FROM anon;
REVOKE ALL PRIVILEGES ON public.wishlists FROM authenticated;
REVOKE ALL PRIVILEGES ON public.wishlists FROM PUBLIC;


-- ── 4. USERS TABLE LOCKDOWN ──
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read users" ON public.users;
DROP POLICY IF EXISTS "Public write users" ON public.users;

REVOKE ALL PRIVILEGES ON public.users FROM anon;
REVOKE ALL PRIVILEGES ON public.users FROM authenticated;
REVOKE ALL PRIVILEGES ON public.users FROM PUBLIC;


-- ── 5. EMAIL_OTPS TABLE LOCKDOWN ──
ALTER TABLE public.email_otps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read email_otps" ON public.email_otps;
DROP POLICY IF EXISTS "Public write email_otps" ON public.email_otps;

REVOKE ALL PRIVILEGES ON public.email_otps FROM anon;
REVOKE ALL PRIVILEGES ON public.email_otps FROM authenticated;
REVOKE ALL PRIVILEGES ON public.email_otps FROM PUBLIC;


-- ── 6. TRUECALLER_SESSIONS TABLE LOCKDOWN ──
ALTER TABLE public.truecaller_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read truecaller_sessions" ON public.truecaller_sessions;
DROP POLICY IF EXISTS "Public write truecaller_sessions" ON public.truecaller_sessions;

REVOKE ALL PRIVILEGES ON public.truecaller_sessions FROM anon;
REVOKE ALL PRIVILEGES ON public.truecaller_sessions FROM authenticated;
REVOKE ALL PRIVILEGES ON public.truecaller_sessions FROM PUBLIC;
