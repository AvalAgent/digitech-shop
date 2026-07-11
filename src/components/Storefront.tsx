"use client";

import { useState } from "react";
import type { Category } from "@/data/types";
import { products, categories } from "@/data/products";
import { ProductCard } from "./ProductCard";

type Filter = Category | "all";

export function Storefront() {
  const [active, setActive] = useState<Filter>("all");
  const shown = active === "all" ? products : products.filter((p) => p.category === active);

  const chips: { key: Filter; label: string }[] = [
    { key: "all", label: "همه" },
    ...categories.map((c) => ({ key: c.key as Filter, label: c.label })),
  ];

  return (
    <section id="products" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-ink">محصولات</h2>
          <p className="mt-1 text-sm text-muted">
            {new Intl.NumberFormat("fa-IR").format(shown.length)} کالا
          </p>
        </div>
      </div>

      {/* category chips — horizontal scroll on mobile */}
      <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {chips.map((c) => {
          const on = active === c.key;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setActive(c.key)}
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

      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {shown.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
