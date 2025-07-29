#!/usr/bin/env python3
"""
Simple HTTP server to run the 2D Mall Game
This avoids CORS issues when loading local images
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Get the current directory
current_dir = Path(__file__).parent
os.chdir(current_dir)

# Set up the server
PORT = 8080
Handler = http.server.SimpleHTTPRequestHandler

print("Starting 2D Mall Game Server...")
print(f"Server will run on: http://localhost:{PORT}")
print("Press Ctrl+C to stop the server")

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Server started at http://localhost:{PORT}")
        print("Opening game in browser...")
        
        # Open the game in the default browser
        webbrowser.open(f'http://localhost:{PORT}/index.html')
        
        print("Game should now be running in your browser!")
        print("If the browser didn't open automatically, go to: http://localhost:8080/index.html")
        
        # Keep the server running
        httpd.serve_forever()
        
except KeyboardInterrupt:
    print("\nServer stopped by user")
except OSError as e:
    if e.errno == 48:  # Address already in use
        print(f"Port {PORT} is already in use. Try a different port or stop the existing server.")
    else:
        print(f"Error starting server: {e}")
except Exception as e:
    print(f"Unexpected error: {e}") 