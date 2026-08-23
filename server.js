const express = require("express");
const { JwtRsaVerifier } = require("aws-jwt-verify");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

// Find your Firebase project number in the Firebase console.
const FIREBASE_PROJECT_NUMBER = "1024943326650";

// The issuer and audience claims of the FPNV token are specific to your
// project.
const issuer = `https://fpnv.googleapis.com/projects/${FIREBASE_PROJECT_NUMBER}`;
const audience = `https://fpnv.googleapis.com/projects/${FIREBASE_PROJECT_NUMBER}`;

// The JWKS URL contains the current public signing keys for FPNV tokens.
const jwksUri = "https://fpnv.googleapis.com/v1beta/jwks";

// Configure a JWT verifier to check the following:
// - The token is signed by Google
// - The issuer and audience claims match your project
// - The token has not yet expired (default behavior)
const fpnvVerifier = JwtRsaVerifier.create({ issuer, audience, jwksUri });

const app = express();

// Middleware to parse the token from the request body.
// Since the token is a raw string, we use express.text() middleware.
app.use(express.text({ type: "*/*" }));
app.use(express.json());

// Initialize Razorpay SDK instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

app.post('/verifiedPhoneNumber', async (req, res) => {
    if (!req.body) return res.sendStatus(400);
    // Get the token from the body of the request.
    // If it's JSON, extract the token property; otherwise, use the raw body.
    const fpnvToken = typeof req.body === "object" ? req.body.token : req.body;
    
    if (!fpnvToken) return res.sendStatus(400);

    try {
        // Attempt to verify the token using the verifier configured
        // previously.
        const verifiedPayload = await fpnvVerifier.verify(fpnvToken);

        // If verification succeeds, the subject claim of the token contains the
        // verified phone number. You can use this value however it's needed by
        // your app.
        const verifiedPhoneNumber = verifiedPayload.sub;
        console.log("Successfully verified phone number:", verifiedPhoneNumber);
        // (Do something with it...)

        return res.sendStatus(200);
    } catch (error) {
        console.error("Token verification failed:", error);
        // If verification fails, reject the token.
        return res.sendStatus(400);
    }
});

// Razorpay Step 1: Create Order
app.post("/api/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body || {};

    if (!amount || isNaN(amount) || Number(amount) < 100) {
      return res.status(400).json({
        error: "Invalid amount. Minimum amount is 100 paise (₹1)."
      });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(401).json({
        error: "Razorpay credentials missing or unauthorized."
      });
    }

    const options = {
      amount: Math.round(Number(amount)),
      currency: currency || "INR",
      receipt: receipt || `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    if (
      error.statusCode === 401 ||
      (error.error && error.error.code === "BAD_REQUEST_ERROR" && error.error.description.includes("auth"))
    ) {
      return res.status(401).json({ error: "Authentication failed with Razorpay API." });
    }
    return res.status(500).json({
      error: error.message || "Failed to create Razorpay order"
    });
  }
});

// Razorpay Step 3: Verify Payment Signature
app.post("/api/verify-payment", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
      payment_id,
      signature
    } = req.body || {};

    const orderId = razorpay_order_id || order_id;
    const paymentId = razorpay_payment_id || payment_id;
    const sig = razorpay_signature || signature;

    if (!orderId || !paymentId || !sig) {
      return res.status(400).json({
        success: false,
        error: "Missing required parameters: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required."
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        error: "Server configuration error: RAZORPAY_KEY_SECRET is not set."
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature === sig) {
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        order_id: orderId,
        payment_id: paymentId
      });
    } else {
      return res.status(400).json({
        success: false,
        error: "Signature mismatch. Payment verification failed."
      });
    }
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to verify Razorpay payment signature"
    });
  }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

