import type { Category } from "@/data/types";

/** Clean line-art device glyph per category. Inherits currentColor. */
export function DeviceIcon({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (category) {
    case "mobile":
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <rect x="16" y="6" width="16" height="36" rx="3.5" />
          <line x1="21" y1="9.5" x2="27" y2="9.5" />
          <line x1="22" y1="38" x2="26" y2="38" />
        </svg>
      );
    case "laptop":
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <rect x="11" y="12" width="26" height="18" rx="2" />
          <path d="M7 34h34l-2 4H9z" />
        </svg>
      );
    case "headphone":
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <path d="M12 26v-2a12 12 0 0 1 24 0v2" />
          <rect x="9" y="26" width="6" height="12" rx="3" />
          <rect x="33" y="26" width="6" height="12" rx="3" />
        </svg>
      );
    case "watch":
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <rect x="16" y="16" width="16" height="16" rx="4.5" />
          <path d="M19 16l1.5-6h7L28 16M19 32l1.5 6h7L28 32" />
        </svg>
      );
    case "tablet":
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="8" width="24" height="32" rx="3" />
          <line x1="22" y1="35" x2="26" y2="35" />
        </svg>
      );
    case "accessory":
    default:
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <path d="M24 6v10" />
          <rect x="18" y="16" width="12" height="9" rx="2" />
          <path d="M24 25v9a5 5 0 0 1-5 5h-2" />
        </svg>
      );
  }
}
