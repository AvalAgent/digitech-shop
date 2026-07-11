export type Category =
  | "mobile"
  | "laptop"
  | "headphone"
  | "watch"
  | "tablet"
  | "accessory";

/** A purchasable variant of a product (storage/color combination). */
export interface Variant {
  id: string;
  sku: string;
  /** e.g. "۲۵۶ گیگابایت" — absent for single-storage products */
  storage?: string;
  /** e.g. "مشکی" — absent for single-color products */
  color?: string;
  priceIRR: number;
  stock: number;
}

/** One product = one model. Storage/color live in `variants` (standard store shape). */
export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: Category;
  /** lowest variant price — shown as «از … تومان» in listings */
  priceIRR: number;
  rating: number;
  /** total stock across variants */
  stock: number;
  specs: Record<string, string>;
  description: string;
  images: string[];
  variants: Variant[];
}
