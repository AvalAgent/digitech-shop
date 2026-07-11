export function Footer() {
  const cols = [
    { title: "خرید", links: ["موبایل", "لپ‌تاپ", "هدفون", "ساعت هوشمند"] },
    { title: "دیجی‌تک", links: ["درباره ما", "تماس با ما", "فرصت‌های شغلی"] },
    { title: "پشتیبانی", links: ["پیگیری سفارش", "بازگشت کالا", "سوالات متداول"] },
  ];
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-surface font-black">دی</span>
              <span className="text-lg font-extrabold text-ink">دیجی‌تک</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-6 text-muted">
              فروشگاه آنلاین کالای دیجیتال، با تضمین اصالت و ارسال سریع به سراسر ایران.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="mb-3 text-sm font-bold text-ink">{c.title}</h4>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <span className="cursor-pointer text-sm text-muted transition hover:text-ink">{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted">
          © ۱۴۰۴ دیجی‌تک — تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}
