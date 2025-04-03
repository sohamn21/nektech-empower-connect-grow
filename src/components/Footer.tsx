
import { Facebook, Instagram, Twitter, Linkedin, Mail, PhoneCall, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer id="contact" className="bg-nektech-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="md:col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="font-display font-bold text-2xl text-white">NEK<span className="text-nektech-orange">TECH</span></span>
            </div>
            <p className="text-gray-400 mb-4">
              {t('footer.tagline')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div className="md:col-span-1 lg:col-span-1">
            <h3 className="font-medium text-lg mb-4">{t('footer.quickLinks.title')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.quickLinks.aboutUs')}</a>
              </li>
              <li>
                <a href="#features" className="text-gray-400 hover:text-white transition-colors">{t('footer.quickLinks.features')}</a>
              </li>
              <li>
                <a href="#marketplace" className="text-gray-400 hover:text-white transition-colors">{t('footer.quickLinks.marketplace')}</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.quickLinks.successStories')}</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.quickLinks.joinNektech')}</a>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1 lg:col-span-1">
            <h3 className="font-medium text-lg mb-4">{t('footer.contactUs.title')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <PhoneCall size={18} className="text-nektech-orange flex-shrink-0 mt-1" />
                <span className="text-gray-400">{t('footer.contactUs.phone')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={18} className="text-nektech-orange flex-shrink-0 mt-1" />
                <span className="text-gray-400">{t('footer.contactUs.email')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-nektech-orange flex-shrink-0 mt-1" />
                <span className="text-gray-400">{t('footer.contactUs.address')}</span>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-3 lg:col-span-1">
            <h3 className="font-medium text-lg mb-4">{t('footer.newsletter.title')}</h3>
            <p className="text-gray-400 mb-4">
              {t('footer.newsletter.description')}
            </p>
            <div className="flex space-x-2">
              <Input 
                type="email" 
                placeholder={t('footer.newsletter.placeholder')}
                className="bg-nektech-dark border-gray-700 text-white"
              />
              <Button className="btn-primary">
                {t('footer.newsletter.button')}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} NEKTECH. {t('footer.copyright')}
            </p>
            <div className="mt-4 md:mt-0">
              <h4 className="text-sm font-medium mb-2">{t('footer.partners.title')}</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.partners.digitalEmpowerment')}
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.partners.sewaFoundation')}
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('footer.partners.grameenFoundation')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
