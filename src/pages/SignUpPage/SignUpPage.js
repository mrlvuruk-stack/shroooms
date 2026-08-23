import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { firebaseGoogleSignIn } from "../../store/actions/actionCreators/signInAction";
import "./SignUpPage.css";

const SignUpPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const userSignIn = useSelector((state) => state.userSignIn);
  const { userInfo, loading, error: authError } = userSignIn;
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      const redirectPath = location.state?.from?.pathname || "/";
      history.push(redirectPath);
    }
  }, [userInfo, history, location]);

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      await dispatch(firebaseGoogleSignIn());
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("Google Sign-In was cancelled. Please try again.");
      } else {
        setError(err.message || "Google Sign-In failed. Please try again.");
      }
    }
  };

  return (
    <div className="signup-page-container">
      <div className="signup-split-wrapper">
        
        {/* Left Side: Art Panel */}
        <div className="signup-left-art" style={{ backgroundImage: "url('/signin_mushrooms_split.png')" }}>
          <div className="signup-art-overlay"></div>
          <div className="signup-art-content animate__animated animate__fadeInLeft">
            <span className="signup-floating-quote">
              Nurturing Wellness, Naturally.
            </span>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="signup-right-form-panel">
          <div className="signup-form-box animate__animated animate__fadeIn">
            
            <div className="signup-logo-header" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <span className="signup-brand-icon" style={{ fontSize: "3rem" }}>🍄</span>
              <h2 className="signup-form-title" style={{ marginTop: "0.5rem" }}>Create Your Account</h2>
              <p style={{ fontSize: "1.3rem", color: "#555", marginTop: "0.5rem" }}>
                Join SHROOOMS with your Google account for an instant, secure customer profile.
              </p>
            </div>

            {(error || authError) && (
              <div className="signup-err-msg" style={{
                padding: "1rem",
                background: "#ffebee",
                color: "#c62828",
                borderRadius: "8px",
                margin: "1rem 0",
                fontSize: "1.2rem",
                textAlign: "center"
              }}>
                {error || authError}
              </div>
            )}

            {/* Google Sign Up Button */}
            <button
              type="button"
              className="signup-google-btn"
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
                transition: "all 0.25s ease",
                marginTop: "1rem"
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              {loading ? "Connecting to Google..." : "Continue with Google"}
            </button>

            <div style={{ marginTop: "3rem", padding: "1.2rem", background: "#fbf9f5", borderRadius: "12px", border: "1px solid #e8e2d5", textAlign: "center" }}>
              <p style={{ fontSize: "1.2rem", color: "#666", margin: 0, lineHeight: 1.5 }}>
                🔒 Fast 1-click Google Sign-Up. No password required. Phone number is requested only during order checkout.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignUpPage;
