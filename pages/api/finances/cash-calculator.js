import { prisma } from '../../../lib/db.js';
import { requireAuth } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  if (req.method === 'GET') {
    const calc = await prisma.cashCalculator.findUnique({ where: { id: 'singleton' } });
    return res.json(calc || { bills: { 200:0,100:0,50:0,20:0,10:0,5:0,1:0 }, coins: { 10:0,5:0,2:0,1:0 } });
  }
  if (req.method === 'PUT') {
    const { bills, coins } = req.body;
    const calc = await prisma.cashCalculator.upsert({
      where: { id: 'singleton' },
      update: { bills, coins },
      create: { id: 'singleton', bills, coins }
    });
    return res.json(calc);
  }
  res.status(405).end();
}
