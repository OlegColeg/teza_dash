import { prisma } from '../../../lib/db.js';
import { requireAuth } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  if (req.method !== 'POST') return res.status(405).end();
  const { teamId, amount, date, description } = req.body;
  if (!teamId || !amount) return res.status(400).json({ error: 'Date lipsă' });
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) return res.status(404).json({ error: 'Echipa nu există' });
  const payAmount = Math.min(Number(amount), Math.abs(team.balance));
  await prisma.team.update({ where: { id: teamId }, data: { balance: { increment: payAmount } } });
  await prisma.finance.create({ data: { type: 'income', category: 'achitare_datorie', client: team.name, description: description || `Achitare datorie - ${team.name}`, amount: payAmount, date: date || new Date().toISOString().split('T')[0], teamId } });
  const updated = await prisma.team.findUnique({ where: { id: teamId } });
  return res.json({ success: true, team: updated });
}
