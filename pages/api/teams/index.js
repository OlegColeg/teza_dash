import { prisma } from '../../../lib/db.js';
import { requireAuth } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  if (req.method === 'GET') {
    const teams = await prisma.team.findMany({ orderBy: { name: 'asc' } });
    return res.json(teams);
  }
  if (req.method === 'POST') {
    const { name, phone, hourlyRate } = req.body;
    if (!name) return res.status(400).json({ error: 'Numele echipei e obligatoriu' });
    const exists = await prisma.team.findUnique({ where: { name } });
    if (exists) return res.status(400).json({ error: 'Echipa există deja' });
    const team = await prisma.team.create({ data: { name, phone: phone || null, hourlyRate: Number(hourlyRate) || 100 } });
    return res.status(201).json(team);
  }
  res.status(405).end();
}
