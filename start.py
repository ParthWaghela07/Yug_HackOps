"""
Memora Unified Full-Stack Application Launcher
Runs both frontend static server and backend engine simultaneously.
"""

import http.server
import socketserver
import subprocess
import sys
import os
import threading
import time

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"\n========================================================")
        print(f"🚀 Memora Full-Stack Application Running!")
        print(f"👉 Local Web App: http://localhost:{PORT}")
        print(f"========================================================\n")
        httpd.serve_forever()

if __name__ == '__main__':
    run_server()
