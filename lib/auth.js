import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'stadion_secret_key_2026';

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try { return jwt.verify(token, SECRET); }
  catch { return null; }
}

export function requireAuth(req, res) {
  const auth = req.headers.authorization;
  const cookieToken = req.cookies?.token;
  const token = (auth?.startsWith('Bearer ') ? auth.slice(7) : null) || cookieToken;
  if (!token) { res.status(401).json({ error: 'Neautorizat' }); return null; }
  const payload = verifyToken(token);
  if (!payload) { res.status(401).json({ error: 'Token invalid' }); return null; }
  return payload;
}
