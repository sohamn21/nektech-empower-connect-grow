
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import MissedCallFeature from "@/components/MissedCallFeature";
import BlockchainFeature from "@/components/BlockchainFeature";
import AITrainingFeature from "@/components/AITrainingFeature";
import MarketplaceFeature from "@/components/MarketplaceFeature";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
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
