# OAuth Implementation Guide

## Overview

This application now supports OAuth authentication using Google as the provider. Users can sign in with their Google accounts in addition to traditional email/password authentication.

## Backend Setup

### 1. Environment Variables

Copy the `.env.example` file to `.env` and configure the following variables:

```bash
cp .env.example .env
```

Required environment variables:

- `GOOGLE_CLIENT_ID`: Your Google OAuth 2.0 client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth 2.0 client secret
- `GOOGLE_CALLBACK_URL`: OAuth callback URL (default: http://localhost:8070/auth/google/callback)
- `JWT_SECRET`: Secret key for JWT tokens
- `SESSION_SECRET`: Secret key for sessions

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - Development: `http://localhost:8070/auth/google/callback`
     - Production: `https://yourdomain.com/auth/google/callback`
5. Copy the Client ID and Client Secret to your `.env` file

## New Features Added

### Backend Components

1. **OAuth Configuration** (`config/passport.js`)

   - Google OAuth strategy setup
   - User serialization/deserialization
   - Automatic user creation for new OAuth users

2. **JWT Authentication Middleware** (`middlewares/jwtAuth.js`)

   - JWT token verification
   - Optional authentication middleware
   - Role-based access control

3. **OAuth Routes** (`routes/auth.js`)

   - `/auth/google` - Initiates Google OAuth flow
   - `/auth/google/callback` - Handles OAuth callback
   - `/auth/logout` - Logout endpoint
   - `/auth/me` - Get current user info

4. **Updated User Model** (`models/User.js`)
   - Added OAuth fields: `googleId`, `avatar`, `isOAuthUser`
   - Made password optional for OAuth users
   - Made contact optional for OAuth users initially

### Frontend Components

1. **Authentication Context** (`contexts/AuthContext.js`)

   - Centralized auth state management
   - Login, register, logout functions
   - Google OAuth integration

2. **Protected Routes** (`components/ProtectedRoute.js`)

   - Route protection based on authentication
   - Role-based access control

3. **OAuth Callback Handler** (`components/OAuthCallback.js`)

   - Handles OAuth redirect flow
   - User role-based navigation

4. **Updated Login Component** (`pages/Login.js`)

   - Added Google OAuth button
   - Integrated with auth context
   - Automatic role-based navigation

5. **Dashboard Component** (`pages/Dashboard.js`)
   - User profile display
   - Role-specific features overview

## API Endpoints

### Authentication Endpoints

- `POST /user/login` - Traditional email/password login
- `POST /user/register` - User registration
- `POST /user/logout` - Logout
- `GET /user/profile` - Get current user profile (protected)

### OAuth Endpoints

- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback handler
- `POST /auth/logout` - OAuth logout
- `GET /auth/me` - Get current user info (protected)

## Usage

### Traditional Login

Users can still log in using email and password as before.

### Google OAuth Login

1. User clicks "Continue with Google" button
2. Redirected to Google OAuth consent screen
3. After approval, redirected back to the application
4. Automatically logged in and redirected based on user role

### User Roles

- **resident**: Redirected to `/residentHome`
- **admin**: Redirected to `/adminHome`
- **collector**: Redirected to `/CollectorHome/:userId`
- **recorder**: Redirected to `/CollectedWasteDashboard`

## Security Features

1. **JWT Tokens**: Secure authentication with HTTP-only cookies
2. **Role-based Access Control**: Route protection based on user roles
3. **CSRF Protection**: Existing CSRF protection maintained
4. **Secure Cookies**: Authentication cookies with secure flags in production
5. **Input Validation**: Comprehensive input validation and sanitization

## Testing

### Manual Testing Steps

1. **Traditional Login**:

   - Go to `/login`
   - Enter valid credentials
   - Verify successful login and role-based redirect

2. **Google OAuth**:

   - Go to `/login`
   - Click "Continue with Google"
   - Complete Google OAuth flow
   - Verify user creation/login and redirect

3. **Protected Routes**:

   - Try accessing protected routes without authentication
   - Verify redirect to login page

4. **Logout**:
   - Log in and then log out
   - Verify session cleanup and redirect

### Development Testing

Start the backend server:

```bash
cd backend
npm run dev
```

Start the frontend server:

```bash
cd frontend
npm start
```

Navigate to `http://localhost:3000` and test the OAuth flow.

## Production Deployment

1. Update environment variables for production
2. Set `NODE_ENV=production`
3. Update Google OAuth redirect URIs in Google Cloud Console
4. Ensure HTTPS is enabled for OAuth callbacks
5. Update `FRONTEND_URL` and `GOOGLE_CALLBACK_URL` to production domains

## Troubleshooting

### Common Issues

1. **OAuth Redirect URI Mismatch**:

   - Ensure redirect URI in Google Cloud Console matches your callback URL
   - Check for HTTP vs HTTPS mismatches

2. **CORS Issues**:

   - Verify CORS configuration in backend server
   - Check that frontend origin is allowed

3. **JWT Token Issues**:

   - Verify JWT_SECRET is set and consistent
   - Check cookie settings (httpOnly, secure, sameSite)

4. **User Creation Failures**:
   - Check MongoDB connection
   - Verify user model validation rules
   - Check for duplicate email issues

### Debug Mode

Enable debug logging by setting environment variables:

```bash
DEBUG=passport:*
NODE_ENV=development
```

This will provide detailed logging for OAuth flow debugging.
