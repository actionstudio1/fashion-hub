import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const jost = Jost({ variable: "--font-jost", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Fashion Hub — Men & Women Fashion Store in Binaki Mangalwari, Nagpur", template: "%s | Fashion Hub Nagpur" },
  description: SITE.description,
  keywords: ["Fashion Hub", "Fashion Hub Nagpur", "clothing store Binaki Mangalwari", "Mehandi Bag Road", "men fashion Nagpur", "women fashion Nagpur", "kurtis", "sarees", "jeans"],
  openGraph: { type: "website", siteName: "Fashion Hub", locale: "en_IN", title: "Fashion Hub — Your Style. Your Statement.", description: SITE.description },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#151311",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${jost.variable} ${cormorant.variable} antialiased`}>
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
