#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VIDEO_ROOT="$PROJECT_ROOT/public/videos"

set -a
source "$PROJECT_ROOT/.env"
set +a

: "${CLOUDFLARE_ACCOUNT_ID:?CLOUDFLARE_ACCOUNT_ID is required}"
: "${CLOUDFLARE_API_TOKEN:?CLOUDFLARE_API_TOKEN is required}"
: "${CLOUDFLARE_BUCKET_NAME:?CLOUDFLARE_BUCKET_NAME is required}"

cd "$PROJECT_ROOT"

# public/videos is the canonical source used by the generated site catalog.
# Deriving every R2 key from this directory prevents category-folder drift.
find "$VIDEO_ROOT" -type f -name '*.mp4' -print0 |
  while IFS= read -r -d '' file; do
    key="videos/${file#"$VIDEO_ROOT/"}"
    echo "Uploading $key"
    npx wrangler r2 object put \
      "$CLOUDFLARE_BUCKET_NAME/$key" \
      --file "$file" \
      --remote
  done

echo "R2 video upload complete."
