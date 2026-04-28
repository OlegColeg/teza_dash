// pages/api/auth/login.js
import { readJSON } from '../../../lib/db';
import { signToken } from '../../../lib/auth';
import bcrypt from 'bcryptjs';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodă nepermisă' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username și parola sunt obligatorii' });
  }

  const users = readJSON('users.json');
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ error: 'Credențiale incorecte' });
  }

  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: 'Credențiale incorecte' });
  }

  const token = signToken({ id: user.id, username: user.username, role: user.role, name: user.name });

  // Set httpOnly cookie
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`);

  return res.status(200).json({ 
    token,
    user: { id: user.id, username: user.username, role: user.role, name: user.name }
  });
}
