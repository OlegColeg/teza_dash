// pages/api/finances/index.js
import { readJSON, writeJSON } from '../../../lib/db';
import { requireAuth } from '../../../lib/auth';
import { v4 as uuidv4 } from 'uuid';

export default function handler(req, res) {
  const user = requireAuth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    const finances = readJSON('finances.json');
    const { type, month } = req.query;

    let result = finances;
    if (type) result = result.filter(f => f.type === type);
    if (month) result = result.filter(f => f.date && f.date.startsWith(month));

    // Sort by date descending
    result.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate summary
    const income = finances.filter(f => f.type === 'income').reduce((s, f) => s + f.amount, 0);
    const expense = finances.filter(f => f.type === 'expense').reduce((s, f) => s + f.amount, 0);
    const balance = income - expense;

    return res.status(200).json({ transactions: result, summary: { income, expense, balance } });
  }

  if (req.method === 'POST') {
    const { type, category, description, amount, date, client, notes } = req.body;

    if (!type || !amount || !date) {
      return res.status(400).json({ error: 'Tipul, suma și data sunt obligatorii' });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Tipul trebuie să fie income sau expense' });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({ error: 'Suma trebuie să fie pozitivă' });
    }

    const finances = readJSON('finances.json');

    const newEntry = {
      id: 'fin-' + uuidv4(),
      type,
      category: category || 'altele',
      client: client || '',
      description: description || '',
      notes: notes || '',
      amount: Number(amount),
      date,
      createdAt: new Date().toISOString()
    };

    finances.push(newEntry);
    writeJSON('finances.json', finances);

    return res.status(201).json(newEntry);
  }

  return res.status(405).json({ error: 'Metodă nepermisă' });
}
