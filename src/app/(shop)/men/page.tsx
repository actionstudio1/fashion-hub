import type { Metadata } from "next";
import { GenderPage } from "@/components/shop/gender-page";

export const metadata: Metadata = {
  title: "Men's Fashion — Shirts, Jeans, Kurtas & Blazers",
  description: "Shop men's shirts, t-shirts, jeans, trousers, kurtas, ethnic wear, formal wear and blazers at Fashion Hub, Binaki Mangalwari, Nagpur.",
};

export default function MenPage() {
  return <GenderPage gender="men" />;
}
