import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from '../src/app';
import { connectDb } from '../src/config/db';

let isDbConnected = false;

const ensureDbConnected = async () => {
  if (isDbConnected) return;
  await connectDb();
  isDbConnected = true;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureDbConnected();
    return app(req, res);
  } catch (error) {
    console.error('Vercel handler error:', error);
    return res.status(500).json({
      message:
        error instanceof Error ? error.message : 'Internal server error'
    });
  }
}
