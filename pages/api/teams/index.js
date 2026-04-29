import { prisma } from '../../../lib/db.js';
import { requireAuth } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  if (req.method === 'GET') {
    const [teams, incomeStats] = await Promise.all([
      prisma.team.findMany({ orderBy: { name: 'asc' } }),
      prisma.finance.groupBy({
        by: ['teamId'],
        where: { type: 'income', teamId: { not: null } },
        _sum: { amount: true },
        _count: { _all: true },
      }),
    ]);
    const statsMap = {};
    incomeStats.forEach(s => {
      statsMap[s.teamId] = { totalIncome: s._sum.amount || 0, gameCount: s._count._all };
    });
    const result = teams.map(t => ({
      ...t,
      totalIncome: statsMap[t.id]?.totalIncome || 0,
      gameCount: statsMap[t.id]?.gameCount || 0,
    }));
    return res.json(result);
  }
  if (req.method === 'POST') {
    const { name, phone } = req.body;
    if (!name) return res.status(400).json({ error: 'Numele echipei e obligatoriu' });
    const exists = await prisma.team.findUnique({ where: { name } });
    if (exists) return res.status(400).json({ error: 'Echipa există deja' });
    const team = await prisma.team.create({ data: { name, phone: phone || null } });
    return res.status(201).json(team);
  }
  res.status(405).end();
}
