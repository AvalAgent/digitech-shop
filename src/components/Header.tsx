import Link from "next/link";

export function Header() {
  return (
    <header className="site-header sticky top-0 z-40">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="brand-mark shrink-0" aria-label="دیجی تک، صفحه اصلی">
          <span>دی</span><b>جی‌تک</b>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-paper/60 md:flex">
          <a href="#products" className="nav-link">فروشگاه</a>
          <a href="#guide" className="nav-link">راهنمای انتخاب</a>
          <a href="#story" className="nav-link">مجله دیجیتال</a>
        </nav>
        <button type="button" className="search-trigger mr-auto hidden items-center gap-2 md:flex" aria-label="جستجو">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
          <span>جستجو</span><kbd>⌘ K</kbd>
        </button>
        <button type="button" aria-label="سبد خرید" className="cart-trigger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5"><path d="M6 6h15l-1.5 9h-12z" strokeLinejoin="round"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M6 6 5 3H3" strokeLinecap="round"/></svg>
          <span>۳</span>
        </button>
      </div>
    </header>
  );
}
