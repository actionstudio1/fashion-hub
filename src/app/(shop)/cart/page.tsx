import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = { title: "Your Bag", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="container-x py-10 md:py-16">
      <h1 className="mb-8 font-display text-5xl md:mb-12 md:text-7xl">Your Bag</h1>
      <CartView />
    </div>
  );
}
