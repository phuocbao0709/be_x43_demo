import { Router } from 'express';
import multer, { memoryStorage } from 'multer';
import {
  createProduct,
  deleteProduct,
  getProductBySlug,
  listProducts,
  updateProduct
} from '../controllers/product.controller';
import { adminGuard } from '../middlewares/auth.middleware';

export const productRouter = Router();

const upload = multer({ storage: memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

productRouter.get('/', listProducts);
productRouter.post('/', adminGuard, upload.single('image'), createProduct);
productRouter.get('/:slug', getProductBySlug);
productRouter.patch('/:id', adminGuard, upload.single('image'), updateProduct);
productRouter.delete('/:id', adminGuard, deleteProduct);
