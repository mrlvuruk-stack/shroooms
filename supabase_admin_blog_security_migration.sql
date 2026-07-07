-- SHROOOMS — DATABASE SECURITY MIGRATION FOR ADMIN BLOG SECURITY
-- Idempotent, safe migration script. Run this inside the Supabase SQL Editor.

-- ─────────────────────────────────────────────────
-- 1. admin_users Table Creation
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id     UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────
-- 2. admin_users RLS Policies (Prevent public enumeration)
-- ─────────────────────────────────────────────────
DROP POLICY IF EXISTS "Allow authenticated users to read admin status" ON public.admin_users;
CREATE POLICY "Allow authenticated users to read admin status" ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (true); -- Authenticated users can check if their own UUID (or others) exists

-- Prevent any insert/update/delete from non-super-admins
DROP POLICY IF EXISTS "Admins manage admin_users" ON public.admin_users;
-- Only database owners or super-users can modify admin list.

-- ─────────────────────────────────────────────────
-- 3. blogs Table RLS Policies
-- ─────────────────────────────────────────────────
-- Ensure RLS is enabled on public.blogs
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Preserve public reads
DROP POLICY IF EXISTS "Public read blogs" ON public.blogs;
CREATE POLICY "Public read blogs" ON public.blogs
  FOR SELECT
  USING (true);

-- Ensure old unsafe write policy is removed
DROP POLICY IF EXISTS "Public write blogs" ON public.blogs;

-- Restricted CREATE/INSERT Policy
DROP POLICY IF EXISTS "Admin write blogs - INSERT" ON public.blogs;
CREATE POLICY "Admin write blogs - INSERT" ON public.blogs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Restricted UPDATE Policy
DROP POLICY IF EXISTS "Admin write blogs - UPDATE" ON public.blogs;
CREATE POLICY "Admin write blogs - UPDATE" ON public.blogs
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Restricted DELETE Policy
DROP POLICY IF EXISTS "Admin write blogs - DELETE" ON public.blogs;
CREATE POLICY "Admin write blogs - DELETE" ON public.blogs
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────
-- 4. Table Privilege Sanitization
-- ─────────────────────────────────────────────────
-- Ensure anon has only SELECT privileges on blogs and admin_users
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER, REFERENCES ON public.blogs FROM anon;
GRANT SELECT ON public.blogs TO anon;

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER, REFERENCES ON public.admin_users FROM anon;
GRANT SELECT ON public.admin_users TO anon;

-- Ensure authenticated role can select and write, but is restricted by RLS
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blogs TO authenticated;
GRANT SELECT ON public.admin_users TO authenticated;
