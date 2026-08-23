const crypto = require('crypto');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

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

    // Validate missing fields
    if (!orderId || !paymentId || !sig) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.'
      });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: RAZORPAY_KEY_SECRET is not set.'
      });
    }

    // HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const generatedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature === sig) {
      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        order_id: orderId,
        payment_id: paymentId
      });
    } else {
      // Signature mismatch: return 400, do NOT mark as paid
      return res.status(400).json({
        success: false,
        error: 'Signature mismatch. Payment verification failed.'
      });
    }
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to verify Razorpay payment signature'
    });
  }
};
