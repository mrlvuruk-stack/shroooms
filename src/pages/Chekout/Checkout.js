import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PhoneVerification from "../../components/CheckoutForm/PhoneVerification/PhoneVerification";
import DeliveryAddress from "../../components/CheckoutForm/DeliveryAddress/DeliveryAddess";
import Payment from "../../components/CheckoutForm/Payment/Payment";
import CheckOutOrder from "../../components/CheckoutForm/CheckoutOrder/CheckoutOrder";
import { sendOrderDetails } from "../../store/actions/actionCreators/orderAction";
import "./Checkout.css";

import {
  getCartFingerprint,
  readSubmissionRecord,
  initializeSubmission,
  lockSubmission,
  classifySubmissionFailure,
  validateSuccessfulOrderResponse,
  completeSuccessfulSubmission
} from "./checkoutSubmissionLifecycle";

const Checkout = (props) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const vegetablesCart = cart.cartData.vegetablesCart;
  const currentFingerprint = getCartFingerprint(vegetablesCart);

  const userSignIn = useSelector((state) => state.userSignIn);
  const { userInfo } = userSignIn;

  // States
  const [email, setEmail] = useState(userInfo?.email || "");
  const [phone, setPhone] = useState(userInfo?.phone || localStorage.getItem("customerPhone") || "");
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

  // Auto-sync Google email/phone if changed
  useEffect(() => {
    if (userInfo?.email && !email) {
      setEmail(userInfo.email);
    }
    const savedPhone = localStorage.getItem("customerPhone");
    if (savedPhone && !phone) {
      setPhone(savedPhone);
    }
  }, [userInfo, email, phone]);

  // Redirect if cart is empty and order is not successfully completed
  useEffect(() => {
    if (cart.cartData.totalQuantity === 0 && submissionStatus !== "SUCCESS") {
      props.history.push("/");
    }
  }, [cart.cartData.totalQuantity, submissionStatus, props.history]);

  // Recover or generate idempotency key on mount
  useEffect(() => {
    const parsed = readSubmissionRecord(sessionStorage);
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

    // Generate new UUID
    const cryptoInstance = typeof crypto !== "undefined" ? crypto : null;
    const newUUID = initializeSubmission(sessionStorage, cryptoInstance, currentFingerprint);
    setIdempotencyKey(newUUID);
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
      const cryptoInstance = typeof crypto !== "undefined" ? crypto : null;
      const newUUID = initializeSubmission(sessionStorage, cryptoInstance, currentFingerprint);
      setIdempotencyKey(newUUID);
      setSubmissionStatus("IDLE");
      setShowConfirmAlert(false);
      setErrorMsg("");

      setStep1Status("active");
      setStep2Status("");
      setStep3Status("");
    }
  };

  const handleOrderSubmit = async (paymentDetails = null) => {
    if (submissionStatus === "PENDING") return;

    // Immediately before RPC invocation, lock the submission in sessionStorage
    setSubmissionStatus("PENDING");
    setErrorMsg("");

    lockSubmission(sessionStorage, idempotencyKey, currentFingerprint);

    // Concatenate address
    const addressParts = [
      addressDetails ? addressDetails.flatNumber.trim() : "",
      addressDetails ? addressDetails.streetName.trim() : "",
      addressDetails ? addressDetails.locality.trim() : "",
      addressDetails ? addressDetails.city.trim() : "",
      addressDetails ? addressDetails.state.trim() : "",
    ].filter((part) => part && part.length > 0);
    const p_address = addressParts.join(", ");

    // Client-side verification (UX only)
    if (addressDetails && (addressDetails.name.trim().length < 1 || addressDetails.name.trim().length > 100)) {
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
        name: addressDetails ? addressDetails.name.trim() : "",
        email: email.trim(),
        phone: phone.trim(),
        address: p_address,
        cartItems: vegetablesCart,
        paymentDetails: paymentDetails || null,
      })
    );

    const validation = validateSuccessfulOrderResponse(result);
    if (validation.ok) {
      setSubmissionStatus("SUCCESS");
      setOrderRequestId(result.orderRequestId);
      setResultCode(result.resultCode);
      completeSuccessfulSubmission(sessionStorage);
    } else {
      classifySubmissionFailure(sessionStorage, idempotencyKey, currentFingerprint, result);
      setErrorMsg(result.safeMessage || "An error occurred while submitting your order request.");
      if (result.category === "EXPECTED_VALIDATION") {
        setSubmissionStatus("IDLE");
      } else {
        setSubmissionStatus("RETRYABLE_FAILURE");
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
          addressDetails={addressDetails}
          email={email}
          phone={phone}
        />
      </div>
      <CheckOutOrder />
    </div>
  );
};

export default Checkout;
