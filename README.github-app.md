# GitHub App & CI/CD integration (Chonk9k MiniApp)

This file documents the added CI/CD workflow, GitHub App manifest, serverless Telegram webhook, and post-deploy scripts.

## Files added
- `.github/workflows/ci-deploy.yml`
- `github-app-manifest.json`
- `scripts/post_deploy_notify.sh`
- `api/telegram/webhook.js`
- `api/telegram/config.js`
- `api/package.json`

## Required repository (or org) secrets
- VERCEL_TOKEN
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID
- CLOUDFLARE_API_TOKEN (optional)
- CLOUDFLARE_ZONE_ID (optional)
- TELEGRAM_BOT_TOKEN
- TELEGRAM_ADMIN_CHAT_ID
- CONFIG_ENDPOINT_SECRET
- INTERNAL_DEPLOY_HOOK (optional)

## Manual step: BotFather
You must set the bot's **web app URL** in BotFather manually:
1. Open @BotFather in Telegram.
2. Use `/setdomain` or the appropriate BotFather command to set the web app URL to `https://mini.boomchainlab.com`.
(If BotFather UI changed, follow the current BotFather instructions.)

## Notes
- Vercel serverless storage is ephemeral. Use a durable store (Redis, RDS) for production config persistence.
- Replace placeholders before enabling workflows in production.
