import type { Category, Product } from "@/data/types";
import { products, categories } from "@/data/products";

const CATEGORY_LABEL = new Map(categories.map((c) => [c.key, c.label]));

export interface CatalogQuery {
  q?: string;
  category?: Category | "";
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "rating";
  page?: number;
  limit?: number;
}

export interface CatalogPage {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/** Persian/Arabic-digit + case insensitive haystack match. */
function matches(p: Product, q: string): boolean {
  const hay =
    `${p.name} ${p.brand} ${CATEGORY_LABEL.get(p.category) ?? ""} ${p.description} ${Object.values(p.specs).join(" ")}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => hay.includes(term));
}

/** Single query path used by BOTH the storefront and the public API. */
export function queryProducts(query: CatalogQuery): CatalogPage {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, Math.max(1, query.limit ?? 24));

  let items = products;
  if (query.category) items = items.filter((p) => p.category === query.category);
  if (query.brand) items = items.filter((p) => p.brand.toLowerCase() === query.brand!.toLowerCase());
  if (query.minPrice != null) items = items.filter((p) => p.priceIRR >= query.minPrice!);
  if (query.maxPrice != null) items = items.filter((p) => p.priceIRR <= query.maxPrice!);
  if (query.q) items = items.filter((p) => matches(p, query.q!));

  switch (query.sort) {
    case "price-asc":
      items = [...items].sort((a, b) => a.priceIRR - b.priceIRR);
      break;
    case "price-desc":
      items = [...items].sort((a, b) => b.priceIRR - a.priceIRR);
      break;
    case "rating":
      items = [...items].sort((a, b) => b.rating - a.rating);
      break;
    default:
      break; // newest = catalog order
  }

  const total = items.length;
  const start = (page - 1) * limit;
  const slice = items.slice(start, start + limit);
  return { items: slice, total, page, limit, hasMore: start + slice.length < total };
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
