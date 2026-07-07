import React from "react";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Payment.css";

const Payment = (props) => {
  const { paymentStep, onSubmit, submissionStatus, errorMsg, onStartNewOrder } = props;
  const cart = useSelector((state) => state.cart);

  const cartTotal = cart.cartData.cartTotal;
  const isPending = submissionStatus === "PENDING";
  const isRetryable = submissionStatus === "RETRYABLE_FAILURE";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPending) return;
    onSubmit();
  };

  return (
    <div className={`checkout-step ${paymentStep}`}>
      <span className="checkout-step__number">3</span>
      <span className="checkout-step__name" data-test-id="payment-title">
        Guest Order Request Confirmation
      </span>
      <div className="checkout-step__body checkout-step__body--payment-step">
        <div className="payment--details" style={{ fontSize: "1.4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", margin: "0.8rem 0" }}>
            <p style={{ margin: 0 }}>Estimated Items Subtotal: </p>
            <p style={{ margin: 0, fontWeight: "600" }}>₹{cartTotal}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", margin: "0.8rem 0" }}>
            <p style={{ margin: 0 }}>Shipping Charge: </p>
            <p style={{ margin: 0, color: "#8a6d3b", fontStyle: "italic" }}>Pending manual calculation</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", margin: "0.8rem 0" }}>
            <p style={{ margin: 0 }}>Estimated Taxes: </p>
            <p style={{ margin: 0, color: "#8a6d3b", fontStyle: "italic" }}>Pending manual calculation</p>
          </div>
        </div>
        <div className="payment--total" style={{ borderTop: "1px solid #ddd", paddingTop: "1rem", marginTop: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.6rem", fontWeight: "bold" }}>
            <p style={{ margin: 0 }}>Estimated Total: </p>
            <p style={{ margin: 0 }}>₹{cartTotal}</p>
          </div>
          <span style={{ fontSize: "1.1rem", color: "#666", display: "block", marginTop: "0.5rem" }}>
            *Excludes shipping and taxes. Offline payment details will be arranged upon verification.
          </span>
        </div>

        <div className="checkout-payment-disabled-notice" style={{
          padding: "1.2rem",
          background: "rgba(90, 75, 49, 0.05)",
          border: "1px solid rgba(90, 75, 49, 0.15)",
          borderRadius: "8px",
          color: "#5a4b31",
          fontSize: "1.3rem",
          textAlign: "left",
          margin: "1.5rem 0",
          lineHeight: "1.4"
        }}>
          <strong>Note:</strong> Online checkout generates a Guest Order Request. Our team will manually review your order request, calculate final shipping/taxes, check stock availability, and contact you shortly via email or phone to coordinate offline payment.
        </div>

        {errorMsg && (
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
            {errorMsg}
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
            An uncertain server response or network timeout occurred. Your request may have already reached the database. You can retry submission with the same safety key, or start a new order.
          </div>
        )}

        <div className="submit-buttons-group" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="btn-pay-demo"
            style={{
              width: "100%",
              padding: "1.4rem 2.8rem",
              backgroundColor: isPending ? "#ccc" : "#a28a5c",
              color: isPending ? "#666" : "#fff",
              fontSize: "1.5rem",
              fontWeight: "600",
              border: "none",
              borderRadius: "30px",
              cursor: isPending ? "not-allowed" : "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "background-color 0.2s"
            }}
          >
            {isPending ? "Submitting Order Request..." : "Submit Guest Order Request"}
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
