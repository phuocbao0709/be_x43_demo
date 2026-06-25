import { Request, Response } from 'express';
import { BannerModel } from '../models/banner.model';
import { uploadImage } from '../services/cloudinary.service';

export const listBanners = async (_req: Request, res: Response) => {
  const banners = await BannerModel.find({ active: true }).sort({ order: 1, createdAt: -1 }).lean();
  return res.json({
    items: banners.map((banner) => ({
      id: banner._id,
      imageUrl: banner.imageUrl,
      active: banner.active,
      order: banner.order
    }))
  });
};

export const createBanner = async (req: Request, res: Response) => {
  try {
    const uploadedImage = req.file ? await uploadImage(req.file.buffer, 'banners') : null;
    const imageUrl = uploadedImage?.url || (req.body.imageUrl as string | undefined);

    if (!imageUrl) return res.status(400).json({ message: 'Banner image is required' });

    const banner = await BannerModel.create({
      imageUrl,
      active: req.body.active !== 'false',
      order: Number(req.body.order ?? 0)
    });

    return res.status(201).json(banner);
  } catch (error) {
    return res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid banner payload' });
  }
};

export const updateBanner = async (req: Request, res: Response) => {
  try {
    const body = { ...req.body } as Record<string, unknown>;
    if (req.file) {
      const uploadedImage = await uploadImage(req.file.buffer, 'banners');
      body.imageUrl = uploadedImage.url;
    }

    if (typeof body.order === 'string') body.order = Number(body.order);
    if (typeof body.active === 'string') body.active = body.active !== 'false';

    const updated = await BannerModel.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true
    }).lean();

    if (!updated) return res.status(404).json({ message: 'Banner not found' });
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid banner payload' });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  const deleted = await BannerModel.findByIdAndDelete(req.params.id).lean();
  if (!deleted) return res.status(404).json({ message: 'Banner not found' });
  return res.json({ message: 'Banner deleted successfully' });
};
