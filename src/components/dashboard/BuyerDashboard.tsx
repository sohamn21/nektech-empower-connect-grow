
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Search, 
  MapPin, 
  Phone, 
  MessageSquare,
  FilterX,
  ChevronDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";

const locations = ["All Locations", "Rajasthan", "Himachal Pradesh", "Gujarat", "West Bengal", "Maharashtra", "Tamil Nadu"];
const categories = ["All Categories", "Handicrafts", "Textiles", "Food", "Jewelry", "Home Decor", "Paper Products"];

const BuyerDashboard = () => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, profiles(name)')
          .eq('status', 'active');
          
        if (error) throw error;
        
        // Transform data to match our Product type
        const transformedProducts = data.map((item: any) => ({
          ...item,
          entrepreneurName: item.profiles.name
        }));
        
        setProducts(transformedProducts);
      } catch (error: any) {
        console.error('Error fetching products:', error.message);
        toast({
          variant: "destructive",
          title: "Failed to load products",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (product as any).entrepreneurName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All Categories" || product.category === selectedCategory;
    
    const matchesLocation = selectedLocation === "All Locations" || product.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "priceAsc") return a.price - b.price;
    if (sortBy === "priceDesc") return b.price - a.price;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedLocation("All Locations");
    setSortBy("newest");
  };

  const hasActiveFilters = searchQuery !== "" || 
                          selectedCategory !== "All Categories" || 
                          selectedLocation !== "All Locations" ||
                          sortBy !== "newest";

  const navigateToMarketplace = () => {
    const marketplaceTab = document.querySelector('[data-value="marketplace"]');
    if (marketplaceTab && marketplaceTab instanceof HTMLElement) {
      marketplaceTab.click();
    }
  };

  // Contact seller function
  const contactSeller = (productId: string) => {
    toast({
      title: "Contact request sent",
      description: "The hub manager will reach out to you soon.",
    });
  };

  // Send inquiry function
  const sendInquiry = (productId: string) => {
    toast({
      title: "Inquiry sent",
      description: "Your inquiry has been sent to the entrepreneur.",
    });
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="marketplace" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto">
          <TabsTrigger value="marketplace">{t('dashboard.buyer.tabs.marketplace')}</TabsTrigger>
          <TabsTrigger value="orders">{t('dashboard.buyer.tabs.orders')}</TabsTrigger>
          <TabsTrigger value="profile">{t('dashboard.buyer.tabs.profile')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="marketplace" className="mt-6">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <CardTitle>{t('dashboard.buyer.marketplace.title')}</CardTitle>
                {hasActiveFilters && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetFilters}
                    className="self-start"
                  >
                    <FilterX className="h-4 w-4 mr-1" />
                    {t('dashboard.buyer.marketplace.resetFilters')}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={t('dashboard.buyer.marketplace.searchPlaceholder')}
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('dashboard.buyer.marketplace.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('dashboard.buyer.marketplace.selectLocation')} />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('dashboard.buyer.marketplace.sortBy')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t('dashboard.buyer.marketplace.sortNewest')}</SelectItem>
                    <SelectItem value="priceAsc">{t('dashboard.buyer.marketplace.sortPriceAsc')}</SelectItem>
                    <SelectItem value="priceDesc">{t('dashboard.buyer.marketplace.sortPriceDesc')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <CardHeader className="p-4">
                    <div className="h-5 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-10 bg-muted animate-pulse rounded" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="h-4 bg-muted animate-pulse rounded mb-2 w-1/3" />
                    <div className="h-6 bg-muted animate-pulse rounded w-1/4 mb-1" />
                    <div className="h-4 bg-muted animate-pulse rounded w-1/2 mt-1" />
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <div className="h-9 bg-muted animate-pulse rounded flex-1" />
                    <div className="h-9 bg-muted animate-pulse rounded flex-1" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square bg-muted relative">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MessageSquare className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <Badge className="absolute top-2 right-2 bg-white text-black hover:bg-white/90">
                      {product.category}
                    </Badge>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                      <MapPin size={12} className="mr-1" />
                      <span>{product.location}</span>
                    </div>
                    <p className="font-medium text-lg">{formatCurrency(product.price)}</p>
                    <p className="text-sm mt-1">
                      {t('dashboard.buyer.marketplace.by')} <span className="font-medium">
                        {(product as any).entrepreneurName || 'Unknown Entrepreneur'}
                      </span>
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => contactSeller(product.id)}>
                      <Phone className="h-4 w-4 mr-1" />
                      {t('dashboard.buyer.marketplace.contact')}
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => sendInquiry(product.id)}>
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {t('dashboard.buyer.marketplace.inquiry')}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {sortedProducts.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p>{t('dashboard.buyer.marketplace.noProducts')}</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.buyer.orders.title')}</CardTitle>
              <CardDescription>
                {t('dashboard.buyer.orders.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">{t('dashboard.buyer.orders.empty')}</p>
                <Button onClick={navigateToMarketplace}>
                  {t('dashboard.buyer.orders.browseProducts')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.buyer.profile.title')}</CardTitle>
              <CardDescription>
                {t('dashboard.buyer.profile.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      {t('dashboard.buyer.profile.name')}
                    </h4>
                    <p className="font-medium">{userProfile?.name}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      {t('dashboard.buyer.profile.email')}
                    </h4>
                    <p className="font-medium">{userProfile?.email}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      {t('dashboard.buyer.profile.phone')}
                    </h4>
                    <p className="font-medium">{userProfile?.phone || "-"}</p>
                  </div>
                  
                  {userProfile?.role === 'buyer' && (
                    <>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          {t('dashboard.buyer.profile.company')}
                        </h4>
                        <p className="font-medium">{'companyName' in (userProfile as any) ? 
                          (userProfile as any).companyName : 
                          "-"}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          {t('dashboard.buyer.profile.businessType')}
                        </h4>
                        <p className="font-medium">{'businessType' in (userProfile as any) ? 
                          (userProfile as any).businessType : 
                          "-"}</p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="pt-4">
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
