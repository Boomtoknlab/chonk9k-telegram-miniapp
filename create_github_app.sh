#!/usr/bin/env bash
set -euo pipefail

MANIFEST_FILE="github-app-manifest.json"
OUTPUT_ENV=".github-app.env"

echo "========================================================="
echo "  🚀 GitHub App Creation Automation"
echo "========================================================="

if [ ! -f "$MANIFEST_FILE" ]; then
  echo "❌ Manifest file '$MANIFEST_FILE' not found."
  exit 1
fi

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "❌ GITHUB_TOKEN environment variable is not set."
  echo "   Export a GitHub PAT with admin:org, admin:repo_hook permissions."
  exit 1
fi

echo "→ Uploading manifest to GitHub..."
APP_RESPONSE=$(curl -s -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/app-manifests \
  --data-binary @"$MANIFEST_FILE")

echo "→ Parsing response..."

APP_ID=$(echo "$APP_RESPONSE" | jq -r '.id')
CLIENT_ID=$(echo "$APP_RESPONSE" | jq -r '.client_id')
CLIENT_SECRET=$(echo "$APP_RESPONSE" | jq -r '.client_secret')
WEBHOOK_SECRET=$(echo "$APP_RESPONSE" | jq -r '.webhook_secret')
PRIVATE_KEY=$(echo "$APP_RESPONSE" | jq -r '.pem')
SLUG=$(echo "$APP_RESPONSE" | jq -r '.slug')
APP_URL=$(echo "$APP_RESPONSE" | jq -r '.html_url')

if [ "$APP_ID" = "null" ]; then
  echo "❌ Failed to create GitHub App. Response:"
  echo "$APP_RESPONSE"
  exit 1
fi

echo "→ Saving secrets to $OUTPUT_ENV..."

cat <<EOF > $OUTPUT_ENV
# Auto-generated GitHub App config
GITHUB_APP_ID="$APP_ID"
GITHUB_APP_SLUG="$SLUG"
GITHUB_APP_CLIENT_ID="$CLIENT_ID"
GITHUB_APP_CLIENT_SECRET="$CLIENT_SECRET"
GITHUB_APP_WEBHOOK_SECRET="$WEBHOOK_SECRET"
GITHUB_APP_PRIVATE_KEY="$PRIVATE_KEY"
EOF

echo "========================================================="
echo "  ✅ Successfully created GitHub App"
echo "========================================================="
echo "App Name: $SLUG"
echo "App ID:   $APP_ID"
echo "URL:      $APP_URL"
echo
echo "Secrets saved in: $OUTPUT_ENV"
echo
echo "========================================================="
echo "  ▶️ Next Step: Add secrets to GitHub Actions"
echo "========================================================="

REPO="Boomtoknlab/chonk9k-telegram-miniapp"

echo
echo "Run these commands to add secrets automatically:"
echo "---------------------------------------------------------"
echo "gh secret set GITHUB_APP_ID --repo $REPO --body \"$APP_ID\""
echo "gh secret set GITHUB_APP_CLIENT_ID --repo $REPO --body \"$CLIENT_ID\""
echo "gh secret set GITHUB_APP_CLIENT_SECRET --repo $REPO --body \"$CLIENT_SECRET\""
echo "gh secret set GITHUB_APP_WEBHOOK_SECRET --repo $REPO --body \"$WEBHOOK_SECRET\""
echo "gh secret set GITHUB_APP_PRIVATE_KEY --repo $REPO --body '$PRIVATE_KEY'"
echo "---------------------------------------------------------"

echo
echo "========================================================="
echo "  ▶️ Install the GitHub App"
echo "========================================================="
echo "Open this link to install the App:"
echo "$APP_URL/installations"
echo
echo "Or install using API (example):"
echo
echo "curl -X PUT \\"
echo "  -H \"Authorization: Bearer \$GITHUB_TOKEN\" \\"
echo "  -H \"Accept: application/vnd.github+json\" \\"
echo "  https://api.github.com/user/installations/INSTALLATION_ID/repositories/REPO_ID"
echo
echo "========================================================="
echo "🎉 All set!"
echo "========================================================="
