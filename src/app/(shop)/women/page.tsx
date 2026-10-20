import type { Metadata } from "next";
import { GenderPage } from "@/components/shop/gender-page";

export const metadata: Metadata = {
  title: "Women's Fashion — Kurtis, Sarees, Dresses & Party Wear",
  description: "Shop women's kurtis, sarees, suits, dresses, tops, jeans, western and party wear at Fashion Hub, Binaki Mangalwari, Nagpur.",
};

export default function WomenPage() {
  return <GenderPage gender="women" />;
}
