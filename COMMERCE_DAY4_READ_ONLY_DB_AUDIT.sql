-- ============================================================================
-- SHROOOMS COMMERCE SPRINT DAY 4 — DATABASE SECURITY READ-ONLY AUDIT
-- ============================================================================
-- Purpose: Read-only inspection of existence, RLS state, policies, table
-- privileges, and routine execution permissions for all required tables and
-- the exact public.create_order_secure function.
--
-- Instructions: Run this script in the Supabase SQL Editor and review the results.
-- This script contains only SELECT queries and does not execute any writes or DDL.
-- ============================================================================

-- 1. OBJECT EXISTENCE AUDIT
SELECT
    'table' AS object_type,
    'public' AS schema_name,
    tbl AS object_name,
    (to_regclass('public.' || tbl) IS NOT NULL) AS object_exists
FROM (
    VALUES
    ('products'), ('blogs'), ('admin_users'), ('orders'), ('wishlists'),
    ('users'), ('email_otps'), ('truecaller_sessions'), ('commerce_orders'), ('commerce_order_items')
) AS t(tbl)
UNION ALL
SELECT
    'function' AS object_type,
    'public' AS schema_name,
    'create_order_secure(uuid, text, text, text, text, jsonb)' AS object_name,
    (to_regprocedure('public.create_order_secure(uuid, text, text, text, text, jsonb)') IS NOT NULL) AS object_exists
ORDER BY object_type, object_name;

-- 2. TABLE RLS STATE
SELECT
    n.nspname AS schemaname,
    c.relname AS tablename,
    c.relrowsecurity AS rls_enabled,
    c.relforcerowsecurity AS rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN (
      'products', 'blogs', 'admin_users', 'orders', 'wishlists',
      'users', 'email_otps', 'truecaller_sessions', 'commerce_orders', 'commerce_order_items'
  )
ORDER BY schemaname, tablename;

-- 3. POLICY AUDIT
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
      'products', 'blogs', 'admin_users', 'orders', 'wishlists',
      'users', 'email_otps', 'truecaller_sessions', 'commerce_orders', 'commerce_order_items'
  )
ORDER BY schemaname, tablename, policyname;

-- 4. TABLE PRIVILEGE AUDIT
SELECT
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN (
      'products', 'blogs', 'admin_users', 'orders', 'wishlists',
      'users', 'email_otps', 'truecaller_sessions', 'commerce_orders', 'commerce_order_items'
  )
  AND grantee IN ('anon', 'authenticated', 'public')
ORDER BY table_schema, table_name, grantee, privilege_type;

-- 5. EXACT FUNCTION SECURITY AUDIT
SELECT
    pg_get_function_identity_arguments(p.oid) AS function_identity,
    pg_get_userbyid(p.proowner) AS function_owner,
    p.prosecdef AS is_security_definer,
    p.provolatile AS volatility,
    p.proparallel AS parallel_safety,
    p.proconfig AS search_path_config,
    p.proacl AS acl
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname = 'create_order_secure'
  AND pg_get_function_identity_arguments(p.oid) = 'uuid, text, text, text, text, jsonb'
ORDER BY function_identity;

-- 6. EXACT FUNCTION EXECUTE PRIVILEGES
SELECT
    role_name,
    has_function_privilege(role_name, 'public.create_order_secure(uuid, text, text, text, text, jsonb)', 'execute') AS can_execute
FROM (
    VALUES ('anon'), ('authenticated'), ('public')
) AS r(role_name)
ORDER BY role_name;

-- 7. FUNCTION OWNER CONTEXT (SUPERUSER VERIFICATION)
SELECT
    pg_get_userbyid(p.proowner) AS function_owner,
    rolsuper AS owner_is_superuser
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
JOIN pg_roles r ON r.oid = p.proowner
WHERE n.nspname = 'public'
  AND p.proname = 'create_order_secure'
  AND pg_get_function_identity_arguments(p.oid) = 'uuid, text, text, text, text, jsonb';
