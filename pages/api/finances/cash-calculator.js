// pages/api/finances/cash-calculator.js
// Saves and loads the physical cash count (bancnote fizice din casă)
import { readJSON, writeJSON } from '../../../lib/db';
import { requireAuth } from '../../../lib/auth';

const DEFAULT = {
  bills: { 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 1: 0 },
  coins: { 10: 0, 5: 0, 2: 0, 1: 0 },
  updatedAt: null
};

export default function handler(req, res) {
  const user = requireAuth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    const data = readJSON('cash-calculator.json');
    return res.status(200).json(data.length ? data[0] : DEFAULT);
  }

  if (req.method === 'PUT') {
    const { bills, coins } = req.body;
    const entry = { bills, coins, updatedAt: new Date().toISOString() };
    writeJSON('cash-calculator.json', [entry]);
    return res.status(200).json(entry);
  }

  return res.status(405).json({ error: 'Metodă nepermisă' });
}
