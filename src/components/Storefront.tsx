"use client";

import { useState } from "react";
import type { Category } from "@/data/types";
import { products, categories } from "@/data/products";
import { ProductCard } from "./ProductCard";

type Filter = Category | "all";

export function Storefront() {
  const [active, setActive] = useState<Filter>("all");
  const shown = active === "all" ? products : products.filter((p) => p.category === active);
  const chips: { key: Filter; label: string }[] = [{ key: "all", label: "همه کالاها" }, ...categories.map((c) => ({ key: c.key, label: c.label }))];

  return (
    <section id="products" className="catalogue-shell">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="catalogue-heading">
          <div><span className="section-label">SELECTED OBJECTS / 02</span><h2>چیزهایی برای<br /><em>زندگی دیجیتال.</em></h2></div>
          <p>انتخاب‌های ما، برای این‌که میان انبوه مشخصات فنی، انتخاب ساده‌تر شود.</p>
        </div>
        <div className="filter-rail" role="tablist" aria-label="دسته‌بندی محصولات">
          {chips.map((chip) => <button key={chip.key} onClick={() => setActive(chip.key)} className={active === chip.key ? "is-active" : ""} type="button">{chip.label}</button>)}
        </div>
        <div className="product-grid mt-9">
          {shown.map((product, index) => <div key={product.id} className="product-reveal" style={{ animationDelay: `${Math.min(index * 45, 300)}ms` }}><ProductCard product={product} /></div>)}
        </div>
      </div>
    </section>
  );
}
