import type { Metadata } from "next";
import { vazirmatn } from "@/lib/fonts";
import { WidgetLoader } from "@/components/WidgetLoader";
import { CartBridge } from "@/components/CartBridge";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/CartDrawer";
import "./globals.css";

export const metadata: Metadata = {
  title: "دیجی‌تک | فروشگاه کالای دیجیتال",
  description:
    "خرید آنلاین موبایل، لپ‌تاپ، هدفون، ساعت هوشمند و لوازم جانبی با بهترین قیمت.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
          {/* Both live inside the provider: the bridge publishes the cart to
              window.avalagentCart, the loader injects the widget that reads it. */}
          <CartBridge />
          <WidgetLoader />
        </CartProvider>
      </body>
    </html>
  );
}
