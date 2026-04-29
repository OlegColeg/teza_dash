import { prisma } from '../../../lib/db.js';
import { requireAuth } from '../../../lib/auth.js';

// POST /api/finances/import
// Body: { type: "income"|"expense", rows: [{...}] }
export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  if (req.method !== 'POST') return res.status(405).end();

  const { type, rows } = req.body;
  if (!type || !Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'Date lipsă sau format incorect' });
  }

  const created = [];
  const errors = [];
  const teamsCreated = [];

  // Cache echipe existente (name -> id) pentru a evita query-uri repetate
  const existingTeams = await prisma.team.findMany({ select: { id: true, name: true } });
  const teamCache = {};
  existingTeams.forEach(t => { teamCache[t.name.toLowerCase()] = t.id; });

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 1;

    const amount = Number(row.amount || row.suma || row.sum);
    const date = (row.date || row.data || '').trim();
    const description = (row.description || row.denumire || row.echipa || row.name || '').trim();
    const category = (row.category || row.categorie || (type === 'income' ? 'chirie_teren' : 'altele')).trim().toLowerCase().replace(/\s+/g, '_');
    const notes = (row.notes || row.observatii || '').trim();

    if (!description) { errors.push(`Rândul ${rowNum}: lipsește denumirea/echipa`); continue; }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) { errors.push(`Rândul ${rowNum}: data invalidă (format: YYYY-MM-DD)`); continue; }
    if (isNaN(amount) || amount <= 0) { errors.push(`Rândul ${rowNum}: suma invalidă`); continue; }

    // Dacă e venit (încasare) — auto-creează echipa dacă nu există
    let teamId = null;
    if (type === 'income') {
      const nameKey = description.toLowerCase();
      if (teamCache[nameKey]) {
        teamId = teamCache[nameKey];
      } else {
        // Creează echipa nouă
        try {
          const newTeam = await prisma.team.create({
            data: { name: description, hourlyRate: 100, balance: 0 }
          });
          teamCache[nameKey] = newTeam.id;
          teamId = newTeam.id;
          teamsCreated.push(description);
        } catch (e) {
          // Poate că a fost creată între timp (race condition) — re-query
          const existing = await prisma.team.findFirst({ where: { name: { equals: description, mode: 'insensitive' } } });
          if (existing) { teamCache[nameKey] = existing.id; teamId = existing.id; }
        }
      }
    }

    try {
      const record = await prisma.finance.create({
        data: {
          type,
          category,
          client: type === 'income' ? description : null,
          description,
          notes: notes || null,
          amount,
          date,
          teamId: teamId || null,
        }
      });
      created.push(record);
    } catch (e) {
      errors.push(`Rândul ${rowNum}: eroare DB — ${e.message}`);
    }
  }

  return res.json({ created: created.length, teamsCreated, errors });
}

