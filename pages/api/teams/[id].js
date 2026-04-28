// pages/api/teams/[id].js
import { readJSON, writeJSON } from '../../../lib/db';
import { requireAuth } from '../../../lib/auth';

export default function handler(req, res) {
  const user = requireAuth(req, res);
  if (!user) return;

  const { id } = req.query;
  const teams = readJSON('teams.json');
  const idx = teams.findIndex(t => t.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Echipa nu a fost găsită' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(teams[idx]);
  }

  if (req.method === 'PUT') {
    const { name, phone, hourlyRate } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Numele echipei este obligatoriu' });
    }

    teams[idx] = {
      ...teams[idx],
      name: name.trim(),
      phone: phone || teams[idx].phone,
      hourlyRate: Number(hourlyRate) || teams[idx].hourlyRate,
    };

    writeJSON('teams.json', teams);
    return res.status(200).json(teams[idx]);
  }

  if (req.method === 'DELETE') {
    teams.splice(idx, 1);
    writeJSON('teams.json', teams);
    return res.status(200).json({ message: 'Echipa a fost ștearsă' });
  }

  return res.status(405).json({ error: 'Metodă nepermisă' });
}
