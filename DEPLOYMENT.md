# 🚀 Deployment Guide

## Quick Deploy (Recommended)

### Step 1: Deploy Backend to Render

1. **Push to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/chat-app.git
   git push -u origin main
   ```

2. **Deploy on Render**:
   - Go to https://render.com and sign up
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: chat-app-backend
     - **Root Directory**: `server`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment**: Node
   
3. **Add Environment Variables** in Render:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://subhadipghosh:subhadipghosh@subha.d5vgqew.mongodb.net/chatapp
   JWT_SECRET=5aee6033349d2c8eade373cff265353f408281d90f2481167ec4533cdbf8d31d73d543890904d7fe36fc79972dcd9291fbabc40c5
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

4. **Copy your backend URL**: e.g., `https://chat-app-backend.onrender.com`

### Step 2: Deploy Frontend to Vercel

1. **Update Frontend Environment**:
   - Create `client/.env.production`:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     VITE_SOCKET_URL=https://your-backend-url.onrender.com
     ```

2. **Deploy on Vercel**:
   - Go to https://vercel.com and sign up
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `client`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   
3. **Add Environment Variables** in Vercel:
   - Go to Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     VITE_SOCKET_URL=https://your-backend-url.onrender.com
     ```

4. **Deploy!** Vercel will give you a URL like `https://chat-app-xyz.vercel.app`

### Step 3: Update Backend with Frontend URL

1. Go back to Render
2. Update `CLIENT_URL` environment variable with your Vercel URL
3. Restart the service

---

## Alternative: Deploy to Railway (Easier)

Railway can host both frontend and backend together:

1. **Sign up at https://railway.app**
2. **New Project** → "Deploy from GitHub repo"
3. **Add MongoDB Atlas** connection string
4. Railway will auto-detect and deploy both services

---

## One-Click Deploy Options

### Deploy Backend to Render
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

### Deploy Frontend to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## Environment Variables Reference

### Backend (Render/Railway)
```env
PORT=5000
MONGODB_URI=mongodb+srv://subhadipghosh:subhadipghosh@subha.d5vgqew.mongodb.net/chatapp
JWT_SECRET=5aee6033349d2c8eade373cff265353f408281d90f2481167ec4533cdbf8d31d73d543890904d7fe36fc79972dcd9291fbabc40c5
CLIENT_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

### Frontend (Vercel/Netlify)
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

---

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend can connect to backend API
- [ ] Socket.io connection works
- [ ] MongoDB connection is successful
- [ ] Users can register and login
- [ ] Messages send in real-time
- [ ] CORS is configured correctly

---

## Troubleshooting

### CORS Errors
Make sure `CLIENT_URL` in backend matches your frontend URL exactly.

### Socket.io Connection Failed
- Check `VITE_SOCKET_URL` is correct
- Ensure backend supports WebSocket connections
- Render free tier supports WebSockets ✅

### MongoDB Connection Error
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check connection string is correct

---

## Free Tier Limitations

**Render (Backend)**:
- ✅ Free tier available
- ⚠️ Sleeps after 15 minutes of inactivity
- ⚠️ Cold start takes 30-60 seconds

**Vercel (Frontend)**:
- ✅ 100% free for personal projects
- ✅ Instant deployments
- ✅ Automatic HTTPS

**MongoDB Atlas**:
- ✅ 512MB free storage
- ✅ Shared cluster

---

## Upgrade Options

For production use without sleep:
- **Render**: $7/month for always-on
- **Railway**: $5/month credit
- **Heroku**: $7/month (Eco Dynos)
