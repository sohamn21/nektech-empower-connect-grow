
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, MapPin, ShoppingBag, User, Phone, Mail, Building, Tag, Calendar, Download, Package, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { BuyerProfile } from "@/types";

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'Handwoven Basket',
    description: 'Beautifully crafted traditional handwoven basket',
    price: 450,
    category: 'Handicrafts',
    images: ['https://placehold.co/600x400/png'],
    location: 'Pune, Maharashtra',
    owner: { name: 'Priya Sharma', hub: 'Pune Rural Hub' },
    created_at: '2023-06-15'
  },
  {
    id: '2',
    name: 'Embroidered Scarf',
    description: 'Hand-embroidered cotton scarf with traditional designs',
    price: 350,
    category: 'Textiles',
    images: ['https://placehold.co/600x400/png'],
    location: 'Jaipur, Rajasthan',
    owner: { name: 'Lakshmi Devi', hub: 'Jaipur Craft Hub' },
    created_at: '2023-07-22'
  },
  {
    id: '3',
    name: 'Pickles Set',
    description: 'Homemade variety pickles set with traditional recipes',
    price: 250,
    category: 'Food Products',
    images: ['https://placehold.co/600x400/png'],
    location: 'Mumbai, Maharashtra',
    owner: { name: 'Meena Kumari', hub: 'Mumbai Rural Hub' },
    created_at: '2023-08-10'
  },
  {
    id: '4',
    name: 'Jute Bag',
    description: 'Eco-friendly handmade jute bag with beautiful patterns',
    price: 350,
    category: 'Handicrafts',
    images: ['https://placehold.co/600x400/png'],
    location: 'Kolkata, West Bengal',
    owner: { name: 'Anjali Patel', hub: 'Kolkata East Hub' },
    created_at: '2023-08-15'
  },
  {
    id: '5',
    name: 'Handmade Pottery Set',
    description: 'Traditional pottery set with 4 cups and a kettle',
    price: 850,
    category: 'Home Decor',
    images: ['https://placehold.co/600x400/png'],
    location: 'Ahmedabad, Gujarat',
    owner: { name: 'Reema Shah', hub: 'Gujarat Craft Hub' },
    created_at: '2023-09-05'
  },
  {
    id: '6',
    name: 'Beaded Jewelry Set',
    description: 'Hand-crafted beaded necklace and earrings set',
    price: 550,
    category: 'Jewelry',
    images: ['https://placehold.co/600x400/png'],
    location: 'Delhi, NCR',
    owner: { name: 'Neeta Verma', hub: 'Delhi Urban Hub' },
    created_at: '2023-09-20'
  }
];

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-001',
    products: [
      { name: 'Handwoven Basket', quantity: 10, price: 450 }
    ],
    total: 4500,
    status: 'delivered',
    date: '2023-10-15',
    tracking: 'TRK12345678',
    seller: 'Priya Sharma',
    hub: 'Pune Rural Hub'
  },
  {
    id: 'ORD-002',
    products: [
      { name: 'Embroidered Scarf', quantity: 5, price: 350 },
      { name: 'Beaded Jewelry Set', quantity: 2, price: 550 }
    ],
    total: 2850,
    status: 'shipped',
    date: '2023-11-01',
    tracking: 'TRK87654321',
    seller: 'Lakshmi Devi & Neeta Verma',
    hub: 'Multiple Hubs'
  },
  {
    id: 'ORD-003',
    products: [
      { name: 'Pickles Set', quantity: 8, price: 250 }
    ],
    total: 2000,
    status: 'processing',
    date: '2023-11-05',
    tracking: 'Pending',
    seller: 'Meena Kumari',
    hub: 'Mumbai Rural Hub'
  }
];

// Filter options
const categoryOptions = [
  'All Categories',
  'Handicrafts', 
  'Textiles', 
  'Food Products', 
  'Jewelry', 
  'Home Decor'
];

const locationOptions = [
  'All Locations',
  'Maharashtra',
  'Rajasthan',
  'Gujarat',
  'West Bengal',
  'Delhi NCR'
];

const BuyerDashboard = () => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [viewOrderId, setViewOrderId] = useState<string | null>(null);
  
  // Filter products based on search, category, location, and price
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || product.category === selectedCategory;
    const matchesLocation = selectedLocation === "All Locations" || product.location.includes(selectedLocation);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
  });
  
  // Get order details by ID
  const getOrderDetails = (id: string) => {
    return orders.find(order => order.id === id);
  };
  
  // Viewed order details
  const viewedOrder = viewOrderId ? getOrderDetails(viewOrderId) : null;
  
  // Handle price range change
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedLocation("All Locations");
    setPriceRange([0, 1000]);
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="browse">{t('dashboard.buyer.tabs.browse')}</TabsTrigger>
          <TabsTrigger value="orders">{t('dashboard.buyer.tabs.orders')}</TabsTrigger>
          <TabsTrigger value="profile">{t('dashboard.buyer.tabs.profile')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
                <CardDescription>Refine your product search</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationOptions.map(location => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>Price Range</Label>
                    <span className="text-sm text-muted-foreground">
                      ₹{priceRange[0]} - ₹{priceRange[1]}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 1000]}
                    value={priceRange}
                    min={0}
                    max={1000}
                    step={50}
                    onValueChange={handlePriceRangeChange}
                  />
                </div>
                
                <Button variant="outline" className="w-full" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
            
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <CardTitle>Browse Products</CardTitle>
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search products..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
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
                            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                            <div className="flex justify-between items-center mt-1">
                              <Badge variant="outline">{product.category}</Badge>
                              <p className="font-medium">₹{product.price}</p>
                            </div>
                            <p className="text-sm mt-2 mb-2 line-clamp-2 text-muted-foreground">{product.description}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1" />
                              {product.location}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <User className="h-3 w-3 mr-1" />
                              {product.owner.name}
                            </div>
                          </CardContent>
                          <CardFooter className="border-t pt-4 flex justify-between">
                            <Button variant="outline" size="sm">View Details</Button>
                            <Button size="sm">Order Now</Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border rounded-lg bg-muted/20">
                      <p className="text-muted-foreground mb-2">No products match your search criteria</p>
                      <Button variant="outline" onClick={resetFilters} className="mt-2">
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="orders" className="mt-6">
          {viewOrderId ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Order Details</CardTitle>
                  <CardDescription>View your order information</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setViewOrderId(null)}>
                  Back to Orders
                </Button>
              </CardHeader>
              <CardContent>
                {viewedOrder && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between border rounded-md p-4 bg-muted/10">
                      <div>
                        <p className="text-sm text-muted-foreground">Order ID</p>
                        <p className="font-medium">{viewedOrder.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Order Date</p>
                        <p className="font-medium">{viewedOrder.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge variant={
                          viewedOrder.status === 'delivered' ? 'default' : 
                          viewedOrder.status === 'shipped' ? 'secondary' : 
                          'outline'
                        }>
                          {viewedOrder.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-medium">₹{viewedOrder.total.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Products</h3>
                      <div className="border rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead className="text-right">Subtotal</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {viewedOrder.products.map((product, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>₹{product.price}</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                                <TableCell className="text-right">₹{(product.price * product.quantity).toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                              <TableCell className="text-right font-bold">₹{viewedOrder.total.toLocaleString()}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Seller Information</h3>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Seller</p>
                          <p className="font-medium">{viewedOrder.seller}</p>
                          <p className="text-sm text-muted-foreground">Hub</p>
                          <p className="font-medium">{viewedOrder.hub}</p>
                        </div>
                        <Button variant="outline">Contact Seller</Button>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Shipping Information</h3>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Tracking Number</p>
                          <p className="font-medium">{viewedOrder.tracking}</p>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <Badge variant={
                            viewedOrder.status === 'delivered' ? 'default' : 
                            viewedOrder.status === 'shipped' ? 'secondary' : 
                            'outline'
                          }>
                            {viewedOrder.status}
                          </Badge>
                        </div>
                        {viewedOrder.status === 'delivered' && (
                          <Button variant="outline">Download Invoice</Button>
                        )}
                        {viewedOrder.status === 'shipped' && (
                          <Button>Track Shipment</Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>Track and manage your orders</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="overflow-hidden">
                        <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between">
                          <div className="mb-4 md:mb-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{order.id}</h3>
                              <Badge variant={
                                order.status === 'delivered' ? 'default' : 
                                order.status === 'shipped' ? 'secondary' : 
                                'outline'
                              }>
                                {order.status}
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              {order.date}
                            </div>
                            <div className="flex items-center text-sm mt-2">
                              <Package className="h-4 w-4 mr-1" />
                              {order.products.length > 1 
                                ? `${order.products[0].name} and ${order.products.length - 1} more item${order.products.length > 2 ? 's' : ''}` 
                                : order.products[0].name
                              }
                            </div>
                          </div>
                          <div className="flex flex-col justify-between items-end">
                            <p className="font-bold text-lg">₹{order.total.toLocaleString()}</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => setViewOrderId(order.id)}
                            >
                              View Details
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-lg bg-muted/20">
                    <p className="text-muted-foreground mb-2">You haven't placed any orders yet</p>
                    <Button className="mt-2">Browse Products</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>View and update your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-16 w-16 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold">{userProfile?.name}</h2>
                    <p className="text-muted-foreground">{userProfile?.email}</p>
                    <Badge className="mt-2">Wholesale Buyer</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Name</Label>
                        <p className="font-medium">{userProfile?.name}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-muted-foreground">Email</Label>
                        <p className="font-medium">{userProfile?.email}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-muted-foreground">Phone</Label>
                        <p className="font-medium">{userProfile?.phone || "+91 98765 43210"}</p>
                      </div>
                      
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
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Business Information</h3>
                    <div className="space-y-4">
                      {userProfile?.role === 'buyer' && (
                        <>
                          <div>
                            <Label className="text-sm text-muted-foreground">Company Name</Label>
                            <p className="font-medium">{'companyName' in (userProfile as any) ? 
                              (userProfile as any).companyName : 
                              "Wholesale Traders Ltd."}</p>
                          </div>
                          
                          <div>
                            <Label className="text-sm text-muted-foreground">Business Type</Label>
                            <p className="font-medium">{'businessType' in (userProfile as any) ? 
                              (userProfile as any).businessType : 
                              "Retail & Wholesale Distribution"}</p>
                          </div>
                          
                          <div>
                            <Label className="text-sm text-muted-foreground">GST Number</Label>
                            <p className="font-medium">27AADCB2230M1ZT</p>
                          </div>
                          
                          <div>
                            <Label className="text-sm text-muted-foreground">Business Address</Label>
                            <p className="font-medium">Commercial Complex, Sector 12, Mumbai, Maharashtra</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t flex justify-between">
                  <Button variant="outline">Download Trade License</Button>
                  <Button>Edit Profile</Button>
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
