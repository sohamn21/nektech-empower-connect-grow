
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from 'react-i18next';
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { isAuthenticated, signOut, userProfile } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="z-40 bg-background border-b border-border sticky top-0">
      <div className="container px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex-shrink-0" onClick={closeMenu}>
          <span className="font-display text-2xl font-bold text-foreground">NEK<span className="text-nektech-orange">TECH</span></span>
        </Link>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t('navbar.home')}
          </Link>
          <Link to="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t('navbar.features')}
          </Link>
          <Link to="/#marketplace" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t('navbar.marketplace')}
          </Link>
          <Link to="/#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t('navbar.contact')}
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <LanguageSelector />
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  {t('navbar.dashboard')}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut}>
                {t('navbar.signOut')}
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button className="font-medium">
                {t('navbar.signIn')}
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container px-4 py-4 flex flex-col gap-4">
            <Link 
              to="/" 
              className="text-foreground font-medium py-2"
              onClick={closeMenu}
            >
              {t('navbar.home')}
            </Link>
            <Link 
              to="/#features" 
              className="text-foreground font-medium py-2"
              onClick={closeMenu}
            >
              {t('navbar.features')}
            </Link>
            <Link 
              to="/#marketplace" 
              className="text-foreground font-medium py-2"
              onClick={closeMenu}
            >
              {t('navbar.marketplace')}
            </Link>
            <Link 
              to="/#contact" 
              className="text-foreground font-medium py-2"
              onClick={closeMenu}
            >
              {t('navbar.contact')}
            </Link>
            
            <div className="flex items-center gap-2 pt-2">
              <LanguageSelector />
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={closeMenu}>
                    <Button variant="ghost" size="sm">
                      {t('navbar.dashboard')}
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => {
                    signOut();
                    closeMenu();
                  }}>
                    {t('navbar.signOut')}
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={closeMenu}>
                  <Button className="font-medium">
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
