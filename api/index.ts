import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDb } from '../src/config/db';
import { createApp } from '../src/create-app';

let isDbConnected = false;
let app: ReturnType<typeof createApp> | null = null;

const ensureDbConnected = async () => {
  if (isDbConnected) return;
  await connectDb();
  isDbConnected = true;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET' && (req.url === '/api/health' || req.url === '/health')) {
      return res.status(200).json({ ok: true });
    }

    if (!app) {
      app = createApp();
    }

    await ensureDbConnected();

    app(req as unknown as never, res as unknown as never);
    return;
  } catch (error) {
    console.error('Vercel handler error:', error);
    return res.status(500).json({
      message:
        error instanceof Error ? error.message : 'Internal server error'
    });
  }
}
