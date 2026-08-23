import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./PhoneVerification.css";

const PhoneVerification = (props) => {
  const { stepStatus, email, setEmail, phone, setPhone, onComplete, onEdit } = props;

  const userSignIn = useSelector((state) => state.userSignIn);
  const { userInfo } = userSignIn;

  // Auto-populate email from Google user if available
  const googleEmail = userInfo?.email || email || "";
  const googleName = userInfo?.name || "Gourmet Customer";

  const [tempEmail, setTempEmail] = useState(googleEmail);
  const [tempPhone, setTempPhone] = useState(phone || localStorage.getItem("customerPhone") || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (googleEmail && !email) {
      setEmail(googleEmail);
      setTempEmail(googleEmail);
    }
  }, [googleEmail, email, setEmail]);

  useEffect(() => {
    const savedPhone = localStorage.getItem("customerPhone");
    if (savedPhone && !phone) {
      setPhone(savedPhone);
      setTempPhone(savedPhone);
    }
  }, [phone, setPhone]);

  const validateIndianMobile = (num) => {
    const clean = num.replace(/\s+|-/g, "");
    // Accepts 10-digit starting with 6-9, or +91/0 prefix with 10 digits
    const indianRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
    return indianRegex.test(clean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = tempEmail.trim().toLowerCase();
    const trimmedPhone = tempPhone.trim();

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validateIndianMobile(trimmedPhone)) {
      setError("Please enter a valid 10-digit Indian mobile number (e.g. 9826012345 or +919826012345).");
      return;
    }

    setEmail(trimmedEmail);
    setPhone(trimmedPhone);
    localStorage.setItem("customerPhone", trimmedPhone);
    onComplete();
  };

  const stepClass =
    stepStatus === "complete"
      ? "checkout-step checkout-step--complete"
      : stepStatus === "active"
      ? "checkout-step checkout-step--active"
      : "checkout-step";

  return (
    <div className={stepClass}>
      <span className="checkout-step__number">1</span>
      <span className="checkout-step__name" data-test-id="logged-in-number-title">
        Customer Contact Information
      </span>

      {stepStatus === "complete" && (
        <button
          onClick={onEdit}
          className="btn delivery_change-btn"
          data-test-id="guest-change-button submit__btn"
        >
          Edit Contact Info
        </button>
      )}

      <div className="checkout-step__body">
        {stepStatus === "complete" ? (
          <div className="guest-details-summary" style={{ fontSize: "1.4rem", padding: "1rem 0", color: "#1b4d2e" }}>
            <p style={{ margin: "0.4rem 0" }}>
              <strong>Customer Name:</strong> {googleName}
            </p>
            <p style={{ margin: "0.4rem 0" }}>
              <strong>Google Email:</strong> {email}
            </p>
            <p style={{ margin: "0.4rem 0" }}>
              <strong>Phone Number:</strong> {phone}
            </p>
          </div>
        ) : (
          <div className="new-delivery-address-wrapper" style={{ marginTop: "1rem" }}>
            <div style={{ background: "#fbf9f5", borderLeft: "4px solid #d4af37", padding: "1rem 1.2rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
              <p style={{ margin: 0, fontSize: "1.3rem", color: "#1b4d2e", fontWeight: "600" }}>
                📞 Phone number is required for order-related communication and delivery tracking.
              </p>
            </div>

            <form className="new-delivery-address" onSubmit={handleSubmit}>
              <div className="new-delivery-address__form-sub">
                <div className="new-delivery-address__form-row">
                  <label htmlFor="guest-email" className="new-delivery-address__label">
                    <div>Google Email Address</div>
                    <input
                      type="email"
                      id="guest-email"
                      placeholder="email@example.com"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      required
                      className="input"
                    />
                  </label>
                </div>
                <div className="new-delivery-address__form-row">
                  <label htmlFor="guest-phone" className="new-delivery-address__label">
                    <div>Phone Number</div>
                    <input
                      type="tel"
                      id="guest-phone"
                      placeholder="e.g. 9826012345 or +919826012345"
                      value={tempPhone}
                      onChange={(e) => setTempPhone(e.target.value)}
                      required
                      className="input"
                    />
                  </label>
                  <small style={{ fontSize: "1.1rem", color: "#777", marginTop: "0.4rem", display: "block" }}>
                    Enter 10-digit mobile number for SMS dispatch updates
                  </small>
                </div>
                {error && (
                  <div style={{ color: "#c62828", fontSize: "1.3rem", margin: "1rem 0", fontWeight: "600", padding: "0.8rem", background: "#ffebee", borderRadius: "6px" }}>
                    ⚠️ {error}
                  </div>
                )}
                <div>
                  <button
                    className="btn new-delivery-address__btn flush--left submit__btn"
                    type="submit"
                    disabled={!tempEmail || !tempPhone}
                    style={{ background: "#1b4d2e", color: "#ffffff", padding: "0.8rem 2rem", borderRadius: "25px", fontWeight: "700", border: "none" }}
                  >
                    Confirm Contact & Continue
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneVerification;
