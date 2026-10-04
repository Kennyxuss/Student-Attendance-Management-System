"""
Student Attendance Management System (SAMS) - Unified HTTP Server
Integrates Router, Validation Guards, Thin Controllers, and Static File Serving.
"""

import http.server
import socketserver
import json
import os
import sys
from urllib.parse import urlparse, parse_qs

from src.repository import Repository
from src.router import Router

PORT = int(os.environ.get('PORT', 8000))
APP_DEBUG = os.environ.get('APP_DEBUG', 'False').lower() in ('true', '1', 't')
HOST = os.environ.get('HOST', '0.0.0.0' if not APP_DEBUG else 'localhost')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, 'public')
DATA_FILE = os.path.join(BASE_DIR, 'data', 'seed_data.json')

# Initialize shared persistence repository and router
repo = Repository(storage_path=DATA_FILE)
router = Router(repo)

class SAMSHttpHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        if APP_DEBUG:
            super().log_message(format, *args)
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path.startswith('/api/'):
            status_code, response = router.dispatch('GET', parsed.path, parse_qs(parsed.query), None)
            self.send_json_response(status_code, response)
        else:
            super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path.startswith('/api/'):
            payload = self._read_json_body()
            status_code, response = router.dispatch('POST', parsed.path, parse_qs(parsed.query), payload)
            self.send_json_response(status_code, response)
        else:
            self.send_error(404, "Not Found")

    def do_PUT(self):
        parsed = urlparse(self.path)
        if parsed.path.startswith('/api/'):
            payload = self._read_json_body()
            status_code, response = router.dispatch('PUT', parsed.path, parse_qs(parsed.query), payload)
            self.send_json_response(status_code, response)
        else:
            self.send_error(404, "Not Found")

    def do_DELETE(self):
        parsed = urlparse(self.path)
        if parsed.path.startswith('/api/'):
            status_code, response = router.dispatch('DELETE', parsed.path, parse_qs(parsed.query), None)
            self.send_json_response(status_code, response)
        else:
            self.send_error(404, "Not Found")

    def _read_json_body(self):
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length > 0:
            raw = self.rfile.read(content_length)
            try:
                return json.loads(raw.decode('utf-8'))
            except Exception:
                return {}
        return {}

    def send_json_response(self, status_code, payload):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(payload, indent=2).encode('utf-8'))

def run():
    print("=" * 60)
    print(" Student Attendance Management System (SAMS)")
    print(f" Web & REST API: http://{HOST}:{PORT}")
    print(f" APP_DEBUG is set to: {APP_DEBUG}")
    print("=" * 60)
    with socketserver.TCPServer((HOST, PORT), SAMSHttpHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer shutting down gracefully.")

if __name__ == '__main__':
    run()
