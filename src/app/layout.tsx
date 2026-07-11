import type { Metadata } from "next";
import { vazirmatn } from "@/lib/fonts";
import { WidgetLoader } from "@/components/WidgetLoader";
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
        {children}
        <WidgetLoader />
      </body>
    </html>
  );
}
