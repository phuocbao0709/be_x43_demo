import { Router } from 'express';
import multer, { memoryStorage } from 'multer';
import { adminGuard } from '../middlewares/auth.middleware';
import { createBanner, deleteBanner, listBanners, updateBanner } from '../controllers/banner.controller';

export const bannerRouter = Router();
const upload = multer({ storage: memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

bannerRouter.get('/', listBanners);
bannerRouter.post('/', adminGuard, upload.single('image'), createBanner);
bannerRouter.patch('/:id', adminGuard, upload.single('image'), updateBanner);
bannerRouter.delete('/:id', adminGuard, deleteBanner);
