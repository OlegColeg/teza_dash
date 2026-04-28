// pages/api/finances/[id].js
import { readJSON, writeJSON } from '../../../lib/db';
import { requireAuth } from '../../../lib/auth';

export default function handler(req, res) {
  const user = requireAuth(req, res);
  if (!user) return;

  const { id } = req.query;
  const finances = readJSON('finances.json');
  const idx = finances.findIndex(f => f.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Tranzacția nu a fost găsită' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(finances[idx]);
  }

  if (req.method === 'DELETE') {
    finances.splice(idx, 1);
    writeJSON('finances.json', finances);
    return res.status(200).json({ message: 'Tranzacția a fost ștearsă' });
  }

  return res.status(405).json({ error: 'Metodă nepermisă' });
}
