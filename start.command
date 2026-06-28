#!/bin/bash
# ============================================================
#  EN/AK — local dev (Eleventy)
#  Double-click to install deps (first run) and start the dev
#  server with live reload. Edits to src/ rebuild automatically.
# ============================================================

cd "$(dirname "$0")" || exit 1

echo ""
echo "  EN/AK — starting Eleventy dev server…"
echo ""

# Install dependencies on first run
if [ ! -d node_modules ]; then
  echo "  Installing dependencies (first run)…"
  npm install || { echo "npm install failed"; exit 1; }
fi

# Open the browser once the server is up (Eleventy serves on :8080)
( sleep 2; open "http://localhost:8080" ) >/dev/null 2>&1 &

npm run dev
