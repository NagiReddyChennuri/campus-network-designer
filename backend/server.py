"""
Campus Minimum Network Designer - Python Backend Server
Built with Python's standard library (http.server) - No external frameworks.
"""
import json
import os
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

# Ensure local backend imports work
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kruskal import kruskal

PORT = int(os.environ.get("PORT", 8000))

class CampusNetworkHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self):
        """Set standard CORS headers to allow React frontend requests."""
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def _send_json_response(self, status_code: int, data: dict):
        """Helper to send JSON response with CORS headers."""
        self.send_response(status_code)
        self._set_cors_headers()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        response_bytes = json.dumps(data, indent=2).encode("utf-8")
        self.wfile.write(response_bytes)

    def do_OPTIONS(self):
        """Handle CORS preflight requests."""
        self.send_response(204)
        self._set_cors_headers()
        self.end_headers()

    def do_GET(self):
        """Handle GET requests (/health)."""
        parsed_path = urlparse(self.path).path

        if parsed_path == "/health":
            self._send_json_response(200, {"status": "ok", "service": "Campus Minimum Network Designer Backend"})
        else:
            self._send_json_response(404, {"error": "Endpoint not found", "path": parsed_path})

    def do_POST(self):
        """Handle POST requests (/mst)."""
        parsed_path = urlparse(self.path).path

        if parsed_path == "/mst":
            try:
                content_length = int(self.headers.get("Content-Length", 0))
                if content_length == 0:
                    self._send_json_response(400, {"success": False, "error": "Empty request body"})
                    return

                raw_body = self.rfile.read(content_length).decode("utf-8")
                payload = json.loads(raw_body)

                buildings = payload.get("buildings", [])
                connections = payload.get("connections", [])

                # Run Kruskal's MST algorithm
                result = kruskal(buildings, connections)
                self._send_json_response(200, result)

            except json.JSONDecodeError:
                self._send_json_response(400, {"success": False, "error": "Invalid JSON format"})
            except Exception as e:
                self._send_json_response(500, {"success": False, "error": f"Server error: {str(e)}"})
        else:
            self._send_json_response(404, {"error": "Endpoint not found", "path": parsed_path})

    def log_message(self, format, *args):
        """Custom clean logging to console."""
        print(f"[{self.log_date_time_string()}] {format % args}")

def run(server_class=HTTPServer, handler_class=CampusNetworkHandler, port=PORT):
    server_address = ("", port)
    httpd = server_class(server_address, handler_class)
    print(f" Campus Network Python Backend running at http://localhost:{port}")
    print(" Ready to calculate Minimum Spanning Trees using Kruskal's algorithm.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n Shutting down backend server...")
        httpd.server_close()

if __name__ == "__main__":
    run()
