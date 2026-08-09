"use client";

import { useMemo, useState } from "react";
import type { Product, Variant } from "@/data/types";
import { useCart, variantLabel } from "@/lib/cart";
import { formatToman } from "@/lib/format";

/** Storage/color selector + live price + working add-to-cart. */
export function VariantPicker({ product }: { product: Product }) {
  const { add } = useCart();
  const variants = product.variants;

  const storages = useMemo(
    () => [...new Set(variants.map((v) => v.storage).filter(Boolean))] as string[],
    [variants],
  );
  const colors = useMemo(
    () => [...new Set(variants.map((v) => v.color).filter(Boolean))] as string[],
    [variants],
  );

  const defaultVariant =
    variants.find((v) => v.priceIRR === product.priceIRR && v.stock > 0) ??
    variants.find((v) => v.stock > 0) ??
    variants[0];

  const [storage, setStorage] = useState<string | undefined>(defaultVariant.storage);
  const [color, setColor] = useState<string | undefined>(defaultVariant.color);

  const selected: Variant =
    variants.find((v) => v.storage === storage && v.color === color) ??
    variants.find((v) => v.storage === storage) ??
    defaultVariant;

  const out = selected.stock <= 0;

  return (
    <div className="flex flex-col gap-4">
      {storages.length > 1 && (
        <div>
          <span className="mb-2 block text-sm font-bold text-ink">حافظه</span>
          <div className="flex flex-wrap gap-2">
            {storages.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStorage(s)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  storage === s
                    ? "bg-ink text-surface"
                    : "border border-border bg-surface text-ink hover:border-ink/30"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {colors.length > 1 && (
        <div>
          <span className="mb-2 block text-sm font-bold text-ink">رنگ</span>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  color === c
                    ? "bg-ink text-surface"
                    : "border border-border bg-surface text-ink hover:border-ink/30"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-ink">
              {formatToman(selected.priceIRR)}
            </span>
            <span className="text-xs text-muted">تومان</span>
          </div>
          <span className={`mt-1 block text-xs ${out ? "text-red-500" : "text-muted"}`}>
            {out
              ? "ناموجود"
              : `موجود در انبار (${new Intl.NumberFormat("fa-IR").format(selected.stock)} عدد)`}
          </span>
        </div>
        <button
          type="button"
          disabled={out}
          onClick={() =>
            void add(selected.id)
          }
          className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-surface transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          افزودن به سبد خرید
        </button>
      </div>
    </div>
  );
}
