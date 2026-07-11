# دیجی‌تک (DigiTech) — Demo Electronics Store + Auto-Open AvalAgent Widget

**Date:** 2026-07-11
**Status:** Approved (Milad, 2026-07-11)
**Repo:** `milad1367/digitech-shop` (new, independent — NOT a fork of avalagent)
**Deploy:** `demo-shop.avalagent.com` (Hetzner box, Docker + Caddy + Let's Encrypt)

## Purpose

A believable, standalone Persian electronics shop — built as if it were a real
customer's site. Its job is to be the host for the **AvalAgent sales-agent demo**:
the AvalAgent web widget **auto-opens on the store index** so a visitor immediately
sees the AI, asks for a product, and (Phase 2) gets a recommendation from the
catalog.

The store is treated as a **completely separate project**. No AvalAgent source is
copied in — the only link is the widget `<script>` tag. Later we "give service to it"
by wiring the sales agent.

## Non-Goals (now)

- No real cart / checkout / payment (cart + add-to-cart buttons are **visual only**).
- No real inventory, accounts, or admin.
- No Digikala live scraping (fragile) — curated **mock** catalog instead.
- Phase-2 sales-agent tuning (KB + prompt) is **out of scope** for this spec; the
  widget is embedded and auto-opens, pointed at a seed business.

## Stack

- **Next.js 16**, TypeScript, Tailwind CSS, App Router, `src/` directory.
- Persian, **RTL** (`<html lang="fa" dir="rtl">`), mobile-first.
- Self-hosted **Vazirmatn** font via `next/font`.
- Node 24. Deployed as a Docker container on the Hetzner box.

## Pages

### `/` — Store index (the star)
- **Header:** logo (دیجی‌تک), search bar (visual only), cart icon w/ badge (visual only).
- **Category chips:** موبایل · لپ‌تاپ · هدفون و ایرپاد · ساعت هوشمند · تبلت · لوازم جانبی.
  Clicking filters the grid client-side.
- **Product grid** (responsive: 2-col mobile → 4-col desktop). Each card:
  image, brand, name (fa), price in تومان, rating stars, «افزودن به سبد» button (visual).
- **AvalAgent widget auto-opens here on load.**

### `/product/[id]` — Product detail
- Image gallery, title, brand, price, star rating.
- Specs table (fa keys/values), description paragraph.
- «افزودن به سبد» (visual) + related-products row (same category).

### Shared
- Header + footer on every page. Footer: fake links (درباره ما / تماس / قوانین),
  copyright. Widget `<script>` on every page; auto-open only on index.

## Data

- **Mock catalog** in-repo: `src/data/products.ts` — ~24 famous electronics across
  the 6 categories. Brands: Apple, Samsung, Xiaomi, Sony, Asus, JBL, etc.
- Each product: `id`, `slug`, `name` (fa), `brand`, `category`, `priceIRR`,
  `rating`, `specs` (record), `description` (fa), `images` (local paths).
- **Images:** bundled locally in `public/products/` (royalty-free / placeholder),
  so nothing depends on an external host that could break. Realistic-looking, but
  not claiming to be the real brand's official asset.
- Prices realistic Iranian-market IRR values (displayed as تومان with thousands
  separators).

## Widget Integration

- Embed AvalAgent's `public/widget.js` via a `<script>` snippet in the root layout.
- Configure it to **auto-open on the index route** (widget's own open API / a small
  inline init script gated to `pathname === '/'`).
- **Phase 1 (this build):** widget present + auto-opens, pointed at a seeded demo
  business id. May answer generically — that's fine.
- **Phase 2 (later, on Milad's go):** turn that business into the sales agent —
  KB = these 24 products, prompt: "understand need → recommend 1-3 from catalog →
  show price → nudge to buy, never invent products."

## Deploy

- Own repo, own CI deploy workflow (mirrors avalagent's `deploy-staging.yml` pattern):
  build Docker image → run on Hetzner box.
- DNS: Cloudflare A-record `demo-shop.avalagent.com` → box.
- Caddy block for the subdomain + Let's Encrypt cert (tls-alpn-01), same as the
  existing `staging.avalagent.com` setup.
- Auto-deploy from `master` of the new repo.

## Architecture / Structure

```
digitech-shop/
  src/
    app/
      layout.tsx           # <html fa/rtl>, font, header/footer, widget script
      page.tsx             # index: category chips + product grid + widget auto-open
      product/[slug]/page.tsx
    components/
      Header.tsx  Footer.tsx
      ProductCard.tsx  ProductGrid.tsx  CategoryChips.tsx
      Rating.tsx  Price.tsx
      WidgetLoader.tsx     # injects widget.js + auto-open on '/'
    data/
      products.ts          # mock catalog + category list
      types.ts
    lib/
      format.ts            # IRR → تومان formatting
  public/
    products/              # bundled product images
  Dockerfile
  .github/workflows/deploy.yml
```

Each component has one job, is understandable in isolation, and depends only on the
mock data + format helper. The widget loader is the single integration seam with
AvalAgent.

## Testing

- `npx tsc --noEmit` clean.
- Build passes (`next build`).
- Manual smoke at 375px + 1280px: index grid, category filter, product detail,
  widget auto-opens on index.

## Open items for Phase 2 (tracked, not built now)

- Seed demo business in AvalAgent DB; get its widget/business id.
- Load the 24 products as the business KB.
- Tune sales-agent prompt.
- Point the widget script at that business id.
