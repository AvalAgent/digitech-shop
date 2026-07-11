import { NextResponse } from "next/server";
import { categories, products } from "@/data/products";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/** GET /api/categories — category list with product counts. */
export function GET() {
  const items = categories.map((c) => ({
    key: c.key,
    label: c.label,
    count: products.filter((p) => p.category === c.key).length,
  }));
  return NextResponse.json({ items }, { headers: CORS });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}
