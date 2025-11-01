import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from api import app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
    #host="0.0.0.0" allows the server to be accessible from any IP address if we're on same LAN