
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-br from-nektech-light to-background overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
        <div className="w-full lg:w-1/2 space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight opacity-0 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <span className="gradient-text">{t('hero.title')}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg opacity-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
            {t('hero.subtitle')}
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
            <Button variant="outline" size="lg" className="transition-all duration-300 hover:bg-secondary/10">
              {t('hero.learnMore')}
            </Button>
          </div>
        </div>
        <div className="w-full lg:w-1/2 mt-12 lg:mt-0 flex justify-center">
          <div className="relative w-full max-w-lg aspect-square opacity-0 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="absolute inset-0 bg-nektech-orange/20 rounded-full blur-3xl animate-float"></div>
            <img
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=500&h=500"
              alt={t('hero.imageAlt')}
              className="relative z-10 w-full h-full object-contain rounded-2xl transform transition-all duration-500 hover:scale-105 hover:rotate-2"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
