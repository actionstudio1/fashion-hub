import type { Metadata } from "next";
import { WishlistView } from "@/components/shop/wishlist-view";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false } };

export default function WishlistPage() {
  return (
    <div className="container-x py-10 md:py-16">
      <h1 className="mb-8 font-display text-5xl md:mb-12 md:text-7xl">Wishlist</h1>
      <WishlistView />
    </div>
  );
}
