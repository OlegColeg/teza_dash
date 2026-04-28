import { prisma } from '../../../lib/db.js';
import { requireAuth } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  if (req.method !== 'GET') return res.status(405).end();

  const [finances, teams, todayRes] = await Promise.all([
    prisma.finance.findMany(),
    prisma.team.findMany(),
    prisma.reservation.findMany({ where: { date: new Date().toISOString().split('T')[0] } })
  ]);

  const income = finances.filter(f => f.type === 'income').reduce((s, f) => s + f.amount, 0);
  const expense = finances.filter(f => f.type === 'expense').reduce((s, f) => s + f.amount, 0);
  const totalDebt = teams.filter(t => t.balance < 0).reduce((s, t) => s + Math.abs(t.balance), 0);

  // Monthly data — last 6 months
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const prefix = `${yr}-${mo}`;
    const mIncome = finances.filter(f => f.type === 'income' && f.date.startsWith(prefix)).reduce((s, f) => s + f.amount, 0);
    const mExpense = finances.filter(f => f.type === 'expense' && f.date.startsWith(prefix)).reduce((s, f) => s + f.amount, 0);
    monthlyData.push({ month: `${mo}/${yr}`, income: mIncome, expense: mExpense, profit: mIncome - mExpense });
  }

  res.json({
    cashBalance: income - expense,
    totalIncome: income,
    totalExpense: expense,
    totalDebt,
    activeTeams: teams.filter(t => t.balance <= 0).length,
    totalTeams: teams.length,
    todayReservations: todayRes.length,
    monthlyData
  });
}
