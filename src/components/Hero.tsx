
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  
  return (
    <section className="relative py-16 md:py-28 lg:py-36 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-nektech-light to-background opacity-90 z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-nektech-orange/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-nektech-blue/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 space-y-8 animate-fade-in">
            <div className="inline-block px-4 py-1.5 bg-nektech-orange/10 text-nektech-orange rounded-full text-sm font-medium mb-2 animate-fade-in" style={{ animationDelay: '50ms' }}>
              Empowering rural entrepreneurs
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight opacity-0 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <span className="gradient-text">{t('hero.title')}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg opacity-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
              {t('hero.subtitle')} Connect rural entrepreneurs with technology that simplifies business operations and expands market reach.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4 opacity-0 animate-fade-in" style={{ animationDelay: '300ms' }}>
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button className="btn-primary group transition-all duration-300 transform hover:scale-105" size="lg">
                    {t('hero.dashboard')} 
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button className="btn-primary group transition-all duration-300 transform hover:scale-105" size="lg">
                    {t('hero.getStarted')} 
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              )}
              <Link to="/product-details">
                <Button variant="outline" size="lg" className="transition-all duration-300 hover:bg-secondary/10">
                  {t('hero.learnMore')}
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 mt-12 lg:mt-0 flex justify-center">
            <div className="relative w-full max-w-lg aspect-square opacity-0 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="absolute -inset-1 bg-gradient-to-r from-nektech-orange/30 to-nektech-blue/30 rounded-2xl blur-xl animate-pulse-gentle"></div>
              <img
                src="/lovable-uploads/8ec6ce32-13ed-477c-98dc-481439a49075.png"
                alt="Rural entrepreneur using digital technology"
                className="relative z-10 w-full h-full object-cover rounded-2xl shadow-lg transform transition-all duration-500 hover:scale-105 hover:rotate-1"
              />
              <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-20 animate-fade-in" style={{ animationDelay: '600ms' }}>
                <p className="text-sm font-medium text-nektech-blue">Connecting rural communities to digital opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
