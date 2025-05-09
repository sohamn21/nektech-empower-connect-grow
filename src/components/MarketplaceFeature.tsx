
import { ShoppingBag, MapPin, Share2, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import HubsMap from './HubsMap';

const MarketplaceFeature = () => {
  const { t } = useTranslation();
  
  // Sample product images
  const productImages = [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&h=300",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&h=300",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=300",
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=300&h=300"
  ];
  
  return (
    <section className="py-16" id="marketplace">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nektech-blue/10 text-nektech-blue font-medium text-sm mx-auto">
            <ShoppingBag size={16} />
            <span>Global Reach</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-4">
            {t('marketplace.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
            {t('marketplace.subtitle')}
          </p>
        </div>
        
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="products">{t('marketplace.tabs.products')}</TabsTrigger>
            <TabsTrigger value="hubs">{t('marketplace.tabs.hubs')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <Card key={item} className="overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-muted relative">
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                      <Share2 size={16} className="text-nektech-orange" />
                    </div>
                    <img 
                      src={productImages[item % productImages.length]} 
                      alt={`Handcrafted Item ${item}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base font-medium">Handcrafted Item {item}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-nektech-blue">₹499</span>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin size={12} className="mr-1" />
                        <span>Rajasthan</span>
                      </div>
                    </div>
                    <Link to={`/product/${item}`}>
                      <Button className="w-full mt-4 btn-primary" size="sm">
                        {t('marketplace.product.viewDetails')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link to="/product-details">
                <Button variant="outline">{t('marketplace.product.browseAll')}</Button>
              </Link>
            </div>
          </TabsContent>
          
          <TabsContent value="hubs" className="mt-8">
            {/* OpenStreetMap Integration */}
            <HubsMap />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {['Delhi', 'Mumbai', 'Jaipur', 'Lucknow', 'Bangalore', 'Chennai'].map((location) => (
                <Card key={location} className="feature-card">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{location} Hub</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {location === 'Delhi' ? 'Main Center' : 'Community Center'}
                        </p>
                      </div>
                      <MapPin className="h-5 w-5 text-nektech-orange" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">
                      Services: Payments, Training, Product Photography, Shipping
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Mon-Sat: 9am-5pm</span>
                      <Button variant="ghost" size="sm" className="text-nektech-blue">
                        Details <ExternalLink size={12} className="ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-16 bg-gradient-to-r from-nektech-blue to-nektech-orange p-0.5 rounded-xl">
          <div className="bg-card p-8 rounded-lg">
            <div className="text-center">
              <h3 className="text-2xl font-display font-bold mb-4">{t('marketplace.partners.title')}</h3>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                {t('marketplace.partners.subtitle')}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center mb-3">
                  <p className="font-bold text-nektech-blue">Amazon</p>
                </div>
                <p className="font-medium">Amazon Saheli</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center mb-3">
                  <p className="font-bold text-nektech-blue">Flipkart</p>
                </div>
                <p className="font-medium">Flipkart Samarth</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center mb-3">
                  <p className="font-bold text-nektech-blue">NEKTECH</p>
                </div>
                <p className="font-medium">{t('marketplace.partners.direct')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceFeature;
