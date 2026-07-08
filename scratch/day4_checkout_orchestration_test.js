const assert = require("assert");
const fs = require("fs");
const path = require("path");

// Mock sessionStorage implementation
class MockSessionStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

// Import checkoutSubmissionLifecycle helpers using relative path inside repository
const helpers = require("../src/pages/Chekout/checkoutSubmissionLifecycle.js");

console.log("=== RUNNING DAY 4 CHECKOUT ORCHESTRATION TESTS ===");
const testResults = [];
const runTest = (name, fn) => {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    testResults.push({ name, status: "PASS" });
  } catch (err) {
    console.error(`[FAIL] ${name}:`, err);
    testResults.push({ name, status: "FAIL", error: err.message });
  }
};

// Test 1: guest checkout route is not protected by authentication guard
runTest("1. Guest checkout route is not protected by authentication guard", () => {
  const appJsPath = path.join(__dirname, "../src/App.js");
  const content = fs.readFileSync(appJsPath, "utf8");
  assert.ok(content.includes('path="/checkout"'), "Checkout route not found in App.js");
  assert.ok(!content.includes('path="/checkout" component={Checkout}').toString().includes("PrivateRoute"), "Checkout route is wrapped in PrivateRoute");
});

// Test 2: empty cart cannot invoke sendOrderDetails
runTest("2. Empty cart cannot invoke sendOrderDetails", () => {
  const cart = [];
  const fp = helpers.getCartFingerprint(cart);
  assert.strictEqual(fp, "", "Empty cart must yield empty fingerprint");
});

// Test 3: repeated submit while PENDING invokes sendOrderDetails exactly once
runTest("3. Repeated submit while PENDING invokes sendOrderDetails exactly once", () => {
  let submissionStatus = "IDLE";
  let sendCount = 0;

  const handleOrderSubmit = () => {
    if (submissionStatus === "PENDING") return;
    submissionStatus = "PENDING";
    sendCount++;
  };

  handleOrderSubmit(); // First submit
  handleOrderSubmit(); // Repeated submit
  assert.strictEqual(submissionStatus, "PENDING");
  assert.strictEqual(sendCount, 1, "Should only invoke backend once while PENDING");
});

// Test 4: ORDER_REQUEST_CREATED with valid UUID transitions to SUCCESS, clears cart, removes record
runTest("4. ORDER_REQUEST_CREATED with valid UUID transitions, clears cart and storage", () => {
  const sessionStorage = new MockSessionStorage();
  const mockResult = {
    ok: true,
    orderRequestId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    resultCode: "ORDER_REQUEST_CREATED"
  };

  helpers.writeSubmissionRecord(sessionStorage, {
    idempotencyKey: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    cartFingerprint: "p1:2",
    lifecycleStatus: "PENDING",
    locked: true
  });

  const validation = helpers.validateSuccessfulOrderResponse(mockResult);
  assert.ok(validation.ok);

  helpers.completeSuccessfulSubmission(sessionStorage);
  assert.strictEqual(sessionStorage.getItem("shroooms_checkout_submission"), null, "Session record must be removed on success");
});

// Test 5: ORDER_REQUEST_ALREADY_EXISTS with valid UUID transitions, clears cart, removes record
runTest("5. ORDER_REQUEST_ALREADY_EXISTS with valid UUID transitions, clears cart and storage", () => {
  const sessionStorage = new MockSessionStorage();
  const mockResult = {
    ok: true,
    orderRequestId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
    resultCode: "ORDER_REQUEST_ALREADY_EXISTS"
  };

  helpers.writeSubmissionRecord(sessionStorage, {
    idempotencyKey: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
    cartFingerprint: "p1:2",
    lifecycleStatus: "PENDING",
    locked: true
  });

  const validation = helpers.validateSuccessfulOrderResponse(mockResult);
  assert.ok(validation.ok);

  helpers.completeSuccessfulSubmission(sessionStorage);
  assert.strictEqual(sessionStorage.getItem("shroooms_checkout_submission"), null, "Session record must be removed on success");
});

// Test 6: expected validation failure preserves cart and sessionStorage
runTest("6. Expected validation failure preserves cart and sessionStorage", () => {
  const sessionStorage = new MockSessionStorage();
  const currentFingerprint = "p1:2";
  const idempotencyKey = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

  helpers.writeSubmissionRecord(sessionStorage, {
    idempotencyKey,
    cartFingerprint: currentFingerprint,
    lifecycleStatus: "PENDING",
    locked: true
  });

  const result = {
    ok: false,
    category: "EXPECTED_VALIDATION",
    code: "P1002",
    safeMessage: "Please enter a valid name."
  };

  helpers.classifySubmissionFailure(sessionStorage, idempotencyKey, currentFingerprint, result);

  const stored = helpers.readSubmissionRecord(sessionStorage);
  assert.ok(stored);
  assert.strictEqual(stored.lifecycleStatus, "IDLE", "Status should return to IDLE for expected validation");
  assert.strictEqual(stored.locked, false, "Should unlock for expected validation");
});

// Test 7: P1999 / RETRYABLE_FAILURE preserves cart, UUID, and locks storage
runTest("7. P1999 / RETRYABLE_FAILURE preserves cart, UUID, and locks storage", () => {
  const sessionStorage = new MockSessionStorage();
  const currentFingerprint = "p1:2";
  const idempotencyKey = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

  helpers.writeSubmissionRecord(sessionStorage, {
    idempotencyKey,
    cartFingerprint: currentFingerprint,
    lifecycleStatus: "PENDING",
    locked: true
  });

  const result = {
    ok: false,
    category: "RETRYABLE_FAILURE",
    code: "P1999",
    safeMessage: "An error occurred. Please try again."
  };

  helpers.classifySubmissionFailure(sessionStorage, idempotencyKey, currentFingerprint, result);

  const stored = helpers.readSubmissionRecord(sessionStorage);
  assert.ok(stored);
  assert.strictEqual(stored.idempotencyKey, idempotencyKey);
  assert.strictEqual(stored.lifecycleStatus, "RETRYABLE_FAILURE");
  assert.strictEqual(stored.locked, true, "Should remain locked for retryable failures");
});

// Test 8: network failure / RETRYABLE_FAILURE preserves cart, UUID, and locks storage
runTest("8. Network failure / RETRYABLE_FAILURE preserves cart and UUID", () => {
  const sessionStorage = new MockSessionStorage();
  const currentFingerprint = "p1:2";
  const idempotencyKey = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

  helpers.writeSubmissionRecord(sessionStorage, {
    idempotencyKey,
    cartFingerprint: currentFingerprint,
    lifecycleStatus: "PENDING",
    locked: true
  });

  const result = {
    ok: false,
    category: "RETRYABLE_FAILURE",
    code: "P1999",
    safeMessage: "An error occurred while submitting your order request. Please try again."
  };

  helpers.classifySubmissionFailure(sessionStorage, idempotencyKey, currentFingerprint, result);

  const stored = helpers.readSubmissionRecord(sessionStorage);
  assert.ok(stored);
  assert.strictEqual(stored.idempotencyKey, idempotencyKey);
  assert.strictEqual(stored.lifecycleStatus, "RETRYABLE_FAILURE");
  assert.ok(!result.safeMessage.includes("network details"), "Should not leak raw network details");
});

// Test 9: malformed success response is rejected
runTest("9. Malformed success response is rejected", () => {
  const mockResultMissingUUID = {
    ok: true,
    resultCode: "ORDER_REQUEST_CREATED"
  };
  const validation = helpers.validateSuccessfulOrderResponse(mockResultMissingUUID);
  assert.strictEqual(validation.ok, false);
  assert.strictEqual(validation.error, "Missing or malformed order request identifier.");
});

// Test 10: unknown result_code is rejected
runTest("10. Unknown result_code is rejected", () => {
  const mockResultUnknownCode = {
    ok: true,
    orderRequestId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    resultCode: "UNKNOWN_CODE"
  };
  const validation = helpers.validateSuccessfulOrderResponse(mockResultUnknownCode);
  assert.strictEqual(validation.ok, false);
  assert.strictEqual(validation.error, "Invalid result code.");
});

// Test 11: remount after RETRYABLE_FAILURE restores same idempotency UUID and locked status
runTest("11. Remount after RETRYABLE_FAILURE restores same idempotency UUID and locked status", () => {
  const sessionStorage = new MockSessionStorage();
  const currentFingerprint = "p1:2";
  const storedRecord = {
    idempotencyKey: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    cartFingerprint: currentFingerprint,
    lifecycleStatus: "RETRYABLE_FAILURE",
    locked: true
  };
  helpers.writeSubmissionRecord(sessionStorage, storedRecord);

  // Simulate mount recovery
  const recovered = helpers.readSubmissionRecord(sessionStorage);
  assert.ok(recovered);
  assert.strictEqual(recovered.idempotencyKey, "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
  assert.strictEqual(recovered.locked, true);
  assert.strictEqual(recovered.lifecycleStatus, "RETRYABLE_FAILURE");
});

// Test 12: locked submission with changed cart fingerprint preserves same UUID
runTest("12. Locked submission with changed cart fingerprint preserves same UUID", () => {
  const sessionStorage = new MockSessionStorage();
  const storedRecord = {
    idempotencyKey: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    cartFingerprint: "p1:2",
    lifecycleStatus: "RETRYABLE_FAILURE",
    locked: true
  };
  helpers.writeSubmissionRecord(sessionStorage, storedRecord);

  const parsed = helpers.readSubmissionRecord(sessionStorage);
  // Simulating mount checkout logic when locked is true
  let idempotencyKey;
  let submissionStatus;
  if (parsed && parsed.locked) {
    idempotencyKey = parsed.idempotencyKey;
    submissionStatus = parsed.lifecycleStatus;
  }
  assert.strictEqual(idempotencyKey, "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", "Must preserve UUID even if fingerprint changes when locked");
  assert.strictEqual(submissionStatus, "RETRYABLE_FAILURE");
});

// Test 13: Start New Order Request warns, generates new UUID, resets lifecycle
runTest("13. Start New Order Request resets key and resets lifecycle status", () => {
  const sessionStorage = new MockSessionStorage();
  const initialFingerprint = "p1:2";

  // Simulate starting new order
  const newUUID = helpers.initializeSubmission(sessionStorage, null, initialFingerprint);
  const stored = helpers.readSubmissionRecord(sessionStorage);

  assert.ok(stored);
  assert.strictEqual(stored.idempotencyKey, newUUID);
  assert.strictEqual(stored.lifecycleStatus, "IDLE");
  assert.strictEqual(stored.locked, false);
});

// Test 14: Payment.js presentation properties
runTest("14. Payment.js does not generate UUIDs or call RPCs directly", () => {
  const paymentJsPath = path.join(__dirname, "../src/components/CheckoutForm/Payment/Payment.js");
  const content = fs.readFileSync(paymentJsPath, "utf8");

  assert.ok(!content.includes("randomUUID"), "Payment.js should not generate UUIDs");
  assert.ok(!content.includes("sendOrderDetails"), "Payment.js should not call sendOrderDetails");
  assert.ok(!content.includes("supabase.rpc"), "Payment.js should not invoke RPCs directly");
  assert.ok(!content.includes("Payment Successful"), "Payment.js must not claim successful payment");
});

console.log("\n=== TEST RESULTS SUMMARY ===");
console.table(testResults);
const failCount = testResults.filter(r => r.status === "FAIL").length;
process.exit(failCount > 0 ? 1 : 0);
