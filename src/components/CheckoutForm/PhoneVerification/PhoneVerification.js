import React, { useState } from "react";
import "./PhoneVerification.css";

const PhoneVerification = (props) => {
  const { stepStatus, email, setEmail, phone, setPhone, onComplete, onEdit } = props;

  const [tempEmail, setTempEmail] = useState(email);
  const [tempPhone, setTempPhone] = useState(phone);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = tempEmail.trim().toLowerCase();
    const trimmedPhone = tempPhone.trim();

    // Bounds checking
    if (trimmedEmail.length < 3 || trimmedEmail.length > 254) {
      setError("Email length must be between 3 and 254 characters.");
      return;
    }
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (trimmedPhone.length < 8 || trimmedPhone.length > 20) {
      setError("Phone number length must be between 8 and 20 characters.");
      return;
    }
    const phoneRegex = /^[0-9+ \-()]+$/;
    if (!phoneRegex.test(trimmedPhone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    setEmail(trimmedEmail);
    setPhone(trimmedPhone);
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
        Guest Contact Details
      </span>

      {stepStatus === "complete" && (
        <button
          onClick={onEdit}
          className="btn delivery_change-btn"
          data-test-id="guest-change-button submit__btn"
        >
          Change
        </button>
      )}

      <div className="checkout-step__body">
        {stepStatus === "complete" ? (
          <div className="guest-details-summary" style={{ fontSize: "1.4rem", padding: "1rem 0", color: "#5a4b31" }}>
            <p style={{ margin: "0.5rem 0" }}>
              <strong>Email:</strong> {email}
            </p>
            <p style={{ margin: "0.5rem 0" }}>
              <strong>Phone:</strong> {phone}
            </p>
          </div>
        ) : (
          <div className="new-delivery-address-wrapper" style={{ marginTop: "1rem" }}>
            <form className="new-delivery-address" onSubmit={handleSubmit}>
              <div className="new-delivery-address__form-sub">
                <div className="new-delivery-address__form-row">
                  <label htmlFor="guest-email" className="new-delivery-address__label">
                    <div>Email Address</div>
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
                      placeholder="+91 99999 99999"
                      value={tempPhone}
                      onChange={(e) => setTempPhone(e.target.value)}
                      required
                      className="input"
                    />
                  </label>
                </div>
                {error && (
                  <div style={{ color: "#d9534f", fontSize: "1.3rem", margin: "1rem 0", fontWeight: "500" }}>
                    {error}
                  </div>
                )}
                <div>
                  <button
                    className="btn new-delivery-address__btn flush--left submit__btn"
                    type="submit"
                    disabled={!tempEmail || !tempPhone}
                  >
                    Continue
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
