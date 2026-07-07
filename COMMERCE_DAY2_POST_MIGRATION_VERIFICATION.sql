-- ============================================================
--  SHROOOMS — COMMERCE POST-MIGRATION SQL VERIFICATION TESTS (DAY 2 REVISED V4)
--  Run these inside the Supabase SQL Editor after manual migration.
--  All write tests use transaction blocks (BEGIN / ROLLBACK) to ensure zero pollution.
-- ============================================================

-- ── 1. PREFLIGHT SCHEMA DETECTION ──
SELECT 
  'commerce_orders_exists' AS check_name, 
  EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'commerce_orders') AS object_exists
UNION ALL
SELECT 
  'commerce_order_items_exists' AS check_name, 
  EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'commerce_order_items') AS object_exists
UNION ALL
SELECT 
  'create_order_secure_exists' AS check_name, 
  EXISTS (SELECT 1 FROM pg_proc WHERE pronamespace = 'public'::regnamespace AND proname = 'create_order_secure') AS object_exists;


-- ── 2. SCHEMA INTEGRITY VERIFICATION ──
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN ('commerce_orders', 'commerce_order_items');
-- Expected: Both tables must return rowsecurity = true.

SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'commerce_orders'
ORDER BY ordinal_position;

SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'commerce_order_items'
ORDER BY ordinal_position;


-- ── 3. PRIVILEGES & RLS AUDIT ──
-- Check direct table privilege grants for public/anon/authenticated roles
SELECT 
  grantee, 
  table_name, 
  privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name IN ('commerce_orders', 'commerce_order_items')
  AND grantee IN ('anon', 'authenticated', 'PUBLIC');
-- Expected: ZERO rows returned. No direct access is permitted.

-- Check function execute grants
SELECT 
  routine_name, 
  grantee, 
  privilege_type 
FROM information_schema.role_routine_grants 
WHERE routine_name = 'create_order_secure'
  AND grantee IN ('anon', 'authenticated', 'PUBLIC');
-- Expected: Only "anon" must have "EXECUTE" privilege. PUBLIC and authenticated must be absent.


-- ── 4. TRANSACTIONAL VALIDATION TESTS ──
BEGIN;

-- Test A: Verify valid guest order request succeeds, checking one-snapshot integrity
SELECT * FROM public.create_order_secure(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
  'Jane Doe',
  'jane.doe@example.com',
  '+91 98260 12345',
  '123 Forest Floor Ave, Mushroom City',
  '[{"product_id": "p1", "quantity": 2}, {"product_id": "p2", "quantity": 1}]'::JSONB
);
-- Expected: Returns one row with UUID and 'ORDER_REQUEST_CREATED'.

-- Verify items_total matches SUM(line_total) consistency invariant
SELECT 
  o.items_total,
  SUM(i.line_total) AS calculated_sum,
  (o.items_total = SUM(i.line_total)) AS invariant_holds
FROM public.commerce_orders o
JOIN public.commerce_order_items i ON o.id = i.order_id
WHERE o.idempotency_key = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
GROUP BY o.items_total;
-- Expected: items_total = 1347.00, calculated_sum = 1347.00, invariant_holds = true.

-- Verify exact line-item snapshot snapshots, duplicate aggregation
SELECT product_id, product_name_snapshot, unit_price, quantity, line_total 
FROM public.commerce_order_items 
WHERE order_id = (SELECT id FROM public.commerce_orders WHERE idempotency_key = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
ORDER BY product_id;
-- Expected: p1 has name = 'Lions Mane', unit_price = 499.00, quantity = 2, line_total = 998.00.
-- Expected: p2 has name = 'King Oyster', unit_price = 349.00, quantity = 1, line_total = 349.00.

ROLLBACK;


-- Test B: Verify duplicate idempotency key (concurrency-safe retry, does not add duplicate sub-items)
BEGIN;

SELECT * FROM public.create_order_secure(
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::UUID,
  'Jane Doe',
  'jane.doe@example.com',
  '+91 98260 12345',
  '123 Forest Floor Ave, Mushroom City',
  '[{"product_id": "p1", "quantity": 1}]'::JSONB
);
-- Expected: 'ORDER_REQUEST_CREATED'.

SELECT * FROM public.create_order_secure(
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::UUID,
  'Jane Doe',
  'jane.doe@example.com',
  '+91 98260 12345',
  '123 Forest Floor Ave, Mushroom City',
  '[{"product_id": "p1", "quantity": 1}]'::JSONB
);
-- Expected: Returns the same Order UUID and 'ORDER_REQUEST_ALREADY_EXISTS'.

-- Verify that no additional line items were inserted into the database for this idempotency key
SELECT count(*) 
FROM public.commerce_order_items 
WHERE order_id = (SELECT id FROM public.commerce_orders WHERE idempotency_key = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22');
-- Expected: Exactly 1 row.

ROLLBACK;


-- Test C: Input validation checks and expected custom error SQLSTATE classes
BEGIN;

-- 1. Null Idempotency Key
-- Expected custom SQLSTATE: P1001 ('INVALID_IDEMPOTENCY_KEY')
-- SELECT * FROM public.create_order_secure(NULL, 'Jane Doe', 'user@mail.com', '+91 9999999999', '123 Forest Ave', '[{"product_id": "p1", "quantity": 1}]'::JSONB);

-- 2. Invalid Name (Control characters check)
-- Expected custom SQLSTATE: P1002 ('INVALID_NAME')
-- SELECT * FROM public.create_order_secure('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::UUID, 'Jane' || CHR(10) || 'Doe', 'user@mail.com', '+91 9999999999', '123 Forest Ave', '[{"product_id": "p1", "quantity": 1}]'::JSONB);

-- 3. Invalid Email Format
-- Expected custom SQLSTATE: P1003 ('INVALID_EMAIL')
-- SELECT * FROM public.create_order_secure('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::UUID, 'Jane Doe', 'invalid-email', '+91 9999999999', '123 Forest Ave', '[{"product_id": "p1", "quantity": 1}]'::JSONB);

-- 4. Invalid Phone Format
-- Expected custom SQLSTATE: P1004 ('INVALID_PHONE')
-- SELECT * FROM public.create_order_secure('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::UUID, 'Jane Doe', 'user@mail.com', 'abc-123', '123 Forest Ave', '[{"product_id": "p1", "quantity": 1}]'::JSONB);

-- 5. Too Many Raw Items (> 50 elements)
-- Expected custom SQLSTATE: P1007 ('TOO_MANY_RAW_ITEMS')
-- SELECT * FROM public.create_order_secure('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::UUID, 'Jane Doe', 'user@mail.com', '+91 9999999999', '123 Forest Ave', '[...51 items...]'::JSONB);

-- 6. Zero Quantity Rejected
-- Expected custom SQLSTATE: P1010 ('INVALID_QUANTITY')
-- SELECT * FROM public.create_order_secure('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::UUID, 'Jane Doe', 'user@mail.com', '+91 9999999999', '123 Forest Ave', '[{"product_id": "p1", "quantity": 0}]'::JSONB);

-- 7. Quantity > 50 Rejected
-- Expected custom SQLSTATE: P1010 ('INVALID_QUANTITY')
-- SELECT * FROM public.create_order_secure('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::UUID, 'Jane Doe', 'user@mail.com', '+91 9999999999', '123 Forest Ave', '[{"product_id": "p1", "quantity": 51}]'::JSONB);

-- 8. Missing product ID rejected
-- Expected custom SQLSTATE: P1012 ('PRODUCT_NOT_FOUND')
-- SELECT * FROM public.create_order_secure('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::UUID, 'Jane Doe', 'user@mail.com', '+91 9999999999', '123 Forest Ave', '[{"product_id": "invalid_id", "quantity": 1}]'::JSONB);

ROLLBACK;
