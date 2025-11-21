// api/telegram/config.js
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join('/tmp', 'chonk9k_config.json');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { secret, webAppUrl } = req.body || {};
  if (!secret || secret !== process.env.CONFIG_ENDPOINT_SECRET) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const cfg = { webAppUrl };
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(cfg));
  } catch (e) {
    // ignore write failures for ephemeral storage
  }

  return res.status(200).json({ ok: true, cfg });
};
