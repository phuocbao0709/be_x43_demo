import { Request, Response } from 'express';
import { BannerModel } from '../models/banner.model';
import { ProductModel } from '../models/product.model';

const defaultHeroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAoR8ZEPitUe8QbDfSRyS-k-EQWhrl1ZdfNpNFqq7fjfS4ufG0sUup57ZduFAO6BXWI82tmknbdsqjEoMSovIAI3rPNpvywxvWv3t1sOi1HarlHOp442ZTyMV4TpT9ai1DAPOzwxm_r9Kl2-qIq3Bqc-P57fZH4-cVYnQSI9LyVs7NTt3mLwQNhys73dKXt9nCaHfzRoTyIuPkzdD2XHZyzMzBjbtVdnv8GOdM-hmXP4DE6arqIc_lBtu267l0rsGilqoWiPF3cg4o';

export const getHomePageData = async (_req: Request, res: Response) => {
  const [featuredProducts, categories, banners] = await Promise.all([
    ProductModel.find({ active: true }).sort({ createdAt: -1 }).limit(8).lean(),
    ProductModel.distinct('category', { active: true }),
    BannerModel.find({ active: true }).sort({ order: 1, createdAt: -1 }).lean()
  ]);

  const normalizedFeaturedProducts = featuredProducts.map((product) => ({
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
    isNew: product.isNew,
    stock: product.stock,
    tags: product.tags ?? []
  }));

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
    categories: [
      {
        name: 'Thời Trang Công Sở',
        description: 'Sự chuyên nghiệp trong từng đường kim mũi chỉ',
        href: '/products?category=office',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuC8hsO3zVHFYf0afZZ_kZMhl6tzg7lDIT2CdO1-bi1qM36WJMvgYt-zL_Q8r6_i8fv-k7U9z0bz3CYzxn9x7pg873C8c6goDNrzB_RyrTU11fDm3umQfXXD4jzeSj_t1zB9xajaJ5b8EbLcdJsxdxhHr1fkRuXlQCpHm7jBz-j7lA1u7fjExdlB22Z4fXAyOCPQ88g4E29HmdXeRSQ0EH9SxhfPXYTVuOZKUqAl3oDNIDwpmdbF3BLAJo6rbrOpfDE_FwLHmr86Vfc'
      },
      {
        name: 'Phụ Kiện Cao Cấp',
        description: 'Hoàn thiện phong cách của bạn',
        href: '/products?category=accessories',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAQDSFn0Up1_wL6TU-s73Q3czQ8hQLAIvRxXZ93Ws-oEpapy6B3ynOM8rBdlxnbUMnY4Xz3ppEloqVQTsW1d8AG5I3U00K2JLKOGltrsxWNhjDaWvLfeD0IF73Ye0OCVTTLEGhazaazQk4W31Fdtc7YTV_NI9jtLs7t5rhJdFZXxkeG30YXsw1IAqLJZCxy4mlSSVF-Qn0UJ0wd-p5ow3MjG1reedbtzuoOX4woo1dLvOzySvc2BxQhaw3Ic9rNuahK9ppNZR5Ki6c'
      },
      {
        name: 'Giày Da Thủ Công',
        description: 'Tinh xảo, bền bỉ, sang trọng',
        href: '/products?category=shoes',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuC_yJYVeCt4yK2BxfG0MOtryzJESPUU7O67cegXR9AIsK0LQvnmRpBEdHyytIHvBaAaGLzQi3xBCvJiIvvAkr0Nwq_dhfX1dPwsstrt3VUtx-GeS1OtaLCWAIgYnLiKCqsJVxqIyV_Kp5A1-28hHC5EJa76hUmS3SOg4suGL4rcxAluKzhF_ZCgp7dpWjus0b6zHuqWNdLyKewaC1XULo0FbE48tTNY28Ps5PBVx3kr_BIZdcDRA6ecM8wzzyb1n_zpmVfNUTQkjMI'
      }
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
