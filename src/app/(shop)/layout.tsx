import { Footer } from "@/components/layout/footer";
import { Toasts, WhatsAppFloat } from "@/components/layout/floating";
import { Header } from "@/components/layout/header";
import { QuickViewModal } from "@/components/product/quick-view";
import { StoreProvider } from "@/components/store/store-provider";
import { getSettings } from "@/lib/data";

export default async function ShopLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  return (
    <StoreProvider settings={{ deliveryCharge: settings.deliveryCharge, freeDeliveryAbove: settings.freeDeliveryAbove }}>
      {settings.announcement && (
        <div className="bg-ink px-4 py-2 text-center text-[0.62rem] uppercase tracking-[0.2em] text-cream/85 md:text-[0.7rem]">
          {settings.announcement.split("·").map((part, i) => (
            <span key={i} className={i > 0 ? "hidden md:inline" : ""}>
              {i > 0 && <span className="mx-3 text-gold-soft">·</span>}
              {part.trim()}
            </span>
          ))}
        </div>
      )}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <QuickViewModal />
      <Toasts />
    </StoreProvider>
  );
}
