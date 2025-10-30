import os
import sys

# Ensure "src" is on sys.path so absolute imports work when run directly
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from api import create_app

app = create_app()

if __name__ == "__main__":
    # Default Flask dev server settings for quick testing
    app.run(host="0.0.0.0", port=5000, debug=True)


