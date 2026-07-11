// Generates ~300 realistic Persian electronics products into src/data/catalog.json.
// Deterministic (seeded RNG) so re-runs are reproducible. No DB — the API serves this.
// Run: node scripts/generate-catalog.mjs
import { writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMG_DIR = join(__dirname, "../public/products");

// ── seeded RNG (mulberry32) ──────────────────────────────
let seed = 0x9e3779b9;
function rnd() {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const between = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const toFa = (n) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

const colors = [
  { fa: "مشکی", slug: "black" }, { fa: "نقره‌ای", slug: "silver" },
  { fa: "آبی", slug: "blue" }, { fa: "طلایی", slug: "gold" },
  { fa: "سبز", slug: "green" }, { fa: "بنفش", slug: "purple" },
  { fa: "خاکستری", slug: "gray" },
];

// storage tiers (gb → price delta in toman)
const storageMobile = [
  { gb: 128, fa: "۱۲۸ گیگابایت", delta: 0 },
  { gb: 256, fa: "۲۵۶ گیگابایت", delta: 6000000 },
  { gb: 512, fa: "۵۱۲ گیگابایت", delta: 14000000 },
];
const storageLaptop = [
  { gb: 256, fa: "۲۵۶ گیگابایت SSD", delta: 0 },
  { gb: 512, fa: "۵۱۲ گیگابایت SSD", delta: 12000000 },
  { gb: 1024, fa: "۱ ترابایت SSD", delta: 28000000 },
];
const storageTablet = [
  { gb: 64, fa: "۶۴ گیگابایت", delta: 0 },
  { gb: 128, fa: "۱۲۸ گیگابایت", delta: 5000000 },
  { gb: 256, fa: "۲۵۶ گیگابایت", delta: 11000000 },
];

// ── model templates ──────────────────────────────────────
// each: { name, brand, slug, base(toman), storages, colorCount, specs }
const models = [
  // mobile
  m("آیفون ۱۵ پرو مکس", "Apple", "iphone-15-pro-max", 78000000, storageMobile, 4, { "تراشه": "A17 Pro", "نمایشگر": "۶.۷ اینچ", "دوربین": "۴۸ مگاپیکسل" }),
  m("آیفون ۱۵ پرو", "Apple", "iphone-15-pro", 68000000, storageMobile, 4, { "تراشه": "A17 Pro", "نمایشگر": "۶.۱ اینچ", "بدنه": "تیتانیوم" }),
  m("آیفون ۱۵", "Apple", "iphone-15", 56000000, storageMobile, 5, { "تراشه": "A16", "نمایشگر": "۶.۱ اینچ", "پورت": "USB-C" }),
  m("آیفون ۱۴", "Apple", "iphone-14", 45000000, storageMobile, 4, { "تراشه": "A15", "نمایشگر": "۶.۱ اینچ", "دوربین": "۱۲ مگاپیکسل" }),
  m("آیفون ۱۳", "Apple", "iphone-13", 38000000, storageMobile, 4, { "تراشه": "A15", "نمایشگر": "۶.۱ اینچ", "باتری": "تمام‌روز" }),
  m("گلکسی S24 اولترا", "Samsung", "galaxy-s24-ultra", 72000000, storageMobile, 4, { "تراشه": "Snapdragon 8 Gen 3", "قلم": "S Pen", "دوربین": "۲۰۰ مگاپیکسل" }),
  m("گلکسی S24 پلاس", "Samsung", "galaxy-s24-plus", 58000000, storageMobile, 3, { "نمایشگر": "۶.۷ اینچ", "باتری": "۴۹۰۰ میلی‌آمپر", "شارژ": "۴۵ وات" }),
  m("گلکسی S24", "Samsung", "galaxy-s24", 48000000, storageMobile, 4, { "نمایشگر": "۶.۲ اینچ", "تراشه": "Exynos 2400", "دوربین": "۵۰ مگاپیکسل" }),
  m("گلکسی A54", "Samsung", "galaxy-a54", 22000000, storageMobile, 3, { "نمایشگر": "۶.۴ اینچ", "باتری": "۵۰۰۰ میلی‌آمپر", "دوربین": "۵۰ مگاپیکسل" }),
  m("گلکسی A34", "Samsung", "galaxy-a34", 16500000, storageMobile, 3, { "نمایشگر": "۶.۶ اینچ", "باتری": "۵۰۰۰ میلی‌آمپر", "شارژ": "۲۵ وات" }),
  m("شیائومی ۱۴", "Xiaomi", "xiaomi-14", 41000000, storageMobile, 3, { "دوربین": "Leica", "تراشه": "Snapdragon 8 Gen 3", "شارژ": "۹۰ وات" }),
  m("شیائومی ۱۳T پرو", "Xiaomi", "xiaomi-13t-pro", 32000000, storageMobile, 3, { "دوربین": "Leica", "شارژ": "۱۲۰ وات", "نمایشگر": "۱۴۴ هرتز" }),
  m("ردمی نوت ۱۳ پرو", "Xiaomi", "redmi-note-13-pro", 14500000, storageMobile, 4, { "دوربین": "۲۰۰ مگاپیکسل", "نمایشگر": "AMOLED", "باتری": "۵۰۰۰ میلی‌آمپر" }),
  m("پوکو X6 پرو", "Xiaomi", "poco-x6-pro", 17000000, storageMobile, 3, { "تراشه": "Dimensity 8300", "نمایشگر": "۱۲۰ هرتز", "شارژ": "۶۷ وات" }),
  m("پیکسل ۸ پرو", "Google", "pixel-8-pro", 44000000, storageMobile, 3, { "تراشه": "Tensor G3", "دوربین": "۵۰ مگاپیکسل", "قابلیت": "هوش مصنوعی" }),
  m("پیکسل ۸", "Google", "pixel-8", 36000000, storageMobile, 3, { "تراشه": "Tensor G3", "نمایشگر": "۶.۲ اینچ", "دوربین": "۵۰ مگاپیکسل" }),
  m("ناتینگ فون ۲", "Nothing", "nothing-phone-2", 30000000, storageMobile, 2, { "طراحی": "Glyph", "تراشه": "Snapdragon 8+ Gen 1", "نمایشگر": "۱۲۰ هرتز" }),

  // laptop
  m("مک‌بوک ایر ۱۳ M3", "Apple", "macbook-air-13-m3", 82000000, storageLaptop, 3, { "تراشه": "Apple M3", "رم": "۸ گیگابایت", "نمایشگر": "۱۳.۶ اینچ" }),
  m("مک‌بوک ایر ۱۵ M3", "Apple", "macbook-air-15-m3", 98000000, storageLaptop, 3, { "تراشه": "Apple M3", "رم": "۸ گیگابایت", "نمایشگر": "۱۵.۳ اینچ" }),
  m("مک‌بوک پرو ۱۴ M3 پرو", "Apple", "macbook-pro-14-m3-pro", 155000000, storageLaptop, 3, { "تراشه": "M3 Pro", "رم": "۱۸ گیگابایت", "نمایشگر": "XDR" }),
  m("ایسوس ROG استریکس G16", "Asus", "asus-rog-strix-g16", 105000000, storageLaptop, 3, { "پردازنده": "Core i9", "گرافیک": "RTX 4070", "نمایشگر": "۱۶۵ هرتز" }),
  m("ایسوس زنبوک ۱۴", "Asus", "asus-zenbook-14", 58000000, storageLaptop, 3, { "پردازنده": "Core i7", "نمایشگر": "OLED", "وزن": "۱.۲ کیلوگرم" }),
  m("ایسوس ویووبوک ۱۵", "Asus", "asus-vivobook-15", 34000000, storageLaptop, 3, { "پردازنده": "Core i5", "رم": "۱۶ گیگابایت", "نمایشگر": "۱۵.۶ اینچ" }),
  m("لنوو لیجن ۵", "Lenovo", "lenovo-legion-5", 88000000, storageLaptop, 3, { "پردازنده": "Ryzen 7", "گرافیک": "RTX 4060", "نمایشگر": "۱۶۵ هرتز" }),
  m("لنوو آیدیاپد اسلیم ۵", "Lenovo", "lenovo-ideapad-slim-5", 32000000, storageLaptop, 3, { "پردازنده": "Ryzen 5", "رم": "۱۶ گیگابایت", "نمایشگر": "۱۵.۶ اینچ" }),
  m("لپ‌تاپ HP ویکتوس", "HP", "hp-victus", 52000000, storageLaptop, 3, { "پردازنده": "Core i5", "گرافیک": "RTX 4050", "نمایشگر": "۱۴۴ هرتز" }),
  m("دل XPS ۱۳", "Dell", "dell-xps-13", 72000000, storageLaptop, 3, { "پردازنده": "Core i7", "نمایشگر": "InfinityEdge", "وزن": "۱.۲ کیلوگرم" }),
  m("MSI کاتانا ۱۵", "MSI", "msi-katana-15", 62000000, storageLaptop, 3, { "پردازنده": "Core i7", "گرافیک": "RTX 4060", "نمایشگر": "۱۴۴ هرتز" }),

  // headphone
  m("ایرپاد پرو ۲", "Apple", "airpods-pro-2", 12900000, null, 1, { "نویزگیر": "فعال", "تراشه": "H2", "شارژ": "USB-C" }),
  m("ایرپاد نسل ۳", "Apple", "airpods-3", 8900000, null, 1, { "طراحی": "باز", "صدا": "فضایی", "باتری": "۶ ساعت" }),
  m("ایرپاد مکس", "Apple", "airpods-max", 32000000, null, 5, { "نویزگیر": "فعال", "صدا": "فضایی", "جنس": "آلومینیوم" }),
  m("سونی WH-1000XM5", "Sony", "sony-wh-1000xm5", 21500000, null, 3, { "نویزگیر": "پیشرفته", "باتری": "۳۰ ساعت", "اتصال": "بلوتوث ۵.۲" }),
  m("سونی WF-1000XM5", "Sony", "sony-wf-1000xm5", 15000000, null, 2, { "نویزگیر": "فعال", "نوع": "درون‌گوشی", "باتری": "۸ ساعت" }),
  m("بوز QC اولترا", "Bose", "bose-qc-ultra", 24000000, null, 3, { "نویزگیر": "Immersive", "باتری": "۲۴ ساعت", "میکروفون": "چهارتایی" }),
  m("بوز QC ایربادز", "Bose", "bose-qc-earbuds", 13500000, null, 3, { "نویزگیر": "فعال", "نوع": "درون‌گوشی", "مقاوم": "ضدآب" }),
  m("جی‌بی‌ال Tune 770NC", "JBL", "jbl-tune-770nc", 3200000, null, 4, { "نویزگیر": "فعال", "باتری": "۷۰ ساعت", "اتصال": "بلوتوث ۵.۳" }),
  m("سامسونگ گلکسی بادز۲ پرو", "Samsung", "galaxy-buds2-pro", 7500000, null, 3, { "نویزگیر": "فعال", "صدا": "Hi-Fi ۲۴ بیت", "مقاوم": "IPX7" }),
  m("سنهایزر مومنتوم ۴", "Sennheiser", "sennheiser-momentum-4", 19000000, null, 2, { "نویزگیر": "تطبیقی", "باتری": "۶۰ ساعت", "صدا": "استودیویی" }),

  // watch
  m("اپل واچ سری ۹", "Apple", "apple-watch-series-9", 28000000, null, 5, { "تراشه": "S9", "نمایشگر": "Always-On", "قابلیت": "Double Tap" }),
  m("اپل واچ اولترا ۲", "Apple", "apple-watch-ultra-2", 48000000, null, 3, { "بدنه": "تیتانیوم", "مقاوم": "۱۰۰ متر", "باتری": "۳۶ ساعت" }),
  m("اپل واچ SE", "Apple", "apple-watch-se", 15000000, null, 3, { "تراشه": "S8", "سنسور": "ضربان قلب", "مقاوم": "ضدآب" }),
  m("گلکسی واچ ۶", "Samsung", "galaxy-watch-6", 18500000, null, 4, { "نمایشگر": "AMOLED", "سنسور": "BioActive", "سیستم": "Wear OS" }),
  m("گلکسی واچ ۶ کلاسیک", "Samsung", "galaxy-watch-6-classic", 25000000, null, 2, { "قاب": "استیل", "بزل": "چرخان", "سیستم": "Wear OS" }),
  m("گارمین ونو ۳", "Garmin", "garmin-venu-3", 27000000, null, 3, { "باتری": "۱۴ روز", "GPS": "دارد", "سنسور": "سلامت پیشرفته" }),
  m("شیائومی واچ S3", "Xiaomi", "xiaomi-watch-s3", 6500000, null, 3, { "نمایشگر": "AMOLED", "باتری": "۱۵ روز", "GPS": "دارد" }),
  m("شیائومی اسمارت بند ۸", "Xiaomi", "xiaomi-smart-band-8", 1900000, null, 4, { "نمایشگر": "AMOLED", "باتری": "۱۶ روز", "مقاوم": "۵ ATM" }),

  // tablet
  m("آیپد پرو ۱۱ M4", "Apple", "ipad-pro-11-m4", 78000000, storageTablet, 3, { "تراشه": "Apple M4", "نمایشگر": "Ultra Retina", "قلم": "Pencil Pro" }),
  m("آیپد ایر ۱۱ M2", "Apple", "ipad-air-11-m2", 45000000, storageTablet, 4, { "تراشه": "Apple M2", "نمایشگر": "۱۱ اینچ", "قلم": "Pencil Pro" }),
  m("آیپد نسل ۱۰", "Apple", "ipad-10", 27000000, storageTablet, 4, { "تراشه": "A14", "نمایشگر": "۱۰.۹ اینچ", "پورت": "USB-C" }),
  m("آیپد مینی", "Apple", "ipad-mini", 34000000, storageTablet, 3, { "تراشه": "A15", "نمایشگر": "۸.۳ اینچ", "قلم": "Pencil 2" }),
  m("گلکسی تب S9", "Samsung", "galaxy-tab-s9", 42000000, storageTablet, 3, { "نمایشگر": "AMOLED", "قلم": "S Pen همراه", "مقاوم": "IP68" }),
  m("گلکسی تب S9 اولترا", "Samsung", "galaxy-tab-s9-ultra", 62000000, storageTablet, 2, { "نمایشگر": "۱۴.۶ اینچ", "قلم": "S Pen", "تراشه": "Snapdragon 8 Gen 2" }),
  m("گلکسی تب A9", "Samsung", "galaxy-tab-a9", 9500000, storageTablet, 3, { "نمایشگر": "۸.۷ اینچ", "باتری": "۵۱۰۰ میلی‌آمپر", "کاربری": "خانوادگی" }),
  m("شیائومی پد ۶", "Xiaomi", "xiaomi-pad-6", 16000000, storageTablet, 3, { "نمایشگر": "۱۴۴ هرتز", "تراشه": "Snapdragon 870", "باتری": "۸۸۴۰ میلی‌آمپر" }),

  // accessory
  m("پاوربانک انکر ۲۰۰۰۰", "Anker", "anker-power-bank-20000", 2300000, null, 2, { "ظرفیت": "۲۰۰۰۰ میلی‌آمپر", "خروجی": "۶۵ وات", "پورت": "USB-C" }),
  m("پاوربانک انکر ۱۰۰۰۰", "Anker", "anker-power-bank-10000", 1500000, null, 3, { "ظرفیت": "۱۰۰۰۰ میلی‌آمپر", "خروجی": "۳۰ وات", "وزن": "سبک" }),
  m("شارژر انکر ۶۵ وات", "Anker", "anker-charger-65w", 1450000, null, 2, { "توان": "۶۵ وات", "پورت": "۲× USB-C", "فناوری": "GaN" }),
  m("کابل انکر USB-C", "Anker", "anker-usb-c-cable", 450000, null, 3, { "طول": "۱.۸ متر", "توان": "۱۰۰ وات", "جنس": "نایلونی" }),
  m("ماوس لاجیتک MX Master 3S", "Logitech", "logitech-mx-master-3s", 2900000, null, 3, { "سنسور": "۸۰۰۰ DPI", "باتری": "۷۰ روز", "کلیک": "بی‌صدا" }),
  m("کیبورد لاجیتک MX Keys", "Logitech", "logitech-mx-keys", 3400000, null, 2, { "نوع": "بی‌سیم", "نوردهی": "هوشمند", "اتصال": "چند دستگاه" }),
  m("SSD سامسونگ T7 یک ترابایت", "Samsung", "samsung-t7-ssd-1tb", 4800000, null, 3, { "ظرفیت": "۱ ترابایت", "سرعت": "۱۰۵۰ مگابایت", "اتصال": "USB 3.2" }),
  m("SSD سامسونگ T9 دو ترابایت", "Samsung", "samsung-t9-ssd-2tb", 9800000, null, 1, { "ظرفیت": "۲ ترابایت", "سرعت": "۲۰۰۰ مگابایت", "اتصال": "USB 3.2 Gen2" }),
  m("هاب UGREEN ۶ پورت", "UGREEN", "ugreen-hub-6in1", 1800000, null, 2, { "پورت": "۶ کاره", "HDMI": "۴K", "شارژ": "PD ۱۰۰ وات" }),
  m("شارژر بیسوس ۳۰ وات", "Baseus", "baseus-charger-30w", 780000, null, 3, { "توان": "۳۰ وات", "فناوری": "GaN", "اندازه": "جمع‌وجور" }),
];

function m(name, brand, slug, base, storages, colorCount, specs) {
  return { name, brand, slug, base, storages, colorCount, specs };
}

const descByCat = {
  mobile: (n, b) => `${n} از ${b}؛ عملکرد روان، دوربین باکیفیت و طراحی مدرن برای استفاده روزمره.`,
  laptop: (n, b) => `${n} محصول ${b}؛ کارایی بالا و بدنه‌ای مقاوم، مناسب کار، تحصیل و بازی.`,
  headphone: (n, b) => `${n} از ${b}؛ صدای شفاف و باکیفیت با اتصال پایدار بلوتوث.`,
  watch: (n, b) => `${n} ساخت ${b}؛ ردیابی دقیق سلامت و اعلان‌های هوشمند روی مچ شما.`,
  tablet: (n, b) => `${n} از ${b}؛ نمایشگر بزرگ و روان برای کار، طراحی و سرگرمی.`,
  accessory: (n, b) => `${n} محصول ${b}؛ همراهی مطمئن و باکیفیت برای دستگاه‌های شما.`,
};

// derive category from which block a model came from — track by index ranges is fragile,
// so tag category explicitly via slug heuristics.
function catOf(model) {
  const s = model.slug;
  if (/iphone|galaxy-s|galaxy-a|xiaomi-1|redmi|poco|pixel|nothing/.test(s)) return "mobile";
  if (/macbook|rog|zenbook|vivobook|legion|ideapad|victus|xps|katana/.test(s)) return "laptop";
  if (/airpods|wh-|wf-|qc-|jbl|buds|momentum/.test(s)) return "headphone";
  if (/watch|smart-band|venu/.test(s)) return "watch";
  if (/ipad|tab-|pad-6/.test(s)) return "tablet";
  return "accessory";
}

const out = [];
let modelIdx = 0;
for (const model of models) {
  modelIdx++;
  const category = catOf(model);
  const storages = model.storages ?? [{ gb: 0, fa: "", delta: 0 }];
  const cols = colors.slice(0, Math.max(1, model.colorCount));

  // one PRODUCT per model; storage x color combos become its variants
  const variants = [];
  let v = 0;
  for (const st of storages) {
    for (const col of cols) {
      v++;
      const price = model.base + st.delta + between(-300000, 300000);
      const skuParts = [model.slug];
      if (st.gb) skuParts.push(`${st.gb}gb`);
      if (cols.length > 1) skuParts.push(col.slug);
      variants.push({
        id: `${model.slug}-v${v}`,
        sku: skuParts.join("-"),
        ...(st.fa ? { storage: st.fa } : {}),
        ...(cols.length > 1 ? { color: col.fa } : {}),
        priceIRR: Math.round(price / 100000) * 100000,
        stock: between(3, 25),
      });
    }
  }

  // real product photo fetched per model (scripts/fetch-images.mjs); variants share it
  const images = existsSync(join(IMG_DIR, `${model.slug}.jpg`))
    ? [`/products/${model.slug}.jpg`]
    : [];

  out.push({
    id: `p${String(modelIdx).padStart(3, "0")}`,
    slug: model.slug,
    name: model.name,
    brand: model.brand,
    category,
    priceIRR: Math.min(...variants.map((x) => x.priceIRR)),
    rating: Math.round((3.9 + rnd() * 1.0) * 10) / 10,
    stock: variants.reduce((s, x) => s + x.stock, 0),
    specs: { ...model.specs },
    description: descByCat[category](model.name, model.brand),
    images,
    variants,
  });
}

// interleave categories round-robin so the "all" listing shows a mix,
// not 17 phones in a row
const buckets = new Map();
for (const p of out) {
  if (!buckets.has(p.category)) buckets.set(p.category, []);
  buckets.get(p.category).push(p);
}
const interleaved = [];
const lists = [...buckets.values()];
for (let i = 0; interleaved.length < out.length; i++) {
  for (const list of lists) if (list[i]) interleaved.push(list[i]);
}
out.length = 0;
out.push(...interleaved);

const json = JSON.stringify(out, null, 2);
writeFileSync(join(__dirname, "../src/data/catalog.json"), json + "\n");
const byCat = out.reduce((a, p) => ((a[p.category] = (a[p.category] || 0) + 1), a), {});
console.log(`generated ${out.length} products`, byCat);
