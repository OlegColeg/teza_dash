import { prisma } from '../../../lib/db.js';
import { requireAuth } from '../../../lib/auth.js';

// POST /api/loans/import
// Body: { rows: [{ denumire, data, suma, obiectii, restituit }] }
export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  if (req.method !== 'POST') return res.status(405).end();

  const { rows } = req.body;
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'Format incorect sau fișier gol' });
  }

  const created = [];
  const errors = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 1;
    const denumire = (row.denumire || row.name || row.description || '').trim();
    const date = (row.date || row.data || '').trim();
    const amount = Number(row.amount || row.suma || 0);
    const notes = (row.notes || row.obiectii || '').trim();
    const restituit = Number(row.restituit || 0);

    if (!denumire) { errors.push(`Rândul ${rowNum}: lipsește denumirea`); continue; }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) { errors.push(`Rândul ${rowNum}: data invalidă (format: YYYY-MM-DD)`); continue; }
    if (isNaN(amount) || amount <= 0) { errors.push(`Rândul ${rowNum}: suma invalidă`); continue; }

    try {
      const loan = await prisma.loan.create({
        data: {
          denumire,
          date,
          amount,
          notes: notes || null,
          restituit: isNaN(restituit) ? 0 : restituit,
        },
      });
      created.push(loan);
    } catch (e) {
      errors.push(`Rândul ${rowNum}: eroare DB — ${e.message}`);
    }
  }

  return res.json({ created: created.length, errors });
}
