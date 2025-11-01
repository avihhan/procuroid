# Supabase Authentication Setup Guide

## Overview
This guide explains how to configure Supabase authentication for the Procuroid backend.

## Prerequisites
- A Supabase project created at https://supabase.com
- Your Supabase project URL and API keys

## Configuration Steps

### 1. Install Dependencies
The required packages are already in `requirements.txt`. Install them with:

```bash
cd procuroid-backend
pip install -r requirements.txt
```

### 2. Set Up Environment Variables
Create a `.env` file in the `procuroid-backend` directory with the following content:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

**Where to find these values:**
1. Go to your Supabase project dashboard
2. Click on "Settings" → "API"
3. Copy the "Project URL" for `SUPABASE_URL`
4. Copy the "anon public" key for `SUPABASE_KEY`
5. Copy the "service_role" key for `SUPABASE_SERVICE_KEY`

**Important:** The `.env` file is already in `.gitignore`, so your credentials won't be committed to version control.

### 3. How It Works

#### Backend Authentication Flow
1. **Token Verification** (`src/services/database.py`):
   - The `verify_user_token()` function validates JWT tokens sent from the frontend
   - It uses the Supabase client to verify the token and retrieve user information
   - Returns a dict with user id, email, and metadata if valid

2. **Route Protection** (`src/api/__init__.py`):
   - The `@require_auth` decorator protects routes that need authentication
   - It extracts the JWT token from the `Authorization: Bearer <token>` header
   - Calls `verify_user_token()` to validate the token
   - Returns 401 if the token is invalid or missing
   - Attaches user info to `request.user` for use in route handlers

3. **Protected Routes**:
   - `/send-quote-request/<user_id>` - Requires authentication
   - Add `@require_auth` decorator to any route that needs protection

#### Frontend Integration (`src/api/apiCalls.tsx`)
- The frontend automatically retrieves the current Supabase session
- Includes the JWT token in the `Authorization` header for API requests
- Throws an error if the user is not authenticated

## Testing the Setup

1. **Start the backend server:**
   ```bash
   cd procuroid-backend
   python src/api/main.py
   ```

2. **Start the frontend:**
   ```bash
   cd procuroid-frontend
   npm run dev
   ```

3. **Test authentication:**
   - Sign in to the application with valid Supabase credentials
   - Try to place an order or use a protected feature
   - Check the backend console for authentication logs

## Troubleshooting

### Backend can't verify tokens
- Ensure `.env` file exists and has the correct Supabase credentials
- Verify that `python-dotenv` is installed
- Check that `SUPABASE_URL` and `SUPABASE_KEY` are set correctly

### Frontend can't send requests
- Make sure the user is logged in to the application
- Check the browser console for authentication errors
- Verify that the Supabase client is initialized in `src/lib/supabase.ts`

### 401 Unauthorized errors
- Verify the Supabase credentials in `.env` match your project
- Ensure the token hasn't expired (Supabase tokens refresh automatically)
- Check that CORS is properly configured in the backend

## Security Notes

- Never commit `.env` files to version control
- Use the anon key for client-side operations
- Use the service role key only in server-side code
- The service role key bypasses Row Level Security policies - use it carefully
- All production deployments should use environment variables set in your hosting platform

## Next Steps

- Add more protected routes as needed
- Implement role-based access control if required
- Set up Row Level Security policies in Supabase
- Add rate limiting to prevent abuse
- Set up proper logging for security events

