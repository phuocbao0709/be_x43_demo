import mongoose, { Schema } from 'mongoose';

export interface BannerDocument extends mongoose.Document {
  imageUrl: string;
  active: boolean;
  order: number;
}

const bannerSchema = new Schema<BannerDocument>(
  {
    imageUrl: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const BannerModel = mongoose.model<BannerDocument>('Banner', bannerSchema);
