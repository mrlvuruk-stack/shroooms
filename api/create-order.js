const Razorpay = require('razorpay');

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
    const { amount, currency = 'INR', receipt } = req.body || {};

    // Validate minimum amount (100 paise)
    if (!amount || isNaN(amount) || Number(amount) < 100) {
      return res.status(400).json({
        error: 'Invalid amount. Amount must be at least 100 paise (₹1).'
      });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return res.status(401).json({
        error: 'Razorpay API credentials missing or unauthorized.'
      });
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret
    });

    const options = {
      amount: Math.round(Number(amount)),
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    if (
      error.statusCode === 401 ||
      (error.error && error.error.code === 'BAD_REQUEST_ERROR' && error.error.description.includes('auth'))
    ) {
      return res.status(401).json({ error: 'Authentication failed with Razorpay API.' });
    }
    return res.status(500).json({
      error: error.message || 'Failed to create Razorpay order'
    });
  }
};
