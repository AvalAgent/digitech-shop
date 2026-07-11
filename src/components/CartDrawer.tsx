"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatToman } from "@/lib/format";

export function CartDrawer() {
  const { items, totalIRR, isOpen, close, setQty, remove, clear } = useCart();
  const [ordered, setOrdered] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-label="سبد خرید">
      {/* backdrop */}
      <button
        type="button"
        aria-label="بستن"
        onClick={() => { close(); setOrdered(false); }}
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
      />

      {/* panel — slides from the left in RTL */}
      <div className="absolute left-0 top-0 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-extrabold text-ink">سبد خرید</h2>
          <button
            type="button"
            onClick={() => { close(); setOrdered(false); }}
            aria-label="بستن سبد"
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-ink transition hover:bg-bg"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {ordered ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-7 w-7">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="text-base font-extrabold text-ink">سفارش ثبت شد</p>
            <p className="text-sm leading-6 text-muted">
              این یک فروشگاه نمایشی است — سفارش واقعی ثبت نمی‌شود.
            </p>
            <button
              type="button"
              onClick={() => { setOrdered(false); close(); }}
              className="mt-2 rounded-full bg-ink px-6 py-2.5 text-sm font-bold text-surface"
            >
              بازگشت به فروشگاه
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="text-sm font-bold text-ink">سبد خرید خالی است.</p>
            <p className="text-sm text-muted">از فروشگاه محصولی اضافه کن.</p>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {items.map((i) => (
                <li key={i.variantId} className="flex gap-3 py-4">
                  <Link
                    href={`/product/${i.slug}`}
                    onClick={close}
                    className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-white"
                  >
                    {i.image && (
                      <Image src={i.image} alt={i.name} fill sizes="64px" className="object-contain p-1.5" />
                    )}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-bold text-ink">{i.name}</span>
                    <span className="mt-0.5 text-xs text-muted">{i.variantLabel}</span>
                    <div className="mt-auto flex items-center justify-between pt-1">
                      <div dir="ltr" className="flex items-center gap-2 rounded-full border border-border px-2 py-1">
                        <button type="button" aria-label="کمتر" onClick={() => setQty(i.variantId, i.qty - 1)} className="grid h-5 w-5 place-items-center text-ink">−</button>
                        <span className="min-w-4 text-center text-sm font-bold text-ink">
                          {new Intl.NumberFormat("fa-IR").format(i.qty)}
                        </span>
                        <button type="button" aria-label="بیشتر" onClick={() => setQty(i.variantId, i.qty + 1)} className="grid h-5 w-5 place-items-center text-ink">+</button>
                      </div>
                      <span className="text-sm font-bold text-ink">
                        {formatToman(i.priceIRR * i.qty)} <span className="text-xs font-normal text-muted">تومان</span>
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`حذف ${i.name}`}
                    onClick={() => remove(i.variantId)}
                    className="self-start text-muted transition hover:text-ink"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4.5 w-4.5">
                      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t border-border px-5 py-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-muted">جمع کل</span>
                <span className="text-lg font-extrabold text-ink">
                  {formatToman(totalIRR)} <span className="text-xs font-normal text-muted">تومان</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => { setOrdered(true); clear(); }}
                className="w-full rounded-full bg-ink py-3 text-sm font-bold text-surface transition hover:bg-accent"
              >
                ثبت سفارش
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
