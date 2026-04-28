import { prisma } from '../../../lib/db.js';
import { requireAuth } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  const { id } = req.query;
  if (req.method === 'GET') {
    const team = await prisma.team.findUnique({ where: { id } });
    if (!team) return res.status(404).json({ error: 'Echipa nu există' });
    return res.json(team);
  }
  if (req.method === 'PUT') {
    const { name, phone, hourlyRate } = req.body;
    const team = await prisma.team.update({ where: { id }, data: { name, phone: phone || null, hourlyRate: Number(hourlyRate) || 100 } });
    return res.json(team);
  }
  if (req.method === 'DELETE') {
    await prisma.team.delete({ where: { id } });
    return res.json({ success: true });
  }
  res.status(405).end();
}
