import { Header } from "@/components/layout/header";
import { Hero } from "@/components/home/hero";
import { Categories } from "@/components/home/categories";
import { HowItWorks } from "@/components/home/how-it-works";
import { Footer } from "@/components/home/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Categories />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
