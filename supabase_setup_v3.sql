-- ============================================================
--  SHROOOMS — Supabase Setup Version 3 (Inquiries Table)
--  Paste this in: SQL Editor → New Query → Run
-- ============================================================

-- ── 1. Create Inquiries Table ──
CREATE TABLE IF NOT EXISTS public.inquiries (
  id             TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  type           TEXT NOT NULL, -- 'wholesale' or 'direct'
  name           TEXT NOT NULL,
  email          TEXT NOT NULL,
  phone          TEXT,
  business_name  TEXT,
  business_type  TEXT,
  volume         TEXT,
  subject        TEXT,
  message        TEXT NOT NULL,
  status         TEXT DEFAULT 'Pending', -- 'Pending', 'Reviewed', 'Replied'
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. Enable Row Level Security (RLS) ──
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- ── 3. Drop existing policies if they exist (safe re-run) ──
DROP POLICY IF EXISTS "Public read inquiries"  ON public.inquiries;
DROP POLICY IF EXISTS "Public write inquiries" ON public.inquiries;

-- ── 4. Create Policies ──
CREATE POLICY "Public read inquiries"  ON public.inquiries FOR SELECT USING (true);
CREATE POLICY "Public write inquiries" ON public.inquiries FOR ALL    USING (true) WITH CHECK (true);

-- ── 5. Seed Some Dummy Inquiries for Testing (Optional) ──
INSERT INTO public.inquiries (id, type, name, email, phone, business_name, business_type, volume, subject, message, status) VALUES
('inq-1', 'wholesale', 'Rajesh Kumar', 'rajesh@shanticulinary.com', '+91 98260 12345', 'Shanti Culinary Group', 'restaurant', '10-25kg', NULL, 'We are looking for a reliable daily supply of organic Lion''s Mane and Blue Oyster mushrooms for our fine-dining locations in Indore.', 'Pending'),
('inq-2', 'direct', 'Aisha Patel', 'aisha.patel@gmail.com', NULL, NULL, NULL, NULL, 'support', 'Hi, I recently ordered your fresh Pink Oyster mushrooms and wanted to know the best way to store them to keep them fresh for longer.', 'Pending')
ON CONFLICT (id) DO NOTHING;
