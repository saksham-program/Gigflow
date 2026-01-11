import { verifyToken } from '../utils/jwt.js';
import { env } from '../config/env.js';

export function requireAuth(req, res, next) {
  const token = req.cookies?.[env.COOKIE_NAME];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = verifyToken(token);
    req.user = { id: decoded.sub, email: decoded.email, name: decoded.name };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
