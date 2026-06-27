import { Request, Response } from 'express';
import { ProductModel } from '../models/product.model';
import { uploadImage } from '../services/cloudinary.service';

const toNumber = (value: unknown, fallback = 0) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const toBoolean = (value: unknown, fallback = false) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true';
  return fallback;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u00C0-\u024F\u1E00-\u1EFF]+/gu, '-')
    .replace(/^-+|-+$/g, '');

const toProductDto = (product: any) => ({
  id: product._id,
  name: product.name,
  slug: product.slug,
  description: product.description,
  price: product.price,
  compareAtPrice: product.compareAtPrice,
  discountPercent: product.discountPercent,
  images: product.images ?? [],
  image: product.images?.[0] ?? '',
  category: product.category,
  brand: product.brand,
  sku: product.sku,
  stock: product.stock,
  rating: product.rating,
  reviewCount: product.reviewCount,
  isFeatured: product.isFeatured,
  isNew: product.isNewProduct,
  tags: product.tags ?? [],
  active: product.active,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt
});

const buildSlug = async (name: string) => {
  const baseSlug = slugify(name);
  let candidate = baseSlug;
  let suffix = 1;

  while (await ProductModel.exists({ slug: candidate })) {
    candidate = `${baseSlug}-${suffix++}`;
  }

  return candidate;
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const payload = req.body as {
      name: string;
      slug?: string;
      description?: string;
      price?: string | number;
      compareAtPrice?: string | number;
      discountPercent?: string | number;
      images?: string[];
      category: string;
      brand?: string;
      sku?: string;
      stock?: string | number;
      rating?: string | number;
      reviewCount?: string | number;
      isFeatured?: string | boolean;
      isNew?: string | boolean;
      tags?: string[] | string;
      active?: string | boolean;
      image?: string;
    };

    const slug = payload.slug?.trim() || (await buildSlug(payload.name));
    const uploadedImage = req.file ? await uploadImage(req.file.buffer, 'products') : null;
    const images = uploadedImage ? [uploadedImage.url] : payload.image ? [payload.image] : payload.images ?? [];
    const tags =
      typeof payload.tags === 'string'
        ? payload.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : payload.tags ?? [];

    const created = await ProductModel.create({
      name: payload.name,
      slug,
      description: payload.description,
      price: toNumber(payload.price),
      compareAtPrice: payload.compareAtPrice !== undefined ? toNumber(payload.compareAtPrice) : undefined,
      discountPercent: payload.discountPercent !== undefined ? toNumber(payload.discountPercent) : undefined,
      images,
      category: payload.category,
      brand: payload.brand,
      sku: payload.sku,
      stock: toNumber(payload.stock, 0),
      rating: toNumber(payload.rating, 0),
      reviewCount: toNumber(payload.reviewCount, 0),
      isFeatured: toBoolean(payload.isFeatured, false),
      isNewProduct: toBoolean(payload.isNew, false),
      tags,
      active: toBoolean(payload.active, true)
    });

    return res.status(201).json(toProductDto(created.toObject()));
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: 'Invalid product payload' });
  }
};

export const listProducts = async (req: Request, res: Response) => {
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const featured = req.query.featured === 'true';
  const limit = Number(req.query.limit ?? 12);
  const page = Number(req.query.page ?? 1);
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = { active: true };
  if (category) filter.category = category;
  if (featured) filter.isFeatured = true;

  const [items, total] = await Promise.all([
    ProductModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ProductModel.countDocuments(filter)
  ]);

  return res.json({
    items: items.map(toProductDto),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1
  });
};

export const getProductBySlug = async (req: Request, res: Response) => {
  const product = await ProductModel.findOne({ slug: req.params.slug, active: true }).lean();
  if (!product) return res.status(404).json({ message: 'Product not found' });
  return res.json(toProductDto(product));
};

export const getProductById = async (req: Request, res: Response) => {
  const product = await ProductModel.findById(req.params.id).lean();
  if (!product) return res.status(404).json({ message: 'Product not found' });
  return res.json(toProductDto(product));
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const body = { ...req.body } as Record<string, unknown>;
    if (req.file) {
      const uploadedImage = await uploadImage(req.file.buffer, 'products');
      body.images = [uploadedImage.url];
    }
    if (typeof body.image === 'string' && body.image.trim()) {
      body.images = [body.image.trim()];
      delete body.image;
    }
    if (typeof body.isFeatured === 'string') body.isFeatured = body.isFeatured === 'true';
    if (typeof body.isNew === 'string') body.isNewProduct = body.isNew === 'true';
    if (typeof body.active === 'string') body.active = body.active === 'true';
    for (const key of ['price', 'compareAtPrice', 'discountPercent', 'stock', 'rating', 'reviewCount'] as const) {
      if (typeof body[key] === 'string' && body[key] !== '') {
        body[key] = Number(body[key]);
      }
    }
    if (typeof body.tags === 'string') {
      body.tags = body.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    }

    const updated = await ProductModel.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true
    }).lean();

    if (!updated) return res.status(404).json({ message: 'Product not found' });
    return res.json(toProductDto(updated));
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: 'Invalid product payload' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const deleted = await ProductModel.findByIdAndDelete(req.params.id).lean();
  if (!deleted) return res.status(404).json({ message: 'Product not found' });
  return res.json({ message: 'Product deleted successfully' });
};
