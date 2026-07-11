import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Storefront } from "@/components/Storefront";
import { JsonLd } from "@/components/JsonLd";
import { storeJsonLd } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <JsonLd data={storeJsonLd()} />
      <Header />
      <main>
        <Hero />
        <Suspense>
          <Storefront />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
