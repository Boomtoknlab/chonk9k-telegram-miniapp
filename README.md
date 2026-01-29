# CHONK9K Telegram Mini-App

[![CI/CD](https://img.shields.io/badge/CI-CD-green)](https://github.com/Boomtoknlab/chonk9k-telegram-miniapp/actions)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## Overview

**CHONK9K Telegram Mini-App** is a production-ready Telegram WebApp delivering the **CHONKPUMP 9000** gamified experience.  

- High-performance front-end optimized for **Telegram Mini-App APIs**  
- Real-time engagement mechanics, gamification, and wallet integration  
- **Built with V0** for serverless backend hosting and fast deployment  
- Fully automated CI/CD and GitHub App integration  

This project is part of the **BoomchainLab suite**, designed to deliver interactive blockchain experiences directly in Telegram.

---

## Quick Features

- Telegram Mini-App with interactive buttons and commands  
- Wallet integration and token-centric onboarding  
- CI/CD automation via GitHub Actions  
- Serverless backend on **V0**, optional frontend deployment on Vercel  
- Optional Cloudflare cache purge for instant updates  

---

## Project Structure
chonk9k-telegram-miniapp/
├─ .github/
│  └─ workflows/
│     └─ ci-deploy.yml        # GitHub Actions CI/CD workflow
├─ api/
│  ├─ telegram/
│  │  ├─ webhook.js           # Telegram webhook endpoint
│  │  └─ config.js            # Admin configuration endpoint
│  └─ package.json            # Node dependencies for serverless functions
├─ scripts/
│  └─ post_deploy_notify.sh   # Post-deploy Telegram notifier
├─ github-app-manifest.json   # GitHub App manifest
├─ bootstrap_github_app.sh    # Full GitHub App bootstrap script
├─ README.md
└─ .github-app.env            # Auto-generated secrets file

---

## Developer Setup

### Prerequisites

- Node.js v20+  
- PNPM package manager  
- Bash shell  
- GitHub PAT with `admin:repo_hook`, `repo`, `read:org` permissions  
- Telegram Bot token from [@BotFather](https://t.me/botfather)  
- Optional: Vercel account and Cloudflare API token  

---

### Installation

```bash
git clone https://github.com/Boomtoknlab/chonk9k-telegram-miniapp.git
cd chonk9k-telegram-miniapp
npm install -g pnpm
pnpm install


GitHub App Bootstrap
export GITHUB_TOKEN="your_personal_access_token"
chmod +x bootstrap_github_app.sh
./bootstrap_github_app.sh

	•	Creates GitHub App
	•	Generates .github-app.env
	•	Adds repository secrets
	•	Triggers initial CI/CD workflow


Running Locally
pnpm dev

Test serverless endpoints
curl -X POST http://localhost:3000/api/telegram/webhook \
-d '{"message": {"chat": {"id": YOUR_CHAT_ID}, "text": "/status"}}'


Deployment
	•	V0: Deploy backend endpoints (/webhook, /config) via V0 dashboard
	•	Vercel: Optional frontend hosting for Mini-App UI
	•	GitHub Actions automates build and deployment for main branch
	•	Optional Cloudflare cache purge for instant content update

Manual workflow trigger:
gh workflow run ci-deploy.yml --ref main


Quickstart for End-Users
For fast deployment without deep dev setup:

1.	Clone repo:
git clone https://github.com/Boomtoknlab/chonk9k-telegram-miniapp.git
cd chonk9k-telegram-miniapp

2.	Install dependencies:
npm install -g pnpm
pnpm install

3.	Add secrets (environment variables):
TELEGRAM_BOT_TOKEN=<bot_token>
TELEGRAM_ADMIN_CHAT_ID=<your_chat_id>
GITHUB_TOKEN=<personal_access_token>
VERCEL_TOKEN=<optional_vercel_token>
CLOUDFLARE_API_TOKEN=<optional_cloudflare_token>
CLOUDFLARE_ZONE_ID=<optional_cloudflare_zone_id>


Security Notes
	•	Keep .github-app.env private; never commit
	•	Rotate all secrets periodically (GitHub App, Telegram Bot, Vercel, Cloudflare)
	•	Use organization-level secrets for shared credentials

⸻

Contributing
	•	Fork the repo
	•	Create feature branches
	•	Test locally or on a fork before PR
	•	Ensure CI/CD workflows pass before merging

⸻

License

MIT License

Contact

BoomchainLab
https://boomchainlab.com￼
silvestremoney@boomchainlab.com
