import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-surface font-black">
            دی
          </span>
          <span className="text-lg font-extrabold text-ink">دیجی‌تک</span>
        </Link>

        <div className="mx-auto hidden w-full max-w-md items-center gap-2 rounded-full border border-border bg-bg px-4 py-2 text-muted sm:flex">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" />
          </svg>
          <input
            readOnly
            placeholder="جستجو در کالای دیجیتال…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </div>

        <button
          type="button"
          aria-label="سبد خرید"
          className="relative mr-auto grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-ink transition hover:bg-bg sm:mr-0"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
            <path d="M6 6h15l-1.5 9h-12z" strokeLinejoin="round" />
            <circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" />
            <path d="M6 6L5 3H3" strokeLinecap="round" />
          </svg>
          <span className="absolute -top-1 -left-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-surface">
            ۳
          </span>
        </button>
      </div>
    </header>
  );
}
