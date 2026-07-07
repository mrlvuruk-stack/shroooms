import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PhoneVerification from "../../components/CheckoutForm/PhoneVerification/PhoneVerification";
import DeliveryAddress from "../../components/CheckoutForm/DeliveryAddress/DeliveryAddess";
import Payment from "../../components/CheckoutForm/Payment/Payment";
import CheckOutOrder from "../../components/CheckoutForm/CheckoutOrder/CheckoutOrder";
import { sendOrderDetails } from "../../store/actions/actionCreators/orderAction";
import "./Checkout.css";

const uuidv4Fallback = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

const getCartFingerprint = (vegetablesCart) => {
  if (!vegetablesCart || vegetablesCart.length === 0) return "";
  return vegetablesCart
    .map((item) => `${item._id}:${item.quantity}`)
    .sort()
    .join("|");
};

const Checkout = (props) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const vegetablesCart = cart.cartData.vegetablesCart;
  const currentFingerprint = getCartFingerprint(vegetablesCart);

  // States
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressDetails, setAddressDetails] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState("IDLE"); // IDLE, PENDING, RETRYABLE_FAILURE, SUCCESS
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [orderRequestId, setOrderRequestId] = useState("");
  const [resultCode, setResultCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);

  // Steps active status
  const [step1Status, setStep1Status] = useState("active"); // active, complete
  const [step2Status, setStep2Status] = useState("");       // "", active, complete
  const [step3Status, setStep3Status] = useState("");       // "", active

  // Redirect if cart is empty and order is not successfully completed
  useEffect(() => {
    if (cart.cartData.totalQuantity === 0 && submissionStatus !== "SUCCESS") {
      props.history.push("/");
    }
  }, [cart.cartData.totalQuantity, submissionStatus, props.history]);

  // Recover or generate idempotency key on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("shroooms_checkout_submission");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.idempotencyKey) {
          // If locked is true, reuse key regardless of cart fingerprint mismatch
          if (
            parsed.locked &&
            (parsed.lifecycleStatus === "PENDING" ||
              parsed.lifecycleStatus === "RETRYABLE_FAILURE")
          ) {
            setIdempotencyKey(parsed.idempotencyKey);
            setSubmissionStatus(parsed.lifecycleStatus);
            setShowConfirmAlert(true);
            return;
          }
          // If not locked, check fingerprint
          if (parsed.cartFingerprint === currentFingerprint) {
            setIdempotencyKey(parsed.idempotencyKey);
            setSubmissionStatus(parsed.lifecycleStatus || "IDLE");
            return;
          }
        }
      } catch (e) {
        // Ignore JSON errors
      }
    }

    // Generate new UUID
    const newUUID = crypto.randomUUID ? crypto.randomUUID() : uuidv4Fallback();
    setIdempotencyKey(newUUID);
    const initialRecord = {
      idempotencyKey: newUUID,
      cartFingerprint: currentFingerprint,
      lifecycleStatus: "IDLE",
      locked: false,
    };
    sessionStorage.setItem(
      "shroooms_checkout_submission",
      JSON.stringify(initialRecord)
    );
  }, [currentFingerprint]);

  const handleStep1Complete = () => {
    setStep1Status("complete");
    setStep2Status("active");
  };

  const handleStep1Edit = () => {
    setStep1Status("active");
    setStep2Status("");
    setStep3Status("");
  };

  const handleStep2Complete = (details) => {
    setAddressDetails(details);
    setStep2Status("complete");
    setStep3Status("active");
  };

  const handleStep2Edit = () => {
    setStep2Status("active");
    setStep3Status("");
  };

  const handleStartNewOrder = () => {
    if (window.confirm("Warning: Your previous order request may have already been received. Do you want to discard it and start a new order request?")) {
      const newUUID = crypto.randomUUID ? crypto.randomUUID() : uuidv4Fallback();
      setIdempotencyKey(newUUID);
      setSubmissionStatus("IDLE");
      setShowConfirmAlert(false);
      setErrorMsg("");

      const newRecord = {
        idempotencyKey: newUUID,
        cartFingerprint: currentFingerprint,
        lifecycleStatus: "IDLE",
        locked: false,
      };
      sessionStorage.setItem(
        "shroooms_checkout_submission",
        JSON.stringify(newRecord)
      );

      setStep1Status("active");
      setStep2Status("");
      setStep3Status("");
    }
  };

  const handleOrderSubmit = async () => {
    if (submissionStatus === "PENDING") return;

    // Immediately before RPC invocation, lock the submission in sessionStorage
    setSubmissionStatus("PENDING");
    setErrorMsg("");

    const activeRecord = {
      idempotencyKey: idempotencyKey,
      cartFingerprint: currentFingerprint,
      lifecycleStatus: "PENDING",
      locked: true,
    };
    sessionStorage.setItem(
      "shroooms_checkout_submission",
      JSON.stringify(activeRecord)
    );

    // Concatenate address
    const addressParts = [
      addressDetails.flatNumber.trim(),
      addressDetails.streetName.trim(),
      addressDetails.locality.trim(),
      addressDetails.city.trim(),
      addressDetails.state.trim(),
    ].filter((part) => part && part.length > 0);
    const p_address = addressParts.join(", ");

    // Client-side verification (UX only)
    if (addressDetails.name.trim().length < 1 || addressDetails.name.trim().length > 100) {
      setSubmissionStatus("IDLE");
      setErrorMsg("Name length must be between 1 and 100 characters inclusive.");
      return;
    }
    if (p_address.length < 5 || p_address.length > 500) {
      setSubmissionStatus("IDLE");
      setErrorMsg("Delivery address length must be between 5 and 500 characters inclusive.");
      return;
    }

    const result = await dispatch(
      sendOrderDetails({
        idempotencyKey,
        name: addressDetails.name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: p_address,
        cartItems: vegetablesCart,
      })
    );

    if (result.ok) {
      setSubmissionStatus("SUCCESS");
      setOrderRequestId(result.orderRequestId);
      setResultCode(result.resultCode);
      sessionStorage.removeItem("shroooms_checkout_submission");
    } else {
      if (result.category === "EXPECTED_VALIDATION") {
        setSubmissionStatus("IDLE");
        setErrorMsg(result.safeMessage);

        const updatedRecord = {
          idempotencyKey: idempotencyKey,
          cartFingerprint: currentFingerprint,
          lifecycleStatus: "IDLE",
          locked: false,
        };
        sessionStorage.setItem(
          "shroooms_checkout_submission",
          JSON.stringify(updatedRecord)
        );
      } else {
        setSubmissionStatus("RETRYABLE_FAILURE");
        setErrorMsg(result.safeMessage);

        const updatedRecord = {
          idempotencyKey: idempotencyKey,
          cartFingerprint: currentFingerprint,
          lifecycleStatus: "RETRYABLE_FAILURE",
          locked: true,
        };
        sessionStorage.setItem(
          "shroooms_checkout_submission",
          JSON.stringify(updatedRecord)
        );
      }
    }
  };

  if (cart.cartData.totalQuantity === 0 && submissionStatus !== "SUCCESS") {
    return null;
  }

  if (submissionStatus === "SUCCESS") {
    return (
      <div
        className="checkout-success-container"
        style={{
          padding: "3rem",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          textAlign: "center",
          maxWidth: "600px",
          margin: "40px auto",
          border: "1px solid #e2ebd5",
        }}
      >
        <div
          className="success-icon"
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "#f1f8e9",
            color: "#689f38",
            fontSize: "3.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 2rem auto",
            fontWeight: "bold",
          }}
        >
          ✓
        </div>
        <h2
          style={{
            fontSize: "2.4rem",
            color: "#2e7d32",
            marginBottom: "1rem",
            fontWeight: "bold",
          }}
        >
          Order Request Submitted
        </h2>
        <p
          style={{
            fontSize: "1.5rem",
            color: "#555",
            lineHeight: "1.6",
            marginBottom: "2rem",
          }}
        >
          Your order request has been successfully received. Our team will
          contact you shortly to verify availability, calculate final
          shipping/taxes, and arrange offline payment.
        </p>
        <div
          className="request-details"
          style={{
            background: "#f9f9f9",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #eee",
            marginBottom: "2.5rem",
            textAlign: "left",
            fontSize: "1.4rem",
          }}
        >
          <p style={{ margin: "0.5rem 0" }}>
            <strong>Request Status:</strong> Pending Verification
          </p>
          <p style={{ margin: "0.5rem 0", wordBreak: "break-all" }}>
            <strong>Request ID:</strong> {orderRequestId}
          </p>
          <p style={{ margin: "0.5rem 0" }}>
            <strong>Result Code:</strong> {resultCode}
          </p>
        </div>
        <button
          onClick={() => props.history.push("/")}
          className="btn submit__btn"
          style={{
            padding: "1.2rem 3rem",
            borderRadius: "30px",
            fontSize: "1.4rem",
            fontWeight: "bold",
            background: "#a28a5c",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper wrapper">
      <div className="checkout">
        {showConfirmAlert && (
          <div
            className="checkout-locked-alert"
            style={{
              gridColumn: "1 / -1",
              padding: "1.5rem",
              background: "#fcf8e3",
              border: "1px solid #faebcc",
              borderRadius: "8px",
              color: "#8a6d3b",
              fontSize: "1.4rem",
              marginBottom: "2rem",
              lineHeight: "1.5",
            }}
          >
            <p style={{ margin: "0 0 1rem 0" }}>
              <strong>Caution:</strong> You have an unfinished order request
              active in this browser session. If you experienced a network error
              or refresh, you should try submitting again to use the same safety
              key.
            </p>
            <button
              onClick={handleStartNewOrder}
              className="btn submit__btn"
              style={{
                background: "#c05600",
                color: "#fff",
                border: "none",
                padding: "0.6rem 1.5rem",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              Start New Order Request
            </button>
          </div>
        )}

        <PhoneVerification
          stepStatus={step1Status}
          email={email}
          setEmail={setEmail}
          phone={phone}
          setPhone={setPhone}
          onComplete={handleStep1Complete}
          onEdit={handleStep1Edit}
        />
        <DeliveryAddress
          stepStatus={step2Status}
          addressDetails={addressDetails}
          onComplete={handleStep2Complete}
          onEdit={handleStep2Edit}
        />
        <Payment
          paymentStep={step3Status}
          onSubmit={handleOrderSubmit}
          submissionStatus={submissionStatus}
          errorMsg={errorMsg}
          onStartNewOrder={handleStartNewOrder}
        />
      </div>
      <CheckOutOrder />
    </div>
  );
};

export default Checkout;
