import bcrypt from 'bcryptjs';
import { prisma } from '../../../lib/db.js';
import { signToken } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Date lipsă' });
  if (username.length < 3) return res.status(400).json({ error: 'Username-ul trebuie să aibă minim 3 caractere' });
  if (password.length < 6) return res.status(400).json({ error: 'Parola trebuie să aibă minim 6 caractere' });

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) return res.status(409).json({ error: 'Username-ul este deja folosit' });

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { username, password: hashedPassword },
  });

  const token = signToken({ id: user.id, username: user.username });
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`);
  res.status(201).json({ token, user: { id: user.id, username: user.username } });
}
