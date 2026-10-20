import type { Metadata } from "next";
import { CheckoutView } from "@/components/cart/checkout-view";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="container-x py-10 md:py-16">
      <h1 className="mb-8 font-display text-5xl md:mb-12 md:text-7xl">Checkout</h1>
      <CheckoutView />
    </div>
  );
}
