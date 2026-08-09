"use client";

import Link from "next/link";
import type { Product } from "@/data/types";
import { useCart, variantLabel } from "@/lib/cart";
import { ProductMedia } from "./ProductMedia";
import { Rating } from "./Rating";
import { Price } from "./Price";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  function addDefault(e: React.MouseEvent) {
    // the card itself is a link — don't navigate when adding
    e.preventDefault();
    e.stopPropagation();
    const v =
      product.variants.find((x) => x.priceIRR === product.priceIRR && x.stock > 0) ??
      product.variants.find((x) => x.stock > 0) ??
      product.variants[0];
    void add(v.id);
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-16px_rgba(12,18,34,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <div className="aspect-square">
        <ProductMedia
          category={product.category}
          brand={product.brand}
          name={product.name}
          image={product.images[0]}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-[11px] font-medium text-muted">{product.brand}</span>
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-6 text-ink">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <Rating rating={product.rating} />
          {product.variants.length > 1 && (
            <span className="rounded-full bg-bg px-2 py-0.5 text-[10px] font-medium text-muted">
              {new Intl.NumberFormat("fa-IR").format(product.variants.length)} مدل
            </span>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <Price irr={product.priceIRR} from={product.variants.length > 1} />
          <button
            type="button"
            aria-label={`افزودن ${product.name} به سبد`}
            onClick={addDefault}
            className="grid h-9 w-9 place-items-center rounded-full bg-ink text-surface transition hover:bg-accent"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}
