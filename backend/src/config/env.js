import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 5000),
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
  COOKIE_NAME: process.env.COOKIE_NAME ?? 'gigflow_token',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173'
};

export function assertEnv() {
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}
