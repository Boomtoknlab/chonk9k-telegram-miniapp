// api/telegram/webhook.js
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '';

const DATA_FILE = path.join('/tmp', 'chonk9k_config.json');

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE));
  } catch (e) {
    return { webAppUrl: process.env.DEPLOY_DOMAIN || 'https://mini.boomchainlab.com' };
  }
}

function writeConfig(cfg) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(cfg));
  } catch (e) {
    // ignore write errors in ephemeral environments
  }
}

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, config: readConfig() });
  }

  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const body = req.body || {};

  // Basic handling: admin /status command
  try {
    if (body.message) {
      const chatId = body.message.chat.id;
      const text = (body.message.text || '').trim();

      if (text === '/status' && String(chatId) === String(ADMIN_CHAT_ID)) {
        const cfg = readConfig();
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: `Chonk9k MiniApp status:\nURL: ${cfg.webAppUrl}`
          })
        });
      }
    }
  } catch (err) {
    // swallow errors to avoid retries
  }

  res.status(200).json({ ok: true });
};
