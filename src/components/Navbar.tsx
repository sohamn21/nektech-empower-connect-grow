
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: t('navbar.home'), href: '/' },
    { name: t('navbar.features'), href: '#features' },
    { name: t('navbar.marketplace'), href: '#marketplace' },
    { name: t('navbar.contact'), href: '#contact' },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-display font-bold text-2xl text-nektech-blue">NEK<span className="text-nektech-orange">TECH</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-foreground hover:text-nektech-orange transition-colors font-medium"
            >
              {item.name}
            </a>
          ))}
          
          <LanguageSelector />
          
          {user ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="flex items-center gap-2">
                <User size={18} />
                <span className="hidden lg:inline">{user.email?.split('@')[0]}</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={handleSignOut}>
                <LogOut size={18} />
                <span className="hidden lg:inline">{t('navbar.signOut')}</span>
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button className="btn-primary">{t('navbar.signIn')}</Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSelector />
          <button
            className="p-2 rounded-md text-foreground"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-nektech-orange transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            {user ? (
              <>
                <div className="flex items-center gap-2 py-2">
                  <User size={18} className="text-nektech-blue" />
                  <span>{user.email}</span>
                </div>
                <Button className="w-full" variant="outline" onClick={handleSignOut}>
                  {t('navbar.signOut')}
                </Button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                <Button className="btn-primary w-full">{t('navbar.signIn')}</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
