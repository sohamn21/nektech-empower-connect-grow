
import { Facebook, Instagram, Twitter, Linkedin, Mail, PhoneCall, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer id="contact" className="bg-nektech-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="md:col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="font-display font-bold text-2xl text-white">NEK<span className="text-nektech-orange">TECH</span></span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering rural women entrepreneurs through technology that works for everyone.
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
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
              </li>
              <li>
                <a href="#marketplace" className="text-gray-400 hover:text-white transition-colors">Marketplace</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Success Stories</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Join NEKTECH</a>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1 lg:col-span-1">
            <h3 className="font-medium text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <PhoneCall size={18} className="text-nektech-orange flex-shrink-0 mt-1" />
                <span className="text-gray-400">+91 123-456-7890</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={18} className="text-nektech-orange flex-shrink-0 mt-1" />
                <span className="text-gray-400">contact@nektech.org</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-nektech-orange flex-shrink-0 mt-1" />
                <span className="text-gray-400">123 Innovation Hub, Delhi, India</span>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-3 lg:col-span-1">
            <h3 className="font-medium text-lg mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for updates on our initiatives and success stories.
            </p>
            <div className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-nektech-dark border-gray-700 text-white"
              />
              <Button className="btn-primary">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} NEKTECH. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <h4 className="text-sm font-medium mb-2">NGO Partners</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Digital Empowerment Foundation
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  SEWA Foundation
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Grameen Foundation
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
