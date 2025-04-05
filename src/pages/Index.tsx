
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import MissedCallFeature from "@/components/MissedCallFeature";
import BlockchainFeature from "@/components/BlockchainFeature";
import AITrainingFeature from "@/components/AITrainingFeature";
import MarketplaceFeature from "@/components/MarketplaceFeature";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const Index = () => {
  // Add smooth scrolling behavior
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="overflow-hidden">
        <Hero />
        <Features />
        <MissedCallFeature />
        <BlockchainFeature />
        <AITrainingFeature />
        <MarketplaceFeature />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
