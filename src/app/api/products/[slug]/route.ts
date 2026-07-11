import { NextResponse } from "next/server";
import { getProduct } from "@/lib/catalog";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/** GET /api/products/:slug — single product detail. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) {
    return NextResponse.json(
      { error: "product_not_found" },
      { status: 404, headers: CORS },
    );
  }
  return NextResponse.json(product, { headers: CORS });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}
