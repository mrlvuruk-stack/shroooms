const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client inside Serverless Function using Environment Variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = async (req, res) => {
  // Set CORS headers so that Truecaller's server can POST successfully
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Truecaller sends: requestId, accessToken, endpoint
  const { requestId, accessToken, endpoint } = req.body;

  if (!requestId || !accessToken || !endpoint) {
    return res.status(400).json({ message: 'Missing required parameters: requestId, accessToken, or endpoint' });
  }

  try {
    // 1. Fetch the user's verified profile from Truecaller using the accessToken
    const profileRes = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const profile = profileRes.data;

    // Map profile details cleanly
    const firstName = profile.name?.first || '';
    const lastName = profile.name?.last || '';
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Truecaller User';
    const phone = profile.phoneNumbers?.[0] || '';
    const email = profile.onlineAddresses?.[0] || '';

    // 2. Insert/Upsert the user into the Supabase 'users' table
    if (phone) {
      const { error: upsertErr } = await supabase.from("users").upsert([
        {
          phone: phone,
          name: fullName,
          email: email
        }
      ], { onConflict: 'phone' });

      if (upsertErr) {
        console.error('Failed to upsert user into Supabase users table:', upsertErr);
      }
    }

    // 3. Insert the session details into 'truecaller_sessions' table for frontend polling
    const { error: sessionErr } = await supabase.from("truecaller_sessions").insert([
      {
        request_id: requestId,
        user_data: {
          name: fullName,
          phone: phone,
          email: email
        },
        token: "tc_token_" + Date.now()
      }
    ]);

    if (sessionErr) {
      throw sessionErr;
    }

    // Return success response to Truecaller's server (must respond within 3 seconds)
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Truecaller callback error handler:', err);
    return res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};
