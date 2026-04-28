import { requireAuth } from '../../../lib/auth.js';
import { prisma } from '../../../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const payload = requireAuth(req, res);
  if (!payload) return;
  // Verifică că utilizatorul există încă în baza de date
  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) return res.status(401).json({ error: 'Utilizator inexistent' });
  res.json({ valid: true, user: { id: user.id, username: user.username } });
}
