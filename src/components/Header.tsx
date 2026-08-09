"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { SignIn } from "@/components/SignIn";

export function Header() {
  const { count, open, remoteAddSeq } = useCart();
  const router = useRouter();
  const [q, setQ] = useState("");
  // Celebrate only adds that came from the chat agent — an in-page add already
  // has its own click feedback, and a doubled animation reads as a bug.
  const [celebrate, setCelebrate] = useState(0);

  useEffect(() => {
    if (remoteAddSeq === 0) return;
    setCelebrate(remoteAddSeq);
    const timer = setTimeout(() => setCelebrate(0), 1200);
    return () => clearTimeout(timer);
  }, [remoteAddSeq]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/?q=${encodeURIComponent(term)}#products` : "/#products");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-surface font-black">
            دی
          </span>
          <span className="text-lg font-extrabold text-ink">دیجی‌تک</span>
        </Link>

        <form
          onSubmit={submit}
          className="mx-auto hidden w-full max-w-md items-center gap-2 rounded-full border border-border bg-bg px-4 py-2 text-muted focus-within:border-ink/30 sm:flex"
        >
          <button type="submit" aria-label="جستجو" className="shrink-0 text-muted transition hover:text-ink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" />
            </svg>
          </button>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجو در کالای دیجیتال…"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          />
        </form>

        <SignIn />

        <button
          type="button"
          aria-label="سبد خرید"
          onClick={open}
          className={`relative mr-auto grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-ink transition hover:bg-bg sm:mr-0${
            celebrate ? " animate-cart-ring" : ""
          }`}
        >
          {celebrate > 0 && (
            <span
              // namespaced: the count badge below is also keyed by a number,
              // and a bare `celebrate` collides with it whenever they match
              key={`plus-${celebrate}`}
              aria-hidden
              className="animate-cart-plus-one pointer-events-none absolute -top-3 -left-2 text-xs font-black text-accent"
            >
              ۱+
            </span>
          )}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
            <path d="M6 6h15l-1.5 9h-12z" strokeLinejoin="round" />
            <circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" />
            <path d="M6 6L5 3H3" strokeLinecap="round" />
          </svg>
          {count > 0 && (
            <span
              key={`count-${count}`}
              className="animate-badge-pop absolute -top-1 -left-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-surface"
            >
              {new Intl.NumberFormat("fa-IR").format(count)}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
