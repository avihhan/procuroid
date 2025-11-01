import os
from dotenv import load_dotenv
from supabase import create_client, Client
from typing import Optional

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url: str = os.getenv("SUPABASE_URL", "")
supabase_key: str = os.getenv("SUPABASE_KEY", "")
supabase_service_key: str = os.getenv("SUPABASE_SERVICE_KEY", "")

# Create Supabase client instance with anon key for public operations
# Only create clients if credentials are provided, otherwise they'll be None
try:
    if supabase_url and supabase_key:
        supabase: Client = create_client(supabase_url, supabase_key)
    else:
        supabase = None
        print("Warning: SUPABASE_URL and SUPABASE_KEY not set. Authentication features will be disabled.")
except Exception as e:
    print(f"Warning: Failed to create Supabase client: {e}")
    supabase = None

try:
    if supabase_url and supabase_service_key:
        supabase_admin: Client = create_client(supabase_url, supabase_service_key)
    else:
        supabase_admin = None
except Exception as e:
    print(f"Warning: Failed to create Supabase admin client: {e}")
    supabase_admin = None


def verify_user_token(token: str) -> Optional[dict]:
    """
    Verify a user's JWT token and return their user information.
    
    Args:
        token: The JWT token from the Authorization header
        
    Returns:
        dict: User information if token is valid, None otherwise
    """
    try:
        if not supabase:
            print("Supabase client not initialized")
            return None
        
        # Verify the JWT token using Supabase
        response = supabase.auth.get_user(token)
        
        if response.user:
            return {
                "id": response.user.id,
                "email": response.user.email,
                "user_metadata": response.user.user_metadata,
            }
        return None
    except Exception as e:
        print(f"Token verification error: {e}")
        return None


def get_user_by_id(user_id: str) -> Optional[dict]:
    """
    Get user information by user ID using admin client.
    
    Args:
        user_id: The Supabase user ID
        
    Returns:
        dict: User information if found, None otherwise
    """
    try:
        response = supabase_admin.auth.admin.get_user_by_id(user_id)
        if response.user:
            return {
                "id": response.user.id,
                "email": response.user.email,
                "user_metadata": response.user.user_metadata,
            }
        return None
    except Exception as e:
        print(f"Error fetching user: {e}")
        return None


def sign_up_user(email: str, password: str, user_metadata: Optional[dict] = None) -> dict:
    """
    Sign up a new user with email and password.
    
    Args:
        email: User's email address
        password: User's password
        user_metadata: Optional metadata dictionary (e.g., first_name, last_name)
        
    Returns:
        dict: Response with user and session data or error message
    """
    try:
        if not supabase:
            return {"success": False, "error": "Supabase client not initialized"}
        
        # Build the sign up payload with metadata if provided
        sign_up_payload = {
            "email": email,
            "password": password,
        }
        
        if user_metadata:
            sign_up_payload["options"] = {"data": user_metadata}
        
        response = supabase.auth.sign_up(sign_up_payload)
        
        if response.user:
            return {
                "success": True,
                "user": {
                    "id": response.user.id,
                    "email": response.user.email,
                    "user_metadata": response.user.user_metadata,
                },
                "message": "User created successfully. Check your email to confirm your account."
            }
        return {"success": False, "error": "Failed to create user"}
    except Exception as e:
        print(f"Sign up error: {e}")
        return {"success": False, "error": str(e)}


def sign_in_user(email: str, password: str) -> dict:
    """
    Sign in an existing user with email and password.
    
    Args:
        email: User's email address
        password: User's password
        
    Returns:
        dict: Response with user, session (including access_token) or error message
    """
    try:
        if not supabase:
            return {"success": False, "error": "Supabase client not initialized"}
        
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password,
        })
        
        if response.user and response.session:
            return {
                "success": True,
                "user": {
                    "id": response.user.id,
                    "email": response.user.email,
                    "user_metadata": response.user.user_metadata,
                },
                "session": {
                    "access_token": response.session.access_token,
                    "refresh_token": response.session.refresh_token,
                    "expires_at": response.session.expires_at,
                    "expires_in": response.session.expires_in,
                }
            }
        return {"success": False, "error": "Invalid credentials"}
    except Exception as e:
        print(f"Sign in error: {e}")
        return {"success": False, "error": str(e)}

