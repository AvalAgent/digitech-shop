import { ProductMedia } from "./ProductMedia";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-4 pt-10 sm:px-6 sm:pt-14 md:grid-cols-2">
        {/* copy */}
        <div className="relative z-10 text-center md:text-right">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            ارسال رایگان سفارش‌های بالای ۵ میلیون تومان
          </span>

          <h1 className="mt-5 text-4xl font-black leading-[1.15] text-ink sm:text-5xl">
            همه‌ی دنیای دیجیتال،
            <br />
            <span className="text-accent">یک‌جا.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-muted md:mx-0">
            جدیدترین موبایل، لپ‌تاپ و لوازم جانبی با تضمین اصالت. مطمئن نیستی کدام
            برایت مناسب‌تر است؟
          </p>

          {/* nudge to the AI assistant — the signature */}
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-start md:justify-start">
            <a
              href="#products"
              className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-surface transition hover:bg-ink/90"
            >
              مشاهده محصولات
            </a>
            <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-accent/50 bg-accent-soft px-4 py-3 text-sm font-medium text-accent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                <path d="M21 11.5a8.5 8.5 0 0 1-12.2 7.6L3 21l1.9-5.8A8.5 8.5 0 1 1 21 11.5z" strokeLinejoin="round" />
              </svg>
              نمی‌دونی کدوم؟ از دستیار بپرس
              <span aria-hidden className="text-base">↙</span>
            </div>
          </div>
        </div>

        {/* featured media */}
        <div className="relative">
          <div className="absolute inset-0 -z-10 translate-x-6 translate-y-6 rounded-[2.5rem] bg-accent-soft blur-2xl" />
          <div className="aspect-[4/3] overflow-hidden rounded-[2.5rem] border border-border shadow-[0_30px_60px_-30px_rgba(12,18,34,0.4)]">
            <ProductMedia
              category="mobile"
              brand="Apple"
              name="آیفون ۱۵ پرو مکس"
              image="/products/iphone-15-pro-max.jpg"
              size="detail"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
