export type Category =
  | "mobile"
  | "laptop"
  | "headphone"
  | "watch"
  | "tablet"
  | "accessory";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: Category;
  priceIRR: number;
  rating: number;
  specs: Record<string, string>;
  description: string;
  images: string[];
}
