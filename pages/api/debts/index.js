import { prisma } from '../../../lib/db.js';
import { requireAuth } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  if (req.method === 'GET') {
    const teams = await prisma.team.findMany({ where: { balance: { lt: 0 } }, orderBy: { balance: 'asc' } });
    const debtors = teams.map(t => ({ ...t, debt: Math.abs(t.balance) }));
    const totalDebt = debtors.reduce((s, t) => s + t.debt, 0);
    return res.json({ debtors, totalDebt });
  }
  res.status(405).end();
}
