import type { Category, Product } from "./types";

export interface CategoryMeta {
  key: Category;
  label: string;
  /** duotone panel gradient for product media */
  from: string;
  to: string;
}

export const categories: CategoryMeta[] = [
  { key: "mobile", label: "موبایل", from: "#EEF2FF", to: "#DBE4FF" },
  { key: "laptop", label: "لپ‌تاپ", from: "#ECFEFF", to: "#CFFAFE" },
  { key: "headphone", label: "هدفون", from: "#F5F3FF", to: "#E9D5FF" },
  { key: "watch", label: "ساعت هوشمند", from: "#FFF7ED", to: "#FFEDD5" },
  { key: "tablet", label: "تبلت", from: "#F0FDF4", to: "#DCFCE7" },
  { key: "accessory", label: "لوازم جانبی", from: "#FDF2F8", to: "#FCE7F3" },
];

export const products: Product[] = [
  // ── mobile ──────────────────────────────────────────────
  {
    id: "m1", slug: "iphone-15-pro-max", name: "آیفون ۱۵ پرو مکس", brand: "Apple",
    category: "mobile", priceIRR: 89900000, rating: 4.9,
    specs: { "حافظه": "۲۵۶ گیگابایت", "نمایشگر": "۶.۷ اینچ سوپر رتینا", "تراشه": "A17 Pro", "دوربین": "۴۸ مگاپیکسل" },
    description: "پرچم‌دار اپل با بدنه تیتانیومی، تراشه A17 Pro و دوربین حرفه‌ای برای عکاسی و فیلم‌برداری در سطح سینمایی.",
    images: [],
  },
  {
    id: "m2", slug: "iphone-15", name: "آیفون ۱۵", brand: "Apple",
    category: "mobile", priceIRR: 62500000, rating: 4.8,
    specs: { "حافظه": "۱۲۸ گیگابایت", "نمایشگر": "۶.۱ اینچ", "تراشه": "A16 Bionic", "پورت": "USB-C" },
    description: "طراحی شیک با پورت USB-C، دوربین ۴۸ مگاپیکسلی و عملکرد روان برای استفاده روزمره.",
    images: [],
  },
  {
    id: "m3", slug: "galaxy-s24-ultra", name: "گلکسی S24 اولترا", brand: "Samsung",
    category: "mobile", priceIRR: 78000000, rating: 4.8,
    specs: { "حافظه": "۲۵۶ گیگابایت", "نمایشگر": "۶.۸ اینچ Dynamic AMOLED", "قلم": "S Pen", "دوربین": "۲۰۰ مگاپیکسل" },
    description: "غول اندرویدی سامسونگ با قلم S Pen، دوربین ۲۰۰ مگاپیکسلی و قابلیت‌های هوش مصنوعی گلکسی.",
    images: [],
  },
  {
    id: "m4", slug: "galaxy-s24", name: "گلکسی S24", brand: "Samsung",
    category: "mobile", priceIRR: 51000000, rating: 4.6,
    specs: { "حافظه": "۲۵۶ گیگابایت", "نمایشگر": "۶.۲ اینچ", "باتری": "۴۰۰۰ میلی‌آمپر", "شارژ": "۲۵ وات" },
    description: "اندازه جمع‌وجور، نمایشگر درخشان و عملکرد قدرتمند در یک گوشی خوش‌دست.",
    images: [],
  },
  {
    id: "m5", slug: "xiaomi-14", name: "شیائومی ۱۴", brand: "Xiaomi",
    category: "mobile", priceIRR: 43000000, rating: 4.5,
    specs: { "حافظه": "۲۵۶ گیگابایت", "دوربین": "Leica", "تراشه": "Snapdragon 8 Gen 3", "شارژ": "۹۰ وات" },
    description: "دوربین لایکا، شارژ فوق‌سریع ۹۰ واتی و پرچم‌دار مقرون‌به‌صرفه با کیفیت ساخت بالا.",
    images: [],
  },
  {
    id: "m6", slug: "redmi-note-13-pro", name: "ردمی نوت ۱۳ پرو", brand: "Xiaomi",
    category: "mobile", priceIRR: 14500000, rating: 4.4,
    specs: { "حافظه": "۱۲۸ گیگابایت", "دوربین": "۲۰۰ مگاپیکسل", "نمایشگر": "AMOLED ۱۲۰ هرتز", "باتری": "۵۰۰۰ میلی‌آمپر" },
    description: "بهترین انتخاب اقتصادی؛ دوربین ۲۰۰ مگاپیکسلی و باتری پرقدرت با قیمت مناسب.",
    images: [],
  },

  // ── laptop ──────────────────────────────────────────────
  {
    id: "l1", slug: "macbook-air-m3", name: "مک‌بوک ایر M3", brand: "Apple",
    category: "laptop", priceIRR: 92000000, rating: 4.9,
    specs: { "تراشه": "Apple M3", "حافظه": "۸ گیگابایت", "ذخیره": "۲۵۶ گیگابایت SSD", "نمایشگر": "۱۳.۶ اینچ" },
    description: "نازک، سبک و بی‌صدا با تراشه M3 و باتری تمام‌روز؛ همراه ایده‌آل برای کار و تحصیل.",
    images: [],
  },
  {
    id: "l2", slug: "macbook-pro-14-m3", name: "مک‌بوک پرو ۱۴ M3 پرو", brand: "Apple",
    category: "laptop", priceIRR: 165000000, rating: 4.9,
    specs: { "تراشه": "M3 Pro", "حافظه": "۱۸ گیگابایت", "ذخیره": "۵۱۲ گیگابایت", "نمایشگر": "Liquid Retina XDR" },
    description: "قدرت حرفه‌ای برای طراحان و برنامه‌نویسان؛ نمایشگر XDR و عملکرد بی‌رقیب تراشه M3 Pro.",
    images: [],
  },
  {
    id: "l3", slug: "asus-rog-strix-g16", name: "ایسوس ROG استریکس G16", brand: "Asus",
    category: "laptop", priceIRR: 110000000, rating: 4.7,
    specs: { "پردازنده": "Core i9", "گرافیک": "RTX 4070", "حافظه": "۱۶ گیگابایت", "نمایشگر": "۱۶۵ هرتز" },
    description: "لپ‌تاپ گیمینگ قدرتمند با گرافیک RTX 4070 و نمایشگر ۱۶۵ هرتز برای اجرای روان بازی‌ها.",
    images: [],
  },
  {
    id: "l4", slug: "lenovo-ideapad-slim-5", name: "لنوو آیدیاپد اسلیم ۵", brand: "Lenovo",
    category: "laptop", priceIRR: 32000000, rating: 4.3,
    specs: { "پردازنده": "Ryzen 5", "حافظه": "۱۶ گیگابایت", "ذخیره": "۵۱۲ گیگابایت SSD", "نمایشگر": "۱۵.۶ اینچ" },
    description: "انتخابی متعادل برای کار روزمره و دانشجویان؛ رم ۱۶ گیگ و بدنه سبک با قیمت منطقی.",
    images: [],
  },

  // ── headphone ───────────────────────────────────────────
  {
    id: "h1", slug: "airpods-pro-2", name: "ایرپاد پرو ۲", brand: "Apple",
    category: "headphone", priceIRR: 12900000, rating: 4.8,
    specs: { "نویزگیر": "فعال (ANC)", "تراشه": "H2", "شارژ": "USB-C", "باتری": "تا ۶ ساعت" },
    description: "حذف نویز فعال قدرتمند، حالت شفافیت و صدای غنی؛ بهترین همراه برای گوشی‌های اپل.",
    images: [],
  },
  {
    id: "h2", slug: "sony-wh-1000xm5", name: "سونی WH-1000XM5", brand: "Sony",
    category: "headphone", priceIRR: 21500000, rating: 4.9,
    specs: { "نویزگیر": "پیشرفته", "باتری": "۳۰ ساعت", "اتصال": "بلوتوث ۵.۲", "وزن": "۲۵۰ گرم" },
    description: "سلطان بی‌چون‌وچرای حذف نویز؛ صدای استودیویی و باتری ۳۰ ساعته برای سفرهای طولانی.",
    images: [],
  },
  {
    id: "h3", slug: "bose-qc-ultra", name: "بوز QC اولترا", brand: "Bose",
    category: "headphone", priceIRR: 24000000, rating: 4.7,
    specs: { "نویزگیر": "Immersive", "باتری": "۲۴ ساعت", "اتصال": "بلوتوث", "میکروفون": "چهارتایی" },
    description: "صدای فراگیر سه‌بعدی و آرامش کامل با نویزگیر افسانه‌ای بوز.",
    images: [],
  },
  {
    id: "h4", slug: "jbl-tune-770nc", name: "جی‌بی‌ال Tune 770NC", brand: "JBL",
    category: "headphone", priceIRR: 3200000, rating: 4.4,
    specs: { "نویزگیر": "فعال", "باتری": "۷۰ ساعت", "اتصال": "بلوتوث ۵.۳", "شارژ": "USB-C" },
    description: "باس قدرتمند JBL و باتری خارق‌العاده ۷۰ ساعته با قیمتی کاملاً اقتصادی.",
    images: [],
  },

  // ── watch ───────────────────────────────────────────────
  {
    id: "w1", slug: "apple-watch-series-9", name: "اپل واچ سری ۹", brand: "Apple",
    category: "watch", priceIRR: 28000000, rating: 4.8,
    specs: { "سایز": "۴۵ میلی‌متر", "تراشه": "S9", "نمایشگر": "Always-On", "قابلیت": "لمس دوبل" },
    description: "سریع‌ترین اپل واچ تا امروز با نمایشگر روشن‌تر و قابلیت جدید Double Tap.",
    images: [],
  },
  {
    id: "w2", slug: "apple-watch-se", name: "اپل واچ SE", brand: "Apple",
    category: "watch", priceIRR: 15000000, rating: 4.6,
    specs: { "سایز": "۴۰ میلی‌متر", "تراشه": "S8", "سنسور": "ضربان قلب", "مقاوم": "ضدآب" },
    description: "همه امکانات ضروری سلامت و تناسب‌اندام با قیمتی در دسترس‌تر.",
    images: [],
  },
  {
    id: "w3", slug: "galaxy-watch-6", name: "گلکسی واچ ۶", brand: "Samsung",
    category: "watch", priceIRR: 18500000, rating: 4.5,
    specs: { "سایز": "۴۴ میلی‌متر", "نمایشگر": "AMOLED", "سنسور": "BioActive", "سیستم": "Wear OS" },
    description: "ردیابی دقیق سلامت، طراحی شیک و تجربه روان Wear OS برای کاربران اندروید.",
    images: [],
  },

  // ── tablet ──────────────────────────────────────────────
  {
    id: "t1", slug: "ipad-air-m2", name: "آیپد ایر M2", brand: "Apple",
    category: "tablet", priceIRR: 45000000, rating: 4.8,
    specs: { "تراشه": "Apple M2", "نمایشگر": "۱۱ اینچ", "قلم": "Apple Pencil Pro", "حافظه": "۱۲۸ گیگابایت" },
    description: "قدرت تراشه M2 در بدنه‌ای سبک؛ عالی برای طراحی، یادداشت‌برداری و سرگرمی.",
    images: [],
  },
  {
    id: "t2", slug: "ipad-10", name: "آیپد نسل ۱۰", brand: "Apple",
    category: "tablet", priceIRR: 27000000, rating: 4.6,
    specs: { "تراشه": "A14", "نمایشگر": "۱۰.۹ اینچ", "پورت": "USB-C", "حافظه": "۶۴ گیگابایت" },
    description: "آیپد رنگی و همه‌کاره برای خانواده؛ نمایشگر بزرگ و کارایی مطمئن با قیمت مناسب.",
    images: [],
  },
  {
    id: "t3", slug: "galaxy-tab-s9", name: "گلکسی تب S9", brand: "Samsung",
    category: "tablet", priceIRR: 42000000, rating: 4.6,
    specs: { "نمایشگر": "AMOLED ۱۱ اینچ", "قلم": "S Pen همراه", "مقاوم": "ضدآب IP68", "تراشه": "Snapdragon 8 Gen 2" },
    description: "نمایشگر AMOLED خیره‌کننده، قلم S Pen داخل جعبه و بدنه ضدآب برای کار و تفریح.",
    images: [],
  },

  // ── accessory ───────────────────────────────────────────
  {
    id: "a1", slug: "anker-power-bank-20000", name: "پاوربانک انکر ۲۰۰۰۰", brand: "Anker",
    category: "accessory", priceIRR: 2300000, rating: 4.7,
    specs: { "ظرفیت": "۲۰۰۰۰ میلی‌آمپر", "خروجی": "۶۵ وات", "پورت": "USB-C + USB-A", "قابلیت": "شارژ لپ‌تاپ" },
    description: "شارژ سریع لپ‌تاپ و گوشی در سفر؛ ظرفیت بالا و کیفیت مطمئن انکر.",
    images: [],
  },
  {
    id: "a2", slug: "anker-charger-65w", name: "شارژر انکر ۶۵ وات", brand: "Anker",
    category: "accessory", priceIRR: 1450000, rating: 4.6,
    specs: { "توان": "۶۵ وات", "پورت": "۲× USB-C", "فناوری": "GaN", "قابلیت": "شارژ همزمان" },
    description: "شارژر فشرده GaN با توان ۶۵ وات برای شارژ همزمان گوشی و لپ‌تاپ.",
    images: [],
  },
  {
    id: "a3", slug: "logitech-mx-master-3s", name: "ماوس لاجیتک MX Master 3S", brand: "Logitech",
    category: "accessory", priceIRR: 2900000, rating: 4.8,
    specs: { "اتصال": "بلوتوث + گیرنده", "سنسور": "۸۰۰۰ DPI", "باتری": "تا ۷۰ روز", "کلیک": "بی‌صدا" },
    description: "ماوس حرفه‌ای برای بهره‌وری بالا؛ اسکرول مغناطیسی و طراحی ارگونومیک.",
    images: [],
  },
  {
    id: "a4", slug: "samsung-t7-ssd-1tb", name: "اس‌اس‌دی سامسونگ T7 یک ترابایت", brand: "Samsung",
    category: "accessory", priceIRR: 4800000, rating: 4.7,
    specs: { "ظرفیت": "۱ ترابایت", "سرعت": "۱۰۵۰ مگابایت", "اتصال": "USB 3.2", "وزن": "۵۸ گرم" },
    description: "حافظه اکسترنال جمع‌وجور و فوق‌سریع برای انتقال فایل‌های سنگین در چند ثانیه.",
    images: [],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelated(p: Product): Product[] {
  return products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
}

export function categoryMeta(key: Category): CategoryMeta {
  return categories.find((c) => c.key === key) ?? categories[0];
}
