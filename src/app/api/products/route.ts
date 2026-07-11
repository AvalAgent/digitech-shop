import { NextRequest, NextResponse } from "next/server";
import type { Category } from "@/data/types";
import { categories } from "@/data/products";
import { queryProducts, type CatalogQuery } from "@/lib/catalog";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const CATEGORY_KEYS = new Set(categories.map((c) => c.key));
const SORTS = new Set(["newest", "price-asc", "price-desc", "rating"]);

function num(v: string | null): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * GET /api/products — standard catalog listing.
 * Query params: q, category, brand, minPrice, maxPrice, sort(newest|price-asc|price-desc|rating), page, limit
 */
export function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const rawCategory = sp.get("category") ?? "";
  const category = CATEGORY_KEYS.has(rawCategory as Category)
    ? (rawCategory as Category)
    : "";

  const rawSort = sp.get("sort") ?? "newest";
  const sort = (SORTS.has(rawSort) ? rawSort : "newest") as NonNullable<CatalogQuery["sort"]>;

  const result = queryProducts({
    q: sp.get("q") ?? undefined,
    category,
    brand: sp.get("brand") ?? undefined,
    minPrice: num(sp.get("minPrice")),
    maxPrice: num(sp.get("maxPrice")),
    sort,
    page: num(sp.get("page")),
    limit: num(sp.get("limit")),
  });

  return NextResponse.json(result, { headers: CORS });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}
