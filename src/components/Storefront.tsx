"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Category, Product } from "@/data/types";
import { categories } from "@/data/products";
import { ProductCard } from "./ProductCard";

type Filter = Category | "";
type Sort = "newest" | "price-asc" | "price-desc" | "rating";

interface ApiPage {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

const LIMIT = 24;

const SORT_OPTIONS: { key: Sort; label: string }[] = [
  { key: "newest", label: "جدیدترین" },
  { key: "price-asc", label: "ارزان‌ترین" },
  { key: "price-desc", label: "گران‌ترین" },
  { key: "rating", label: "پرامتیازترین" },
];

/** Storefront consumes the store's own catalog API — like any headless shop. */
export function Storefront() {
  const searchParams = useSearchParams();
  const urlQ = searchParams.get("q") ?? "";
  const [q, setQ] = useState(urlQ);

  // header search navigates to /?q=… — follow it
  useEffect(() => {
    setQ(urlQ);
  }, [urlQ]);
  const [category, setCategory] = useState<Filter>("");
  const [sort, setSort] = useState<Sort>("newest");
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const requestId = useRef(0);

  const load = useCallback(
    async (nextPage: number, append: boolean) => {
      const id = ++requestId.current;
      setLoading(true);
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(LIMIT),
        sort,
      });
      if (q.trim()) params.set("q", q.trim());
      if (category) params.set("category", category);

      try {
        const res = await fetch(`/api/products?${params}`);
        const data: ApiPage = await res.json();
        if (id !== requestId.current) return; // stale response
        setItems((prev) => (append ? [...prev, ...data.items] : data.items));
        setTotal(data.total);
        setHasMore(data.hasMore);
        setPage(data.page);
      } catch {
        if (id === requestId.current) setHasMore(false);
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [q, category, sort],
  );

  // reload on filter/search/sort change (debounced for typing)
  useEffect(() => {
    const t = setTimeout(() => load(1, false), q ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  const chips: { key: Filter; label: string }[] = [
    { key: "", label: "همه" },
    ...categories.map((c) => ({ key: c.key as Filter, label: c.label })),
  ];

  return (
    <section id="products" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-ink">محصولات</h2>
          <p className="mt-1 text-sm text-muted" aria-live="polite">
            {loading && items.length === 0
              ? "در حال بارگذاری…"
              : `${new Intl.NumberFormat("fa-IR").format(total)} کالا`}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* search — hits /api/products?q= */}
          <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0 text-muted">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جستجو… مثلاً آیفون ۲۵۶"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted sm:w-52"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="مرتب‌سازی"
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-ink outline-none"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* category chips — horizontal scroll on mobile */}
      <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {chips.map((c) => {
          const on = category === c.key;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setCategory(c.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                on
                  ? "bg-ink text-surface"
                  : "border border-border bg-surface text-ink hover:border-ink/30"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {items.length === 0 && !loading ? (
        <div className="rounded-3xl border border-border bg-surface py-16 text-center">
          <p className="text-sm font-medium text-ink">کالایی مطابق جستجو پیدا نشد.</p>
          <p className="mt-1 text-sm text-muted">عبارت دیگری را امتحان کن یا دسته را عوض کن.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => load(page + 1, true)}
            disabled={loading}
            className="rounded-full border border-border bg-surface px-8 py-3 text-sm font-bold text-ink transition hover:border-ink/40 disabled:opacity-50"
          >
            {loading ? "در حال بارگذاری…" : "نمایش بیشتر"}
          </button>
        </div>
      )}
    </section>
  );
}
