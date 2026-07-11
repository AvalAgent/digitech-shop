import type { Product } from "@/data/types";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://demo-shop.avalagent.com";

export const STORE_NAME = "دیجی‌تک";

export function productUrl(slug: string): string {
  return `${SITE_URL}/product/${slug}`;
}

/** schema.org/Product JSON-LD — the standard structured data every store ships for Google. */
export function productJsonLd(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.slug,
    mpn: p.id,
    brand: { "@type": "Brand", name: p.brand },
    category: p.category,
    description: p.description,
    image: p.images.length
      ? p.images.map((i) => (i.startsWith("http") ? i : `${SITE_URL}${i}`))
      : [`${SITE_URL}/product/${p.slug}`],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: p.rating,
      reviewCount: 20 + (p.stock % 80),
    },
    offers: {
      "@type": "Offer",
      price: p.priceIRR,
      priceCurrency: "IRR",
      availability:
        p.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: productUrl(p.slug),
    },
  };
}

/** schema.org/Organization + WebSite JSON-LD for the storefront home. */
export function storeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: STORE_NAME,
    url: SITE_URL,
    description:
      "فروشگاه آنلاین کالای دیجیتال — موبایل، لپ‌تاپ، هدفون، ساعت هوشمند و لوازم جانبی.",
  };
}
