# Firebase Setup Guide for Quantify

This guide will help you set up Firebase Authentication for your Quantify React app.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter your project name (e.g., "Quantify")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Set Up Authentication

1. In your Firebase project console, click on "Authentication" in the left sidebar
2. Click on the "Get started" button
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## Step 3: Get Your Firebase Configuration

1. Click on the gear icon (Project settings) in the left sidebar
2. Scroll down to "Your apps" section
3. Click on the web icon (`</>`) to add a web app
4. Enter your app nickname (e.g., "Quantify Web")
5. Click "Register app"
6. Copy the Firebase configuration object

## Step 4: Configure Environment Variables

1. Create a `.env` file in your project root (copy from `.env.example`)
2. Replace the placeholder values with your actual Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-actual-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
VITE_FIREBASE_APP_ID=your-actual-app-id
```

## Step 5: Set Up Firestore (Optional)

If you want to store user data:

1. In Firebase Console, click on "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location for your database
5. Click "Done"

## Step 6: Security Rules (Important!)

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 7: Test Your Setup

1. Restart your development server: `npm run dev`
2. Try creating a new account at `/signup`
3. Try logging in at `/login`
4. Verify that protected routes work correctly

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/configuration-not-found)"**
   - Make sure your `.env` file is in the project root
   - Verify all environment variables are correctly set
   - Restart your development server

2. **"Firebase: Error (auth/invalid-api-key)"**
   - Double-check your API key in the `.env` file
   - Ensure there are no extra spaces or quotes

3. **"Firebase: Error (auth/project-not-found)"**
   - Verify your project ID is correct
   - Make sure the project exists in Firebase Console

### Development vs Production:

- For development, the demo configuration will work with basic functionality
- For production, you MUST set up actual Firebase configuration
- Never commit your actual Firebase keys to version control

## Next Steps

Once Firebase is set up, you can:

1. Add user profile management
2. Implement role-based access control
3. Add social authentication (Google, Facebook, etc.)
4. Set up email verification
5. Add user data storage in Firestore

For more advanced features, check the [Firebase Auth documentation](https://firebase.google.com/docs/auth/web/start).
