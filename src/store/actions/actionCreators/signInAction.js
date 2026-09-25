import axios from "axios";
import * as actionTypes from "../actionTypes/signInTypes";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  updateProfile
} from "../../../firebase";
import { syncUserProfile } from "../../../services/firebaseService";

export const signin = (phone, hash, otp) => async (dispatch) => {
  dispatch({
    type: actionTypes.USER_SIGNIN_REQUEST,
    payload: { phone, hash, otp },
  });
  try {
    const { data } = await axios.post("/api/users/verifyOTP", {
      phone,
      hash,
      otp,
    });
    dispatch({
      type: actionTypes.USER_SIGNIN_SUCCESS,
      payload: data,
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: actionTypes.USER_SIGNIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

const formatFirebaseError = (error) => {
  if (!error) return "Authentication error occurred.";
  const code = error.code || "";
  if (code === "auth/popup-blocked") {
    return "Pop-up was blocked by your browser settings. Redirecting to Google Login...";
  }
  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
    return "Google Sign-In window was closed. Please click 'Continue with Google' to try again.";
  }
  if (code === "auth/operation-not-allowed") {
    return "This authentication provider is not enabled yet in your Firebase Console. Please enable Email/Password or Google under Firebase Console -> Authentication -> Sign-in method.";
  }
  if (code === "auth/email-already-in-use") {
    return "An account with this email address already exists. Please log in instead.";
  }
  if (code === "auth/user-not-found") {
    return "No user found with this email. Please check your email or sign up.";
  }
  if (code === "auth/wrong-password") {
    return "Incorrect password. Please verify your password and try again.";
  }
  if (code === "auth/invalid-credential") {
    return "Invalid email or password. Please check your credentials and try again.";
  }
  if (code === "auth/weak-password") {
    return "Password is too weak. Please use at least 6 characters.";
  }
  if (code === "auth/invalid-email") {
    return "Please enter a valid email address.";
  }
  if (code === "auth/too-many-requests") {
    return "Access temporarily locked due to multiple failed login attempts. Please try again later.";
  }
  if (code === "auth/network-request-failed") {
    return "Network error. Please check your internet connection and try again.";
  }
  if (code === "auth/unauthorized-domain") {
    const currentHost = typeof window !== "undefined" ? window.location.hostname : "current domain";
    if (currentHost === "127.0.0.1") {
      return "This domain (127.0.0.1) is not authorized in Firebase. Please open http://localhost:3000 in your browser instead, or add 127.0.0.1 to Authorized Domains in Firebase Console.";
    }
    return `Domain "${currentHost}" is not authorized for Firebase Google Sign-In. Please add "${currentHost}" under Firebase Console -> Authentication -> Settings -> Authorized domains.`;
  }
  if (code === "auth/invalid-phone-number") {
    return "Invalid phone number format. Please include country code (e.g. +91).";
  }
  return error.message || "Authentication failed. Please try again.";
};

/**
 * Firebase Email / Password Sign In or Sign Up
 */
export const firebaseEmailSignIn = (email, password, isSignUp = false, displayName = "", phoneNumber = "") => async (dispatch) => {
  dispatch({ type: actionTypes.USER_SIGNIN_REQUEST });
  try {
    let userCredential;
    if (isSignUp) {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName && userCredential.user) {
        try {
          await updateProfile(userCredential.user, { displayName });
        } catch (profileErr) {
          console.warn("Could not update displayName:", profileErr);
        }
      }
    } else {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    }
    const user = userCredential.user;
    const profile = await syncUserProfile(user, { displayName, phoneNumber, phone: phoneNumber });
    
    const userInfo = {
      _id: user.uid,
      name: user.displayName || profile?.displayName || displayName || email.split("@")[0],
      email: user.email,
      phone: user.phoneNumber || profile?.phoneNumber || phoneNumber || "",
      token: await user.getIdToken(),
      isFirebase: true
    };

    dispatch({ type: actionTypes.USER_SIGNIN_SUCCESS, payload: userInfo });
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    dispatch(signInClose());
    return userInfo;
  } catch (error) {
    const message = formatFirebaseError(error);
    dispatch({
      type: actionTypes.USER_SIGNIN_FAIL,
      payload: message,
    });
    throw new Error(message);
  }
};

/**
 * Firebase Google Sign-In with Popup-Blocked Fallback
 */
export const firebaseGoogleSignIn = () => async (dispatch) => {
  dispatch({ type: actionTypes.USER_SIGNIN_REQUEST });
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;
    const profile = await syncUserProfile(user);

    const userInfo = {
      _id: user.uid,
      name: user.displayName || profile.displayName || "Google User",
      email: user.email,
      photoURL: user.photoURL,
      token: await user.getIdToken(),
      isFirebase: true
    };

    dispatch({ type: actionTypes.USER_SIGNIN_SUCCESS, payload: userInfo });
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    dispatch(signInClose());
    return userInfo;
  } catch (error) {
    if (error && (error.code === "auth/popup-blocked" || error.code === "auth/cancelled-popup-request")) {
      try {
        console.warn("Popup blocked by browser. Redirecting to Google Login...");
        await signInWithRedirect(auth, googleProvider);
        return;
      } catch (redirectErr) {
        console.error("Redirect login error:", redirectErr);
      }
    }
    const message = formatFirebaseError(error);
    dispatch({
      type: actionTypes.USER_SIGNIN_FAIL,
      payload: message,
    });
    throw new Error(message);
  }
};

/**
 * Firebase Phone Auth - Send OTP
 */
export const firebasePhoneSendOtp = (phoneNumber, containerId = "recaptcha-container") => async (dispatch) => {
  dispatch({ type: actionTypes.USER_SIGNIN_REQUEST });
  try {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA solved");
        }
      });
    }
    const appVerifier = window.recaptchaVerifier;
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    dispatch({ type: "PHONE_OTP_SENT" });
    return confirmationResult;
  } catch (error) {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    const message = formatFirebaseError(error);
    dispatch({
      type: actionTypes.USER_SIGNIN_FAIL,
      payload: message,
    });
    throw new Error(message);
  }
};

/**
 * Firebase Phone Auth - Verify OTP
 */
export const firebasePhoneVerifyOtp = (confirmationResult, code) => async (dispatch) => {
  dispatch({ type: actionTypes.USER_SIGNIN_REQUEST });
  try {
    const userCredential = await confirmationResult.confirm(code);
    const user = userCredential.user;
    const profile = await syncUserProfile(user);

    const userInfo = {
      _id: user.uid,
      name: user.displayName || profile?.displayName || user.phoneNumber,
      phone: user.phoneNumber,
      token: await user.getIdToken(),
      isFirebase: true
    };

    dispatch({ type: actionTypes.USER_SIGNIN_SUCCESS, payload: userInfo });
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    dispatch(signInClose());
    return userInfo;
  } catch (error) {
    const message = formatFirebaseError(error);
    dispatch({
      type: actionTypes.USER_SIGNIN_FAIL,
      payload: message,
    });
    throw new Error(message);
  }
};

/**
 * Sync Firebase listener user state
 */
export const syncFirebaseUser = (user) => async (dispatch) => {
  if (user) {
    const profile = await syncUserProfile(user);
    const userInfo = {
      _id: user.uid,
      name: user.displayName || profile.displayName || (user.email ? user.email.split("@")[0] : user.phoneNumber),
      email: user.email || "",
      phone: user.phoneNumber || "",
      photoURL: user.photoURL || "",
      token: await user.getIdToken(),
      isFirebase: true
    };
    dispatch({ type: actionTypes.USER_SIGNIN_SUCCESS, payload: userInfo });
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  } else {
    dispatch(userSignOut());
  }
};

export const signInTestUser = () => async (dispatch) => {
  dispatch({
    type: actionTypes.USER_SIGNIN_REQUEST,
  });
  try {
    const { data } = await axios.post("/api/users/testuser");
    dispatch({
      type: actionTypes.USER_SIGNIN_SUCCESS,
      payload: data,
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: actionTypes.USER_SIGNIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const sendCustomerName = (name) => async (dispatch, getState) => {
  dispatch({ type: actionTypes.SEND_NAME_REQUEST, payload: name });
  try {
    const {
      userSignIn: { userInfo },
    } = getState();
    const { data } = await axios.put(
      "/api/users/username",
      { name },
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
    dispatch({ type: actionTypes.SEND_NAME_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: actionTypes.SEND_NAME_FAIL,
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const userSignOut = () => (dispatch) => {
  try {
    signOut(auth);
  } catch (e) {
    console.warn("Firebase signOut error", e);
  }
  localStorage.removeItem("userInfo");
  localStorage.removeItem("cartItems");
  localStorage.removeItem("customerAddress");

  dispatch({
    type: actionTypes.USER_SIGNOUT,
  });
};

export const signInOpen = () => {
  return {
    type: actionTypes.SIGNIN_OPEN,
  };
};

export const signInClose = () => {
  return {
    type: actionTypes.SIGNIN_CLOSE,
  };
};
