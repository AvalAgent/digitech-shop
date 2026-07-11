import type { Category } from "@/data/types";
import { categoryMeta } from "@/data/products";
import { DeviceIcon } from "./DeviceIcon";

/** Duotone gradient panel with a large device glyph — stands in for a product photo. */
export function ProductMedia({
  category,
  brand,
  size = "card",
}: {
  category: Category;
  brand: string;
  size?: "card" | "detail";
}) {
  const meta = categoryMeta(category);
  const iconSize = size === "detail" ? "h-32 w-32 sm:h-44 sm:w-44" : "h-20 w-20";

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(120% 120% at 30% 0%, ${meta.from} 0%, ${meta.to} 100%)`,
      }}
    >
      <div
        aria-hidden
        className="absolute -left-6 -top-6 h-24 w-24 rounded-full opacity-40 blur-2xl"
        style={{ background: meta.to }}
      />
      <DeviceIcon category={category} className={`${iconSize} text-ink/70`} />
      <span className="absolute bottom-3 right-4 text-[11px] font-medium tracking-wide text-ink/45">
        {brand}
      </span>
    </div>
  );
}
