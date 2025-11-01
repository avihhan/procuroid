from flask import Flask, request, jsonify
import json
from datetime import datetime
from functools import wraps
import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from services.database import verify_user_token, sign_up_user, sign_in_user

# Optional CORS import
try:
    from flask_cors import CORS
except ImportError:
    CORS = None

app = Flask(__name__)

# Enable CORS for local development with credentials support
if CORS:
    CORS(
        app,
        resources={r"/*": {"origins": [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            # Include LAN frontends if accessed via IP
            "http://192.168.1.236:5173",
        ]}},
        supports_credentials=True,
    )

# In-memory storage (temporary)
QUOTE_REQUESTS = []


def require_auth(f):
    """
    Decorator to require authentication for a route.
    Expects Authorization header with format: Bearer <token>
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get the Authorization header
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({"error": "Missing authorization header"}), 401
        
        # Extract the token from "Bearer <token>"
        try:
            token = auth_header.split(' ')[1]
        except IndexError:
            return jsonify({"error": "Invalid authorization header format. Use: Bearer <token>"}), 401
        
        # Verify the token
        user_info = verify_user_token(token)
        
        if not user_info:
            return jsonify({"error": "Invalid or expired token"}), 401
        
        # Attach user info to request context so route handlers can access it
        request.user = user_info
        
        # Call the original function
        return f(*args, **kwargs)
    
    return decorated_function


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Procuroid API is running"})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/auth/signup", methods=["POST"])
def signup():
    data = request.get_json()
    
    if not data:
        return jsonify({"success": False, "error": "No data provided"}), 400
    
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"success": False, "error": "Email and password are required"}), 400
    
    # Extract user metadata if provided
    user_metadata = {}
    if data.get("firstName"):
        user_metadata["first_name"] = data.get("firstName")
    if data.get("lastName"):
        user_metadata["last_name"] = data.get("lastName")
    if data.get("firstName") or data.get("lastName"):
        user_metadata["display_name"] = f"{data.get('firstName', '')} {data.get('lastName', '')}".strip()
    
    result = sign_up_user(email, password, user_metadata if user_metadata else None)
    
    if result.get("success"):
        return jsonify(result), 201
    else:
        return jsonify(result), 400


@app.route("/auth/signin", methods=["POST"])
def signin():
    data = request.get_json()
    
    if not data:
        return jsonify({"success": False, "error": "No data provided"}), 400
    
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"success": False, "error": "Email and password are required"}), 400
    
    result = sign_in_user(email, password)
    
    if result.get("success"):
        return jsonify(result), 200
    else:
        return jsonify(result), 401


@app.route("/send-quote-request/<user_id>", methods=["POST"])
@require_auth
def send_quote_request(user_id):
    data = request.get_json()
    print("Received data:", data)
    print("Authenticated user:", request.user)
    if not data:
        return jsonify({"error": "No data provided"}), 400
    return jsonify({"status": "ok", "received": data, "user_id": request.user["id"]})

@app.get("/_debug/quote-requests")
def list_quote_requests():
    return jsonify(QUOTE_REQUESTS)

if __name__ == "__main__":
    app.run(debug=True)
