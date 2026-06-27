import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, Link } from "react-router-dom";
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

    setLoading(true);
    try {
      const isSupabaseConfigured = !!supabase;

      // Save user to Supabase if configured
      if (isSupabaseConfigured) {
        // We use a mock/placeholder phone for email registration to satisfy database constraints
        const mockPhone = "email_" + Date.now();
        const { error: dbErr } = await supabase.from("users").insert([
          {
            name: fullName,
            email: email,
            phone: mockPhone,
            wishlist: []
          }
        ]);
        if (dbErr) throw dbErr;
      }

      // Mock user login session details
      const registeredUser = {
        _id: "usr_" + Date.now(),
        name: fullName,
        email: email,
        phone: "",
        token: "mock_token_" + Date.now()
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
      setError("Sign up failed: " + (err.message || "Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = (e) => {
    e.preventDefault();
    // Simulate login as guest/test user
    const mockGuest = {
      _id: "mock_guest_id_202",
      name: "Guest Explorer",
      email: "guest@shroooms.in",
      phone: "9999999999",
      token: "mock_guest_token_99"
    };

    dispatch({
      type: actionTypes.USER_SIGNIN_SUCCESS,
      payload: mockGuest
    });

    localStorage.setItem("userInfo", JSON.stringify(mockGuest));
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
          <div className="signup-form-box animate__animated animate__fadeIn">
            
            {/* Logo Icon */}
            <div className="signup-logo-header">
              <span className="signup-brand-icon">🍄</span>
            </div>

            <h2 className="signup-form-title">Begin Your Wellness Journey</h2>
            <p className="signup-form-desc">
              Join the Shroooms community and discover nature's most powerful nutrients.
            </p>

            {error && <div className="signup-err-msg">{error}</div>}
            {success && <div className="signup-success-msg">Welcome! Setting up your space...</div>}

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
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <div className="signup-divider">
                <span>OR</span>
              </div>

              {/* Google signup option */}
              <button onClick={handleGoogleSignUp} className="signup-google-btn">
                <img src="/google_icon.png" alt="Google" className="signup-google-icon" onError={(e) => { e.target.style.display = 'none'; }} />
                <span>Sign up with Google</span>
              </button>
            </form>

            <p className="signup-footer-text">
              Already have an account? <Link to="/signin" className="signup-link">Log in</Link>
            </p>

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
