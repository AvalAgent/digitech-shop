// Downloads one real product photo per MODEL from Digikala's public search API
// into public/products/<model-slug>.jpg. Variants of a model share the image.
// Skips models whose image already exists. Falls back category→generic search.
// Run: node scripts/fetch-images.mjs
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../public/products");
mkdirSync(OUT_DIR, { recursive: true });

const UA = { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" };

// model-slug → { cat: digikala category slug, q: search query }
const MODELS = {
  // mobile
  "iphone-15-pro-max": { cat: "mobile-phone", q: "iphone 15 pro max" },
  "iphone-15-pro": { cat: "mobile-phone", q: "iphone 15 pro" },
  "iphone-15": { cat: "mobile-phone", q: "iphone 15" },
  "iphone-14": { cat: "mobile-phone", q: "iphone 14" },
  "iphone-13": { cat: "mobile-phone", q: "iphone 13" },
  "galaxy-s24-ultra": { cat: "mobile-phone", q: "galaxy s24 ultra" },
  "galaxy-s24-plus": { cat: "mobile-phone", q: "galaxy s24 plus" },
  "galaxy-s24": { cat: "mobile-phone", q: "galaxy s24" },
  "galaxy-a54": { cat: "mobile-phone", q: "galaxy a54" },
  "galaxy-a34": { cat: "mobile-phone", q: "galaxy a34" },
  "xiaomi-14": { cat: "mobile-phone", q: "xiaomi 14" },
  "xiaomi-13t-pro": { cat: "mobile-phone", q: "xiaomi 13t pro" },
  "redmi-note-13-pro": { cat: "mobile-phone", q: "redmi note 13 pro" },
  "poco-x6-pro": { cat: "mobile-phone", q: "poco x6 pro" },
  "pixel-8-pro": { cat: "mobile-phone", q: "pixel 8 pro" },
  "pixel-8": { cat: "mobile-phone", q: "google pixel 8" },
  "nothing-phone-2": { cat: "mobile-phone", q: "nothing phone 2" },
  // laptop
  "macbook-air-13-m3": { cat: "notebook-netbook-ultrabook", q: "macbook air m3 13" },
  "macbook-air-15-m3": { cat: "notebook-netbook-ultrabook", q: "macbook air m3 15" },
  "macbook-pro-14-m3-pro": { cat: "notebook-netbook-ultrabook", q: "macbook pro 14 m3" },
  "asus-rog-strix-g16": { cat: "notebook-netbook-ultrabook", q: "asus rog strix g16" },
  "asus-zenbook-14": { cat: "notebook-netbook-ultrabook", q: "asus zenbook 14 oled" },
  "asus-vivobook-15": { cat: "notebook-netbook-ultrabook", q: "asus vivobook 15" },
  "lenovo-legion-5": { cat: "notebook-netbook-ultrabook", q: "lenovo legion 5" },
  "lenovo-ideapad-slim-5": { cat: "notebook-netbook-ultrabook", q: "lenovo ideapad slim 5" },
  "hp-victus": { cat: "notebook-netbook-ultrabook", q: "hp victus" },
  "dell-xps-13": { cat: "notebook-netbook-ultrabook", q: "dell xps 13" },
  "msi-katana-15": { cat: "notebook-netbook-ultrabook", q: "msi katana 15" },
  // headphone
  "airpods-pro-2": { cat: "headphone", q: "airpods pro 2" },
  "airpods-3": { cat: "headphone", q: "airpods 3" },
  "airpods-max": { cat: "headphone", q: "airpods max" },
  "sony-wh-1000xm5": { cat: "headphone", q: "sony wh-1000xm5" },
  "sony-wf-1000xm5": { cat: "headphone", q: "sony wf-1000xm5" },
  "bose-qc-ultra": { cat: "headphone", q: "bose quietcomfort ultra" },
  "bose-qc-earbuds": { cat: "headphone", q: "bose quietcomfort earbuds" },
  "jbl-tune-770nc": { cat: "headphone", q: "jbl tune 770nc" },
  "galaxy-buds2-pro": { cat: "headphone", q: "galaxy buds2 pro" },
  "sennheiser-momentum-4": { cat: "headphone", q: "sennheiser momentum 4" },
  // watch
  "apple-watch-series-9": { cat: "smart-watch", q: "apple watch series 9" },
  "apple-watch-ultra-2": { cat: "smart-watch", q: "apple watch ultra 2" },
  "apple-watch-se": { cat: "smart-watch", q: "apple watch se" },
  "galaxy-watch-6": { cat: "smart-watch", q: "galaxy watch 6" },
  "galaxy-watch-6-classic": { cat: "smart-watch", q: "galaxy watch 6 classic" },
  "garmin-venu-3": { cat: "smart-watch", q: "garmin venu 3" },
  "xiaomi-watch-s3": { cat: "smart-watch", q: "xiaomi watch s3" },
  "xiaomi-smart-band-8": { cat: "smart-watch", q: "xiaomi smart band 8" },
  // tablet
  "ipad-pro-11-m4": { cat: "tablet", q: "ipad pro 11 m4" },
  "ipad-air-11-m2": { cat: "tablet", q: "ipad air 11 m2" },
  "ipad-10": { cat: "tablet", q: "ipad 10" },
  "ipad-mini": { cat: "tablet", q: "ipad mini" },
  "galaxy-tab-s9": { cat: "tablet", q: "galaxy tab s9" },
  "galaxy-tab-s9-ultra": { cat: "tablet", q: "galaxy tab s9 ultra" },
  "galaxy-tab-a9": { cat: "tablet", q: "galaxy tab a9" },
  "xiaomi-pad-6": { cat: "tablet", q: "xiaomi pad 6" },
  // accessory
  "anker-power-bank-20000": { cat: "power-bank", q: "انکر 20000" },
  "anker-power-bank-10000": { cat: "power-bank", q: "انکر 10000" },
  "anker-charger-65w": { cat: null, q: "شارژر انکر 65 وات" },
  "anker-usb-c-cable": { cat: null, q: "کابل انکر usb-c" },
  "logitech-mx-master-3s": { cat: "mouse", q: "logitech mx master 3s" },
  "logitech-mx-keys": { cat: "keyboard", q: "logitech mx keys" },
  "samsung-t7-ssd-1tb": { cat: null, q: "اس اس دی سامسونگ t7 یک ترابایت" },
  "samsung-t9-ssd-2tb": { cat: null, q: "اس اس دی سامسونگ t9" },
  "ugreen-hub-6in1": { cat: null, q: "هاب یوگرین 6 پورت" },
  "baseus-charger-30w": { cat: null, q: "شارژر بیسوس 30 وات" },
};

async function searchDk(cat, q) {
  const base = cat
    ? `https://api.digikala.com/v1/categories/${cat}/search/`
    : "https://api.digikala.com/v1/search/";
  const res = await fetch(`${base}?q=${encodeURIComponent(q)}`, { headers: UA });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data?.products?.[0]?.images?.main?.url?.[0]?.split("?")[0] ?? null;
}

let ok = 0, skipped = 0, failed = [];
for (const [slug, { cat, q }] of Object.entries(MODELS)) {
  const file = join(OUT_DIR, `${slug}.jpg`);
  if (existsSync(file)) { skipped++; continue; }
  try {
    let url = await searchDk(cat, q);
    if (!url && cat) url = await searchDk(null, q); // fallback: generic search
    if (!url) { failed.push(slug); continue; }
    const img = await fetch(url, { headers: UA });
    if (!img.ok) { failed.push(slug); continue; }
    writeFileSync(file, Buffer.from(await img.arrayBuffer()));
    ok++;
    console.log(`✓ ${slug}`);
  } catch {
    failed.push(slug);
  }
  await new Promise((r) => setTimeout(r, 350)); // be polite
}
console.log(`\ndone: ${ok} downloaded, ${skipped} cached, ${failed.length} failed`);
if (failed.length) console.log("failed:", failed.join(", "));
