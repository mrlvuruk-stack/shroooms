import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "./Payment.css";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Payment = (props) => {
  const {
    paymentStep,
    onSubmit,
    submissionStatus,
    errorMsg,
    onStartNewOrder,
    addressDetails,
    email,
    phone
  } = props;
  const cart = useSelector((state) => state.cart);

  const cartTotal = cart.cartData.cartTotal;
  const isPending = submissionStatus === "PENDING";
  const isRetryable = submissionStatus === "RETRYABLE_FAILURE";

  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const handleRazorpayCheckout = async (e) => {
    if (e) e.preventDefault();
    if (isPending || loading) return;

    setPaymentError("");
    setLoading(true);

    try {
      // 1. Ensure Razorpay script is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        setPaymentError("Razorpay SDK failed to load. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // Convert cart total to paise (minimum 100 paise = ₹1)
      const amountInPaise = Math.max(Math.round(cartTotal * 100), 100);

      // STEP 1: BACKEND - Create Order (POST /api/create-order)
      let orderResponse;
      try {
        orderResponse = await axios.post("/api/create-order", {
          amount: amountInPaise,
          currency: "INR",
          receipt: `receipt_${Date.now()}`
        });
      } catch (err) {
        console.error("Razorpay order creation failed:", err);
        const errMsg = err.response?.data?.error || err.message || "Failed to create Razorpay order on server";
        setPaymentError(`Order creation error: ${errMsg}`);
        setLoading(false);
        return;
      }

      const orderData = orderResponse.data;
      if (!orderData || !orderData.order_id) {
        setPaymentError("Failed to obtain valid Order ID from Razorpay backend.");
        setLoading(false);
        return;
      }

      const razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_TPYcqdcBX9cPc4";

      // STEP 2: FRONTEND - Open Razorpay Modal with order_id
      const options = {
        key: razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Shroooms",
        description: "Purchase Gourmet Mushrooms",
        order_id: orderData.order_id,
        handler: async function (response) {
          setLoading(true);
          try {
            // STEP 3: BACKEND - Verify Payment Signature (POST /api/verify-payment)
            const verifyRes = await axios.post("/api/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data && verifyRes.data.success) {
              setLoading(false);
              if (onSubmit) {
                onSubmit({
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  signature: response.razorpay_signature
                });
              }
            } else {
              setPaymentError(verifyRes.data?.error || "Payment signature verification failed.");
              setLoading(false);
            }
          } catch (verifyErr) {
            console.error("Payment verification error:", verifyErr);
            const errMsg = verifyErr.response?.data?.error || verifyErr.message || "Payment signature verification failed.";
            setPaymentError(errMsg);
            setLoading(false);
          }
        },
        prefill: {
          name: addressDetails?.name || "",
          email: email || "",
          contact: phone || ""
        },
        theme: {
          color: "#2e7d32"
        },
        modal: {
          ondismiss: function () {
            console.log("Razorpay checkout modal dismissed by user");
            setPaymentError("Payment process was cancelled by user.");
            setLoading(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on("payment.failed", function (response) {
        console.error("Razorpay Payment Failed:", response.error);
        const failMsg = response.error?.description || response.error?.reason || "Payment transaction failed.";
        setPaymentError(`Payment failed: ${failMsg}`);
        setLoading(false);
      });

      razorpayInstance.open();
    } catch (err) {
      console.error("Razorpay Checkout initialization error:", err);
      setPaymentError(`Unexpected checkout error: ${err.message}`);
      setLoading(false);
    }
  };

  const displayError = paymentError || errorMsg;

  return (
    <div className={`checkout-step ${paymentStep}`}>
      <span className="checkout-step__number">3</span>
      <span className="checkout-step__name" data-test-id="payment-title">
        Payment & Order Confirmation
      </span>
      <div className="checkout-step__body checkout-step__body--payment-step">
        <div className="payment--details" style={{ fontSize: "1.4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", margin: "0.8rem 0" }}>
            <p style={{ margin: 0 }}>Items Subtotal: </p>
            <p style={{ margin: 0, fontWeight: "600" }}>₹{cartTotal}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", margin: "0.8rem 0" }}>
            <p style={{ margin: 0 }}>Shipping Charge: </p>
            <p style={{ margin: 0, color: "#2e7d32", fontWeight: "500" }}>Free Delivery</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", margin: "0.8rem 0" }}>
            <p style={{ margin: 0 }}>Taxes & Fees: </p>
            <p style={{ margin: 0, color: "#2e7d32", fontWeight: "500" }}>Included</p>
          </div>
        </div>
        <div className="payment--total" style={{ borderTop: "1px solid #ddd", paddingTop: "1rem", marginTop: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.6rem", fontWeight: "bold" }}>
            <p style={{ margin: 0 }}>Total Amount: </p>
            <p style={{ margin: 0, color: "#2e7d32" }}>₹{cartTotal}</p>
          </div>
          <span style={{ fontSize: "1.1rem", color: "#666", display: "block", marginTop: "0.5rem" }}>
            Secure instant payment powered by Razorpay Standard Web Checkout (UPI, Cards, NetBanking, Wallets).
          </span>
        </div>

        {displayError && (
          <div className="checkout-error-box" style={{
            padding: "1.2rem",
            background: "#f2dede",
            border: "1px solid #ebccd1",
            borderRadius: "8px",
            color: "#a94442",
            fontSize: "1.3rem",
            margin: "1.5rem 0",
            fontWeight: "500"
          }}>
            {displayError}
          </div>
        )}

        {isRetryable && (
          <div className="checkout-retry-box" style={{
            padding: "1.2rem",
            background: "#fcf8e3",
            border: "1px solid #faebcc",
            borderRadius: "8px",
            color: "#8a6d3b",
            fontSize: "1.3rem",
            margin: "1.5rem 0",
            lineHeight: "1.4"
          }}>
            An uncertain server response or network timeout occurred. You can retry payment or start a new order.
          </div>
        )}

        <div className="submit-buttons-group" style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
          <button
            type="button"
            onClick={handleRazorpayCheckout}
            disabled={isPending || loading}
            className="btn-pay-demo"
            style={{
              width: "100%",
              padding: "1.4rem 2.8rem",
              backgroundColor: (isPending || loading) ? "#ccc" : "#2e7d32",
              color: (isPending || loading) ? "#666" : "#fff",
              fontSize: "1.5rem",
              fontWeight: "600",
              border: "none",
              borderRadius: "30px",
              cursor: (isPending || loading) ? "not-allowed" : "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "background-color 0.2s"
            }}
          >
            {loading ? "Initializing Razorpay..." : isPending ? "Processing Order..." : `Pay ₹${cartTotal} Online with Razorpay`}
          </button>

          <button
            type="button"
            onClick={() => onSubmit && onSubmit({ paymentId: "COD_" + Date.now(), mode: "Cash on Delivery" })}
            disabled={isPending || loading}
            style={{
              width: "100%",
              padding: "1.2rem 2.4rem",
              backgroundColor: "transparent",
              color: "#1b2e23",
              fontSize: "1.4rem",
              fontWeight: "700",
              border: "1.5px solid #1b2e23",
              borderRadius: "30px",
              cursor: (isPending || loading) ? "not-allowed" : "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            🚚 Place Order with Cash on Delivery / Direct Contact
          </button>

          {isRetryable && (
            <button
              type="button"
              onClick={onStartNewOrder}
              className="btn-new-order"
              style={{
                width: "100%",
                padding: "1rem 2rem",
                backgroundColor: "#fff",
                color: "#c05600",
                fontSize: "1.3rem",
                fontWeight: "600",
                border: "1px solid #c05600",
                borderRadius: "30px",
                cursor: "pointer",
                textAlign: "center"
              }}
            >
              Start New Order Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default withRouter(Payment);

