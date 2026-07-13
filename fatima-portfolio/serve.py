#!/usr/bin/env python3
"""Dev server with caching disabled so edits always show.

Plain `python -m http.server` honors If-Modified-Since at second granularity
and will happily 304 your freshly-edited HTML; browsers also memory-cache JS
across navigations. no-store on everything kills both problems.

Usage: python3 serve.py [port]   (default 8741, binds 127.0.0.1)
"""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8741
    print(f"serving (no-store) on http://127.0.0.1:{port}")
    ThreadingHTTPServer(("127.0.0.1", port), NoCacheHandler).serve_forever()
