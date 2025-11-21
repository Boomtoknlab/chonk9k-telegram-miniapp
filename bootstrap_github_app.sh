#!/usr/bin/env bash
set -euo pipefail

# ----------------------------
# Configuration
# ----------------------------
MANIFEST_FILE="github-app-manifest.json"
REPO="Boomtoknlab/chonk9k-telegram-miniapp"
OUTPUT_ENV=".github-app.env"

if [ ! -f "$MANIFEST_FILE" ]; then
  echo "❌ Manifest file '$MANIFEST_FILE' not found."
  exit 1
fi

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "❌ GITHUB_TOKEN environment variable not set."
  echo "   Provide a PAT with admin:org, admin:repo_hook permissions."
  exit 1
fi

if ! command -v jq &> /dev/null; then
  echo "❌ jq not installed. Install jq for JSON parsing."
  exit 1
fi

if ! command -v gh &> /dev/null; then
  echo "❌ GitHub CLI (gh) not installed."
  exit 1
fi

# ----------------------------
# Step 1: Upload manifest
# ----------------------------
echo "→ Uploading GitHub App manifest..."
APP_RESPONSE=$(curl -s -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/app-manifests \
  --data-binary @"$MANIFEST_FILE")

# ----------------------------
# Step 2: Extract secrets
# ----------------------------
APP_ID=$(echo "$APP_RESPONSE" | jq -r '.id')
SLUG=$(echo "$APP_RESPONSE" | jq -r '.slug')
CLIENT_ID=$(echo "$APP_RESPONSE" | jq -r '.client_id')
CLIENT_SECRET=$(echo "$APP_RESPONSE" | jq -r '.client_secret')
WEBHOOK_SECRET=$(echo "$APP_RESPONSE" | jq -r '.webhook_secret')
PRIVATE_KEY=$(echo "$APP_RESPONSE" | jq -r '.pem')
APP_HTML_URL=$(echo "$APP_RESPONSE" | jq -r '.html_url')

if [ "$APP_ID" = "null" ]; then
  echo "❌ Failed to create GitHub App. Response:"
  echo "$APP_RESPONSE"
  exit 1
fi

echo "→ Saving secrets to $OUTPUT_ENV..."
cat <<EOF > "$OUTPUT_ENV"
GITHUB_APP_ID="$APP_ID"
GITHUB_APP_SLUG="$SLUG"
GITHUB_APP_CLIENT_ID="$CLIENT_ID"
GITHUB_APP_CLIENT_SECRET="$CLIENT_SECRET"
GITHUB_APP_WEBHOOK_SECRET="$WEBHOOK_SECRET"
GITHUB_APP_PRIVATE_KEY="$PRIVATE_KEY"
EOF

# ----------------------------
# Step 3: Install App in repository
# ----------------------------
echo "→ Installing GitHub App to repository: $REPO"
INSTALLATION_RESPONSE=$(gh api \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  /repos/$REPO/installation)

INSTALLATION_ID=$(echo "$INSTALLATION_RESPONSE" | jq -r '.id')

if [ "$INSTALLATION_ID" = "null" ] || [ -z "$INSTALLATION_ID" ]; then
  echo "❌ Failed to fetch installation ID. Please install manually via $APP_HTML_URL/installations"
else
  echo "→ Installation successful. Installation ID: $INSTALLATION_ID"
fi

# ----------------------------
# Step 4: Add secrets to repo
# ----------------------------
echo "→ Adding GitHub Actions secrets to repo"
gh secret set GITHUB_APP_ID --repo "$REPO" --body "$APP_ID"
gh secret set GITHUB_APP_SLUG --repo "$REPO" --body "$SLUG"
gh secret set GITHUB_APP_CLIENT_ID --repo "$REPO" --body "$CLIENT_ID"
gh secret set GITHUB_APP_CLIENT_SECRET --repo "$REPO" --body "$CLIENT_SECRET"
gh secret set GITHUB_APP_WEBHOOK_SECRET --repo "$REPO" --body "$WEBHOOK_SECRET"
gh secret set GITHUB_APP_PRIVATE_KEY --repo "$REPO" --body "$PRIVATE_KEY"

# ----------------------------
# Step 5: Trigger first workflow run
# ----------------------------
echo "→ Triggering first CI/CD workflow (main branch)..."
gh workflow run "ci-deploy.yml" --ref main --repo "$REPO"

# ----------------------------
# Step 6: Final report
# ----------------------------
echo
echo "========================================================="
echo "✅ GitHub App bootstrap complete"
echo "App Name: $SLUG"
echo "App ID:   $APP_ID"
echo "App URL:  $APP_HTML_URL"
echo "Installation ID: $INSTALLATION_ID"
echo
echo "Secrets saved in: $OUTPUT_ENV"
echo
echo "You can check workflow status here:"
echo "https://github.com/$REPO/actions"
echo
echo "Telegram MiniApp deployment URL (replace in manifest if needed):"
echo "https://mini.boomchainlab.com"
echo "========================================================="
