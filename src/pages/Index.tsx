
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      
      {/* New AI Training Section */}
      <section className="bg-gradient-to-br from-nektech-orange/10 to-nektech-blue/10 py-16 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 animate-fade-in">
              Learn Anytime, Anywhere with AI Training
            </h2>
            <p className="text-lg text-gray-600 animate-fade-in-delay">
              Receive personalized business training through voice calls and WhatsApp messages. 
              Learn essential skills at your own pace, in your preferred language.
            </p>
            <div className="flex space-x-4 animate-slide-in-left">
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="bg-nektech-orange hover:bg-nektech-orange/90 transition-colors"
              >
                <Phone className="mr-2" /> Schedule Voice Call
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="border-nektech-blue text-nektech-blue hover:bg-nektech-blue/10 transition-colors"
              >
                <MessageCircle className="mr-2" /> WhatsApp Training
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="bg-nektech-orange/20 absolute inset-0 rounded-xl blur-2xl animate-pulse"></div>
            <img 
              src="/placeholder.svg" 
              alt="AI Training" 
              className="relative z-10 rounded-xl shadow-lg transform transition-transform hover:scale-105"
            />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
