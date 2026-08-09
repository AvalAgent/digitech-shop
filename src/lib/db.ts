import { neon } from "@neondatabase/serverless";

/**
 * Neon Postgres — the store's own database (provisioned via Vercel Marketplace).
 *
 * The cart used to live in a process Map, which meant a serverless instance
 * swap could show a shopper an empty basket right after a successful add. It
 * also made the cart per-conversation instead of per-customer. Both go away
 * once the store keeps real state: the cart belongs to a CUSTOMER, and a
 * customer is identified by their phone number — the same key an Iranian store
 * logs people in with.
 *
 * Lazy init: `neon()` throws when DATABASE_URL is unset, and Next.js evaluates
 * top-level module code at build time.
 */
type Sql = ReturnType<typeof neon>;

let _sql: Sql | null = null;

export function getSql(): Sql {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    _sql = neon(url);
  }
  return _sql;
}

/** True when the store has a database wired — lets routes degrade honestly. */
export function hasDb(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
