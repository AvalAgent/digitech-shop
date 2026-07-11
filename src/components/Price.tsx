import { formatToman } from "@/lib/format";

export function Price({
  irr,
  size = "md",
}: {
  irr: number;
  size?: "md" | "lg";
}) {
  return (
    <div className="flex items-baseline gap-1">
      <span
        className={
          size === "lg"
            ? "text-2xl font-extrabold text-ink"
            : "text-base font-bold text-ink"
        }
      >
        {formatToman(irr)}
      </span>
      <span className="text-xs text-muted">تومان</span>
    </div>
  );
}
