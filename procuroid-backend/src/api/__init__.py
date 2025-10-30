from flask import Flask, request, jsonify
from datetime import datetime

try:
    from flask_cors import CORS
except Exception:  # CORS is optional; app should still run without it
    CORS = None  # type: ignore

QUOTE_REQUESTS = []  # in-memory store


def create_app() -> Flask:
    app = Flask(__name__)

    if CORS is not None:
        CORS(
            app,
            resources={r"/*": {"origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:3000",
                "http://127.0.0.1:3000",
            ]}},
            supports_credentials=True,
        )

    @app.get("/")
    def root():
        return {"message": "Procuroid API is running"}

    @app.get("/health")
    def health():
        return {"status": "ok"}

    @app.post("/send-quote-request/<user_id>")
    def send_quote_request(user_id: str):
        data = request.get_json(silent=True) or {}
        record = {
            "userId": user_id,
            "data": data,
            "receivedAt": datetime.utcnow().isoformat() + "Z",
        }
        QUOTE_REQUESTS.append(record)
        print(f"Quote request received from {user_id}: {data}")
        return jsonify({"ok": True, "count": len(QUOTE_REQUESTS), "saved": record}), 201

    return app

