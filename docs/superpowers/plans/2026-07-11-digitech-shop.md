# DigiTech Demo Store Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an independent Persian RTL electronics store (`digitech-shop`) whose index page auto-opens the AvalAgent widget, deployed to `demo-shop.avalagent.com`.

**Architecture:** Next.js 16 App Router, `src/`. A typed mock catalog (`src/data`) feeds pure presentational components. Index renders category-filterable product grid; `/product/[slug]` renders detail. A single `WidgetLoader` client component injects AvalAgent's `widget.js` and auto-opens it only on `/`. Docker + Caddy deploy on the existing Hetzner box.

**Tech Stack:** Next.js ^16, TypeScript, Tailwind CSS v4, `next/font` (Vazirmatn self-hosted), Vitest for pure-logic tests, Node 24, Docker.

## Global Constraints

- Persian only, `<html lang="fa" dir="rtl">`, mobile-first.
- Font: self-hosted **Vazirmatn** via `next/font/local`. Never Inter/Arial/Roboto.
- Cart / search / checkout are **visual only** — no state, no navigation, no payment.
- No AvalAgent source copied in — integration is the `widget.js` `<script>` ONLY.
- No external image hosts — product images bundled in `public/products/`.
- Prices are IRR integers in data; displayed as تومان with thousands separators.
- `npx tsc --noEmit` clean + `next build` passes before any commit.
- Commit format `feat:`/`fix:`/`docs:` + trailing `[Opus 4.8 High]` tag.

---

### Task 1: Scaffold Next.js project + RTL/font shell

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `src/app/globals.css`, `src/app/layout.tsx`, `src/lib/fonts.ts`, `Dockerfile`, `.dockerignore`
- Create: `public/fonts/Vazirmatn-Regular.woff2`, `Vazirmatn-Bold.woff2` (self-hosted)

**Interfaces:**
- Produces: `RootLayout` wrapping children in `<html lang="fa" dir="rtl">` with Vazirmatn `className` on `<body>`, Tailwind loaded.

- [ ] **Step 1:** `cd /Users/milad/Desktop/digitech-shop && npm init -y`, then install: `npm i next@^16 react react-dom` and `npm i -D typescript @types/react @types/node tailwindcss @tailwindcss/postcss vitest`.
- [ ] **Step 2:** Add scripts to `package.json`: `"dev":"next dev -p 4010"`, `"build":"next build"`, `"start":"next start -p 4010"`, `"test":"vitest run"`, `"typecheck":"tsc --noEmit"`.
- [ ] **Step 3:** Create `tsconfig.json` (Next 16 defaults, `"paths": {"@/*":["./src/*"]}`), `next.config.ts` with `output: 'standalone'`, `postcss.config.mjs` with `@tailwindcss/postcss`.
- [ ] **Step 4:** `src/app/globals.css`: `@import "tailwindcss";` + `:root` brand tokens (`--brand:#00C277`) + base RTL body styles.
- [ ] **Step 5:** Download Vazirmatn Regular+Bold woff2 into `public/fonts/`; `src/lib/fonts.ts` exports `vazirmatn` via `next/font/local` (both weights, `display:'swap'`, CSS var `--font-sans`).
- [ ] **Step 6:** `src/app/layout.tsx`: `<html lang="fa" dir="rtl">`, `<body className={vazirmatn.className}>{children}</body>`, export `metadata` (title «دیجی‌تک | فروشگاه کالای دیجیتال»).
- [ ] **Step 7:** Run `npx tsc --noEmit` (expect clean) and `npm run build` (expect success with an empty-ish route tree — add a temporary `src/app/page.tsx` returning `<div/>` so build passes).
- [ ] **Step 8:** Commit: `git add -A && git commit -m "feat: scaffold Next.js RTL shell + Vazirmatn font [Opus 4.8 High]"`.

---

### Task 2: Catalog data + types + IRR formatter (with tests)

**Files:**
- Create: `src/data/types.ts`, `src/data/products.ts`, `src/lib/format.ts`
- Test: `src/lib/format.test.ts`, `src/data/products.test.ts`

**Interfaces:**
- Produces:
  - `type Category = 'mobile'|'laptop'|'headphone'|'watch'|'tablet'|'accessory'`
  - `interface Product { id:string; slug:string; name:string; brand:string; category:Category; priceIRR:number; rating:number; specs:Record<string,string>; description:string; images:string[] }`
  - `const products: Product[]` (~24 items), `const categories: {key:Category; label:string}[]`
  - `getProductBySlug(slug:string): Product | undefined`, `getRelated(p:Product): Product[]` (same category, exclude self, max 4)
  - `formatToman(irr:number): string` → e.g. `formatToman(24990000)` = `"۲۴٬۹۹۰٬۰۰۰"` Persian digits + separators (toman = irr, we display the IRR number as toman value per spec).

- [ ] **Step 1: Write failing test** `src/lib/format.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { formatToman } from './format';
describe('formatToman', () => {
  it('groups thousands with Persian digits', () => {
    expect(formatToman(24990000)).toBe('۲۴٬۹۹۰٬۰۰۰');
  });
  it('handles small numbers', () => {
    expect(formatToman(500000)).toBe('۵۰۰٬۰۰۰');
  });
});
```
- [ ] **Step 2:** Run `npm test` → FAIL (module not found).
- [ ] **Step 3:** Implement `src/lib/format.ts`:
```ts
export function formatToman(irr: number): string {
  return new Intl.NumberFormat('fa-IR', { useGrouping: true }).format(irr);
}
```
- [ ] **Step 4:** Run `npm test` → PASS. (If separator char differs, assert on `fa-IR` output actual — adjust expected to match `Intl` on Node 24.)
- [ ] **Step 5:** Create `src/data/types.ts` (the `Category` + `Product` types above).
- [ ] **Step 6:** Create `src/data/products.ts` — 24 products across 6 categories (Apple iPhone 15 Pro, Samsung Galaxy S24, Xiaomi 14, MacBook Air M3, Asus ROG, AirPods Pro 2, Sony WH-1000XM5, JBL, Apple Watch S9, Galaxy Watch, iPad Air, Galaxy Tab, chargers/cases/…), each fully populated with fa name, brand, priceIRR, rating 4.0–4.9, 3–5 specs, 1–2 sentence fa description, `images:['/products/<slug>.jpg']`. Export `products`, `categories`, `getProductBySlug`, `getRelated`.
- [ ] **Step 7: Write failing test** `src/data/products.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { products, getProductBySlug, getRelated, categories } from './products';
describe('catalog', () => {
  it('has >=24 products with unique slugs', () => {
    expect(products.length).toBeGreaterThanOrEqual(24);
    expect(new Set(products.map(p => p.slug)).size).toBe(products.length);
  });
  it('every product category is a known category', () => {
    const keys = new Set(categories.map(c => c.key));
    expect(products.every(p => keys.has(p.category))).toBe(true);
  });
  it('getProductBySlug + getRelated work', () => {
    const p = products[0];
    expect(getProductBySlug(p.slug)).toEqual(p);
    expect(getRelated(p).every(r => r.category === p.category && r.id !== p.id)).toBe(true);
  });
});
```
- [ ] **Step 8:** Run `npm test` → PASS. Run `npx tsc --noEmit` → clean.
- [ ] **Step 9:** Commit: `feat: typed mock catalog + IRR toman formatter [Opus 4.8 High]`.

---

### Task 3: Presentational components (Header, Footer, Rating, Price, ProductCard)

**Files:**
- Create: `src/components/Header.tsx`, `Footer.tsx`, `Rating.tsx`, `Price.tsx`, `ProductCard.tsx`

**Interfaces:**
- Consumes: `formatToman`, `Product`.
- Produces:
  - `<Header/>` — sticky top bar: logo «دیجی‌تک», visual search input (`readOnly`), cart icon + badge (visual). `dir="rtl"`.
  - `<Footer/>` — fake links + copyright.
  - `<Rating rating={number}/>` — 5 stars, filled per rating, `dir="ltr"` on the star row.
  - `<Price irr={number}/>` — renders `formatToman(irr)` + «تومان».
  - `<ProductCard product={Product}/>` — Next `<Link href={`/product/${slug}`}>` wrapping image (`next/image`), brand, name, `<Rating/>`, `<Price/>`, visual «افزودن به سبد» button (`type=button`, no handler).

- [ ] **Step 1:** Build `Rating.tsx` + `Price.tsx` (pure, no state). Star row forced `dir="ltr"`.
- [ ] **Step 2:** Build `Header.tsx` + `Footer.tsx`. Search input `readOnly`, cart button non-functional.
- [ ] **Step 3:** Build `ProductCard.tsx` using `next/image` (configure `next.config.ts` images if needed for local — local `/public` needs no remote patterns).
- [ ] **Step 4:** Run `npx tsc --noEmit` → clean.
- [ ] **Step 5:** Commit: `feat: store presentational components [Opus 4.8 High]`.

---

### Task 4: Index page — category chips + filterable grid

**Files:**
- Create: `src/components/CategoryChips.tsx`, `src/components/ProductGrid.tsx`, `src/app/page.tsx` (replace temp stub)

**Interfaces:**
- Consumes: `products`, `categories`, `ProductCard`.
- Produces: index route rendering `<Header/>`, hero strip, `<CategoryChips/>` (client — tracks selected category), `<ProductGrid/>` (2-col→4-col responsive), `<Footer/>`.
- `CategoryChips` + grid filtering is **client-side** (`'use client'`, `useState<Category|'all'>`).

- [ ] **Step 1:** `ProductGrid.tsx` — takes `items: Product[]`, renders responsive grid of `<ProductCard/>`.
- [ ] **Step 2:** `CategoryChips.tsx` (`'use client'`) — chip row incl. «همه»; lifts selection to a parent client wrapper that filters `products` and renders `<ProductGrid/>`.
- [ ] **Step 3:** `src/app/page.tsx` — server component: `<Header/>`, hero («جدیدترین کالاهای دیجیتال»), the client filter+grid section, `<Footer/>`.
- [ ] **Step 4:** Run `npm run dev -- -p 4010`, verify index renders grid + filtering at 375px & 1280px. `npx tsc --noEmit` clean, `next build` passes.
- [ ] **Step 5:** Commit: `feat: store index with category filter + grid [Opus 4.8 High]`.

---

### Task 5: Product detail page

**Files:**
- Create: `src/app/product/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getProductBySlug`, `getRelated`, `products`, all components.
- Produces: `/product/[slug]` — `generateStaticParams` from `products`; `notFound()` on unknown slug; renders gallery, title, brand, `<Rating/>`, `<Price/>`, specs table, description, visual add-to-cart, related-products row.

- [ ] **Step 1:** Implement `page.tsx` with `generateStaticParams()` returning all slugs and `generateMetadata` (title = product name).
- [ ] **Step 2:** Render detail layout (image col + info col, responsive stack on mobile) + specs `<table>` + related `<ProductCard/>` row.
- [ ] **Step 3:** Verify `/product/<slug>` in dev + a bad slug 404s. `npx tsc --noEmit` clean, `next build` passes (static params prerender).
- [ ] **Step 4:** Commit: `feat: product detail page [Opus 4.8 High]`.

---

### Task 6: WidgetLoader — inject AvalAgent widget + auto-open on index

**Files:**
- Create: `src/components/WidgetLoader.tsx`
- Modify: `src/app/layout.tsx` (mount `<WidgetLoader/>`)
- Create: `.env.example` (`NEXT_PUBLIC_WIDGET_SRC`, `NEXT_PUBLIC_WIDGET_BUSINESS_ID`)

**Interfaces:**
- Consumes: env `NEXT_PUBLIC_WIDGET_SRC` (URL of AvalAgent `widget.js`), `NEXT_PUBLIC_WIDGET_BUSINESS_ID`.
- Produces: `<WidgetLoader/>` (`'use client'`) — injects the widget `<script>` once, passes business id via the attributes `widget.js` expects, and on `usePathname()==='/'` calls the widget's open API after load.

- [ ] **Step 1:** Read AvalAgent's `public/widget.js` (in `/Users/milad/Desktop/avalagent/public/widget.js`) to learn its embed contract — the script attributes / global init function it reads (e.g. `data-business-id`, `window.AvalAgent?.open()`), and how "open" is triggered. Record the exact attribute + open-call names.
- [ ] **Step 2:** Implement `WidgetLoader.tsx`: on mount, if no existing script, create `<script src={WIDGET_SRC} data-business-id={BUSINESS_ID} async>` and append to `body`; on `script.onload`, if `pathname === '/'`, invoke the discovered open API (guarded with optional chaining + a short `setTimeout` retry if the global isn't ready yet).
- [ ] **Step 3:** Mount `<WidgetLoader/>` at the end of `<body>` in `layout.tsx`. Add `.env.example` with the two vars documented; default `NEXT_PUBLIC_WIDGET_SRC` to the avalagent prod widget URL.
- [ ] **Step 4:** Dev-smoke with a real `NEXT_PUBLIC_WIDGET_SRC` (avalagent staging/prod widget) in `.env.local`: confirm the widget bubble appears on all pages and auto-opens on `/` only. If Phase-1 business id is unknown, the widget still loading + opening is the pass condition. `npx tsc --noEmit` clean, `next build` passes.
- [ ] **Step 5:** Commit: `feat: auto-open AvalAgent widget on store index [Opus 4.8 High]`.

---

### Task 7: Deploy config — Dockerfile, compose, Caddy, CI, DNS notes

**Files:**
- Create: `Dockerfile` (finalize), `docker-compose.yml`, `.github/workflows/deploy.yml`, `deploy/Caddyfile.snippet`, `README.md`

**Interfaces:**
- Produces: a reproducible container build + deploy path to `demo-shop.avalagent.com` mirroring avalagent's staging pattern.

- [ ] **Step 1:** Finalize multi-stage `Dockerfile` for Next 16 `output:'standalone'` (build → copy `.next/standalone` + `.next/static` + `public` → `node server.js` on port 4010).
- [ ] **Step 2:** `docker-compose.yml` — single `web` service, port map, `NEXT_PUBLIC_*` env, restart policy, joined to the box's shared/Caddy network (match avalagent staging compose networking).
- [ ] **Step 3:** `deploy/Caddyfile.snippet` — `demo-shop.avalagent.com { reverse_proxy web:4010 }` (Let's Encrypt auto via Caddy). Document adding it to the box's Caddyfile + reload.
- [ ] **Step 4:** `.github/workflows/deploy.yml` — on push to `master`: SSH to box, pull repo, `docker compose up -d --build` (model on avalagent's `deploy-staging.yml`; reuse the same secrets/host).
- [ ] **Step 5:** `README.md` — what it is, local dev (`npm run dev` → :4010), env vars, deploy steps, DNS note (CF A-record `demo-shop` → box IP `65.109.191.252`).
- [ ] **Step 6:** `npx tsc --noEmit` clean, `next build` passes, `docker build .` succeeds locally. Commit: `chore: docker + caddy + CI deploy to demo-shop subdomain [Opus 4.8 High]`.

---

### Task 8: Final smoke + push repo to org

**Files:** none (verification + repo publish)

- [ ] **Step 1:** Full local smoke at 375px + 1280px: index grid + filter, product detail, 404 on bad slug, widget bubble on all pages, auto-open on `/`.
- [ ] **Step 2:** `npm test` (all green), `npx tsc --noEmit` (clean), `next build` (pass).
- [ ] **Step 3:** `gh repo create milad1367/digitech-shop --private --source=. --remote=origin --push` (create org repo + push master).
- [ ] **Step 4:** Output to Milad: local port (4010) + exact areas/URLs to test. STOP for his review before any DNS/deploy goes live.

---

## Self-Review

- **Spec coverage:** store index+grid+price (T4) ✓ · product detail (T5) ✓ · mock 24-product catalog + images (T2, images bundled per T1/T2) ✓ · RTL + Vazirmatn (T1) ✓ · widget auto-open on index (T6) ✓ · Hetzner/Caddy/subdomain deploy (T7) ✓ · visual-only cart/search (T3) ✓ · separate repo, no avalagent source (T8, integration only via widget.js) ✓. Phase-2 agent tuning intentionally excluded per spec.
- **Placeholders:** none — every code step shows code or an exact command. Product-image assets sourced in T2 (bundled); the one true unknown is the widget embed contract, which T6 Step 1 resolves by reading the real `widget.js` before coding.
- **Type consistency:** `Product`/`Category` defined in T2 and consumed unchanged in T3–T6; `formatToman`, `getProductBySlug`, `getRelated` names stable across tasks.
