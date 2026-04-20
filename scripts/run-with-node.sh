#!/usr/bin/env bash

set -euo pipefail

if command -v node >/dev/null 2>&1; then
  NODE_BIN="$(command -v node)"
elif [ -x /mnt/c/nodejs/node.exe ]; then
  NODE_BIN="/mnt/c/nodejs/node.exe"
else
  echo "Node.js is not available on PATH and /mnt/c/nodejs/node.exe was not found." >&2
  exit 127
fi

exec "$NODE_BIN" "$@"
