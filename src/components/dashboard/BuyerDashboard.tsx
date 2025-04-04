
import { useState } from "react";
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

// Mock products data
const mockProducts = [
  {
    id: "1",
    name: "Handwoven Basket",
    description: "Traditional handwoven bamboo basket with intricate patterns",
    price: 450,
    category: "Handicrafts",
    images: ["https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&h=300"],
    location: "Rajasthan",
    entrepreneurName: "Priya Sharma",
    hubName: "Jaipur Hub"
  },
  {
    id: "2",
    name: "Embroidered Shawl",
    description: "Handmade wool shawl with traditional embroidery work",
    price: 1200,
    category: "Textiles",
    images: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&h=300"],
    location: "Himachal Pradesh",
    entrepreneurName: "Sunita Devi",
    hubName: "Shimla Hub"
  },
  {
    id: "3",
    name: "Organic Pickles Set",
    description: "Homemade organic pickle set with five different flavors",
    price: 350,
    category: "Food",
    images: ["https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=300"],
    location: "Gujarat",
    entrepreneurName: "Meena Kumari",
    hubName: "Ahmedabad Hub"
  },
  {
    id: "4",
    name: "Terracotta Jewelry",
    description: "Handcrafted terracotta jewelry set with earrings and necklace",
    price: 550,
    category: "Jewelry",
    images: ["https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=300&h=300"],
    location: "West Bengal",
    entrepreneurName: "Lakshmi Roy",
    hubName: "Kolkata Hub"
  }
];

// List of locations and categories for filters
const locations = ["All Locations", "Rajasthan", "Himachal Pradesh", "Gujarat", "West Bengal", "Maharashtra", "Tamil Nadu"];
const categories = ["All Categories", "Handicrafts", "Textiles", "Food", "Jewelry", "Home Decor", "Paper Products"];

const BuyerDashboard = () => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [sortBy, setSortBy] = useState("newest");

  // Filter products based on search, category, and location
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.entrepreneurName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All Categories" || product.category === selectedCategory;
    
    const matchesLocation = selectedLocation === "All Locations" || product.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "priceAsc") return a.price - b.price;
    if (sortBy === "priceDesc") return b.price - a.price;
    // For "newest" (default), use the product ID as a proxy for creation date
    return b.id.localeCompare(a.id);
  });

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedLocation("All Locations");
    setSortBy("newest");
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery !== "" || 
                          selectedCategory !== "All Categories" || 
                          selectedLocation !== "All Locations" ||
                          sortBy !== "newest";

  return (
    <div className="space-y-8">
      <Tabs defaultValue="marketplace" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto">
          <TabsTrigger value="marketplace">{t('dashboard.buyer.tabs.marketplace')}</TabsTrigger>
          <TabsTrigger value="orders">{t('dashboard.buyer.tabs.orders')}</TabsTrigger>
          <TabsTrigger value="profile">{t('dashboard.buyer.tabs.profile')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="marketplace" className="mt-6">
          {/* Filters section */}
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
          
          {/* Products grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square bg-muted relative">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
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
                  <p className="font-medium text-lg">₹{product.price}</p>
                  <p className="text-sm mt-1">
                    {t('dashboard.buyer.marketplace.by')} <span className="font-medium">{product.entrepreneurName}</span>
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-1" />
                    {t('dashboard.buyer.marketplace.contact')}
                  </Button>
                  <Button size="sm" className="flex-1">
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
                <Button onClick={() => document.querySelector('[data-value="marketplace"]')?.click()}>
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
