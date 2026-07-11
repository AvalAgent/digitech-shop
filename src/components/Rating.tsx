export function Rating({ rating }: { rating: number }) {
  return (
    <div dir="ltr" className="inline-flex items-center gap-1 text-amber">
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
        <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L10 14.8l-5.2 2.72.99-5.8L1.58 7.62l5.82-.85z" />
      </svg>
      <span className="text-xs font-medium text-ink/70">
        {new Intl.NumberFormat("fa-IR").format(rating)}
      </span>
    </div>
  );
}
