import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDb } from './config/db';
import { env } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import { adminRouter } from './routes/admin.route';
import { authRouter } from './routes/auth.route';
import { bannerRouter } from './routes/banner.route';
import { homeRouter } from './routes/home.route';
import { productRouter } from './routes/product.route';
import { profileRouter } from './routes/profile.route';

const healthResponse = { ok: true };
const serviceName = 'be-x43-demo';
const rateLimitWindowMs = 15 * 60 * 1000;
const rateLimitMaxRequests = 300;

const apiRoutes = [
  ['/home', homeRouter],
  ['/auth', authRouter],
  ['/admin', adminRouter],
  ['/banners', bannerRouter],
  ['/products', productRouter],
  ['/profile', profileRouter]
] as const;

let isDbConnected = false;

const ensureDbConnected = async () => {
  if (isDbConnected) return;

  await connectDb();
  isDbConnected = true;
};

export const createApp = () => {
  const app = express();

  app.set('trust proxy', 1);
  app.use(cors({ origin: env.clientUrl }));
  app.use(express.json());
  app.use(rateLimit({ windowMs: rateLimitWindowMs, max: rateLimitMaxRequests }));

  app.get('/', (_req, res) => res.json({ ok: true, service: serviceName }));
  app.get('/health', (_req, res) => res.json(healthResponse));

  for (const [path, router] of apiRoutes) {
    app.use(path, router);
    app.use(`/api${path}`, router);
  }

  app.use(errorMiddleware);

  return app;
};

const app = createApp();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET' && (req.url === '/api/health' || req.url === '/health')) {
      return res.status(200).json(healthResponse);
    }

    await ensureDbConnected();
    app(req as never, res as never);
  } catch (error) {
    console.error('Vercel handler error:', error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}

const start = async () => {
  await ensureDbConnected();
  app.listen(env.port, () => {
    console.log(`Backend running at http://localhost:${env.port}`);
  });
};

if (require.main === module) {
  start().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
