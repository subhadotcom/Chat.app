# SMTP Troubleshooting Guide

## Try These Configurations

### Option 1: Port 587 (TLS/STARTTLS) - RECOMMENDED
```env
EMAIL_HOST=smtpout.secureserver.net
EMAIL_PORT=587
EMAIL_USER=connect@subhadipghosh.co.in
EMAIL_PASSWORD=YUHJyuhj@8927
EMAIL_FROM=Chat App <connect@subhadipghosh.co.in>
```

### Option 2: Port 465 (SSL)
```env
EMAIL_HOST=smtpout.secureserver.net
EMAIL_PORT=465
EMAIL_USER=connect@subhadipghosh.co.in
EMAIL_PASSWORD=YUHJyuhj@8927
EMAIL_FROM=Chat App <connect@subhadipghosh.co.in>
```

### Option 3: Alternative Host
```env
EMAIL_HOST=smtp.secureserver.net
EMAIL_PORT=465
EMAIL_USER=connect@subhadipghosh.co.in
EMAIL_PASSWORD=YUHJyuhj@8927
EMAIL_FROM=Chat App <connect@subhadipghosh.co.in>
```

## Common Error Messages

### "ECONNREFUSED"
- Server is blocking the connection
- Try different port (587 instead of 465)

### "ETIMEDOUT"
- Connection timeout
- Check firewall settings
- Verify SMTP host is correct

### "Invalid login"
- Wrong email or password
- Make sure EMAIL_USER includes full email address
- Verify password is correct

### "Self signed certificate"
- Already handled with `rejectUnauthorized: false`

## Quick Test

After changing .env, restart server and watch for:
```
✅ SMTP connection verified successfully
```

If you see an error, it will show the specific problem.

## Alternative: Use Gmail

If SecureServer continues to fail, use Gmail:

1. Enable 2FA on Google account
2. Generate App Password at https://myaccount.google.com/apppasswords
3. Update .env:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
EMAIL_FROM=Chat App <your_gmail@gmail.com>
```
