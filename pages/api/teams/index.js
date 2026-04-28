// pages/api/teams/index.js
import { readJSON, writeJSON } from '../../../lib/db';
import { requireAuth } from '../../../lib/auth';
import { v4 as uuidv4 } from 'uuid';

export default function handler(req, res) {
  const user = requireAuth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    const teams = readJSON('teams.json');
    return res.status(200).json(teams);
  }

  if (req.method === 'POST') {
    const { name, phone, hourlyRate } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Numele echipei este obligatoriu' });
    }

    const teams = readJSON('teams.json');

    const existing = teams.find(t => t.name.toLowerCase() === name.trim().toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'O echipă cu acest nume există deja' });
    }

    const newTeam = {
      id: 'team-' + uuidv4(),
      name: name.trim(),
      phone: phone || '',
      hourlyRate: Number(hourlyRate) || 200,
      balance: 0,
      createdAt: new Date().toISOString()
    };

    teams.push(newTeam);
    writeJSON('teams.json', teams);

    return res.status(201).json(newTeam);
  }

  return res.status(405).json({ error: 'Metodă nepermisă' });
}
