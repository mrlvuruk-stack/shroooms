// Pure submission lifecycle helper functions for Checkout orchestration

export const uuidv4Fallback = (randomBytesGenerator) => {
  // Use provided random bytes generator or fallback to simple Math.random for Node testing compatibility
  const getRandomValues = randomBytesGenerator || ((arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  });
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

export const getCartFingerprint = (vegetablesCart) => {
  if (!vegetablesCart || vegetablesCart.length === 0) return "";
  return vegetablesCart
    .map((item) => `${item._id}:${item.quantity}`)
    .sort()
    .join("|");
};

export const readSubmissionRecord = (sessionStorageInstance) => {
  const stored = sessionStorageInstance.getItem("shroooms_checkout_submission");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
};

export const writeSubmissionRecord = (sessionStorageInstance, record) => {
  sessionStorageInstance.setItem(
    "shroooms_checkout_submission",
    JSON.stringify(record)
  );
};

export const initializeSubmission = (sessionStorageInstance, cryptoInstance, currentFingerprint) => {
  let newUUID;
  if (cryptoInstance && cryptoInstance.randomUUID) {
    newUUID = cryptoInstance.randomUUID();
  } else if (cryptoInstance && cryptoInstance.getRandomValues) {
    const bytesGen = (arr) => cryptoInstance.getRandomValues(arr);
    newUUID = uuidv4Fallback(bytesGen);
  } else {
    newUUID = uuidv4Fallback();
  }

  const initialRecord = {
    idempotencyKey: newUUID,
    cartFingerprint: currentFingerprint,
    lifecycleStatus: "IDLE",
    locked: false,
  };
  writeSubmissionRecord(sessionStorageInstance, initialRecord);
  return newUUID;
};

export const lockSubmission = (sessionStorageInstance, idempotencyKey, currentFingerprint) => {
  const activeRecord = {
    idempotencyKey,
    cartFingerprint: currentFingerprint,
    lifecycleStatus: "PENDING",
    locked: true,
  };
  writeSubmissionRecord(sessionStorageInstance, activeRecord);
};

export const classifySubmissionFailure = (sessionStorageInstance, idempotencyKey, currentFingerprint, result) => {
  const isExpectedValidation = result && result.category === "EXPECTED_VALIDATION";
  const updatedRecord = {
    idempotencyKey,
    cartFingerprint: currentFingerprint,
    lifecycleStatus: isExpectedValidation ? "IDLE" : "RETRYABLE_FAILURE",
    locked: !isExpectedValidation,
  };
  writeSubmissionRecord(sessionStorageInstance, updatedRecord);
};

export const validateSuccessfulOrderResponse = (result) => {
  if (!result || !result.ok) {
    return { ok: false, error: "Result not ok" };
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!result.orderRequestId || !uuidRegex.test(result.orderRequestId)) {
    return { ok: false, error: "Missing or malformed order request identifier." };
  }
  if (result.resultCode !== "ORDER_REQUEST_CREATED" && result.resultCode !== "ORDER_REQUEST_ALREADY_EXISTS") {
    return { ok: false, error: "Invalid result code." };
  }
  return { ok: true };
};

export const completeSuccessfulSubmission = (sessionStorageInstance) => {
  sessionStorageInstance.removeItem("shroooms_checkout_submission");
};
