"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { formatToman } from "@/lib/format";
import type { CartLine } from "@/lib/server-cart";

/**
 * /checkout?cart=<uuid> — where the chat agent's «مشاهده سبد و ادامه خرید» link
 * lands. The id is the cart's own opaque uuid (never the shopper's phone), and
 * the basket is read live from the store's database, so the link renders the
 * same cart no matter which channel filled it or which instance serves it.
 */
function CheckoutInner() {
  const params = useSearchParams();
  const cartId = params.get("cart") ?? "";
  const [lines, setLines] = useState<CartLine[] | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!cartId) {
      setLines([]);
      return;
    }

    fetch(`/api/cart?cart=${encodeURIComponent(cartId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled) setLines(data?.cart?.items ?? []);
      })
      .catch(() => {
        if (!cancelled) setLines([]);
      });

    return () => {
      cancelled = true;
    };
  }, [cartId]);

  const total = (lines ?? []).reduce((s, i) => s + i.priceIRR * i.qty, 0);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold text-ink">تسویه حساب</h1>

        {lines === null ? (
          <p className="mt-6 text-muted">در حال بارگذاری سبد…</p>
        ) : lines.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-border bg-surface p-6 text-center">
            <p className="text-ink font-bold">سبدی برای این لینک پیدا نشد.</p>
            <p className="mt-1 text-sm text-muted">ممکن است منقضی شده باشد.</p>
            <Link href="/" className="mt-4 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-surface">
              بازگشت به فروشگاه
            </Link>
          </div>
        ) : done ? (
          <div className="mt-6 rounded-2xl border border-border bg-surface p-8 text-center">
            <p className="text-3xl">🎉</p>
            <p className="mt-2 text-lg font-extrabold text-ink">سفارش شما ثبت شد!</p>
            <p className="mt-1 text-sm text-muted">
              این یک فروشگاه نمایشی است — پرداختی انجام نشد.
            </p>
            <Link href="/" className="mt-5 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-surface">
              بازگشت به فروشگاه
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
              {lines.map((line) => (
                <li key={line.variantId} className="flex items-center gap-4 p-4">
                  {line.image ? (
                    <Image
                      src={line.image}
                      alt={line.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-xl border border-border object-cover"
                    />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-ink">{line.name}</p>
                    <p className="text-xs text-muted">{line.variantLabel} × {line.qty.toLocaleString("fa-IR")}</p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-ink">
                    {formatToman(line.priceIRR * line.qty)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4">
              <span className="font-bold text-ink">جمع کل</span>
              <span className="text-lg font-extrabold text-ink">{formatToman(total)}</span>
            </div>

            <button
              type="button"
              onClick={() => setDone(true)}
              className="w-full rounded-full bg-accent py-3.5 text-base font-extrabold text-surface transition hover:opacity-90"
            >
              ثبت سفارش
            </button>
          </div>
        )}
      </main>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutInner />
    </Suspense>
  );
}
