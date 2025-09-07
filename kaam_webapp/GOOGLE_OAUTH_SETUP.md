# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your STEPUP application.

## Prerequisites

1. A Google Cloud Platform account
2. Access to Google Cloud Console
3. Node.js and npm installed

## Step 1: Set up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google Identity Services API

## Step 2: Configure OAuth Consent Screen

1. In the Google Cloud Console, go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "STEPUP"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users if needed

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
5. Add authorized redirect URIs:
   - `http://localhost:3000`
   - `https://yourdomain.com`
6. Copy the Client ID and Client Secret

## Step 4: Configure Environment Variables

### Backend (.env file)
Create a `.env` file in the `kaam-backend` directory:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production

# MongoDB Configuration
MONGODB_URI=mongodb+srv://admin:admin@cluster0.a63tul9.mongodb.net/StepUP_Backend?retryWrites=true&w=majority&appName=Cluster0

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Frontend
Update the `GOOGLE_CLIENT_ID` in `kaam_webapp/src/App.js`:

```javascript
const GOOGLE_CLIENT_ID = "your_actual_google_client_id_here";
```

## Step 5: Install Dependencies

### Backend
```bash
cd kaam-backend
npm install jsonwebtoken bcryptjs google-auth-library
```

### Frontend
```bash
cd kaam_webapp
npm install @react-oauth/google jwt-decode
```

## Step 6: Database Schema Updates

The application now includes authentication fields in all user models:

- `googleId`: Google's unique identifier for the user
- `password`: Hashed password (optional for Google users)
- `authMethod`: Authentication method ('google', 'password', or 'both')
- `isEmailVerified`: Whether the email is verified by Google
- `lastLogin`: Timestamp of last login

## Step 7: Start the Application

### Backend
```bash
cd kaam-backend
npm start
```

### Frontend
```bash
cd kaam_webapp
npm start
```

## How It Works

### For New Users
1. User clicks "Sign in with Google"
2. Google OAuth flow completes
3. Backend creates new user account with Google data
4. User is redirected to complete profile form
5. Optional: User can set a password for additional security

### For Existing Users
1. User clicks "Sign in with Google"
2. Backend finds existing user by email or Google ID
3. User is logged in and redirected to dashboard
4. User can optionally set a password

### Password-Based Login
- Existing users with passwords can still use email/password login
- New Google users can set passwords for additional login options

## Security Features

1. **JWT Tokens**: Secure authentication tokens with expiration
2. **Password Hashing**: Bcrypt with salt rounds for password security
3. **Google Token Verification**: Server-side verification of Google ID tokens
4. **Email Verification**: Leverages Google's email verification
5. **Rate Limiting**: Built-in protection against brute force attacks

## API Endpoints

### Authentication Routes
- `POST /api/auth/student/google` - Student Google OAuth
- `POST /api/auth/executive/google` - Executive Google OAuth
- `POST /api/auth/employer/google` - Employer Google OAuth
- `POST /api/auth/login` - Password-based login
- `POST /api/auth/set-password` - Set password for Google users

### Protected Routes
All existing routes remain the same, but now support JWT authentication.

## Troubleshooting

### Common Issues

1. **"Invalid Google token" error**
   - Check if GOOGLE_CLIENT_ID is correct
   - Verify the token hasn't expired
   - Ensure the domain is authorized in Google Console

2. **"User not found" error**
   - Check if the user exists in the database
   - Verify email format and uniqueness

3. **CORS errors**
   - Ensure backend CORS is properly configured
   - Check if frontend URL is in authorized origins

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=oauth:*
```

## Production Considerations

1. **Environment Variables**: Use proper environment variables for production
2. **HTTPS**: Ensure all production URLs use HTTPS
3. **Domain Verification**: Verify your domain with Google
4. **Rate Limiting**: Implement proper rate limiting for production
5. **Monitoring**: Set up logging and monitoring for authentication events

## Support

For issues or questions:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure Google Cloud Console configuration is correct
4. Check database connectivity and schema

## Migration from Demo Mode

The application now supports both demo mode and secure authentication:

- **Demo Mode**: Users can still use any email/password (for testing)
- **Secure Mode**: Google OAuth + optional password authentication
- **Hybrid Mode**: Users can use both methods

To completely disable demo mode, remove the demo login logic from the login components.
