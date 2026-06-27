import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { supabase } from "../../supabase";
import * as actionTypes from "../../store/actions/actionTypes/signInTypes";
import "animate.css";
import "./SignUpPage.css";

const SignUpPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const userSignIn = useSelector((state) => state.userSignIn);
  const { userInfo } = userSignIn;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [step, setStep] = useState(1); // 1: Sign up details, 2: OTP Verification
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      const redirectPath = location.state?.from?.pathname || "/";
      history.push(redirectPath);
    }
  }, [userInfo, history, location]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    if (!fullName || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      // 1. Check if user already exists
      const { data: existingUser, error: checkErr } = await supabase
        .from("users")
        .select("*")
        .eq("email", email.toLowerCase())
        .single();

      if (!checkErr && existingUser) {
        setError("An account with this email already exists. Please Sign In.");
        setLoading(false);
        return;
      }

      // 2. Generate 4-digit OTP
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      console.log("%c[Dev Fallback] OTP for " + email + " is: " + generatedOtp, "color: #ff9900; font-size: 16px; font-weight: bold;");

      // 3. Upsert to Supabase 'email_otps' table
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
      const { error: dbErr } = await supabase.from("email_otps").upsert(
        [
          {
            email: email.toLowerCase(),
            otp: generatedOtp,
            expires_at: expiresAt
          }
        ],
        { onConflict: "email" }
      );

      if (dbErr) throw dbErr;

      // 4. Send Email via nodemailer API
      await axios.post("/api/send-email", {
        email: email.toLowerCase(),
        otp: generatedOtp
      });

      setStep(2);
    } catch (err) {
      console.error("Error during signup send:", err);
      setError("Failed to register: " + (err.response?.data?.message || err.message || "Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.length < 4) {
      setError("Please enter the 4-digit code.");
      return;
    }

    setLoading(true);
    try {
      const emailValue = email.trim().toLowerCase();

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

      // Clear the OTP row
      await supabase.from("email_otps").delete().eq("email", emailValue);

      // 3. Insert user into Supabase 'users' table
      const mockPhone = "email_" + Date.now();
      const { error: insertErr } = await supabase.from("users").insert([
        {
          name: fullName,
          email: emailValue,
          phone: mockPhone,
          wishlist: []
        }
      ]);

      if (insertErr) throw insertErr;

      const registeredUser = {
        _id: "usr_" + Date.now(),
        name: fullName,
        email: emailValue,
        phone: "",
        token: "email_session_" + Date.now()
      };

      // Dispatch login success in Redux
      dispatch({
        type: actionTypes.USER_SIGNIN_SUCCESS,
        payload: registeredUser
      });

      // Save session in local storage
      localStorage.setItem("userInfo", JSON.stringify(registeredUser));
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Verification failed: " + (err.message || "Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page-container">
      <div className="signup-split-wrapper">
        
        {/* Left Side: Art of Fungi Panel */}
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
          {/* Subtle watermarks */}
          <div className="signup-watermark top-right" style={{ backgroundImage: "url('/shroooms_bg_decor.png')" }}></div>
          <div className="signup-watermark bottom-left" style={{ backgroundImage: "url('/shroooms_bg_decor.png')" }}></div>

          <div className="signup-form-box animate__animated animate__fadeIn">
            
            {/* Logo Icon */}
            <div className="signup-logo-header">
              <span className="signup-brand-icon">🍄</span>
            </div>

            {step === 1 && (
              <>
                <h2 className="signup-form-title">Begin Your Wellness Journey</h2>
                <p className="signup-form-desc">
                  Join the Shroooms community and discover nature's most powerful nutrients.
                </p>

                {error && <div className="signup-err-msg">{error}</div>}

                <form onSubmit={handleSignUp} className="signup-form">
                  
                  {/* Full Name Input */}
                  <div className="signup-form-group">
                    <label className="signup-label">Full Name</label>
                    <div className="signup-input-wrapper">
                      <i className="fa fa-user signup-input-icon"></i>
                      <input
                        type="text"
                        placeholder="Sage Everly"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          setError("");
                        }}
                        className="signup-line-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Address Input */}
                  <div className="signup-form-group">
                    <label className="signup-label">Email Address</label>
                    <div className="signup-input-wrapper">
                      <i className="fa fa-envelope signup-input-icon"></i>
                      <input
                        type="email"
                        placeholder="wellness@shroooms.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        className="signup-line-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="signup-form-group">
                    <label className="signup-label">Password</label>
                    <div className="signup-input-wrapper">
                      <i className="fa fa-lock signup-input-icon"></i>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError("");
                        }}
                        className="signup-line-input"
                        required
                      />
                      <i 
                        className={`fa fa-eye${showPassword ? "-slash" : ""} signup-eye-toggle`}
                        onClick={() => setShowPassword(!showPassword)}
                      ></i>
                    </div>
                  </div>

                  <button type="submit" className="signup-primary-btn" disabled={loading}>
                    {loading ? "Sending Verification OTP..." : "Create Account"}
                  </button>

                </form>

                <p className="signup-footer-text">
                  Already have an account? <Link to="/signin" className="signup-link">Log in</Link>
                </p>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="signup-form-title">Verify Your Email</h2>
                <p className="signup-form-desc">
                  Enter the 4-digit code sent to {email}
                </p>

                {error && <div className="signup-err-msg">{error}</div>}
                {success && <div className="signup-success-msg">Email Verified! Setting up your space...</div>}

                <form onSubmit={handleOtpVerify} className="signup-form">
                  <div className="signup-form-group">
                    <label className="signup-label">4-DIGIT OTP CODE</label>
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
                      className="signup-line-input"
                      required
                    />
                  </div>

                  <button type="submit" className="signup-primary-btn" disabled={loading || success}>
                    {loading ? "Verifying..." : "Verify & Complete Signup"}
                  </button>

                  <div className="signup-verify-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', fontSize: '1.2rem' }}>
                    <span 
                      style={{ color: '#5a1827', cursor: 'pointer', fontWeight: '600' }} 
                      onClick={() => setStep(1)}
                    >
                      ← Change Details
                    </span>
                    <span 
                      style={{ color: '#5a1827', cursor: 'pointer', fontWeight: '600' }} 
                      onClick={handleSignUp}
                    >
                      Resend Code
                    </span>
                  </div>
                </form>
              </>
            )}

            <div className="signup-bottom-quote">
              "Your daily dose of natural intelligence."
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignUpPage;
