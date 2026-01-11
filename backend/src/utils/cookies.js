import { env } from '../config/env.js';

export function cookieOptions() {
  const isProd = env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}
