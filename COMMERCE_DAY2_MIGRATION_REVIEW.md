# SHROOOMS — COMMERCE DAY 2 MIGRATION REVIEW (REVISED V4)

This document details the final database migration review, preflight check protocols, custom validation SQLSTATE mappings, and the hardened set-based query design for the secure Order Request boundary.

---

## 1. PREFLIGHT DETECT CHECKS
Before executing the database migration, run this read-only preflight check to identify if any schema objects already exist. This prevents accidental namespace overrides:
```sql
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
```
*Note: If any object returns `object_exists = true`, stop and inspect the database state manually before proceeding. Do not assume `IF NOT EXISTS` is sufficient.*

---

## 2. SET-BASED TRANSACTIONAL DESIGN & ONE-SNAPSHOT ISOLATION
We completely avoid the use of temporary database objects or other schema staging constructs inside `create_order_secure` to maintain clean connection pooling and path separation. 

Instead, we use standard PL/pgSQL arrays/JSONB variables and set-based joining:
1. **Raw Validation**: Loops over array elements and validates individual shapes and constraints.
2. **Duplicate Aggregation**: Normalizes duplicate inputs on-the-fly and writes them to a local JSONB variable.
3. **Authoritative Snapshot**: Queries `public.products` exactly once to construct a local JSONB variable containing:
   - `product_id`
   - `product_name`
   - `unit_price`
   - `quantity`
   - `line_total`
4. **Calculations**: Loops through the local snapshot variable to check price ranges, validate numeric line totals, and sum the overall order total.
5. **Idempotency Insertion**: Inserts into `commerce_orders` using `ON CONFLICT DO NOTHING`. If a duplicate key is found, the execution terminates early, returning the existing UUID and status `ORDER_REQUEST_ALREADY_EXISTS` (without inserting any sub-items).
6. **Line Items Insert**: Inserts into `commerce_order_items` directly from the local JSONB snapshot variable (`jsonb_to_recordset()`). No subsequent reads of `public.products` are performed, guaranteeing absolute transactional consistency even if prices change mid-transaction.

---

## 3. APPLICATION SQLSTATE MAPPING

Expected validation failures raise a custom, 5-character SQLSTATE code in the application range `'P1001'` through `'P1014'`. The outer exception block catches and passes these unchanged, while routing all unexpected database errors to a generic `'ORDER_REQUEST_FAILED'` (SQLSTATE `'P1999'`) to prevent stack-trace leaks.

| Custom SQLSTATE | Custom Error Message | Validation Category |
| :--- | :--- | :--- |
| **`P1001`** | `INVALID_IDEMPOTENCY_KEY` | Idempotency Key is null. |
| **`P1002`** | `INVALID_NAME` | Trimmed guest name length < 1 or > 100, or contains ASCII control characters. |
| **`P1003`** | `INVALID_EMAIL` | Trimmed lowercase email length < 3 or > 254, or fails regex, or contains control characters. |
| **`P1004`** | `INVALID_PHONE` | Trimmed phone length < 8 or > 20, or contains invalid characters, or contains control characters. |
| **`P1005`** | `INVALID_ADDRESS` | Trimmed address length < 5 or > 500, or contains control characters. |
| **`P1006`** | `INVALID_ITEMS` | Items payload is null, not an array, or empty. |
| **`P1007`** | `TOO_MANY_RAW_ITEMS` | Items payload length exceeds the technical limit of 50 raw items. |
| **`P1008`** | `INVALID_ITEM_SHAPE` | Elements are not objects, or contain keys other than `product_id` and `quantity`. |
| **`P1009`** | `INVALID_PRODUCT_ID` | Product ID is not a string, or is empty, or exceeds 50, or contains control characters. |
| **`P1010`** | `INVALID_QUANTITY` | Quantity is not an integer, or <= 0, or > 50 (individual or aggregated). |
| **`P1011`** | `TOO_MANY_ITEMS` | Distinct products in the aggregated payload exceed 15. |
| **`P1012`** | `PRODUCT_NOT_FOUND` | Product ID does not match any record in the `public.products` table. |
| **`P1013`** | `INVALID_PRODUCT_PRICE` | Product price is null, negative, or overflows the NUMERIC scale. |
| **`P1014`** | `ORDER_TOTAL_TOO_LARGE` | Items total exceeds `999999.99` or overflows numeric bounds. |
| **`P1999`** | `ORDER_REQUEST_FAILED` | Unexpected database exception occurred (generic error). |

---

## 4. ADDITIVE SCHEMA TABLES

### 4.1 `public.commerce_orders`
- **`id`** `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- **`idempotency_key`** `UUID NOT NULL UNIQUE` (Final database-level race protection)
- **`guest_name`** `TEXT NOT NULL` (Length check: 1 to 100 after trim)
- **`guest_email`** `TEXT NOT NULL` (Length check: 3 to 254 after trim)
- **`guest_phone`** `TEXT NOT NULL` (Length check: 8 to 20 after trim)
- **`delivery_address`** `TEXT NOT NULL` (Length check: 5 to 500 after trim)
- **`items_total`** `NUMERIC(14,2) NOT NULL` (Constraint: `>= 0`)
- **`status`** `TEXT NOT NULL DEFAULT 'Pending'` (Constraint: strictly `'Pending'`)
- **`payment_status`** `TEXT NOT NULL DEFAULT 'Unpaid'` (Constraint: strictly `'Unpaid'`)
- **`created_at`** `TIMESTAMPTZ NOT NULL DEFAULT NOW()`
- **RLS Status**: **ENABLED**.
- **Privileges**: Direct reads (`SELECT`), inserts (`INSERT`), updates (`UPDATE`), and deletes (`DELETE`) are fully revoked from `anon`, `authenticated`, and `PUBLIC`.

### 4.2 `public.commerce_order_items`
- **`id`** `BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY`
- **`order_id`** `UUID NOT NULL REFERENCES public.commerce_orders(id) ON DELETE CASCADE`
- **`product_id`** `TEXT NOT NULL REFERENCES public.products(_id)`
- **`product_name_snapshot`** `TEXT NOT NULL`
- **`unit_price`** `NUMERIC(14,2) NOT NULL` (Constraint: `>= 0`)
- **`quantity`** `INTEGER NOT NULL` (Constraint: `> 0` and `<= 50`)
- **`line_total`** `NUMERIC(14,2) NOT NULL` (Constraint: `>= 0`)
- **Indexes**: Single index `idx_commerce_order_items_order_id` on the `order_id` foreign key.
- **RLS Status**: **ENABLED**.
- **Privileges**: Direct CRUD privileges are fully revoked.

---

## 5. REVISION NOTES & STATUS
- **Admin Access**: `COMMERCE_ORDER_ADMIN_ACCESS = DEFERRED` (deferred to checkout integration).
- **Payment / Shipping / Tax**: Intentionally deferred to prevent arbitrary rule injection.
- **Status Verdict**: **`COMMERCE_DAY2_MIGRATION_READY_FOR_HUMAN_REVIEW`**
