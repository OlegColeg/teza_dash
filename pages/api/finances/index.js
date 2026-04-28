import { prisma } from '../../../lib/db.js';
import { requireAuth } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  if (req.method === 'GET') {
    const transactions = await prisma.finance.findMany({ orderBy: { date: 'desc' }, include: { team: { select: { name: true } } } });
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return res.json({ transactions, summary: { income, expense, balance: income - expense } });
  }
  if (req.method === 'POST') {
    const { type, category, client, description, notes, amount, date, teamId } = req.body;
    if (!type || !amount || !date) return res.status(400).json({ error: 'Date lipsă' });
    if (Number(amount) <= 0) return res.status(400).json({ error: 'Suma trebuie pozitivă' });
    const finance = await prisma.finance.create({ data: { type, category: category || 'altele', client: client || null, description: description || null, notes: notes || null, amount: Number(amount), date, teamId: teamId || null } });
    return res.status(201).json(finance);
  }
  res.status(405).end();
}
