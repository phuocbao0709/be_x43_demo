import { Router } from 'express';
import { adminGuard } from '../middlewares/auth.middleware';
import { getProductById, listProducts } from '../controllers/product.controller';

export const adminRouter = Router();

adminRouter.use(adminGuard);
adminRouter.get('/products', listProducts);
adminRouter.get('/products/:id', getProductById);
