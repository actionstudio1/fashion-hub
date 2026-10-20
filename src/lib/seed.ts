import type { Category, Colour, Database, Gender, Offer, Product } from "./types";

/** Placeholder editorial photography (Unsplash). Replace with real shop photos from the admin panel. */
const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=80`;

export const PHOTOS = {
  rack: img("1490481651871-ab68de25d43d"),
  shopWoman: img("1483985988355-763728e1935b"),
  womanYellow: img("1515886657613-9f3515b0c78f"),
  womanTeal: img("1509631179647-0177331693ae"),
  manSuitBlue: img("1617137968427-85924c800a22"),
  manCasual: img("1488161628813-04466f872be2"),
  manSuit: img("1507679799987-c73779587ccf"),
  manCasual2: img("1516826957135-700dedea698c"),
  womanTee: img("1503342217505-b0a15ec3261c"),
  whiteTee: img("1521572163474-6864f9cf17ab"),
  denimShirt: img("1596755094514-f87e34085b2c"),
  foldedShirts: img("1602810318383-e386cc2a3ccf"),
  jeans: img("1542272604-787c3835535d"),
  chinos: img("1473966968600-fa801b869a1a"),
  ethnicGreen: img("1597983073493-88cd35cf93b0"),
  sareeRed: img("1610030469983-98e550d6193c"),
  anarkali: img("1583391733956-3750e0ff4e8b"),
  redDress: img("1595777457583-95e059d581b8"),
  redDress2: img("1572804013309-59a88b7e92f1"),
  whiteDress: img("1539008835657-9e8e9680c956"),
  whiteTop: img("1564257631407-4deb1f99d992"),
  pinkTrousers: img("1594633312681-425c7b97ccd1"),
  menFlatlay: img("1593030761757-71fae45fa0e7"),
  sareeBridal: img("1617627143750-d86bc21e42bb"),
  greenDress: img("1609357605129-26f69add5d6e"),
  maroonDress: img("1585487000160-6ebcfceb0d03"),
  creamTop: img("1434389677669-e08b4cac3105"),
  manJacket: img("1520975954732-35dd22299614"),
  blackTeeMan: img("1622519407650-3df9883f76a5"),
  redGown: img("1612336307429-8a898d10e223"),
  graphicTee: img("1576566588028-4147f3842f27"),
  blackTee: img("1618354691373-d851c5c3a990"),
  jeans2: img("1624378439575-d8705ad7ae80"),
  backpack: img("1553062407-98eeb64c6a62"),
  watch: img("1523170335258-f5ed11844a49"),
  store: img("1441986300917-64674bd600d8"),
  rack2: img("1445205170230-053b83016050"),
  womanSunglass: img("1469334031218-e382a71b716b"),
  beachDress: img("1496747611176-843222e1e57c"),
  manBlazerPink: img("1487222477894-8943e31ef7b2"),
  manMaroon: img("1506634572416-48cdfe530110"),
  womanWhiteHat: img("1617922001439-4a2e6562f328"),
  rackNeutral: img("1558769132-cb1aea458c5e"),
  orangeSweater: img("1591047139829-d91aecb6caea"),
  shirtFlat: img("1551028719-00167b16eac5"),
  womanOrange: img("1578587018452-892bacefd3f2"),
  womanPink: img("1581044777550-4cfa60707c03"),
  whiteTeeMan: img("1554568218-0f1715e72254"),
  womanJeans: img("1598554747436-c9293d6a588f"),
  manBlazer: img("1600091166971-7f9faad6c1e2"),
  shoesJeans: img("1544441893-675973e31985"),
  shoes: img("1525507119028-ed4c629a60a3"),
  handbag: img("1559563458-527698bf5295"),
  denimJacket: img("1611312449408-fcece27cdbb7"),
  whiteSweater: img("1620799140408-edc6dcb6d633"),
};

const P = PHOTOS;

type CatSeed = [slug: string, name: string, description: string, image: string];

const MEN_CATEGORIES: CatSeed[] = [
  ["shirts", "Shirts", "Crisp, tailored and made for every day.", P.foldedShirts],
  ["t-shirts", "T-Shirts", "Soft cotton essentials and graphic tees.", P.blackTeeMan],
  ["jeans", "Jeans", "Slim, straight and tapered denim.", P.jeans],
  ["trousers", "Trousers", "Chinos and trousers for work and weekends.", P.chinos],
  ["kurtas", "Kurtas", "Festive and everyday kurtas.", P.manMaroon],
  ["ethnic-wear", "Ethnic Wear", "Kurta sets for every celebration.", P.manMaroon],
  ["casual-wear", "Casual Wear", "Easy layers and street-ready fits.", P.manCasual2],
  ["formal-wear", "Formal Wear", "Sharp suits for big days.", P.manSuit],
  ["blazers", "Blazers", "Structured blazers that make an entrance.", P.manBlazer],
  ["accessories", "Accessories", "Watches, bags and finishing touches.", P.watch],
];

const WOMEN_CATEGORIES: CatSeed[] = [
  ["kurtis", "Kurtis", "Everyday kurtis with festive details.", P.ethnicGreen],
  ["dresses", "Dresses", "Wrap, midi and maxi dresses.", P.redDress],
  ["sarees", "Sarees", "Silk and festive sarees.", P.sareeRed],
  ["suits", "Suits", "Anarkalis and suit sets.", P.anarkali],
  ["tops", "Tops", "Tops, tees and knits.", P.whiteTop],
  ["jeans", "Jeans", "High-rise, mom and straight fits.", P.womanJeans],
  ["western-wear", "Western Wear", "Co-ords, trousers and modern sets.", P.womanYellow],
  ["ethnic-wear", "Ethnic Wear", "Traditional looks, modern finish.", P.sareeBridal],
  ["party-wear", "Party Wear", "Gowns and jumpsuits for the spotlight.", P.redGown],
  ["accessories", "Accessories", "Bags and statement pieces.", P.handbag],
];

function buildCategories(gender: Gender, seeds: CatSeed[]): Category[] {
  return seeds.map(([slug, name, description, image], i) => ({
    id: `${gender === "men" ? "m" : "w"}-${slug}`,
    slug,
    name,
    gender,
    description,
    image,
    active: true,
    order: i,
  }));
}

const C = {
  white: { name: "White", hex: "#f5f3ee" },
  black: { name: "Black", hex: "#111111" },
  navy: { name: "Navy", hex: "#1f2a44" },
  indigo: { name: "Indigo", hex: "#2e3a5c" },
  sky: { name: "Sky Blue", hex: "#9bb7d4" },
  beige: { name: "Beige", hex: "#d8c7a8" },
  olive: { name: "Olive", hex: "#6b6b3a" },
  maroon: { name: "Maroon", hex: "#5e1b26" },
  red: { name: "Red", hex: "#b3202a" },
  emerald: { name: "Emerald", hex: "#1f6b4f" },
  ivory: { name: "Ivory", hex: "#efe7d6" },
  blush: { name: "Blush", hex: "#e9b8b0" },
  mustard: { name: "Mustard", hex: "#d8a227" },
  teal: { name: "Teal", hex: "#1b8a8a" },
  tan: { name: "Tan", hex: "#a8764a" },
  grey: { name: "Grey", hex: "#8a8a8a" },
  orange: { name: "Tangerine", hex: "#e2742b" },
  silver: { name: "Silver", hex: "#c0c0c0" },
} satisfies Record<string, Colour>;

const SIZES = {
  menTop: ["S", "M", "L", "XL", "XXL"],
  waist: ["28", "30", "32", "34", "36"],
  women: ["XS", "S", "M", "L", "XL"],
  free: ["Free Size"],
  one: ["One Size"],
};

type ProductSeed = {
  name: string;
  brand?: string;
  cat: string; // category id
  price: number;
  mrp: number;
  images: string[];
  sizes: string[];
  colours: Colour[];
  fabric: string;
  care?: string;
  description: string;
  flags?: Partial<Pick<Product, "isNewArrival" | "isTrending" | "isBestSeller" | "isOnOffer">>;
  stock?: number;
};

const CARE_COTTON = "Machine wash cold with similar colours. Do not bleach. Tumble dry low. Warm iron.";
const CARE_DELICATE = "Dry clean recommended. Store folded in a muslin cloth. Steam iron on reverse.";

const PRODUCT_SEEDS: ProductSeed[] = [
  // MEN
  { name: "Classic Oxford Shirt", cat: "m-shirts", price: 1299, mrp: 1999, images: [P.foldedShirts, P.shirtFlat], sizes: SIZES.menTop, colours: [C.white, C.sky, C.navy], fabric: "100% Cotton Oxford", description: "A wardrobe hero. Our Oxford shirt has a soft, breathable weave, button-down collar and a tailored fit that moves from office to evening.", flags: { isNewArrival: true, isBestSeller: true } },
  { name: "Washed Denim Shirt", cat: "m-shirts", price: 1499, mrp: 2299, images: [P.denimShirt, P.shirtFlat], sizes: SIZES.menTop, colours: [C.indigo, C.sky], fabric: "Cotton Chambray Denim", description: "Lightweight chambray denim with a lived-in wash. Wear it buttoned up or open over a tee.", flags: { isTrending: true } },
  { name: "Essential Crew Tee", cat: "m-t-shirts", price: 599, mrp: 999, images: [P.whiteTee, P.whiteTeeMan], sizes: SIZES.menTop, colours: [C.white, C.black, C.grey], fabric: "180 GSM Combed Cotton", description: "The perfect everyday tee — midweight combed cotton, a clean crew neck and a fit that holds its shape wash after wash.", flags: { isBestSeller: true } },
  { name: "Midnight Black Tee", cat: "m-t-shirts", price: 649, mrp: 999, images: [P.blackTeeMan, P.blackTee], sizes: SIZES.menTop, colours: [C.black], fabric: "Bio-washed Cotton Jersey", description: "Deep black, super soft and made to layer. A modern regular fit with dropped shoulders.", flags: { isNewArrival: true } },
  { name: "Retro Graphic Tee", cat: "m-t-shirts", price: 699, mrp: 1199, images: [P.graphicTee], sizes: SIZES.menTop, colours: [C.ivory], fabric: "100% Cotton", description: "Vintage-inspired print on a relaxed tee. Weekend-ready and Instagram-approved.", flags: { isTrending: true, isOnOffer: true } },
  { name: "Slim Fit Indigo Jeans", cat: "m-jeans", price: 1799, mrp: 2799, images: [P.jeans, P.shoesJeans], sizes: SIZES.waist, colours: [C.indigo, C.black], fabric: "98% Cotton, 2% Elastane Stretch Denim", description: "Our best-selling slim fit in rich indigo with just enough stretch for all-day comfort.", flags: { isBestSeller: true, isTrending: true } },
  { name: "Tapered Cotton Chinos", cat: "m-trousers", price: 1499, mrp: 2199, images: [P.chinos], sizes: SIZES.waist, colours: [C.beige, C.olive, C.navy], fabric: "Cotton Twill with Stretch", description: "Smart-casual chinos with a tapered leg. Pair with a tee or a crisp shirt.", flags: { isNewArrival: true } },
  { name: "Tailored Navy Suit", cat: "m-formal-wear", price: 6999, mrp: 9999, images: [P.manSuitBlue, P.manSuit], sizes: ["36", "38", "40", "42", "44"], colours: [C.navy, C.black], fabric: "Poly-Viscose Suiting", care: CARE_DELICATE, description: "A two-piece suit cut for a sharp, modern silhouette. Made for weddings, receptions and big presentations.", flags: { isTrending: true } },
  { name: "Textured Linen Blazer", cat: "m-blazers", price: 3999, mrp: 5999, images: [P.manBlazer, P.manBlazerPink], sizes: SIZES.menTop, colours: [C.ivory, C.blush], fabric: "Linen Blend", care: CARE_DELICATE, description: "An unstructured blazer in a breathable linen blend — elevated, effortless and perfect for Nagpur evenings.", flags: { isNewArrival: true, isOnOffer: true } },
  { name: "Street Utility Jacket", cat: "m-casual-wear", price: 2499, mrp: 3499, images: [P.manJacket, P.manCasual2], sizes: SIZES.menTop, colours: [C.black, C.olive], fabric: "Cotton Canvas", description: "A boxy utility jacket with patch pockets. Throw it over anything for instant street style.", flags: { isTrending: true } },
  { name: "Weekend Casual Set", cat: "m-casual-wear", price: 1999, mrp: 2999, images: [P.manCasual, P.menFlatlay], sizes: SIZES.menTop, colours: [C.beige, C.white], fabric: "Cotton Linen", description: "A relaxed overshirt-and-tee combination for brunches, trips and everything in between.", flags: { isOnOffer: true } },
  { name: "Maroon Festive Kurta Set", cat: "m-ethnic-wear", price: 2299, mrp: 3299, images: [P.manMaroon], sizes: SIZES.menTop, colours: [C.maroon], fabric: "Cotton Silk", care: CARE_DELICATE, description: "A rich maroon kurta set for festivals and family functions. Comfortable, classic and camera-ready.", flags: { isNewArrival: true } },
  { name: "Chrono Steel Watch", cat: "m-accessories", price: 2499, mrp: 3999, images: [P.watch], sizes: SIZES.one, colours: [C.silver], fabric: "Stainless Steel, Mineral Glass", care: "Wipe with a soft dry cloth. Avoid contact with perfume and water.", description: "A bold chronograph-style watch that finishes every look.", flags: { isBestSeller: true } },
  { name: "Everyday Backpack", cat: "m-accessories", price: 1599, mrp: 2499, images: [P.backpack], sizes: SIZES.one, colours: [C.navy], fabric: "Water-resistant Polyester", care: "Spot clean with a damp cloth.", description: "A minimal backpack with a padded laptop sleeve — college, office, travel.", stock: 0 },
  { name: "Classic Denim Jacket", cat: "m-casual-wear", price: 2199, mrp: 3299, images: [P.denimJacket], sizes: SIZES.menTop, colours: [C.indigo], fabric: "100% Cotton Denim", description: "The timeless trucker jacket in a mid-blue wash. Layer it all year round.", flags: { isBestSeller: true } },

  // WOMEN
  { name: "Scarlet Wrap Dress", cat: "w-dresses", price: 1899, mrp: 2999, images: [P.redDress, P.redDress2], sizes: SIZES.women, colours: [C.red], fabric: "Viscose Crepe", care: CARE_DELICATE, description: "A flattering wrap silhouette in statement scarlet. Made for date nights and celebrations.", flags: { isTrending: true, isNewArrival: true } },
  { name: "Ivory Summer Dress", cat: "w-dresses", price: 1699, mrp: 2599, images: [P.whiteDress, P.beachDress], sizes: SIZES.women, colours: [C.ivory], fabric: "Cotton Voile", description: "Light, airy and effortlessly pretty — a flowing summer dress for sunny days.", flags: { isNewArrival: true } },
  { name: "Emerald Flow Maxi", cat: "w-dresses", price: 2199, mrp: 3199, images: [P.greenDress], sizes: SIZES.women, colours: [C.emerald], fabric: "Georgette", care: CARE_DELICATE, description: "A floor-sweeping maxi in jewel-toned emerald with a soft, fluid drape.", flags: { isTrending: true } },
  { name: "Wine Midi Dress", cat: "w-dresses", price: 1799, mrp: 2699, images: [P.maroonDress], sizes: SIZES.women, colours: [C.maroon], fabric: "Rayon", description: "A sleek midi in deep wine — polished enough for work, chic enough for dinner.", flags: { isBestSeller: true } },
  { name: "Banarasi Silk Saree", cat: "w-sarees", price: 4999, mrp: 7499, images: [P.sareeRed, P.sareeBridal], sizes: SIZES.free, colours: [C.red, C.maroon], fabric: "Art Silk with Zari Weave", care: CARE_DELICATE, description: "A rich Banarasi-style saree with zari detailing and an unstitched blouse piece. Perfect for weddings and festive occasions.", flags: { isTrending: true, isBestSeller: true } },
  { name: "Ivory Anarkali Suit", cat: "w-suits", price: 3499, mrp: 4999, images: [P.anarkali], sizes: SIZES.women, colours: [C.ivory], fabric: "Georgette with Thread Embroidery", care: CARE_DELICATE, description: "A graceful flared anarkali with dupatta — elegant, festive and so comfortable.", flags: { isNewArrival: true } },
  { name: "Emerald Embroidered Kurti", cat: "w-kurtis", price: 1299, mrp: 1999, images: [P.ethnicGreen], sizes: SIZES.women, colours: [C.emerald], fabric: "Cotton Blend", description: "A straight-cut kurti with delicate embroidery at the yoke. Everyday ethnic, elevated.", flags: { isBestSeller: true, isOnOffer: true } },
  { name: "Crochet Detail Top", cat: "w-tops", price: 899, mrp: 1399, images: [P.whiteTop], sizes: SIZES.women, colours: [C.white], fabric: "Cotton", description: "A breezy white top with crochet details — pair with denim or a skirt.", flags: { isNewArrival: true } },
  { name: "Cream Knit Poncho", cat: "w-tops", price: 1199, mrp: 1799, images: [P.creamTop], sizes: SIZES.free, colours: [C.ivory], fabric: "Acrylic Knit", care: "Hand wash cold. Dry flat.", description: "A cosy knit poncho to layer through the Nagpur winter.", flags: { isOnOffer: true } },
  { name: "Sunburst Co-ord Set", cat: "w-western-wear", price: 2299, mrp: 3299, images: [P.womanYellow, P.womanSunglass], sizes: SIZES.women, colours: [C.mustard], fabric: "Polyester Crepe", description: "A bold mustard co-ord set that does the talking. Wear together or style separately.", flags: { isTrending: true } },
  { name: "Teal Statement Jumpsuit", cat: "w-party-wear", price: 2799, mrp: 3999, images: [P.womanTeal], sizes: SIZES.women, colours: [C.teal], fabric: "Satin", care: CARE_DELICATE, description: "A fluid wide-leg jumpsuit in a striking teal for parties and evenings out.", flags: { isNewArrival: true } },
  { name: "Crimson Evening Gown", cat: "w-party-wear", price: 4499, mrp: 6499, images: [P.redGown], sizes: SIZES.women, colours: [C.red], fabric: "Satin with Lining", care: CARE_DELICATE, description: "A show-stopping red gown with a high slit. Reception, cocktail, spotlight.", flags: { isTrending: true } },
  { name: "High-Rise Mom Jeans", cat: "w-jeans", price: 1599, mrp: 2399, images: [P.womanJeans, P.jeans2], sizes: ["26", "28", "30", "32", "34"], colours: [C.sky, C.indigo], fabric: "Rigid Cotton Denim", description: "A high-rise, relaxed mom fit in a clean light wash. The jeans you'll live in.", flags: { isBestSeller: true } },
  { name: "Blush Tailored Trousers", cat: "w-western-wear", price: 1399, mrp: 1999, images: [P.pinkTrousers], sizes: SIZES.women, colours: [C.blush], fabric: "Poly-Viscose", description: "High-waisted trousers in soft blush — tailored, modern and work-ready.", flags: { isOnOffer: true } },
  { name: "Quilted Chain Handbag", cat: "w-accessories", price: 1999, mrp: 2999, images: [P.handbag], sizes: SIZES.one, colours: [C.grey], fabric: "Vegan Leather", care: "Wipe with a soft dry cloth.", description: "A structured quilted handbag with a chain strap. The finishing touch for every outfit.", flags: { isNewArrival: true } },
  { name: "Tangerine Ribbed Top", cat: "w-tops", price: 799, mrp: 1199, images: [P.womanOrange], sizes: SIZES.women, colours: [C.orange], fabric: "Ribbed Cotton Stretch", description: "A fitted ribbed top in a sunny tangerine. Tuck it into high-rise jeans.", flags: { isTrending: true } },
  { name: "Boyfriend Graphic Tee", cat: "w-tops", price: 699, mrp: 999, images: [P.womanTee], sizes: SIZES.women, colours: [C.blush, C.white], fabric: "100% Cotton", description: "An oversized graphic tee with an easy, slouchy fit.", stock: 3 },
];

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildProducts(categories: Category[]): Product[] {
  const base = Date.UTC(2026, 9, 7);
  const products = PRODUCT_SEEDS.map((s, i): Product => {
    const cat = categories.find((c) => c.id === s.cat)!;
    return {
      id: `p${String(i + 1).padStart(3, "0")}`,
      slug: slugify(s.name),
      name: s.name,
      brand: s.brand ?? (cat.gender === "men" ? "Fashion Hub Men" : "Fashion Hub Women"),
      gender: cat.gender,
      categoryId: cat.id,
      price: s.price,
      mrp: s.mrp,
      images: s.images,
      sizes: s.sizes,
      colours: s.colours,
      stock: s.stock ?? 12,
      description: s.description,
      fabric: s.fabric,
      care: s.care ?? CARE_COTTON,
      isNewArrival: false,
      isTrending: false,
      isBestSeller: false,
      isOnOffer: false,
      ...s.flags,
      completeTheLook: [],
      active: true,
      createdAt: new Date(base - i * 36 * 3600 * 1000).toISOString(),
    };
  });
  const bySlug = (slug: string) => products.find((p) => p.slug === slug)!.id;
  const looks: [string, string[]][] = [
    ["classic-oxford-shirt", ["tapered-cotton-chinos", "chrono-steel-watch", "textured-linen-blazer"]],
    ["slim-fit-indigo-jeans", ["essential-crew-tee", "classic-denim-jacket", "chrono-steel-watch"]],
    ["scarlet-wrap-dress", ["quilted-chain-handbag", "cream-knit-poncho"]],
    ["high-rise-mom-jeans", ["tangerine-ribbed-top", "crochet-detail-top", "quilted-chain-handbag"]],
    ["banarasi-silk-saree", ["quilted-chain-handbag"]],
  ];
  for (const [slug, ids] of looks) {
    products.find((p) => p.slug === slug)!.completeTheLook = ids.map(bySlug);
  }
  return products;
}

const OFFERS: Offer[] = [
  {
    id: "o1",
    slug: "fashion-week-special",
    title: "Fashion Week Special",
    description: "Limited-time styles at special prices. Flat 20% off on orders above ₹1,999.",
    banner: P.rack2,
    validFrom: "2026-10-01",
    validTo: "2026-10-31",
    couponCode: "FHWEEK20",
    discountType: "percent",
    discountValue: 20,
    minOrder: 1999,
    maxDiscount: 1000,
    terms: [
      "Valid on orders of ₹1,999 and above.",
      "Maximum discount ₹1,000 per order.",
      "Cannot be combined with any other coupon.",
      "Valid online and on WhatsApp orders.",
    ],
    ctaLabel: "Shop the edit",
    ctaHref: "/trending",
    active: true,
  },
  {
    id: "o2",
    slug: "festive-edit",
    title: "The Festive Edit",
    description: "Celebrate in style — 15% off sarees, suits, kurtas and party wear this festive season.",
    banner: P.sareeBridal,
    validFrom: "2026-10-01",
    validTo: "2026-11-15",
    couponCode: "FESTIVE15",
    discountType: "percent",
    discountValue: 15,
    minOrder: 2499,
    maxDiscount: 1500,
    terms: ["Valid on orders of ₹2,499 and above.", "Maximum discount ₹1,500 per order.", "One use per customer."],
    ctaLabel: "Shop women",
    ctaHref: "/women",
    active: true,
  },
  {
    id: "o3",
    slug: "welcome-offer",
    title: "Welcome to Fashion Hub",
    description: "New here? Get flat ₹200 off your first order above ₹1,499.",
    banner: P.store,
    validFrom: "2026-01-01",
    validTo: "2026-12-31",
    couponCode: "WELCOME200",
    discountType: "flat",
    discountValue: 200,
    minOrder: 1499,
    maxDiscount: 0,
    terms: ["Valid on your first order only.", "Minimum order value ₹1,499."],
    ctaLabel: "Start shopping",
    ctaHref: "/new-arrivals",
    active: true,
  },
];

export function createSeed(): Database {
  const categories = [...buildCategories("men", MEN_CATEGORIES), ...buildCategories("women", WOMEN_CATEGORIES)];
  return {
    categories,
    products: buildProducts(categories),
    offers: OFFERS,
    orders: [],
    settings: {
      deliveryCharge: 79,
      freeDeliveryAbove: 999,
      announcement: "Free delivery on orders above ₹999 · Order on WhatsApp +91 84596 36574",
    },
  };
}
