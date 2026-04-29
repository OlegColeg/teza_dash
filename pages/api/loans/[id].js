import { prisma } from '../../../lib/db.js';
import { requireAuth } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { denumire, date, amount, notes, restituit } = req.body;
    const data = {};
    if (denumire !== undefined) data.denumire = denumire.trim();
    if (date !== undefined) data.date = date;
    if (amount !== undefined) data.amount = Number(amount);
    if (notes !== undefined) data.notes = notes?.trim() || null;
    if (restituit !== undefined) data.restituit = Number(restituit);
    const loan = await prisma.loan.update({ where: { id }, data });
    return res.json(loan);
  }

  if (req.method === 'DELETE') {
    await prisma.loan.delete({ where: { id } });
    return res.json({ ok: true });
  }

  res.status(405).end();
}
