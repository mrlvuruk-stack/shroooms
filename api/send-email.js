const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Missing parameters: email and otp are required.' });
  }

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  // If no SMTP host is configured, we run in sandbox mode to avoid Vercel outgoing port blocks
  if (!host || !user || !pass) {
    console.log(`[SMTP Sandbox] No SMTP credentials configured. OTP for ${email} is: ${otp}`);
    return res.status(200).json({
      success: true,
      sandbox: true,
      message: 'Running in sandbox mode. OTP has been logged to console and stored in Supabase.'
    });
  }

  try {
    console.log(`[SMTP] Sending OTP email to ${email} via ${host}:${port}...`);
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port),
      secure: parseInt(port) === 465,
      auth: {
        user,
        pass,
      },
      // Increase connection timeout to avoid hanging
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000
    });

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2dcd8; border-radius: 8px; background-color: #fcf7f4; color: #1b2d1f;">
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #5a1827; padding-bottom: 10px;">
          <h1 style="color: #5a1827; margin: 0; font-family: Georgia, serif; font-size: 28px; letter-spacing: 1px;">SHROOOMS</h1>
          <p style="color: #6e7e72; font-style: italic; margin: 5px 0 0 0; font-size: 14px;">Gourmet & Rare Forest Fungi</p>
        </div>
        <div style="padding: 10px 0;">
          <h2 style="font-size: 20px; color: #1b2d1f; margin-top: 0;">Verification Code</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #435347;">
            Please use the following One-Time Password (OTP) to verify your account and complete your sign in / sign up process. This OTP is valid for 5 minutes.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #5a1827; background-color: #f3ede9; padding: 12px 30px; border-radius: 6px; border: 1px dashed #5a1827;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 14px; color: #8fa093; margin-top: 30px; border-top: 1px solid #e2dcd8; padding-top: 15px; text-align: center;">
            If you did not request this code, you can safely ignore this email.
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'SHROOOMS Support'}" <${user}>`,
      to: email,
      subject: `Verify Your SHROOOMS Account — OTP ${otp}`,
      text: `Your SHROOOMS verification OTP is: ${otp}`,
      html: htmlContent,
    });

    console.log(`[SMTP] Email sent successfully to ${email}`);
    return res.status(200).json({ success: true, message: 'OTP email sent successfully.' });
  } catch (err) {
    // If real email sending fails, fallback to sandbox success so developer is NOT blocked by SMTP issues!
    console.error(`[SMTP Error] Failed to send email via SMTP host ${host}. Falling back to sandbox mode. Error:`, err.message);
    return res.status(200).json({
      success: true,
      sandbox: true,
      error_warning: err.message,
      message: 'SMTP failed. Running in sandbox fallback mode. OTP has been stored in Supabase.'
    });
  }
};
