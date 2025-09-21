#!/bin/bash

# OAuth Setup Test Script
# This script helps verify that the OAuth implementation is working correctly

echo "🔍 Checking OAuth Implementation..."
echo

# Check if required files exist
echo "📁 Checking required files..."
files_to_check=(
    "backend/config/passport.js"
    "backend/routes/auth.js"
    "backend/middlewares/jwtAuth.js"
    "frontend/src/contexts/AuthContext.js"
    "frontend/src/components/ProtectedRoute.js"
    "frontend/src/components/OAuthCallback.js"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

echo

# Check if required npm packages are installed
echo "📦 Checking backend dependencies..."
cd backend

required_packages=("passport" "passport-google-oauth20" "express-session" "jsonwebtoken")
for package in "${required_packages[@]}"; do
    if npm list "$package" > /dev/null 2>&1; then
        echo "✅ $package installed"
    else
        echo "❌ $package not installed"
        echo "   Run: npm install $package"
    fi
done

echo

# Check if frontend dependencies are installed
echo "📦 Checking frontend dependencies..."
cd ../frontend

frontend_packages=("js-cookie")
for package in "${frontend_packages[@]}"; do
    if npm list "$package" > /dev/null 2>&1; then
        echo "✅ $package installed"
    else
        echo "❌ $package not installed"
        echo "   Run: npm install $package"
    fi
done

echo

# Check environment variables
echo "🔧 Checking environment variables..."
cd ../backend

if [ -f ".env" ]; then
    echo "✅ .env file exists"
    
    # Check for required variables
    required_vars=("GOOGLE_CLIENT_ID" "GOOGLE_CLIENT_SECRET" "JWT_SECRET" "SESSION_SECRET")
    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=" .env 2>/dev/null; then
            echo "✅ $var is set"
        else
            echo "❌ $var not set in .env"
        fi
    done
else
    echo "❌ .env file not found"
    echo "   Copy .env.example to .env and configure your variables"
fi

echo

# Provide next steps
echo "🚀 Next Steps:"
echo "1. Set up Google OAuth in Google Cloud Console"
echo "2. Configure environment variables in backend/.env"
echo "3. Start backend server: cd backend && npm run dev"
echo "4. Start frontend server: cd frontend && npm start"
echo "5. Test OAuth flow at http://localhost:3000/login"

echo
echo "📖 For detailed setup instructions, see OAUTH_SETUP.md"
