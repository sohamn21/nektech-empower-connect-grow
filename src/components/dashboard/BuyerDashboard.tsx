
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, User, ShoppingCart, Phone, MapPin, Calendar } from "lucide-react";

// Mock products
const mockProducts = [
  {
    id: '1',
    name: 'Handwoven Basket',
    description: 'Beautifully crafted traditional handwoven basket',
    price: 450,
    category: 'Handicrafts',
    location: 'Pune, Maharashtra',
    owner: {
      name: 'Priya Sharma',
      hub: 'Pune Rural Hub'
    },
    images: ['https://placehold.co/600x400/png'],
    status: 'active',
    created_at: '2023-06-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Embroidered Scarf',
    description: 'Hand-embroidered cotton scarf with traditional designs',
    price: 350,
    category: 'Textiles',
    location: 'Jaipur, Rajasthan',
    owner: {
      name: 'Meena Kumari',
      hub: 'Jaipur Hub'
    },
    images: ['https://placehold.co/600x400/png'],
    status: 'active',
    created_at: '2023-07-22T14:30:00Z'
  },
  {
    id: '3',
    name: 'Organic Pickles Set',
    description: 'Homemade organic pickles using traditional recipes',
    price: 250,
    category: 'Food',
    location: 'Nashik, Maharashtra',
    owner: {
      name: 'Lakshmi Devi',
      hub: 'Nashik Rural Hub'
    },
    images: ['https://placehold.co/600x400/png'],
    status: 'active',
    created_at: '2023-08-10T09:15:00Z'
  },
  {
    id: '4',
    name: 'Hand-painted Pottery',
    description: 'Traditional hand-painted decorative pottery items',
    price: 550,
    category: 'Home Decor',
    location: 'Kutch, Gujarat',
    owner: {
      name: 'Geeta Patel',
      hub: 'Kutch Craft Hub'
    },
    images: ['https://placehold.co/600x400/png'],
    status: 'active',
    created_at: '2023-09-05T16:20:00Z'
  }
];

// Mock orders
const mockOrders = [
  {
    id: 'ORD-001',
    date: '2023-10-15',
    status: 'Delivered',
    items: 2,
    total: 800,
    products: [
      { id: '1', name: 'Handwoven Basket', quantity: 1, price: 450 },
      { id: '3', name: 'Organic Pickles Set', quantity: 1, price: 350 }
    ]
  },
  {
    id: 'ORD-002',
    date: '2023-11-02',
    status: 'Processing',
    items: 1,
    total: 550,
    products: [
      { id: '4', name: 'Hand-painted Pottery', quantity: 1, price: 550 }
    ]
  }
];

const BuyerDashboard = () => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Filter products based on search, price range, category, and location
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = 
      product.price >= priceRange[0] && product.price <= priceRange[1];
    
    const matchesCategory = 
      selectedCategory === 'all' || product.category === selectedCategory;
    
    const matchesLocation = 
      selectedLocation === 'all' || product.location.includes(selectedLocation);
    
    return matchesSearch && matchesPrice && matchesCategory && matchesLocation;
  });

  // Get unique categories and locations for filters
  const categories = ['all', ...new Set(products.map(product => product.category))];
  const locations = ['all', ...new Set(products.map(product => product.location.split(',')[1].trim()))];

  return (
    <div className="space-y-8">
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-xl mx-auto">
          <TabsTrigger value="products">{t('dashboard.buyer.tabs.products')}</TabsTrigger>
          <TabsTrigger value="orders">{t('dashboard.buyer.tabs.orders')}</TabsTrigger>
          <TabsTrigger value="profile">{t('dashboard.buyer.tabs.profile')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>{t('dashboard.buyer.products.title')}</CardTitle>
                  <CardDescription className="mt-1">{t('dashboard.buyer.products.description')}</CardDescription>
                </div>
                <div className="w-full md:w-72">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={t('dashboard.buyer.products.searchPlaceholder')}
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Filters */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <h3 className="font-medium">{t('dashboard.buyer.products.filter')}</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('dashboard.buyer.products.categories')}</Label>
                      <Select 
                        value={selectedCategory} 
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category === 'all' ? 'All Categories' : category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('dashboard.buyer.products.price')}</Label>
                      <div className="pt-4 px-1">
                        <Slider
                          defaultValue={priceRange}
                          max={1000}
                          step={50}
                          onValueChange={setPriceRange}
                        />
                        <div className="flex items-center justify-between mt-2 text-sm">
                          <span>₹{priceRange[0]}</span>
                          <span>₹{priceRange[1]}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('dashboard.buyer.products.location')}</Label>
                      <Select 
                        value={selectedLocation} 
                        onValueChange={setSelectedLocation}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map(location => (
                            <SelectItem key={location} value={location}>
                              {location === 'all' ? 'All Locations' : location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Products grid */}
                <div className="md:col-span-3">
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredProducts.map((product) => (
                        <Card key={product.id} className="overflow-hidden">
                          <div className="aspect-video w-full overflow-hidden">
                            <img 
                              src={product.images[0]} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-lg">{product.name}</h3>
                              <Badge>₹{product.price}</Badge>
                            </div>
                            <div className="flex items-center mt-1">
                              <p className="text-muted-foreground text-sm">{product.category}</p>
                            </div>
                            <p className="text-sm mt-2 line-clamp-2">{product.description}</p>
                            <div className="flex items-center mt-2 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1" />
                              {product.location}
                            </div>
                          </CardContent>
                          <CardFooter className="border-t pt-4 flex justify-between">
                            <Button size="sm" variant="outline">
                              {t('dashboard.buyer.products.viewDetails')}
                            </Button>
                            <Button size="sm">
                              {t('dashboard.buyer.products.contact')}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border rounded-lg bg-muted/20">
                      <p className="text-muted-foreground mb-2">{t('dashboard.buyer.products.noProductsFound')}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.buyer.orders.title')}</CardTitle>
              <CardDescription>{t('dashboard.buyer.orders.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">{t('dashboard.buyer.orders.id')}</th>
                        <th className="text-left py-3 px-4">{t('dashboard.buyer.orders.date')}</th>
                        <th className="text-left py-3 px-4">{t('dashboard.buyer.orders.status')}</th>
                        <th className="text-left py-3 px-4">{t('dashboard.buyer.orders.items')}</th>
                        <th className="text-left py-3 px-4">{t('dashboard.buyer.orders.total')}</th>
                        <th className="text-left py-3 px-4">{t('dashboard.buyer.orders.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{order.id}</td>
                          <td className="py-3 px-4">{order.date}</td>
                          <td className="py-3 px-4">
                            <Badge variant={order.status === 'Delivered' ? 'outline' : 'default'}>
                              {order.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{order.items}</td>
                          <td className="py-3 px-4">₹{order.total}</td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground mb-2">{t('dashboard.buyer.orders.noOrders')}</p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    {t('dashboard.buyer.orders.noOrdersDescription')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.buyer.profile.title')}</CardTitle>
              <CardDescription>{t('dashboard.buyer.profile.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">{userProfile?.name}</h3>
                    <p className="text-muted-foreground">{userProfile?.email}</p>
                    {userProfile?.role === 'buyer' && 'companyName' in (userProfile as any) && (
                      <p className="mt-1">{(userProfile as any).companyName || 'Individual Buyer'}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">{t('dashboard.buyer.profile.phone')}</Label>
                    <p className="font-medium">{userProfile?.phone || '-'}</p>
                  </div>
                  
                  {userProfile?.role === 'buyer' && (
                    <>
                      <div>
                        <Label className="text-sm text-muted-foreground">{t('dashboard.buyer.profile.company')}</Label>
                        <p className="font-medium">
                          {'companyName' in (userProfile as any) ? 
                            (userProfile as any).companyName || 'Individual Buyer' : 
                            'Individual Buyer'}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-muted-foreground">{t('dashboard.buyer.profile.businessType')}</Label>
                        <p className="font-medium">
                          {'businessType' in (userProfile as any) ? 
                            (userProfile as any).businessType || '-' : 
                            '-'}
                        </p>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Preferred Language</Label>
                    <p className="font-medium">
                      {userProfile?.preferredLanguage === 'en' ? 'English' : 
                       userProfile?.preferredLanguage === 'hi' ? 'हिन्दी' : 
                       userProfile?.preferredLanguage === 'mr' ? 'मराठी' : 
                       userProfile?.preferredLanguage}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-start pt-4">
                  <Button>
                    {t('dashboard.buyer.profile.edit')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BuyerDashboard;
