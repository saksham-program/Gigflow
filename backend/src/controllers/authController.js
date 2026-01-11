import bcrypt from "bcrypt";
import { z } from 'zod';
import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { env } from '../config/env.js';
import { cookieOptions } from '../utils/cookies.js';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0].message });

  const { name, email, password } = parsed.data;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already in use' });

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed });

  const token = signToken({ sub: user._id.toString(), email: user.email, name: user.name });
  res.cookie(env.COOKIE_NAME, token, cookieOptions());
  return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } });
}

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0].message });

  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken({ sub: user._id.toString(), email: user.email, name: user.name });
  res.cookie(env.COOKIE_NAME, token, cookieOptions());
  return res.json({ user: { id: user._id, name: user.name, email: user.email } });
}

export async function me(req, res) {
  return res.json({ user: req.user });
}

export async function logout(req, res) {
  res.clearCookie(env.COOKIE_NAME, cookieOptions());
  return res.json({ message: 'Logged out' });
}
