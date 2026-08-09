"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";

/**
 * Phone sign-in — the store's own identity, the same key the chat agent uses.
 *
 * Iranian stores log people in by mobile number, so that number IS the customer.
 * Signing in here merges whatever the shopper collected as a guest into their
 * customer basket, and from then on the web page and the Telegram/Bale agent are
 * looking at ONE cart.
 *
 * Demo store: no OTP — a real store would verify the number before trusting it.
 */
export function SignIn() {
  const { phone, signIn, signOut } = useCart();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) {
      setValue("");
      setError(null);
    }
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const ok = await signIn(value);
    setBusy(false);
    if (!ok) {
      setError("شماره موبایل معتبر نیست. مثل ۰۹۱۲۱۲۳۴۵۶۷ وارد کن.");
      return;
    }
    setOpen(false);
  }

  if (phone) {
    return (
      <button
        type="button"
        onClick={signOut}
        title="خروج"
        className="hidden shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-bold text-ink transition hover:bg-bg sm:flex"
      >
        <span dir="ltr">{phone}</span>
        <span className="text-muted">خروج</span>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shrink-0 rounded-full border border-border px-4 py-2 text-xs font-bold text-ink transition hover:bg-bg"
      >
        ورود
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="ورود به حساب"
          onClick={() => setOpen(false)}
        >
          <form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6"
          >
            <h2 className="text-lg font-extrabold text-ink">ورود با شماره موبایل</h2>
            <p className="mt-1 text-xs leading-6 text-muted">
              سبد خریدت با همین شماره همه‌جا یکی می‌شود — سایت، تلگرام و بله.
            </p>

            <input
              dir="ltr"
              inputMode="tel"
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="09121234567"
              className="mt-4 w-full rounded-xl border border-border bg-bg p-3 text-center text-base text-ink outline-none transition focus:border-ink/30"
            />
            {error ? (
              <p role="alert" className="mt-2 text-xs leading-6 text-red-600">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="mt-4 w-full rounded-full bg-accent py-3 text-sm font-extrabold text-surface transition hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "…" : "ورود"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-2 w-full py-2 text-xs text-muted"
            >
              بعداً
            </button>
          </form>
        </div>
      )}
    </>
  );
}
