
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from 'react-i18next';
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();
  const { isAuthenticated, signOut, userProfile } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`z-40 bg-background sticky top-0 transition-all duration-300 ${isScrolled ? 'shadow-md border-transparent' : 'border-b border-border'}`}>
      <div className="container px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex-shrink-0 transition-transform duration-300 hover:scale-105" onClick={closeMenu}>
          <span className="font-display text-2xl font-bold text-foreground">NEK<span className="text-nektech-orange animate-pulse-gentle">TECH</span></span>
        </Link>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-nektech-orange after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
            {t('navbar.home')}
          </Link>
          <Link to="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-nektech-orange after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
            {t('navbar.features')}
          </Link>
          <Link to="/#marketplace" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-nektech-orange after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
            {t('navbar.marketplace')}
          </Link>
          <Link to="/#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-nektech-orange after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
            {t('navbar.contact')}
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <LanguageSelector />
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="transition-colors duration-300 hover:bg-nektech-orange/10">
                  {t('navbar.dashboard')}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut} className="transition-colors duration-300 hover:bg-nektech-orange/10">
                {t('navbar.signOut')}
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button className="font-medium transition-all duration-300 hover:bg-nektech-orange/90 hover:shadow-md">
                {t('navbar.signIn')}
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden transition-transform duration-300 hover:scale-110" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} className="animate-rotate-in" /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border animate-slide-in-right">
          <div className="container px-4 py-4 flex flex-col gap-4">
            <Link 
              to="/" 
              className="text-foreground font-medium py-2 transition-colors duration-300 hover:text-nektech-orange"
              onClick={closeMenu}
            >
              {t('navbar.home')}
            </Link>
            <Link 
              to="/#features" 
              className="text-foreground font-medium py-2 transition-colors duration-300 hover:text-nektech-orange"
              onClick={closeMenu}
            >
              {t('navbar.features')}
            </Link>
            <Link 
              to="/#marketplace" 
              className="text-foreground font-medium py-2 transition-colors duration-300 hover:text-nektech-orange"
              onClick={closeMenu}
            >
              {t('navbar.marketplace')}
            </Link>
            <Link 
              to="/#contact" 
              className="text-foreground font-medium py-2 transition-colors duration-300 hover:text-nektech-orange"
              onClick={closeMenu}
            >
              {t('navbar.contact')}
            </Link>
            
            <div className="flex items-center gap-2 pt-2">
              <LanguageSelector />
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={closeMenu}>
                    <Button variant="ghost" size="sm" className="transition-colors duration-300 hover:bg-nektech-orange/10">
                      {t('navbar.dashboard')}
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => {
                    signOut();
                    closeMenu();
                  }} className="transition-colors duration-300 hover:bg-nektech-orange/10">
                    {t('navbar.signOut')}
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={closeMenu}>
                  <Button className="font-medium transition-all duration-300 hover:bg-nektech-orange/90 hover:shadow-md">
                    {t('navbar.signIn')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
