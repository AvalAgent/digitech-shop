import { products } from "@/data/products";
import type { Product, Variant } from "@/data/types";
import { getSql } from "@/lib/db";

/**
 * The store's cart — persisted in the store's own Postgres (Neon).
 *
 * Identity model, and the reason this isn't keyed on a chat id any more:
 * a CUSTOMER is a phone number, the same key an Iranian store logs people in
 * with. One customer = one cart, no matter which channel they arrived from
 * (web widget, Telegram, Bale, Rubika). Before we know who they are, the cart
 * hangs off an opaque `guestKey`; the moment a phone arrives, the guest cart
 * MERGES into the customer's — exactly what a real store does at login.
 *
 * Only the catalog stays in JSON. Prices, names and stock are always read from
 * it, never stored on the line, so a price change can't leave a stale cart.
 */

export interface CartLine {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  /** e.g. "۲۵۶ گیگابایت · مشکی" */
  variantLabel: string;
  priceIRR: number;
  image?: string;
  qty: number;
}

export interface Cart {
  cartId: string;
  /** Set once the shopper is identified — null while still a guest. */
  customerPhone: string | null;
  items: CartLine[];
  count: number;
  totalIRR: number;
}

/** How a caller names the shopper: a verified phone, a guest key, or both. */
export interface CartIdentity {
  phone?: string | null;
  guestKey?: string | null;
}

const MAX_QTY_PER_LINE = 20;

// ── catalog helpers ────────────────────────────────────────────────────────

function variantLabel(v: Variant): string {
  return [v.storage, v.color].filter(Boolean).join(" · ") || "استاندارد";
}

/**
 * Find a product from whatever identifier the caller has: a slug, a product id,
 * a variant sku, or a variant id. The AI's synced catalog rows are
 * product-level (their `sku` is our `slug`), so «افزودن به سبد» usually arrives
 * with a slug and no variant.
 */
export function findProduct(sku: string): Product | undefined {
  const key = sku.trim().toLowerCase();
  if (!key) return undefined;
  return (
    products.find((p) => p.slug.toLowerCase() === key) ??
    products.find((p) => p.id.toLowerCase() === key) ??
    products.find((p) => p.variants.some((v) => v.sku.toLowerCase() === key)) ??
    products.find((p) => p.variants.some((v) => v.id.toLowerCase() === key))
  );
}

/**
 * Pick the variant to add. An explicit `variantId` (or variant sku) wins;
 * otherwise the cheapest in-stock one, so «بذارش تو سبد» on a product with six
 * combos never lands the shopper on a sold-out variant.
 */
export function resolveVariant(product: Product, variantId?: string): Variant | undefined {
  if (variantId) {
    const key = variantId.trim().toLowerCase();
    const exact = product.variants.find(
      (v) => v.id.toLowerCase() === key || v.sku.toLowerCase() === key,
    );
    if (exact) return exact;
  }
  const inStock = product.variants.filter((v) => v.stock > 0);
  const pool = inStock.length > 0 ? inStock : product.variants;
  return pool.slice().sort((a, b) => a.priceIRR - b.priceIRR)[0];
}

/** Build a full cart line from a stored `variantId` + qty. */
export function lineFor(variantId: string, qty: number): CartLine | null {
  const product = findProduct(variantId);
  const variant = product?.variants.find((v) => v.id === variantId || v.sku === variantId);
  if (!product || !variant) return null;
  return {
    productId: product.id,
    variantId: variant.id,
    slug: product.slug,
    name: product.name,
    variantLabel: variantLabel(variant),
    priceIRR: variant.priceIRR,
    image: product.images[0],
    qty,
  };
}

// ── identity ───────────────────────────────────────────────────────────────

/**
 * Iranian mobile numbers arrive as 09…, +989…, 989… or 9… — all the same
 * person. Normalize to a single canonical form so one human is never two
 * customers.
 */
export function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let d = String(raw).replace(/[۰-۹]/g, (c) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(c)));
  d = d.replace(/\D/g, "");
  if (d.startsWith("0098")) d = d.slice(4);
  else if (d.startsWith("98")) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  // Iranian mobiles are 9XXXXXXXXX (10 digits) after stripping prefixes.
  return /^9\d{9}$/.test(d) ? `0${d}` : null;
}

// ── cart resolution ────────────────────────────────────────────────────────

interface CartRow {
  id: string;
  phone: string | null;
}

/**
 * Get (or create) the one open cart for this identity, merging a guest cart in
 * when the shopper has just become known.
 */
async function resolveCart(identity: CartIdentity): Promise<CartRow | null> {
  const sql = getSql();
  const phone = normalizePhone(identity.phone);
  const guestKey = identity.guestKey?.trim() || null;

  if (!phone && !guestKey) return null;

  if (!phone) {
    const rows = await sql`
      insert into carts (guest_key) values (${guestKey})
      on conflict (guest_key) where guest_key is not null do update set updated_at = now()
      returning id
    ` as Array<{ id: string }>;
    return { id: rows[0].id, phone: null };
  }

  const customerRows = await sql`
    insert into customers (phone) values (${phone})
    on conflict (phone) do update set phone = excluded.phone
    returning id
  ` as Array<{ id: string }>;
  const customerId = customerRows[0].id;

  const cartRows = await sql`
    insert into carts (customer_id) values (${customerId})
    on conflict (customer_id) where customer_id is not null do update set updated_at = now()
    returning id
  ` as Array<{ id: string }>;
  const cartId = cartRows[0].id;

  // Login-time merge: whatever they put in the basket as a guest follows them.
  if (guestKey) {
    const guestRows = await sql`
      select id from carts where guest_key = ${guestKey} and id <> ${cartId}
    ` as Array<{ id: string }>;
    for (const guest of guestRows) {
      await sql`
        insert into cart_items (cart_id, variant_id, qty)
        select ${cartId}, variant_id, qty from cart_items where cart_id = ${guest.id}
        on conflict (cart_id, variant_id)
          do update set qty = least(cart_items.qty + excluded.qty, ${MAX_QTY_PER_LINE})
      `;
      await sql`delete from carts where id = ${guest.id}`;
    }
  }

  return { id: cartId, phone };
}

async function shape(cart: CartRow): Promise<Cart> {
  const sql = getSql();
  const rows = await sql`
    select variant_id, qty from cart_items where cart_id = ${cart.id} order by added_at
  ` as Array<{ variant_id: string; qty: number }>;

  // Lines are rebuilt from the catalog every read — the DB stores only what was
  // chosen, never a price that could go stale.
  const items = rows
    .map((r) => lineFor(r.variant_id, r.qty))
    .filter((l): l is CartLine => l !== null);

  return {
    cartId: cart.id,
    customerPhone: cart.phone,
    items,
    count: items.reduce((s, i) => s + i.qty, 0),
    totalIRR: items.reduce((s, i) => s + i.priceIRR * i.qty, 0),
  };
}

const EMPTY: Cart = { cartId: "", customerPhone: null, items: [], count: 0, totalIRR: 0 };

export async function getCart(identity: CartIdentity): Promise<Cart> {
  const cart = await resolveCart(identity);
  return cart ? shape(cart) : EMPTY;
}

/**
 * Read a cart by its own id. This is what a checkout LINK carries: an opaque
 * uuid, never the shopper's phone — that link travels through Telegram, and a
 * phone number has no business sitting in a URL.
 */
export async function getCartById(cartId: string): Promise<Cart | null> {
  if (!/^[0-9a-f-]{36}$/i.test(cartId)) return null;
  const rows = await getSql()`
    select c.id, cu.phone
      from carts c
      left join customers cu on cu.id = c.customer_id
     where c.id = ${cartId}
  ` as Array<{ id: string; phone: string | null }>;
  return rows.length > 0 ? shape({ id: rows[0].id, phone: rows[0].phone }) : null;
}

export type AddResult =
  | { ok: true; cart: Cart; added: CartLine }
  | { ok: false; error: "product_not_found" | "no_variant" | "out_of_stock" | "no_identity" };

export async function addToCart(
  identity: CartIdentity,
  sku: string,
  variantId?: string,
  qty = 1,
): Promise<AddResult> {
  const product = findProduct(sku);
  if (!product) return { ok: false, error: "product_not_found" };

  const variant = resolveVariant(product, variantId);
  if (!variant) return { ok: false, error: "no_variant" };
  if (variant.stock <= 0) return { ok: false, error: "out_of_stock" };

  const cart = await resolveCart(identity);
  if (!cart) return { ok: false, error: "no_identity" };

  const amount = Math.min(Math.max(Math.trunc(qty) || 1, 1), MAX_QTY_PER_LINE);
  const sql = getSql();
  await sql`
    insert into cart_items (cart_id, variant_id, qty)
    values (${cart.id}, ${variant.id}, ${amount})
    on conflict (cart_id, variant_id)
      do update set qty = least(cart_items.qty + ${amount}, ${MAX_QTY_PER_LINE})
  `;
  await sql`update carts set updated_at = now() where id = ${cart.id}`;

  const shaped = await shape(cart);
  const added = shaped.items.find((i) => i.variantId === variant.id) ?? lineFor(variant.id, amount)!;
  return { ok: true, cart: shaped, added };
}

export async function clearCart(identity: CartIdentity): Promise<Cart> {
  const cart = await resolveCart(identity);
  if (!cart) return EMPTY;
  await getSql()`delete from cart_items where cart_id = ${cart.id}`;
  return shape(cart);
}

/** Set a line's quantity; 0 removes it. Used by the storefront cart drawer. */
export async function setLineQty(
  identity: CartIdentity,
  variantId: string,
  qty: number,
): Promise<Cart> {
  const cart = await resolveCart(identity);
  if (!cart) return EMPTY;
  const sql = getSql();
  const amount = Math.min(Math.max(Math.trunc(qty) || 0, 0), MAX_QTY_PER_LINE);
  if (amount <= 0) {
    await sql`delete from cart_items where cart_id = ${cart.id} and variant_id = ${variantId}`;
  } else {
    await sql`
      update cart_items set qty = ${amount}
       where cart_id = ${cart.id} and variant_id = ${variantId}
    `;
  }
  await sql`update carts set updated_at = now() where id = ${cart.id}`;
  return shape(cart);
}
