from flask import Flask, request, jsonify
import json
from datetime import datetime

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


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Procuroid API is running"})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/send-quote-request/<user_id>", methods=["POST"])
def send_quote_request(user_id):
    data = request.get_json()
    print("Received data:", data)
    if not data:
        return jsonify({"error": "No data provided"}), 400
    return jsonify({"status": "ok", "received": data})

@app.get("/_debug/quote-requests")
def list_quote_requests():
    return jsonify(QUOTE_REQUESTS)

if __name__ == "__main__":
    app.run(debug=True)
