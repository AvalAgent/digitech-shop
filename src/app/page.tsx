import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Storefront } from "@/components/Storefront";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Storefront />
      </main>
      <Footer />
    </>
  );
}
