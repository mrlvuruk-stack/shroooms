import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { signin } from "../../store/actions/actionCreators/signInAction";
import { supabase } from "../../supabase";
import * as actionTypes from "../../store/actions/actionTypes/signInTypes";
import "./SignInPage.css";

const SignInPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const userSignIn = useSelector((state) => state.userSignIn);
  const { userInfo, error: authError } = userSignIn;

  const [identifier, setIdentifier] = useState(""); // Phone number or Email address
  const [isEmailFlow, setIsEmailFlow] = useState(false);
  const [hash, setHash] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [truecallerLoading, setTruecallerLoading] = useState(false);
  const [sandboxOtp, setSandboxOtp] = useState(""); // For displaying OTP on screen in sandbox mode

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      const redirectPath = location.state?.from?.pathname || "/";
      history.push(redirectPath);
    }
  }, [userInfo, history, location]);

  const handleIdentifierSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSandboxOtp("");

    const value = identifier.trim();
    if (!value) {
      setError("Please enter a phone number or email address.");
      return;
    }

    const isEmail = value.includes("@");
    setIsEmailFlow(isEmail);

    setLoading(true);
    try {
      if (isEmail) {
        // Validate Email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          setError("Please enter a valid email address.");
          setLoading(false);
          return;
        }

        // 1. Generate 4-digit OTP code
        const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("%c[Dev Fallback] OTP for " + value + " is: " + generatedOtp, "color: #ff9900; font-size: 16px; font-weight: bold;");

        // 2. Upsert OTP to Supabase 'email_otps' table
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes validity
        const { error: dbErr } = await supabase.from("email_otps").upsert(
          [
            {
              email: value.toLowerCase(),
              otp: generatedOtp,
              expires_at: expiresAt
            }
          ],
          { onConflict: "email" }
        );

        if (dbErr) throw dbErr;

        // 3. Send email via serverless function (and handle fallback dynamically)
        try {
          const res = await axios.post("/api/send-email", {
            email: value.toLowerCase(),
            otp: generatedOtp
          });
          
          if (res.data && res.data.sandbox) {
            setSandboxOtp(generatedOtp);
          }
        } catch (mailErr) {
          console.warn("Mail API failed but proceeding to OTP verification (Sandbox Mode):", mailErr.message);
          setSandboxOtp(generatedOtp); // Fallback to displaying on screen
        }

        setStep(2);
      } else {
        // Phone number flow
        const cleanPhone = value.replace(/[^0-9]/g, "");
        if (cleanPhone.length < 10) {
          setError("Please enter a valid 10-digit phone number.");
          setLoading(false);
          return;
        }

        const res = await axios.post("/api/users/sendOTP", { phone: cleanPhone });
        setHash(res.data.hash);
        setStep(2);
      }
    } catch (err) {
      console.error("Error sending verification code:", err);
      setError("Failed to send verification code: " + (err.response?.data?.message || err.message || "Please try again."));
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
      if (isEmailFlow) {
        const emailValue = identifier.trim().toLowerCase();

        // 1. Fetch OTP record from Supabase 'email_otps' table
        const { data, error: dbErr } = await supabase
          .from("email_otps")
          .select("*")
          .eq("email", emailValue)
          .single();

        if (dbErr || !data) {
          setError("Verification code expired or not found. Please request a new one.");
          setLoading(false);
          return;
        }

        // 2. Verify OTP code and expiration time
        const now = new Date();
        const expirationTime = new Date(data.expires_at);

        if (data.otp !== otp) {
          setError("Invalid code. Please try again.");
          setLoading(false);
          return;
        }

        if (now > expirationTime) {
          setError("Verification code expired. Please request a new one.");
          setLoading(false);
          return;
        }

        // OTP is correct! Clear the row from db
        await supabase.from("email_otps").delete().eq("email", emailValue);

        // 3. Check if user already exists in 'users' table
        const { data: userData, error: userErr } = await supabase
          .from("users")
          .select("*")
          .eq("email", emailValue)
          .single();

        let loggedInUser;

        if (!userErr && userData) {
          // Existing User
          loggedInUser = {
            _id: userData.id || "usr_" + Date.now(),
            name: userData.name || emailValue.split("@")[0],
            email: userData.email,
            phone: userData.phone || "",
            token: "email_session_" + Date.now()
          };
        } else {
          // New User signup/login on the fly
          const mockPhone = "email_" + Date.now();
          await supabase
            .from("users")
            .insert([
              {
                name: emailValue.split("@")[0],
                email: emailValue,
                phone: mockPhone,
                wishlist: []
              }
            ]);

          loggedInUser = {
            _id: "usr_" + Date.now(),
            name: emailValue.split("@")[0],
            email: emailValue,
            phone: "",
            token: "email_session_" + Date.now()
          };
        }

        // Log user in
        dispatch({
          type: actionTypes.USER_SIGNIN_SUCCESS,
          payload: loggedInUser
        });

        localStorage.setItem("userInfo", JSON.stringify(loggedInUser));
      } else {
        // Phone flow: verify through standard Redux thunk
        const cleanPhone = identifier.trim().replace(/[^0-9]/g, "");
        dispatch(signin(cleanPhone, hash, otp));
      }
    } catch (err) {
      console.error(err);
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
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

    // Open Truecaller app using the correct web_verify deep link scheme
    const deepLink = `truecallersdk://truesdk/web_verify?type=btmsheet&requestNonce=${reqId}&partnerKey=${appKey}&partnerName=${encodeURIComponent(appName)}&lang=en`;
    window.location.href = deepLink;

    // Fallback check: if the document still has focus after 2.5 seconds, the Truecaller app failed to launch
    const focusTimeout = setTimeout(() => {
      if (document.hasFocus()) {
        clearInterval(interval);
        setTruecallerLoading(false);
        setError("Truecaller app not detected or failed to open. Please use Phone or Email OTP instead.");
      }
    }, 2500);

    // Start polling the Supabase 'truecaller_sessions' table for callback status
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 12) { // 30 seconds timeout limit
        clearInterval(interval);
        clearTimeout(focusTimeout);
        setTruecallerLoading(false);
        setError("Truecaller verification timed out. Please try again or use Phone/Email OTP.");
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
          clearTimeout(focusTimeout);
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


          <div className="signin-form-box animate__animated animate__fadeIn">
            {step === 1 && (
              <>
                <h2 className="signin-form-title font-serif">Welcome Back</h2>
                <p className="signin-form-desc">
                  Please enter your details to access your account.
                </p>

                {error && <div className="signin-err-msg">{error}</div>}

                <form onSubmit={handleIdentifierSubmit} className="signin-form">
                  <div className="signin-form-group">
                    <label className="signin-label">PHONE OR EMAIL ADDRESS</label>
                    <input
                      type="text"
                      placeholder="e.g. 9826012345 or user@shrooom.in"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
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
                  Enter the 4-digit code sent to {identifier}
                </p>

                {sandboxOtp && (
                  <div className="signin-sandbox-alert">
                    <strong>Sandbox Testing Active:</strong> Use code <code>{sandboxOtp}</code> to verify.
                    <div style={{ fontSize: "1.1rem", marginTop: "0.5rem", color: "#666" }}>
                      Note: Real emails will be sent once SMTP credentials are set up in Vercel.
                    </div>
                  </div>
                )}

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
                      ← Change Details
                    </span>
                    <span className="signin-resend-link" onClick={handleIdentifierSubmit}>
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
