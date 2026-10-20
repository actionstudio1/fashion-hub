export const SITE = {
  name: "Fashion Hub",
  tagline: "Your Style. Your Statement.",
  description:
    "Fashion Hub, Binaki Mangalwari, Nagpur — the latest fashion for Men & Women. Shirts, jeans, kurtas, kurtis, sarees, dresses, party wear and more. Order on WhatsApp.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsapp: "918459636574",
  whatsappDisplay: "+91 84596 36574",
  instagram: "https://www.instagram.com/fashion_hub_0.2_/",
  instagramHandle: "@fashion_hub_0.2_",
  address: {
    line1: "Jai Bhole Nagar, Mehandi Bag Road",
    area: "Binaki Mangalwari",
    city: "Nagpur",
    state: "Maharashtra",
    country: "India",
    full: "Jai Bhole Nagar, Mehandi Bag Road, Binaki Mangalwari, Nagpur, Maharashtra",
  },
  mapsUrl: "https://maps.app.goo.gl/WiGBdwcixJH2uLyh9",
  mapsEmbed: "https://www.google.com/maps?q=Jai+Bhole+Nagar,+Mehandi+Bag+Road,+Binaki+Mangalwari,+Nagpur&output=embed",
  hours: "Open daily · 10:00 AM – 10:00 PM",
} as const;

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Trending", href: "/trending" },
  { label: "Offers", href: "/offers" },
  { label: "Contact", href: "/contact" },
] as const;
