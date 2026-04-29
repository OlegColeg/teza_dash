import { prisma } from '../../../lib/db.js';
import { requireAuth } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  if (req.method === 'GET') {
    const [teams, allIncome] = await Promise.all([
      prisma.team.findMany({ orderBy: { name: 'asc' } }),
      prisma.finance.findMany({
        where: { type: 'income' },
        select: { teamId: true, client: true, amount: true },
      }),
    ]);
    // Build stats: match by teamId first, then by client name for records without teamId
    const statsMap = {};
    teams.forEach(t => {
      statsMap[t.id] = { totalIncome: 0, gameCount: 0, nameLower: t.name.toLowerCase().trim() };
    });
    // Build reverse lookup: name -> id
    const nameToId = {};
    teams.forEach(t => { nameToId[t.name.toLowerCase().trim()] = t.id; });

    allIncome.forEach(r => {
      if (r.teamId && statsMap[r.teamId]) {
        statsMap[r.teamId].totalIncome += r.amount;
        statsMap[r.teamId].gameCount += 1;
      } else if (!r.teamId && r.client) {
        const key = r.client.toLowerCase().trim();
        const id = nameToId[key];
        if (id) {
          statsMap[id].totalIncome += r.amount;
          statsMap[id].gameCount += 1;
        }
      }
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
