import React, { useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import {
  signInClose,
  firebaseGoogleSignIn,
  firebaseEmailSignIn
} from "../store/actions/actionCreators/signInAction";
import "./AuthModal.css";

Modal.setAppElement("#root");

const AuthModal = () => {
  const dispatch = useDispatch();
  const userSignInState = useSelector((state) => state.userSignIn);
  const { signInOpen, loading, error: reduxError } = userSignInState;

  // Active tab: 'signin' or 'signup'
  const [activeTab, setActiveTab] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleClose = () => {
    setLocalError("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
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

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email.trim() || !password) {
      setLocalError("Please fill in all required fields.");
      return;
    }

    if (activeTab === "signup") {
      if (password.length < 6) {
        setLocalError("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setLocalError("Passwords do not match.");
        return;
      }
    }

    try {
      if (activeTab === "signup") {
        await dispatch(firebaseEmailSignIn(email.trim(), password, true, name.trim()));
      } else {
        await dispatch(firebaseEmailSignIn(email.trim(), password, false));
      }
    } catch (err) {
      setLocalError(err.message || "Authentication failed. Please try again.");
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
          <h2 style={{ margin: 0, color: "#1b4d2e" }}>
            {activeTab === "signin" ? "Welcome Back" : "Create Account"}
          </h2>
        </div>
        <button className="auth-close-btn" onClick={handleClose} aria-label="Close modal">
          &times;
        </button>
      </div>

      {/* Tabs */}
      <div className="auth-tabs">
        <button
          type="button"
          className={`auth-tab ${activeTab === "signin" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("signin");
            setLocalError("");
          }}
        >
          Sign In
        </button>
        <button
          type="button"
          className={`auth-tab ${activeTab === "signup" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("signup");
            setLocalError("");
          }}
        >
          Create Account
        </button>
      </div>

      {/* Error alert */}
      {(localError || reduxError) && (
        <div className="auth-error-banner">
          {localError || reduxError}
        </div>
      )}

      {/* Google Sign In Button */}
      <div className="social-auth-section">
        <button
          type="button"
          className="btn-google-signin"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <svg className="google-icon" width="20" height="20" viewBox="0 0 24 24">
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
          {loading ? "Connecting..." : activeTab === "signup" ? "Sign up with Google" : "Continue with Google"}
        </button>
      </div>

      <div className="auth-divider">
        <span>OR WITH EMAIL</span>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleEmailSubmit} className="auth-form">
        {activeTab === "signup" && (
          <div className="form-group">
            <label htmlFor="modal-name">Full Name</label>
            <input
              id="modal-name"
              type="text"
              placeholder="e.g. Sage Everly"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setLocalError("");
              }}
              autoComplete="name"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="modal-email">Email Address</label>
          <input
            id="modal-email"
            type="email"
            placeholder="name@shrooom.in"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setLocalError("");
            }}
            autoComplete="email"
            required
          />
        </div>

        <div className="form-group">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label htmlFor="modal-password">Password</label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: "none",
                border: "none",
                color: "#2e7d32",
                fontSize: "0.8rem",
                cursor: "pointer",
                padding: 0
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input
            id="modal-password"
            type={showPassword ? "text" : "password"}
            placeholder={activeTab === "signup" ? "At least 6 characters" : "Enter your password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setLocalError("");
            }}
            autoComplete={activeTab === "signup" ? "new-password" : "current-password"}
            required
          />
        </div>

        {activeTab === "signup" && (
          <div className="form-group">
            <label htmlFor="modal-confirm-password">Confirm Password</label>
            <input
              id="modal-confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setLocalError("");
              }}
              autoComplete="new-password"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="btn-auth-primary"
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : activeTab === "signup"
            ? "Create Account"
            : "Sign In"}
        </button>
      </form>

      <div className="auth-toggle-mode">
        {activeTab === "signin" ? (
          <span>
            Don't have an account?
            <button
              type="button"
              onClick={() => {
                setActiveTab("signup");
                setLocalError("");
              }}
            >
              Create Account
            </button>
          </span>
        ) : (
          <span>
            Already have an account?
            <button
              type="button"
              onClick={() => {
                setActiveTab("signin");
                setLocalError("");
              }}
            >
              Sign In
            </button>
          </span>
        )}
      </div>
    </Modal>
  );
};

export default AuthModal;
