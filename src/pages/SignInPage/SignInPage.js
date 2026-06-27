import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { signin, signInTestUser } from "../../store/actions/actionCreators/signInAction";
import { supabase } from "../../supabase";
import * as actionTypes from "../../store/actions/actionTypes/signInTypes";
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
  const [truecallerLoading, setTruecallerLoading] = useState(false);

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

  const handleTruecallerLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) {
      setError("Truecaller One-Tap is only supported on mobile devices with the Truecaller app installed.");
      return;
    }

    setTruecallerLoading(true);
    const reqId = "tc_" + Math.random().toString(36).substring(2) + Date.now();
    const appKey = "N0lIN65efea9e6a9a4953881ce21d74c8f24e";
    const appName = "shroooms";
    
    sessionStorage.setItem("tc_request_id", reqId);

    // Open Truecaller app using deep link scheme
    const deepLink = `truecallersdk://truesdk/open_app?request_id=${reqId}&app_key=${appKey}&app_name=${encodeURIComponent(appName)}`;
    window.location.href = deepLink;

    // Start polling the Supabase 'truecaller_sessions' table for callback status
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 12) { // 30 seconds timeout limit
        clearInterval(interval);
        setTruecallerLoading(false);
        setError("Truecaller verification timed out. Please try again or use Phone OTP.");
        return;
      }

      try {
        const { data, error: dbErr } = await supabase
          .from("truecaller_sessions")
          .select("*")
          .eq("request_id", reqId)
          .single();

        if (!dbErr && data) {
          clearInterval(interval);
          setTruecallerLoading(false);

          // Clean up database row in Supabase
          await supabase.from("truecaller_sessions").delete().eq("request_id", reqId);

          const loggedInUser = {
            _id: "usr_" + Date.now(),
            name: data.user_data?.name || "Truecaller User",
            phone: data.user_data?.phone || "",
            email: data.user_data?.email || "",
            token: data.token
          };

          dispatch({
            type: actionTypes.USER_SIGNIN_SUCCESS,
            payload: loggedInUser
          });

          localStorage.setItem("userInfo", JSON.stringify(loggedInUser));
        }
      } catch (pollErr) {
        console.error("Truecaller polling error:", pollErr);
      }
    }, 2500);
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

                  <button type="submit" className="signin-primary-btn" disabled={loading || truecallerLoading}>
                    {loading ? "Sending OTP..." : "Get OTP Code"}
                  </button>

                  {/* Truecaller verification option */}
                  <button 
                    onClick={handleTruecallerLogin} 
                    className="signin-truecaller-btn" 
                    disabled={loading || truecallerLoading}
                  >
                    <i className="fa fa-phone-square truecaller-icon"></i>
                    <span>{truecallerLoading ? "Verifying via Truecaller..." : "Verify with Truecaller"}</span>
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
                  Don't have an account? <Link to="/signup" className="signin-link">Sign up</Link>
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
