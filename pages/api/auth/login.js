import bcrypt from 'bcryptjs';
import { prisma } from '../../../lib/db.js';
import { signToken } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Date lipsă' });
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Credențiale incorecte' });
  const token = signToken({ id: user.id, username: user.username });
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`);
  res.json({ token, user: { id: user.id, username: user.username } });
}
