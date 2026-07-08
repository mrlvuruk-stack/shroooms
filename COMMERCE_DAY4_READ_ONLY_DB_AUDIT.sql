-- ============================================================================
-- SHROOOMS COMMERCE SPRINT DAY 4 — DATABASE SECURITY READ-ONLY AUDIT
-- ============================================================================
-- Purpose: Read-only inspection of RLS state, policies, table grants, 
-- and routine execution permissions for public.commerce_orders,
-- public.commerce_order_items, and public.create_order_secure.
--
-- Instructions: Run this script in the Supabase SQL Editor and review the results.
-- Do not run any write operations.
-- ============================================================================

-- 1. Check Row Level Security (RLS) state of commerce tables
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('commerce_orders', 'commerce_order_items', 'orders', 'products', 'blogs');

-- 2. Inspect active policies on commerce tables
SELECT 
    schemaname,
    tablename,
    policyname,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename IN ('commerce_orders', 'commerce_order_items', 'orders', 'products', 'blogs');

-- 3. Check role table grants for anon, authenticated, and public roles
SELECT 
    grantee, 
    table_schema, 
    table_name, 
    privilege_type
FROM information_schema.role_table_grants
WHERE table_name IN ('commerce_orders', 'commerce_order_items', 'orders', 'products', 'blogs')
  AND grantee IN ('anon', 'authenticated', 'public', 'PUBLIC');

-- 4. Check function permissions and security settings for create_order_secure
SELECT 
    proname as function_name,
    prosecdef as is_security_definer,
    provolatile as volatility,
    proconfig as search_path_config,
    pg_get_userbyid(proowner) as function_owner
FROM pg_proc 
JOIN pg_namespace n ON n.oid = pg_proc.pronamespace
WHERE proname = 'create_order_secure' 
  AND n.nspname = 'public';

-- 5. Check EXECUTE routine privileges for create_order_secure
SELECT 
    grantee,
    routine_schema,
    routine_name,
    privilege_type
FROM information_schema.routine_privileges
WHERE routine_name = 'create_order_secure'
  AND grantee IN ('anon', 'authenticated', 'public', 'PUBLIC');
