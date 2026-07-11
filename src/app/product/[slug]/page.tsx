import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { products, getProductBySlug, getRelated } from "@/data/products";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductMedia } from "@/components/ProductMedia";
import { ProductCard } from "@/components/ProductCard";
import { Rating } from "@/components/Rating";
import { Price } from "@/components/Price";
import { JsonLd } from "@/components/JsonLd";
import { productJsonLd } from "@/lib/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  return { title: p ? `${p.name} | دیجی‌تک` : "دیجی‌تک" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelated(product);

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <nav className="mb-6 text-sm text-muted">
          <Link href="/" className="transition hover:text-ink">دیجی‌تک</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-[2rem] border border-border">
            <ProductMedia category={product.category} brand={product.brand} size="detail" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted">{product.brand}</span>
            <h1 className="mt-1 text-2xl font-black leading-9 text-ink sm:text-3xl">
              {product.name}
            </h1>
            <div className="mt-3">
              <Rating rating={product.rating} />
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">{product.description}</p>

            <dl className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between px-4 py-3 text-sm">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4">
              <Price irr={product.priceIRR} size="lg" />
              <button
                type="button"
                className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-surface transition hover:bg-accent"
              >
                افزودن به سبد خرید
              </button>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 self-start rounded-full bg-accent-soft px-4 py-2 text-sm font-medium text-accent">
              سوالی درباره این محصول داری؟ از دستیار هوشمند بپرس ↙
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-5 text-xl font-extrabold text-ink">محصولات مشابه</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
