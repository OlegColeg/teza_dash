import { prisma } from '../../../lib/db.js';
import { requireAuth } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  const { id } = req.query;
  if (req.method === 'GET') {
    const r = await prisma.reservation.findUnique({ where: { id }, include: { team: true } });
    if (!r) return res.status(404).json({ error: 'Nu există' });
    return res.json(r);
  }
  if (req.method === 'DELETE') {
    const r = await prisma.reservation.findUnique({ where: { id } });
    if (!r) return res.status(404).json({ error: 'Nu există' });
    if (r.status === 'deferred') {
      await prisma.team.update({ where: { id: r.teamId }, data: { balance: { increment: r.cost } } });
    }
    await prisma.reservation.delete({ where: { id } });
    return res.json({ success: true });
  }
  res.status(405).end();
}
