"use client";

import { X } from "lucide-react";
import { SnapshotCard } from "@/components/product/recently-viewed";
import { useStore } from "@/components/store/store-provider";
import { EmptyState } from "@/components/ui/section";

export function WishlistView() {
  const { wishlist, toggleWishlist } = useStore();
  if (wishlist.length === 0) {
    return <EmptyState title="Your wishlist is empty" text="Tap the heart on any style to save it here for later." action={{ label: "Explore trending", href: "/trending" }} />;
  }
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:gap-x-6 lg:grid-cols-4">
      {wishlist.map((item) => (
        <div key={item.id} className="relative">
          <SnapshotCard item={item} />
          <button
            type="button"
            onClick={() => toggleWishlist(item)}
            aria-label={`Remove ${item.name} from wishlist`}
            className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-cream/90"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      ))}
    </div>
  );
}
