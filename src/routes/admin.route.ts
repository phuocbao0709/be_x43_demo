import { Router } from 'express';
import { adminGuard } from '../middlewares/auth.middleware';
import { listProducts } from '../controllers/product.controller';

export const adminRouter = Router();

adminRouter.use(adminGuard);
adminRouter.get('/products', listProducts);
