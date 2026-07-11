import Link from "next/link";
import { DeviceIcon } from "./DeviceIcon";

const specs = ["A17 Pro", "48MP", "USB-C"];

export function Hero() {
  return (
    <section className="hero-shell relative overflow-hidden pb-12 pt-8 sm:pb-20 sm:pt-14">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="hero-orbit hero-orbit-one" />
      <div className="hero-orbit hero-orbit-two" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:min-h-[640px] lg:grid-cols-[1.05fr_.95fr] lg:gap-8">
        <div className="hero-copy relative z-10 pt-4 text-center lg:text-right">
          <div className="hero-kicker mx-auto lg:mx-0">
            <span className="hero-kicker-pulse" />
            انتخاب تازه این هفته
            <span className="font-mono text-[10px] tracking-[0.16em] text-lime/70">/ 01</span>
          </div>
          <h1 className="mt-7 text-[clamp(3rem,7vw,6.8rem)] font-black leading-[.94] tracking-[-0.07em] text-paper">
            تکنولوژی،
            <br />
            <span className="hero-outline">برای امروز.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-md text-base leading-8 text-paper/60 lg:mx-0">
            از اولین کلیک تا آخرین درصد باتری، آن چیزی را پیدا کن که واقعاً با ریتم زندگی‌ات جور است.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link href="#products" className="hero-primary-action">
              شروع خرید
              <span aria-hidden>↙</span>
            </Link>
            <a href="#guide" className="hero-secondary-action">راهنمای انتخاب</a>
          </div>
          <div className="mt-12 flex justify-center gap-8 text-right lg:justify-start">
            <div><b className="block text-xl text-paper">۲۴ ساعت</b><span className="text-xs text-paper/45">ارسال به تهران</span></div>
            <div><b className="block text-xl text-paper">۷ روز</b><span className="text-xs text-paper/45">فرصت بازگشت</span></div>
            <div><b className="block text-xl text-paper">۱۰۰٪</b><span className="text-xs text-paper/45">ضمانت اصالت</span></div>
          </div>
        </div>

        <div className="hero-product-stage relative mx-auto w-full max-w-[520px]" aria-label="آیفون ۱۵ پرو مکس">
          <div className="hero-index absolute right-0 top-2 text-left font-mono text-[10px] tracking-[.24em] text-paper/45">FEATURED / 2025</div>
          <div className="hero-float-card hero-float-card-top">
            <span className="text-[10px] text-paper/45">قدرت پردازش</span>
            <b>A17 <em>PRO</em></b>
          </div>
          <div className="hero-float-card hero-float-card-bottom">
            <span className="hero-sound-wave"><i /><i /><i /><i /></span>
            <span className="text-xs text-paper/70">صدایی که نزدیک‌تر است</span>
          </div>
          <div className="hero-device-frame">
            <span className="hero-device-glow" />
            <div className="hero-device-notch" />
            <DeviceIcon category="mobile" className="hero-device-icon" />
            <div className="hero-device-screen">
              <span className="hero-screen-time">9:41</span>
              <span className="hero-screen-title">digital,<br />but human.</span>
              <span className="hero-screen-dot" />
            </div>
          </div>
          <div className="hero-product-caption">
            <span>APPLE / IPHONE 15 PRO</span>
            <div>{specs.map((spec) => <b key={spec}>{spec}</b>)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
