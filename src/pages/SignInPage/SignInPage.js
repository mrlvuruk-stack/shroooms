import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { signin, signInTestUser } from "../../store/actions/actionCreators/signInAction";
import "./SignInPage.css";

const SignInPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const userSignIn = useSelector((state) => state.userSignIn);
  const { userInfo, error: authError } = userSignIn;

  const [phone, setPhone] = useState("");
  const [hash, setHash] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      const redirectPath = location.state?.from?.pathname || "/";
      history.push(redirectPath);
    }
  }, [userInfo, history, location]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (phone.length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/users/sendOTP", { phone });
      setHash(res.data.hash);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.length < 4) {
      setError("Please enter the 4-digit code.");
      return;
    }

    setLoading(true);
    try {
      dispatch(signin(phone, hash, otp));
    } catch (err) {
      console.error(err);
      setError("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    dispatch(signInTestUser());
  };

  return (
    <div className="signin-page-container">
      <div className="signin-split-wrapper">
        
        {/* Left Side: Art of Fungi Panel */}
        <div className="signin-left-art" style={{ backgroundImage: "url('/signin_mushrooms_split.png')" }}>
          <div className="signin-art-overlay"></div>
          <div className="signin-art-content animate__animated animate__fadeInLeft">
            <h1 className="signin-art-title font-serif">The Art of the Fungi.</h1>
            <p className="signin-art-subtitle">
              Connecting the forest floor to the sophisticated palate.
            </p>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="signin-right-form-panel">
          {/* Subtle watermarks */}
          <div className="signin-watermark top-right" style={{ backgroundImage: "url('/shroooms_bg_decor.png')" }}></div>
          <div className="signin-watermark bottom-left" style={{ backgroundImage: "url('/shroooms_bg_decor.png')" }}></div>

          <div className="signin-form-box animate__animated animate__fadeIn">
            {step === 1 && (
              <>
                <h2 className="signin-form-title font-serif">Welcome Back</h2>
                <p className="signin-form-desc">
                  Please enter your details to access your account.
                </p>

                {error && <div className="signin-err-msg">{error}</div>}

                <form onSubmit={handlePhoneSubmit} className="signin-form">
                  <div className="signin-form-group">
                    <label className="signin-label">PHONE NUMBER</label>
                    <input
                      type="tel"
                      maxLength="10"
                      pattern="[0-9]*"
                      placeholder="e.g. 9826012345"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/[^0-9]/g, ""));
                        setError("");
                      }}
                      className="signin-line-input"
                      required
                    />
                  </div>

                  <button type="submit" className="signin-primary-btn" disabled={loading}>
                    {loading ? "Sending OTP..." : "Get OTP Code"}
                  </button>

                  <div className="signin-divider">
                    <span>OR CONTINUE WITH</span>
                  </div>

                  <button onClick={handleGoogleLogin} className="signin-google-btn">
                    <img src="/google_icon.png" alt="Google" className="google-icon" onError={(e) => { e.target.style.display = 'none'; }} />
                    <span>Sign in as Guest</span>
                  </button>
                </form>

                <p className="signin-footer-text">
                  Don't have an account? <span className="signin-link" onClick={handleGoogleLogin}>Sign up</span>
                </p>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="signin-form-title font-serif">Verify Account</h2>
                <p className="signin-form-desc">
                  Enter the 4-digit code sent to +91 {phone}
                </p>

                {(error || authError) && (
                  <div className="signin-err-msg">{error || authError}</div>
                )}

                <form onSubmit={handleOtpSubmit} className="signin-form">
                  <div className="signin-form-group">
                    <label className="signin-label">4-DIGIT OTP CODE</label>
                    <input
                      type="password"
                      maxLength="4"
                      pattern="[0-9]*"
                      placeholder="••••"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/[^0-9]/g, ""));
                        setError("");
                      }}
                      className="signin-line-input"
                      required
                    />
                  </div>

                  <button type="submit" className="signin-primary-btn" disabled={loading}>
                    {loading ? "Verifying..." : "Verify & Sign In"}
                  </button>

                  <div className="signin-verify-actions">
                    <span className="signin-back-link" onClick={() => setStep(1)}>
                      ← Change Number
                    </span>
                    <span className="signin-resend-link" onClick={handlePhoneSubmit}>
                      Resend Code
                    </span>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignInPage;
