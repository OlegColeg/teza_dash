// pages/api/dashboard/stats.js - Dashboard summary statistics
import { readJSON } from '../../../lib/db';
import { requireAuth } from '../../../lib/auth';

export default function handler(req, res) {
  const user = requireAuth(req, res);
  if (!user) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metodă nepermisă' });
  }

  const teams = readJSON('teams.json');
  const finances = readJSON('finances.json');
  const reservations = readJSON('reservations.json');

  // Financial summary
  const totalIncome = finances.filter(f => f.type === 'income').reduce((s, f) => s + f.amount, 0);
  const totalExpense = finances.filter(f => f.type === 'expense').reduce((s, f) => s + f.amount, 0);
  const cashBalance = totalIncome - totalExpense;

  // Debts
  const totalDebt = teams
    .filter(t => t.balance < 0)
    .reduce((s, t) => s + Math.abs(t.balance), 0);

  // Active teams (played at least once)
  const activeTeamIds = new Set(reservations.map(r => r.teamId));
  const activeTeams = teams.filter(t => activeTeamIds.has(t.id)).length;

  // Today's reservations
  const today = new Date().toISOString().split('T')[0];
  const todayReservations = reservations.filter(r => r.date === today);

  // Monthly chart data (last 6 months)
  const monthlyData = getLast6MonthsData(finances);

  return res.status(200).json({
    cashBalance,
    totalIncome,
    totalExpense,
    totalDebt,
    activeTeams,
    totalTeams: teams.length,
    todayReservations: todayReservations.length,
    monthlyData
  });
}

function getLast6MonthsData(finances) {
  const months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('ro-RO', { month: 'short', year: '2-digit' });

    const monthFinances = finances.filter(f => f.date && f.date.startsWith(monthKey));
    const income = monthFinances.filter(f => f.type === 'income').reduce((s, f) => s + f.amount, 0);
    const expense = monthFinances.filter(f => f.type === 'expense').reduce((s, f) => s + f.amount, 0);

    months.push({ month: label, income, expense, profit: income - expense });
  }

  return months;
}
