import { prisma } from '../../../lib/db.js';
import { requireAuth } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  if (req.method === 'GET') {
    const { date } = req.query;
    const reservations = await prisma.reservation.findMany({
      where: date ? { date } : undefined,
      include: { team: { select: { name: true } } },
      orderBy: [{ date: 'desc' }, { startTime: 'asc' }]
    });
    return res.json(reservations);
  }
  if (req.method === 'POST') {
    const { teamId: teamIdParam, teamName, date, startTime, endTime, cost, status, notes } = req.body;
    // Resolve teamId — find or create if teamName given
    let teamId = teamIdParam;
    if (!teamId && teamName?.trim()) {
      let team = await prisma.team.findFirst({ where: { name: { equals: teamName.trim(), mode: 'insensitive' } } }).catch(() => null);
      if (!team) {
        team = await prisma.team.create({ data: { name: teamName.trim(), balance: 0 } });
      }
      teamId = team.id;
    }
    if (!teamId || !date || !startTime || !endTime) return res.status(400).json({ error: 'Date lipsă' });
    // Conflict check — overlap: A.start < B.end AND A.end > B.start
    const conflict = await prisma.reservation.findFirst({
      where: { date, startTime: { lt: endTime }, endTime: { gt: startTime } }
    });
    if (conflict) return res.status(409).json({ error: `Interval ocupat: ${conflict.startTime}–${conflict.endTime}` });
    const reservation = await prisma.reservation.create({ data: { teamId, date, startTime, endTime, cost: Number(cost) || 0, status: status || 'paid', notes: notes || null } });
    // Finance + balance logic
    if (status === 'deferred') {
      await prisma.team.update({ where: { id: teamId }, data: { balance: { decrement: Number(cost) } } });
    } else {
      const team = await prisma.team.findUnique({ where: { id: teamId } });
      await prisma.finance.create({ data: { type: 'income', category: 'chirie_teren', client: team.name, description: `Rezervare ${date} ${startTime}-${endTime}`, amount: Number(cost), date } });
    }
    return res.status(201).json(reservation);
  }
  res.status(405).end();
}
