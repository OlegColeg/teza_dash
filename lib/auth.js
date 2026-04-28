// lib/auth.js - JWT authentication helper
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'stadion_secret_key_2025';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function getTokenFromRequest(req) {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  // Check cookie
  const cookies = req.headers.cookie || '';
  const match = cookies.match(/token=([^;]+)/);
  if (match) return match[1];
  return null;
}

function requireAuth(req, res) {
  const token = getTokenFromRequest(req);
  if (!token) {
    res.status(401).json({ error: 'Neautorizat. Autentifică-te mai întâi.' });
    return null;
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ error: 'Token invalid sau expirat.' });
    return null;
  }
  return decoded;
}

module.exports = { signToken, verifyToken, getTokenFromRequest, requireAuth };
