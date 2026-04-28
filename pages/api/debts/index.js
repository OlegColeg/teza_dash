import { prisma } from '../../../lib/db.js';
import { requireAuth } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  if (req.method === 'GET') {
    const debtors = await prisma.team.findMany({ where: { balance: { lt: 0 } }, orderBy: { balance: 'asc' } });
    const totalDebt = debtors.reduce((s, t) => s + Math.abs(t.balance), 0);
    return res.json({ debtors, totalDebt });
  }
  res.status(405).end();
}
