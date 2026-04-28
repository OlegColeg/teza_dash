// pages/api/debts/index.js - Get all team debts and make payments
import { readJSON, writeJSON } from '../../../lib/db';
import { requireAuth } from '../../../lib/auth';
import { v4 as uuidv4 } from 'uuid';

export default function handler(req, res) {
  const user = requireAuth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    const teams = readJSON('teams.json');
    // Only teams that have negative balance (owe money)
    const debtors = teams
      .filter(t => t.balance < 0)
      .map(t => ({ ...t, debt: Math.abs(t.balance) }));

    const totalDebt = debtors.reduce((s, t) => s + t.debt, 0);

    return res.status(200).json({ debtors, totalDebt });
  }

  return res.status(405).json({ error: 'Metodă nepermisă' });
}
