import { prisma } from '../../../lib/db.js';
import { requireAuth } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;

  if (req.method === 'GET') {
    const loans = await prisma.loan.findMany({ orderBy: { date: 'desc' } });
    const totalAmount = loans.reduce((s, l) => s + l.amount, 0);
    const totalRestituit = loans.reduce((s, l) => s + l.restituit, 0);
    const totalRamas = totalAmount - totalRestituit;
    return res.json({ loans, summary: { totalAmount, totalRestituit, totalRamas } });
  }

  if (req.method === 'POST') {
    const { denumire, date, amount, notes, restituit } = req.body;
    if (!denumire || !date || !amount) return res.status(400).json({ error: 'Denumire, data și suma sunt obligatorii' });
    if (Number(amount) <= 0) return res.status(400).json({ error: 'Suma trebuie să fie pozitivă' });
    const loan = await prisma.loan.create({
      data: {
        denumire: denumire.trim(),
        date,
        amount: Number(amount),
        notes: notes?.trim() || null,
        restituit: Number(restituit) || 0,
      },
    });
    return res.status(201).json(loan);
  }

  res.status(405).end();
}
