import { Request, Response } from 'express';
import { BannerModel } from '../models/banner.model';
import { ProductModel } from '../models/product.model';

const defaultHeroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAoR8ZEPitUe8QbDfSRyS-k-EQWhrl1ZdfNpNFqq7fjfS4ufG0sUup57ZduFAO6BXWI82tmknbdsqjEoMSovIAI3rPNpvywxvWv3t1sOi1HarlHOp442ZTyMV4TpT9ai1DAPOzwxm_r9Kl2-qIq3Bqc-P57fZH4-cVYnQSI9LyVs7NTt3mLwQNhys73dKXt9nCaHfzRoTyIuPkzdD2XHZyzMzBjbtVdnv8GOdM-hmXP4DE6arqIc_lBtu267l0rsGilqoWiPF3cg4o';

const toPublicProduct = (product: any) => ({
  id: product._id,
  name: product.name,
  slug: product.slug,
  description: product.description,
  price: product.price,
  compareAtPrice: product.compareAtPrice,
  discountPercent: product.discountPercent,
  image: product.images?.[0] ?? '',
  images: product.images ?? [],
  category: product.category,
  brand: product.brand,
  rating: product.rating,
  reviewCount: product.reviewCount,
  isNew: product.isNewProduct ?? product.isNew,
  stock: product.stock,
  tags: product.tags ?? []
});

export const getHomePageData = async (_req: Request, res: Response) => {
  const [featuredProducts, banners] = await Promise.all([
    ProductModel.find({ active: true }).sort({ createdAt: -1 }).limit(8).lean(),
    BannerModel.find({ active: true }).sort({ order: 1, createdAt: -1 }).lean()
  ]);

  const normalizedFeaturedProducts = featuredProducts.map(toPublicProduct);

  return res.json({
    hero: {
      title: 'Kỷ Nguyên Mới Của Sự Sang Trọng',
      description:
        'Khám phá bộ sưu tập Thu-Đông 2024 với những thiết kế độc bản, kết hợp giữa nghệ thuật thủ công truyền thống và phong cách hiện đại.',
      ctaPrimary: 'Xem Bộ Sưu Tập',
      ctaSecondary: 'Khám Phá Thêm',
      image: banners[0]?.imageUrl ?? defaultHeroImage
    },
    banners: banners.map((banner) => ({
      id: banner._id,
      imageUrl: banner.imageUrl,
      order: banner.order
    })),
    navigation: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Sản phẩm', href: '/products' },
      { label: 'Bộ sưu tập', href: '/collections' },
      { label: 'Giảm giá', href: '/sale' }
    ],
    featuredProducts: normalizedFeaturedProducts,
    benefits: [
      {
        title: 'Chất Lượng Thượng Hạng',
        description: 'Cam kết 100% sản phẩm chính hãng từ các nghệ nhân hàng đầu.'
      },
      {
        title: 'Giao Hàng Ưu Tiên',
        description: 'Miễn phí giao hàng cho mọi hóa đơn trên toàn quốc.'
      },
      {
        title: 'Đổi Trả Linh Hoạt',
        description: 'Hỗ trợ đổi trả trong vòng 30 ngày cho mọi lý do.'
      },
      {
        title: 'Hỗ Trợ 24/7',
        description: 'Đội ngũ chuyên gia sẵn sàng tư vấn phong cách riêng.'
      }
    ],
    footer: {
      copyright: '© 2024 LUXE Premium Commerce. All rights reserved.'
    }
  });
};
