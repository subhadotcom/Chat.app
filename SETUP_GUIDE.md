# 🚀 Quick Setup Guide

This guide will help you get the chat application up and running in under 10 minutes.

## ⚡ Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm run install-all
```

### Step 2: Configure Environment
```bash
# Server configuration
cd server
cp .env.example .env
# Edit server/.env with your MongoDB URI and email credentials

# Client configuration
cd ../client
cp .env.example .env
# Edit client/.env if needed (defaults should work)
```

### Step 3: Run the Application
```bash
# From root directory
npm run dev
```

Open http://localhost:5173 in your browser! 🎉

---

## 📧 Email Configuration (Gmail)

### Option 1: Gmail App Password (Recommended)

1. **Enable 2-Factor Authentication**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Chat App" as the name
   - Copy the 16-character password

3. **Update server/.env**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # Paste the app password here
   EMAIL_FROM=Chat App <your_email@gmail.com>
   ```

### Option 2: Other Email Providers

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASSWORD=your_password
```

#### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your_email@yahoo.com
EMAIL_PASSWORD=your_app_password
```

#### Custom SMTP
```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_USER=your_email@domain.com
EMAIL_PASSWORD=your_password
```

---

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB

**Windows:**
```bash
# Download from https://www.mongodb.com/try/download/community
# Install and run
mongod
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Configuration:**
```env
MONGODB_URI=mongodb://localhost:27017/chatapp
```

### Option 2: MongoDB Atlas (Cloud - Free)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free

2. **Create Cluster**
   - Choose "Shared" (Free tier)
   - Select your region
   - Click "Create Cluster"

3. **Setup Access**
   - Database Access → Add New User
   - Network Access → Add IP Address (0.0.0.0/0 for development)

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

5. **Update server/.env**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp?retryWrites=true&w=majority
   ```

---

## 🔧 Environment Variables Reference

### Server (.env)
```env
# Server Configuration
PORT=5000                                    # Server port
MONGODB_URI=mongodb://localhost:27017/chatapp  # MongoDB connection
JWT_SECRET=your_super_secret_key_here        # JWT secret (change this!)
CLIENT_URL=http://localhost:5173             # Frontend URL

# Email Configuration
EMAIL_HOST=smtp.gmail.com                    # SMTP host
EMAIL_PORT=587                               # SMTP port
EMAIL_USER=your_email@gmail.com              # Email address
EMAIL_PASSWORD=your_app_password             # Email password/app password
EMAIL_FROM=Chat App <your_email@gmail.com>   # From address

# OTP Configuration
OTP_EXPIRY_MINUTES=10                        # OTP validity in minutes
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api      # Backend API URL
VITE_SOCKET_URL=http://localhost:5000       # Socket.io server URL
```

---

## 🎯 Testing the Application

### 1. Test OTP Email
```bash
# Start the server
cd server
npm run dev

# In another terminal, test the endpoint
curl -X POST http://localhost:5000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"connect@subhadipghosh.co.in","name":"Test User"}'
```

Check your email for the OTP!

### 2. Test with Multiple Users
- Open http://localhost:5173 in Chrome
- Open http://localhost:5173 in Firefox (or Incognito)
- Login with different emails
- Send messages between the two users

### 3. Test Real-time Features
- Keep both browser windows visible
- Send a message from one user
- See it appear instantly in the other window
- Check online status indicators
- Try typing to see typing indicators

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:**
```bash
# Check if MongoDB is running
# Windows
tasklist | findstr mongod

# macOS/Linux
ps aux | grep mongod

# If not running, start it
mongod
```

### Issue: "Email not sending"
**Solutions:**
1. Check email credentials in `.env`
2. For Gmail, use App Password (not regular password)
3. Enable "Less secure app access" (not recommended)
4. Check spam folder

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue: "Socket connection failed"
**Solutions:**
1. Check if server is running
2. Verify `VITE_SOCKET_URL` in `client/.env`
3. Clear browser cache
4. Check browser console for errors

### Issue: "Module not found"
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
rm -rf server/node_modules server/package-lock.json
rm -rf client/node_modules client/package-lock.json
npm run install-all
```

---

## 📱 Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- **Frontend**: Vite automatically reloads on file changes
- **Backend**: Nodemon restarts server on file changes

### Debug Mode
Enable detailed logging:
```javascript
// server/index.js
mongoose.set('debug', true);  // MongoDB query logging

// client/src/store/socketStore.js
socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});
```

### Browser DevTools
- **Network Tab**: Monitor API calls and WebSocket connections
- **Console**: Check for errors and logs
- **Application Tab**: Inspect localStorage for JWT token

---

## 🚀 Production Deployment

### Environment Setup
```env
# Production server/.env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/chatapp
JWT_SECRET=use_a_very_strong_random_secret_here
CLIENT_URL=https://your-domain.com
```

### Build Frontend
```bash
cd client
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Deploy Backend
```bash
cd server
npm start
# Use PM2 or similar for process management
```

### Recommended Hosting
- **Frontend**: Vercel, Netlify, or Cloudflare Pages
- **Backend**: Heroku, Railway, or DigitalOcean
- **Database**: MongoDB Atlas (free tier available)

---

## 📞 Need Help?

If you encounter any issues:
1. Check the main README.md for detailed documentation
2. Review the troubleshooting section
3. Check browser console for errors
4. Verify all environment variables are set correctly
5. Ensure MongoDB is running and accessible

---

**Happy Coding! 🎉**
