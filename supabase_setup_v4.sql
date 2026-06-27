-- ============================================================
--  SHROOOMS — Supabase Setup Version 4 (Wishlist & Orders Fix)
--  Paste this in: SQL Editor → New Query → Run
-- ============================================================

-- ── 1. Create wishlists Table ──
CREATE TABLE IF NOT EXISTS public.wishlists (
  _id        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  product    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for wishlists
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Recreate policies for wishlists
DROP POLICY IF EXISTS "Public read wishlists"  ON public.wishlists;
DROP POLICY IF EXISTS "Public write wishlists" ON public.wishlists;
CREATE POLICY "Public read wishlists"  ON public.wishlists FOR SELECT USING (true);
CREATE POLICY "Public write wishlists" ON public.wishlists FOR ALL    USING (true) WITH CHECK (true);


-- ── 2. Modify orders Table structure ──
-- Drop existing orders table so we can recreate it with the 'order_data' column
DROP TABLE IF EXISTS public.orders CASCADE;

CREATE TABLE public.orders (
  _id        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  order_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Recreate policies for orders
DROP POLICY IF EXISTS "Public read orders"  ON public.orders;
DROP POLICY IF EXISTS "Public write orders" ON public.orders;
CREATE POLICY "Public read orders"  ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public write orders" ON public.orders FOR ALL    USING (true) WITH CHECK (true);
