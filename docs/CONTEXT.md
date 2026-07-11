# digitech-shop — Project Journal

> Simulated "customer" store for the AvalAgent sales-agent demo. Newest entries first.

## 2026-07-11 — Store built, deployed, catalog + API + cart live

**What this is:** دیجی‌تک — a fake-but-realistic Persian electronics store, built as if it were a real AvalAgent customer. Phase 2 (NOT done): seed a demo business in avalagent, load this catalog as its KB, point the widget at it → sales agent demo.

**Live:** https://preview-shop.avalagent.com (custom domain) · https://digitech-shop.vercel.app
**Repo:** github.com/AvalAgent/digitech-shop (transferred from milad1367)

### Infra / deploy
- **Vercel** project `mili01dev/digitech-shop` (team mili01dev). Deploy = `vercel --prod --yes` from repo root.
- **Auto-deploy on push NOT wired** — Vercel GitHub app has no access to the `AvalAgent` org. Grant at github.com/apps/vercel → Configure → AvalAgent. Until then: CLI deploys only.
- **DNS:** Cloudflare CNAME `preview-shop` → `cname.vercel-dns.com` (unproxied). Created via CF API (token lives in avalagent's `.env.local`: `CLOUDFLARE_API_TOKEN`).
- ⚠️ **Vercel auto bot-challenge:** rapid curl polling against the custom domain triggers `x-vercel-mitigated: challenge` (403) for ~15 min. Poll politely (≥1/min). When avalagent's agent consumes the API server-side, add Vercel **Protection Bypass for Automation** header (`x-vercel-protection-bypass`) or a WAF bypass rule for `/api/*`.

### Catalog (no DB — in-repo JSON behind an API)
- `scripts/generate-catalog.mjs` (seeded RNG, deterministic) → `src/data/catalog.json`: **64 products / 429 variants** (storage × color, per-variant price+stock, min stock 3 so demo never blocks). Output order interleaves categories round-robin so «همه» shows a mix.
- `scripts/fetch-images.mjs` → real per-model photos from **Digikala public search API** (`api.digikala.com/v1/categories/<cat>/search/?q=`) into `public/products/<model-slug>.jpg`, resized 800px via `sips`. Variants share the model photo. Idempotent (skips existing).
- Regen flow: fetch-images → generate-catalog → build.

### API (the seam avalagent will consume — CORS `*`)
- `GET /api/products?q=&category=&brand=&minPrice=&maxPrice=&sort=&page=&limit=` → `{items,total,page,limit,hasMore}` (items include nested `variants`)
- `GET /api/products/:slug` · `GET /api/categories` (with counts)
- Storefront itself fetches this API over HTTP (headless-shop pattern) — search/sort/filter/pagination all server-side in `src/lib/catalog.ts` (single query path for UI + API). Search haystack includes name/brand/category-label/specs/variant terms.

### Widget (dark until Phase 2)
- `src/components/WidgetLoader.tsx` — env-gated (`NEXT_PUBLIC_WIDGET_SRC`, `NEXT_PUBLIC_WIDGET_BUSINESS_ID`); no-ops when unset.
- avalagent `widget.js` contract: reads `data-business-id` via `document.currentScript` → inject with `async=false`; no public open API → auto-open on `/` = click `#smflow-fab` once mounted (250ms retry loop).

### UX decisions (Milad-driven)
- **One card per model** — variants NEVER listed as separate cards (was the big complaint). Card shows «از …» price + «N مدل» badge; product page has حافظه/رنگ picker with per-variant price/stock.
- **Cart is real:** localStorage (`digitech-cart-v1`), add = silent + badge pop (no drawer popup), drawer opens only from basket icon, animated slide/fade, qty ±, «ثبت سفارش» → demo confirmation.
- **Header search is real:** Enter → `/?q=…#products`, grid synced via `useSearchParams` (Suspense-wrapped). Desktop-only (`sm:flex`) as of now.
- JSON-LD (schema.org Product + AggregateOffer) on product pages, sitemap.xml (64 URLs), robots.txt.

### Pending (Phase 2 — needs Milad's go)
1. Seed demo business in avalagent DB + KB from this catalog; set widget env vars → agent lights up on index.
2. Vercel GitHub app → AvalAgent org (auto-deploy).
3. Protection-bypass header for agent API calls.
