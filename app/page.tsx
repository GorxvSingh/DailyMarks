import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { StorySection } from "@/components/landing/StorySection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <StorySection />
      <FeatureGrid />
      <CtaBanner />
      <Footer />
    </main>
  );
}
