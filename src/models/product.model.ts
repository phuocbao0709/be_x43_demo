import mongoose, { Schema } from 'mongoose';

export interface ProductDocument extends mongoose.Document {
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  discountPercent?: number;
  images: string[];
  category: string;
  brand?: string;
  sku?: string;
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNewProduct: boolean;
  tags: string[];
  active: boolean;
}

const productSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    discountPercent: { type: Number, min: 0, max: 100 },
    images: [{ type: String, required: true }],
    category: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    sku: { type: String, trim: true, unique: true, sparse: true },
    stock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    isNewProduct: { type: Boolean, default: false },
    tags: [{ type: String, trim: true }],
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', category: 'text', brand: 'text', tags: 'text' });

export const ProductModel = mongoose.model<ProductDocument>('Product', productSchema);
