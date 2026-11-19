# Quick Deployment Checklist

Follow these steps to deploy your Quiz App:

## ðŸš€ Step-by-Step Deployment

### 1. Setup MongoDB Atlas (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a FREE cluster (M0)
4. Create database user:
   - Username: `quizapp`
   - Password: Generate and save it!
5. Network Access: Add IP `0.0.0.0/0` (allow all for now)
6. Get connection string:
   - Click "Connect" â†’ "Connect your application"
   - Copy the string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://<db_username>:<db_password>@<cluster-host>/<database>?retryWrites=true&w=majority`

### 2. Deploy Backend to Render (10 minutes)

1. Go to https://render.com and sign up with GitHub
2. Click "New" â†’ "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `quiz-app-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm run start`
5. Add Environment Variables:
   ```
   PORT=5000
   MONGO_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-random-32-char-string>
   JWT_EXPIRES_IN=1d
   CORS_ORIGIN=https://your-frontend.vercel.app (update after frontend deploy)
   NODE_ENV=production
   ```
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL (e.g., `https://quiz-app-backend.onrender.com`)

### 3. Deploy Frontend to Vercel (5 minutes)

1. Go to https://vercel.com and sign up with GitHub
2. Click "Add New" â†’ "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```
6. Click "Deploy"
7. Wait for build (2-3 minutes)
8. Copy your frontend URL (e.g., `https://quiz-app.vercel.app`)

### 4. Update Backend CORS

1. Go back to Render dashboard
2. Update `CORS_ORIGIN` environment variable to your Vercel URL
3. Redeploy backend (or it will auto-redeploy)

### 5. Seed Production Database

Run locally with production MongoDB URI:

```bash
cd backend
# Update .env with production MONGO_URI
npm run seed
```

Or create admin via API:
```bash
curl -X POST https://your-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin"
  }'
```

### 6. Test Deployment

1. Visit your frontend URL
2. Try signing up
3. Try logging in
4. Test all features

---

## ðŸ“ Environment Variables Reference

### Backend (Render)
```
PORT=5000
MONGO_URI=mongodb+srv://<db_username>:<db_password>@<cluster-host>/<database>?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-32-chars-minimum
JWT_EXPIRES_IN=1d
CORS_ORIGIN=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## âœ… Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelist configured
- [ ] Backend deployed to Render
- [ ] Backend environment variables set
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable set
- [ ] CORS_ORIGIN updated in backend
- [ ] Database seeded
- [ ] All features tested

---

## ðŸ”§ Generate JWT Secret

Use this command to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use an online generator: https://randomkeygen.com/

---

## ðŸ†˜ Troubleshooting

**Backend won't start:**
- Check MongoDB connection string
- Verify all environment variables are set
- Check Render logs

**Frontend can't connect:**
- Verify VITE_API_URL is correct
- Check CORS_ORIGIN matches frontend URL exactly
- Check browser console for errors

**Database connection fails:**
- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Verify database user credentials

---

## ðŸ“š Full Documentation

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

