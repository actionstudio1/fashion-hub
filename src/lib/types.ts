export type Gender = "men" | "women";

export type Category = {
  id: string;
  slug: string;
  name: string;
  gender: Gender;
  description: string;
  image: string;
  active: boolean;
  order: number;
};

export type Colour = { name: string; hex: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  gender: Gender;
  categoryId: string;
  price: number;
  mrp: number;
  images: string[];
  sizes: string[];
  colours: Colour[];
  stock: number;
  description: string;
  fabric: string;
  care: string;
  isNewArrival: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isOnOffer: boolean;
  /** Product ids shown under "Complete the look". */
  completeTheLook: string[];
  active: boolean;
  createdAt: string;
};

export type DiscountType = "percent" | "flat";

export type Offer = {
  id: string;
  slug: string;
  title: string;
  description: string;
  banner: string;
  validFrom: string; // YYYY-MM-DD
  validTo: string; // YYYY-MM-DD
  couponCode: string;
  discountType: DiscountType;
  discountValue: number;
  minOrder: number;
  maxDiscount: number; // 0 = no cap
  terms: string[];
  ctaLabel: string;
  ctaHref: string;
  active: boolean;
};

export type OrderStatus = "new" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  colour: string;
  qty: number;
};

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    pincode: string;
    notes: string;
  };
  paymentMethod: "cod" | "whatsapp";
  items: OrderItem[];
  couponCode: string;
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
};

export type Settings = {
  deliveryCharge: number;
  freeDeliveryAbove: number;
  announcement: string;
};

export type Database = {
  categories: Category[];
  products: Product[];
  offers: Offer[];
  orders: Order[];
  settings: Settings;
};
