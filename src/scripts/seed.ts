import { connectDb } from '../config/db';
import { ProductModel } from '../models/product.model';

const products = [
  {
    name: 'Blazer Navy Classic',
    slug: 'blazer-navy-classic',
    description: 'Blazer form chuẩn, phù hợp phong cách công sở cao cấp.',
    price: 4250000,
    compareAtPrice: 4950000,
    discountPercent: 14,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD053siKBSSRgFyJ1BgOiS3BL4_EJNQMcPZcr7rip3tNQppYYa6fPKk6M0MR0Y7TEmcqvNcKNW-H97_rTODT2boc3LGrj2OmVJklJu1E3h-2QijN2NZ4fzFhtohCanh6iF203AV5YsNe_u9_08pRIb8AfuRht73LMPeACg5vq31OHgRfWU8dRc_2jM3S39BOsNdxg5JXb_gmkj4mmSceoEpeD9sMR5oERKqx8TyK6u-2cNU3V26Scni5WZSuXGr43TkYrC7hNG9CjA'
    ],
    category: 'office',
    brand: 'LUXE',
    stock: 12,
    rating: 4.9,
    reviewCount: 48,
    isFeatured: true,
    isNew: true,
    tags: ['blazer', 'office', 'premium']
  },
  {
    name: 'Túi Xách Heritage',
    slug: 'tui-xach-heritage',
    description: 'Túi xách da bò thật, tôn lên sự sang trọng và tinh tế.',
    price: 8900000,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA9NjosiVStQYTUx3XimpxOob4_OdCcwl2nlVS6WYukk0ymanWRLHQDgTFCHdpJJ98inRGxn-toPmMKMXXA9zSYhB0gmaQiJsOOYO6hlWthrmCi3_WVoOcn65zolz-fcORET__hpxSpvVfa8TXG23loj_UPGINO0UTBpFyC6Fk26uPT0vpAC4zIQFKHEuqkEaPk3P4Hv6tNqj0eSWXltkM9f4gVSVUNebxjyOmkYl4Lus772iDnxbwmT6mIneIj5cQne8eRPWvhSFM'
    ],
    category: 'accessories',
    brand: 'LUXE',
    stock: 8,
    rating: 4.8,
    reviewCount: 32,
    isFeatured: true,
    isNew: false,
    tags: ['bag', 'leather', 'luxury']
  },
  {
    name: 'Áo Len Cashmere Cream',
    slug: 'ao-len-cashmere-cream',
    description: 'Cashmere tự nhiên, mềm mại và ấm áp.',
    price: 2975000,
    compareAtPrice: 3500000,
    discountPercent: 15,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuATPAH_f8du4kYnz0x8Gnh_eZHp_mr6dx9ws1_Hdsud_bkfsO9DB7nX3Vj3uoPnnDK2CA81BwI4wP9s6gzNAwtGs5h8nT8GXC3jyYINDV7hvshKY9vq2b2-8qUya-ENJoPez4tjQTxigZo18L0S7tScpOQ7tTdkbPKXjUxD7SzE4seFdhZeP8XYkFpagIZnaM2rCvujit0sw7OwJkB1TjHkMC6tbii_789DSXICETu2ImG-mAtOVfiLh-d5qIdNEVbbUhB-rSbCNmE'
    ],
    category: 'knitwear',
    brand: 'LUXE',
    stock: 15,
    rating: 5,
    reviewCount: 120,
    isFeatured: true,
    isNew: false,
    tags: ['cashmere', 'winter', 'soft']
  },
  {
    name: 'Giày Loafer Signature',
    slug: 'giay-loafer-signature',
    description: 'Giày loafer thủ công với đế chống trượt.',
    price: 5500000,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCYrIQ_Quzw9VnJL3r10nL8PfgEuQq3SpFf2wpP8zARhLgAnZW2wjukPE55nUKG8yO4uV3ATSUK8m1xhuEsX-WVad01IkLP7G8C1rv0kS8v21aAFqsAGDKbh4460kNTwChD0DCVT_IusAzzGk3Ys5g7J7B5O93t-oXD2WDmtI6fTK7BWeE3Co-iTfJIKoXDtTqJ4rmTJzhc9MlAvL7h7w6fE5u5iX7x1v2zpE9dhA-f8fFMdkZ70LysPggiHDlZXj-MnAEZHsoq3R8'
    ],
    category: 'shoes',
    brand: 'LUXE',
    stock: 20,
    rating: 4.7,
    reviewCount: 15,
    isFeatured: true,
    isNew: false,
    tags: ['shoes', 'loafer', 'handmade']
  }
];

const run = async () => {
  await connectDb();
  await ProductModel.deleteMany({});
  await ProductModel.insertMany(products);
  console.log(`Seeded ${products.length} products`);
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
