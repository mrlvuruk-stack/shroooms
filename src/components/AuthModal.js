import React, { useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import {
  signInClose,
  firebaseGoogleSignIn
} from "../store/actions/actionCreators/signInAction";
import "./AuthModal.css";

Modal.setAppElement("#root");

const AuthModal = () => {
  const dispatch = useDispatch();
  const userSignInState = useSelector((state) => state.userSignIn);
  const { signInOpen, loading, error } = userSignInState;
  const [localError, setLocalError] = useState("");

  const handleClose = () => {
    setLocalError("");
    dispatch(signInClose());
  };

  const handleGoogleSignIn = async () => {
    setLocalError("");
    try {
      await dispatch(firebaseGoogleSignIn());
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        setLocalError("Google Sign-In was cancelled. Please try again.");
      } else {
        setLocalError(err.message || "Google Sign-In failed. Please try again.");
      }
    }
  };

  return (
    <Modal
      isOpen={signInOpen}
      onRequestClose={handleClose}
      shouldCloseOnOverlayClick={true}
      className="auth-modal-content"
      overlayClassName="auth-modal-overlay"
    >
      <div className="auth-modal-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "2rem" }}>🍄</span>
          <h2 style={{ margin: 0, color: "#1b4d2e" }}>Welcome to SHROOOMS</h2>
        </div>
        <button className="auth-close-btn" onClick={handleClose} aria-label="Close modal">
          &times;
        </button>
      </div>

      <div style={{ textAlign: "center", padding: "1rem 0" }}>
        <p style={{ fontSize: "1.4rem", color: "#555", lineHeight: 1.5, margin: "0 0 1.5rem 0" }}>
          Sign in with your Google account to access your profile, order history, and fast checkout.
        </p>

        {(error || localError) && (
          <div className="auth-error-banner" style={{ marginBottom: "1.5rem" }}>
            {localError || error}
          </div>
        )}

        {/* GOOGLE SIGN IN ONLY */}
        <div className="social-auth-section">
          <button
            className="btn-google-signin"
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              width: "100%",
              padding: "1.2rem",
              borderRadius: "30px",
              border: "1.5px solid #d4af37",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              fontWeight: "700",
              fontSize: "1.4rem",
              color: "#1b4d2e",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 15px rgba(27, 77, 46, 0.08)",
              transition: "all 0.25s ease"
            }}
          >
            <svg className="google-icon" width="22" height="22" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            {loading ? "Connecting to Google..." : "Continue with Google"}
          </button>
        </div>

        <p style={{ fontSize: "1.1rem", color: "#888", marginTop: "2rem", marginBottom: 0 }}>
          🔒 Safe & secure Google authentication. Your phone number is requested only during order checkout.
        </p>
      </div>
    </Modal>
  );
};

export default AuthModal;
