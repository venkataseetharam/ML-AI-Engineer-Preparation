# Firebase Security Rules for Public Sharing

## Current Rules (Private Only)
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

## New Rules (Public Sharing Enabled)

Replace your Firestore security rules with these to enable public sharing:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Allow owner to read/write their own data
      allow write: if request.auth != null && request.auth.uid == userId;

      // Allow public read access to owner's data
      // Replace YOUR_FIREBASE_USER_ID with your actual Firebase UID
      allow read: if userId == 'YOUR_FIREBASE_USER_ID' ||
                     (request.auth != null && request.auth.uid == userId);
    }
  }
}
```

## How to Update

1. **Get Your Firebase User ID:**
   - Sign in to your app
   - Open browser console (F12 → Console tab)
   - Look for: `🔑 Your Firebase User ID...`
   - Copy the ID shown

2. **Update Security Rules:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: "ml-engineer-preparation"
   - Click **Firestore Database** → **Rules** tab
   - Replace `YOUR_FIREBASE_USER_ID` with your actual ID
   - Click **Publish**

3. **Update Environment Variable:**
   - Open `.env.local` in your project
   - Replace `YOUR_USER_ID_HERE` with your Firebase User ID
   - Save the file
   - Rebuild and redeploy: `npm run build && git push`

## Example

If your Firebase User ID is `abc123xyz789`, the rules would be:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow write: if request.auth != null && request.auth.uid == userId;
      allow read: if userId == 'abc123xyz789' ||
                     (request.auth != null && request.auth.uid == userId);
    }
  }
}
```

## What This Does

- **Your data is publicly readable**: Anyone can view your progress
- **Your data is NOT editable**: Only you can update your progress (when signed in)
- **Other users' data remains private**: Each user can only see and edit their own data
- **Visitors see YOUR progress**: When they visit without signing in

## Security Notes

- Your progress data will be publicly visible to anyone with the link
- Your personal information (email, name) from Google auth is NOT shared
- Only the tracking data (LeetCode problems, projects, etc.) is visible
- Other users who sign in will still have completely private trackers
