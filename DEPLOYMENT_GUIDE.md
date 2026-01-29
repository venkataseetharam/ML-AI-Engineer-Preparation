# MAANG Prep Tracker - Deployment Guide
## Deploy to Vercel with Firebase (Free)

This guide will help you deploy your tracker app so you can access it from anywhere.

**Total time: ~20 minutes**

---

## Step 1: Set Up Firebase (10 minutes)

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** (or "Add project")
3. Name it: `maang-prep-tracker`
4. Disable Google Analytics (optional, not needed)
5. Click **"Create project"**

### 1.2 Enable Authentication

1. In Firebase console, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Click **"Google"** under "Sign-in providers"
4. Toggle **"Enable"**
5. Select your email as the project support email
6. Click **"Save"**

### 1.3 Create Firestore Database

1. Click **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose a location close to you (e.g., `us-east1`)
5. Click **"Enable"**

### 1.4 Set Firestore Security Rules

1. In Firestore, click the **"Rules"** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

### 1.5 Get Firebase Config

1. Click the **gear icon** ⚙️ next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"**
4. Click the **web icon** `</>`
5. Register app with nickname: `maang-tracker-web`
6. **Don't** check "Firebase Hosting"
7. Click **"Register app"**
8. You'll see a config object like this - **COPY IT**:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "maang-prep-tracker.firebaseapp.com",
  projectId: "maang-prep-tracker",
  storageBucket: "maang-prep-tracker.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**Save these values - you'll need them in Step 3!**

---

## Step 2: Push Code to GitHub (5 minutes)

### 2.1 Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click **"+"** → **"New repository"**
3. Name: `maang-prep-tracker`
4. Keep it **Public** or **Private** (your choice)
5. Click **"Create repository"**

### 2.2 Push the Code

Open terminal in the `maang-tracker` folder and run:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: MAANG Prep Tracker"

# Add your GitHub repo as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/maang-prep-tracker.git

# Push
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel (5 minutes)

### 3.1 Connect Vercel to GitHub

1. Go to [Vercel](https://vercel.com)
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub

### 3.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Find `maang-prep-tracker` and click **"Import"**

### 3.3 Add Environment Variables

Before clicking Deploy, add your Firebase config:

1. Expand **"Environment Variables"**
2. Add each variable (copy values from Step 1.5):

| Name | Value |
|------|-------|
| `VITE_FIREBASE_API_KEY` | Your apiKey |
| `VITE_FIREBASE_AUTH_DOMAIN` | Your authDomain |
| `VITE_FIREBASE_PROJECT_ID` | Your projectId |
| `VITE_FIREBASE_STORAGE_BUCKET` | Your storageBucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your messagingSenderId |
| `VITE_FIREBASE_APP_ID` | Your appId |

3. Click **"Deploy"**

### 3.4 Wait for Deployment

Vercel will build and deploy your app. This takes 1-2 minutes.

Once done, you'll get a URL like: `https://maang-prep-tracker.vercel.app`

---

## Step 4: Configure Firebase Auth Domain

### 4.1 Add Vercel Domain to Firebase

1. Go back to [Firebase Console](https://console.firebase.google.com/)
2. Click **Authentication** → **Settings** tab
3. Scroll to **"Authorized domains"**
4. Click **"Add domain"**
5. Add your Vercel domain: `maang-prep-tracker.vercel.app`
6. Click **"Add"**

---

## 🎉 Done!

Your app is now live at your Vercel URL!

**Features:**
- ✅ Sign in with Google
- ✅ Data syncs across all devices
- ✅ Works on phone, tablet, desktop
- ✅ Auto-deploys when you push to GitHub

---

## Troubleshooting

### "Sign in failed" error
- Make sure you added your Vercel domain to Firebase Authorized Domains
- Check that Google Auth is enabled in Firebase

### "Permission denied" error
- Make sure Firestore security rules are set correctly
- Check that you're signed in

### Build fails on Vercel
- Check that all environment variables are set
- Make sure variable names start with `VITE_`

---

## Custom Domain (Optional)

Want `tracker.yourname.com`?

1. In Vercel, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow DNS instructions
5. Add the domain to Firebase Authorized Domains

---

## Local Development

To run locally:

```bash
# Create .env.local file with your Firebase config
cat > .env.local << EOF
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
EOF

# Install dependencies
npm install

# Run dev server
npm run dev
```

Open http://localhost:5173

---

## Support

If you run into issues:
1. Check the browser console for errors (F12 → Console)
2. Verify Firebase config values are correct
3. Make sure all environment variables are set in Vercel

Good luck with your MAANG prep! 🚀
