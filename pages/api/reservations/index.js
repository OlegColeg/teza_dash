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
    const { teamId, date, startTime, endTime, cost, status, notes } = req.body;
    if (!teamId || !date || !startTime || !endTime) return res.status(400).json({ error: 'Date lipsă' });
    // Verificare conflict
    const conflict = await prisma.reservation.findFirst({
      where: { date, OR: [{ AND: [{ startTime: { lte: startTime } }, { endTime: { gt: startTime } }] }, { AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }] }, { AND: [{ startTime: { gte: startTime } }, { endTime: { lte: endTime } }] }] }
    });
    if (conflict) return res.status(400).json({ error: 'Interval ocupat deja' });
    const reservation = await prisma.reservation.create({ data: { teamId, date, startTime, endTime, cost: Number(cost) || 0, status: status || 'paid', notes: notes || null } });
    // Dacă amânat, adaugă la datoria echipei
    if (status === 'deferred') {
      await prisma.team.update({ where: { id: teamId }, data: { balance: { decrement: Number(cost) } } });
    } else {
      // Achitat pe loc — adaugă în finanțe
      const team = await prisma.team.findUnique({ where: { id: teamId } });
      await prisma.finance.create({ data: { type: 'income', category: 'chirie_teren', client: team.name, description: `Rezervare ${date} ${startTime}-${endTime}`, amount: Number(cost), date } });
    }
    return res.status(201).json(reservation);
  }
  res.status(405).end();
}
