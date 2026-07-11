import type { Category, Product } from "./types";
import catalog from "./catalog.json";

export interface CategoryMeta {
  key: Category;
  label: string;
  /** duotone panel gradient for product media */
  from: string;
  to: string;
}

export const categories: CategoryMeta[] = [
  { key: "mobile", label: "موبایل", from: "#EEF2FF", to: "#DBE4FF" },
  { key: "laptop", label: "لپ‌تاپ", from: "#ECFEFF", to: "#CFFAFE" },
  { key: "headphone", label: "هدفون", from: "#F5F3FF", to: "#E9D5FF" },
  { key: "watch", label: "ساعت هوشمند", from: "#FFF7ED", to: "#FFEDD5" },
  { key: "tablet", label: "تبلت", from: "#F0FDF4", to: "#DCFCE7" },
  { key: "accessory", label: "لوازم جانبی", from: "#FDF2F8", to: "#FCE7F3" },
];

export const products: Product[] = catalog as unknown as Product[];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelated(p: Product): Product[] {
  return products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
}

export function categoryMeta(key: Category): CategoryMeta {
  return categories.find((c) => c.key === key) ?? categories[0];
}
