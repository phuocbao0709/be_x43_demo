import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import { homeRouter } from './routes/home.route';
import { authRouter } from './routes/auth.route';
import { adminRouter } from './routes/admin.route';
import { bannerRouter } from './routes/banner.route';
import { productRouter } from './routes/product.route';
import { profileRouter } from './routes/profile.route';

export const app = express();

app.set('trust proxy', 1);
app.use(cors({ origin: env.clientUrl }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/', homeRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/banners', bannerRouter);
app.use('/api/products', productRouter);
app.use('/api/profile', profileRouter);
app.use(errorMiddleware);
