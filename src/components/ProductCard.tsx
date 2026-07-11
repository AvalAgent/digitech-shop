import Link from "next/link";
import type { Product } from "@/data/types";
import { ProductMedia } from "./ProductMedia";
import { Rating } from "./Rating";
import { Price } from "./Price";

export function ProductCard({ product }: { product: Product }) {
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
        <Rating rating={product.rating} />
        <div className="mt-auto flex items-center justify-between pt-2">
          <Price irr={product.priceIRR} />
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-full bg-ink text-surface transition group-hover:bg-accent"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
