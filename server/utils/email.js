const nodemailer = require('nodemailer');

// Determine if secure connection is needed based on port
const emailPort = parseInt(process.env.EMAIL_PORT || '587');
const isSecure = emailPort === 465;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: emailPort,
  secure: isSecure, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
    ciphers: 'SSLv3'
  },
  requireTLS: !isSecure, // Require TLS for non-secure ports
  connectionTimeout: 10000, // 10 seconds timeout
  greetingTimeout: 10000,
  socketTimeout: 10000,
  debug: true, // Enable debug output
  logger: true // Log to console
});

const sendOTPEmail = async (email, otp, name = '') => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Chat App Login',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
            padding: 40px;
            text-align: center;
          }
          .content {
            background: white;
            border-radius: 8px;
            padding: 30px;
            margin-top: 20px;
          }
          .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            letter-spacing: 8px;
            margin: 20px 0;
            padding: 15px;
            background: #f7f7f7;
            border-radius: 8px;
            display: inline-block;
          }
          .header {
            color: white;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
          }
          .warning {
            color: #e74c3c;
            font-size: 14px;
            margin-top: 20px;
          }
          .footer {
            color: white;
            font-size: 12px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="header">🔐 Chat App</h1>
          <div class="content">
            <h2>Hello${name ? ' ' + name : ''}! 👋</h2>
            <p>Your One-Time Password (OTP) for login is:</p>
            <div class="otp-code">${otp}</div>
            <p>This OTP is valid for <strong>10 minutes</strong>.</p>
            <p class="warning">⚠️ Never share this OTP with anyone. Our team will never ask for your OTP.</p>
          </div>
          <div class="footer">
            <p>If you didn't request this OTP, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    console.log('📧 Attempting to send email to:', email);
    console.log('📧 Using SMTP:', process.env.EMAIL_HOST, 'Port:', emailPort, 'Secure:', isSecure);
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent successfully to ${email}`);
    console.log('📧 Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Full error:', error);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

// Test SMTP connection
const testConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    return false;
  }
};

module.exports = { sendOTPEmail, testConnection };
