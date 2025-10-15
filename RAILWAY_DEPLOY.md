# 🚂 Railway Deployment Guide (Easiest Method)

Railway is the simplest way to deploy - it handles both frontend and backend automatically!

## 🎯 Step-by-Step Deployment

### Step 1: Push to GitHub (if not done)

```bash
git init
git add .
git commit -m "Ready for Railway deployment"
git remote add origin https://github.com/YOUR_USERNAME/chat-app.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Railway

1. **Go to https://railway.app**
2. **Sign up** with GitHub (it's free!)
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your `chat-app` repository
6. Railway will automatically detect and deploy!

### Step 3: Add Environment Variables

After deployment starts, click on your project:

1. Click on the **backend service** (server)
2. Go to **"Variables"** tab
3. Add these variables:

```env
MONGODB_URI=mongodb+srv://subhadipghosh:subhadipghosh@subha.d5vgqew.mongodb.net/chatapp
JWT_SECRET=5aee6033349d2c8eade373cff265353f408281d90f2481167ec4533cdbf8d31d73d543890904d7fe36fc79972dcd9291fbabc40c5
CLIENT_URL=${{RAILWAY_PUBLIC_DOMAIN}}
PORT=5000
NODE_ENV=production
```

4. Click on the **frontend service** (client)
5. Add these variables:

```env
VITE_API_URL=https://${{server.RAILWAY_PUBLIC_DOMAIN}}/api
VITE_SOCKET_URL=https://${{server.RAILWAY_PUBLIC_DOMAIN}}
```

### Step 4: Generate Domains

1. Click on your **backend service**
2. Go to **"Settings"** → **"Networking"**
3. Click **"Generate Domain"**
4. Copy the domain (e.g., `chat-backend-production.up.railway.app`)

5. Click on your **frontend service**
6. Go to **"Settings"** → **"Networking"**
7. Click **"Generate Domain"**
8. Copy the domain (e.g., `chat-frontend-production.up.railway.app`)

### Step 5: Update Environment Variables

1. Go back to **backend variables**
2. Update `CLIENT_URL` with your frontend domain:
   ```
   CLIENT_URL=https://chat-frontend-production.up.railway.app
   ```

3. Go to **frontend variables**
4. Update the API URLs with your backend domain:
   ```
   VITE_API_URL=https://chat-backend-production.up.railway.app/api
   VITE_SOCKET_URL=https://chat-backend-production.up.railway.app
   ```

5. Both services will automatically redeploy!

## ✅ Done!

Your app is now live! Visit your frontend domain to use the chat app.

---

## 🎁 Railway Free Tier

- ✅ **$5 free credit per month**
- ✅ **No credit card required**
- ✅ **Always-on services** (no sleep!)
- ✅ **Automatic HTTPS**
- ✅ **Auto-deploy on git push**

---

## 🔧 Alternative: Single Service Deployment

If Railway creates two services, you can also deploy as a monorepo:

1. **Create `Procfile`** in root:
   ```
   web: cd server && npm start
   ```

2. **Update `package.json`** in root:
   ```json
   {
     "scripts": {
       "start": "cd server && npm start",
       "build": "cd client && npm run build"
     }
   }
   ```

3. Railway will serve the built frontend from the backend.

---

## 📊 Monitor Your App

Railway provides:
- 📈 **Real-time logs** - See what's happening
- 📊 **Metrics** - CPU, Memory, Network usage
- 🔄 **Deployments** - History of all deploys
- 🚨 **Alerts** - Get notified of issues

---

## 🐛 Troubleshooting

### Build Failed?
- Check the build logs in Railway dashboard
- Verify `package.json` has all dependencies

### Can't Connect?
- Make sure domains are generated
- Check environment variables are correct
- Verify MongoDB allows connections from anywhere

### Out of Credits?
- Free tier gives $5/month
- Upgrade to hobby plan ($5/month) for more credits
- Or use Render (free but sleeps)

---

## 🎉 Share Your App!

Your app is live at: `https://your-frontend.up.railway.app`

Share it with friends and start chatting! 🚀
