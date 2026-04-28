import { prisma } from '../../../lib/db.js';
import { requireAuth } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  const { id } = req.query;
  if (req.method === 'GET') {
    const f = await prisma.finance.findUnique({ where: { id } });
    if (!f) return res.status(404).json({ error: 'Nu există' });
    return res.json(f);
  }
  if (req.method === 'DELETE') {
    await prisma.finance.delete({ where: { id } });
    return res.json({ success: true });
  }
  res.status(405).end();
}
