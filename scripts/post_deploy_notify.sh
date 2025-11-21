#!/usr/bin/env bash
# Usage: post_deploy_notify.sh <DEPLOY_URL>
set -euo pipefail

DEPLOY_URL="${1:-https://mini.boomchainlab.com}"
BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
ADMIN_CHAT_ID="${TELEGRAM_ADMIN_CHAT_ID:-}"

if [ -n "$BOT_TOKEN" ]; then
  WEBHOOK_ENDPOINT="${DEPLOY_URL}/api/telegram/webhook"
  echo "Setting Telegram webhook -> $WEBHOOK_ENDPOINT"
  curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
    -d "url=${WEBHOOK_ENDPOINT}" \
    -d "max_connections=40" > /dev/null || true

  if [ -n "$ADMIN_CHAT_ID" ]; then
    MSG="✅ *Chonk9k MiniApp Deployed*\nURL: ${DEPLOY_URL}\nRepo: ${GITHUB_REPOSITORY:-local}\nRef: ${GITHUB_REF:-manual}"
    curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
      -d chat_id="${ADMIN_CHAT_ID}" \
      -d parse_mode=Markdown \
      -d text="${MSG}" > /dev/null || true
  fi
else
  echo "TELEGRAM_BOT_TOKEN not set — skipping Telegram steps"
fi
