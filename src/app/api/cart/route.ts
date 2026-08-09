import { NextRequest, NextResponse } from "next/server";
import {
  addToCart,
  clearCart,
  getCart,
  getCartById,
  setLineQty,
  type CartIdentity,
} from "@/lib/server-cart";

// Open CORS like /api/products: this endpoint is the integration seam an
// external agent (AvalAgent's sales agent) calls server-to-server, and the
// storefront itself calls it from the browser.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const MAX_KEY = 128;

function badRequest(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400, headers: CORS });
}

function str(value: unknown, max = MAX_KEY): string | null {
  const s = typeof value === "string" ? value.trim() : "";
  return s && s.length <= max ? s : null;
}

/**
 * Who is shopping.
 *
 * `customerPhone` is the real identity — one customer, one cart, whichever
 * channel they came from. `cartId` is the anonymous fallback for a shopper we
 * don't know yet; send BOTH on the call where a phone first becomes known and
 * the guest basket merges into the customer's.
 */
function identityFrom(source: { phone?: unknown; cartId?: unknown }): CartIdentity | null {
  const phone = str(source.phone, 32);
  const guestKey = str(source.cartId);
  return phone || guestKey ? { phone, guestKey } : null;
}

/**
 * GET /api/cart?cart=<uuid>            — by cart id (what a checkout link uses)
 *     /api/cart?customerPhone=… | ?cartId=<guestKey>  — by identity
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const byId = str(sp.get("cart"), 64);
  if (byId) {
    const cart = await getCartById(byId);
    if (!cart) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404, headers: CORS });
    return NextResponse.json({ ok: true, cart: withCheckoutUrl(req, cart) }, { headers: CORS });
  }

  const identity = identityFrom({ phone: sp.get("customerPhone"), cartId: sp.get("cartId") });
  if (!identity) return badRequest("cart, customerPhone or cartId is required");

  const cart = await getCart(identity);
  return NextResponse.json({ ok: true, cart: withCheckoutUrl(req, cart) }, { headers: CORS });
}

/**
 * POST /api/cart — add a product.
 * Body: { customerPhone?, cartId?, sku, variantId?, qty? }
 * `sku` accepts a product slug, product id, variant sku or variant id; with no
 * `variantId` the cheapest in-stock variant is chosen.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return badRequest("invalid json body");

  const b = body as Record<string, unknown>;
  const identity = identityFrom({ phone: b.customerPhone, cartId: b.cartId });
  if (!identity) return badRequest("customerPhone or cartId is required");

  const sku = str(b.sku);
  if (!sku) return badRequest("sku is required");

  const variantId = typeof b.variantId === "string" ? b.variantId : undefined;
  const qty = typeof b.qty === "number" ? b.qty : 1;

  const result = await addToCart(identity, sku, variantId, qty);
  if (!result.ok) {
    // 404 for an unknown sku, 409 for a real product we can't sell right now.
    const status = result.error === "product_not_found" ? 404 : 409;
    return NextResponse.json({ ok: false, error: result.error }, { status, headers: CORS });
  }

  return NextResponse.json(
    { ok: true, added: result.added, cart: withCheckoutUrl(req, result.cart) },
    { headers: CORS },
  );
}

/**
 * PATCH /api/cart — set a line's quantity (0 removes it).
 * Body: { customerPhone?, cartId?, variantId, qty }
 */
export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return badRequest("invalid json body");

  const b = body as Record<string, unknown>;
  const identity = identityFrom({ phone: b.customerPhone, cartId: b.cartId });
  if (!identity) return badRequest("customerPhone or cartId is required");

  const variantId = str(b.variantId);
  if (!variantId) return badRequest("variantId is required");

  const qty = typeof b.qty === "number" ? b.qty : 0;
  const cart = await setLineQty(identity, variantId, qty);
  return NextResponse.json({ ok: true, cart: withCheckoutUrl(req, cart) }, { headers: CORS });
}

/** DELETE /api/cart?customerPhone=… — empty a cart (reset between demo takes). */
export async function DELETE(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const identity = identityFrom({ phone: sp.get("customerPhone"), cartId: sp.get("cartId") });
  if (!identity) return badRequest("customerPhone or cartId is required");
  const cart = await clearCart(identity);
  return NextResponse.json({ ok: true, cart: withCheckoutUrl(req, cart) }, { headers: CORS });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

/**
 * A chat agent on Telegram/Bale has no page context, so it needs a link it can
 * hand the customer. The link carries ONLY the cart's opaque uuid — never the
 * phone: it travels through a chat app and a phone number does not belong in a
 * URL. The cart is durable now, so the page reads the live basket by that id.
 */
function withCheckoutUrl<T extends { cartId: string; customerPhone: string | null }>(
  req: NextRequest,
  cart: T,
) {
  const url = new URL("/checkout", req.nextUrl.origin);
  if (cart.cartId) url.searchParams.set("cart", cart.cartId);
  return { ...cart, checkoutUrl: url.toString() };
}
