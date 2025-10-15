require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('=== SMTP Configuration Test ===\n');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
console.log('\n');

const emailPort = parseInt(process.env.EMAIL_PORT || '587');
const isSecure = emailPort === 465;

console.log('Calculated settings:');
console.log('Port:', emailPort);
console.log('Secure:', isSecure);
console.log('\n');

// Try multiple configurations
const configs = [
  {
    name: 'Config 1: Port 587 with STARTTLS',
    config: {
      host: 'smtpout.secureserver.net',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    }
  },
  {
    name: 'Config 2: Port 465 with SSL',
    config: {
      host: 'smtpout.secureserver.net',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    }
  },
  {
    name: 'Config 3: Alternative host smtp.secureserver.net',
    config: {
      host: 'smtp.secureserver.net',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    }
  }
];

async function testConfig(name, config) {
  console.log(`\n🔍 Testing: ${name}`);
  console.log('-----------------------------------');
  
  try {
    const transporter = nodemailer.createTransport(config);
    
    // Test connection
    console.log('⏳ Verifying connection...');
    await transporter.verify();
    console.log('✅ Connection verified!');
    
    // Try sending test email
    console.log('⏳ Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email from Chat App',
      text: 'If you receive this, your SMTP is working!',
      html: '<h1>Success!</h1><p>Your SMTP configuration is working correctly.</p>'
    });
    
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('\n✨ THIS CONFIGURATION WORKS! Use these settings in your .env file:');
    console.log(`EMAIL_HOST=${config.host}`);
    console.log(`EMAIL_PORT=${config.port}`);
    console.log('\n');
    
    return true;
  } catch (error) {
    console.log('❌ Failed:', error.message);
    if (error.code) console.log('   Error code:', error.code);
    if (error.response) console.log('   Response:', error.response);
    return false;
  }
}

async function runTests() {
  console.log('Starting SMTP tests...\n');
  
  for (const { name, config } of configs) {
    const success = await testConfig(name, config);
    if (success) {
      console.log('\n🎉 Found working configuration! You can stop here.');
      process.exit(0);
    }
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n\n❌ All configurations failed.');
  console.log('\nPossible issues:');
  console.log('1. Email password is incorrect');
  console.log('2. Email account requires special SMTP settings');
  console.log('3. Firewall is blocking SMTP ports');
  console.log('4. SecureServer requires authentication from their control panel');
  console.log('\nTry using Gmail instead (see SMTP_TROUBLESHOOTING.md)');
}

runTests().catch(console.error);
