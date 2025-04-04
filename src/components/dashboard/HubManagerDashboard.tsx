
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ChevronRight, Check, X, User, Phone, Mail, Building, Filter, MapPin, ShoppingBag, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HubManagerProfile } from "@/types";

// Mock entrepreneurs data
const mockEntrepreneurs = [
  { 
    id: '1', 
    name: 'Priya Sharma', 
    aadharNumber: '123456789012', 
    occupation: 'Handicraft Artisan', 
    familyIncome: 120000,
    products: [
      { id: '1', name: 'Handwoven Basket', price: 450, category: 'Handicrafts' }
    ],
    hubManagerPermission: true,
    phone: '+91 98765 43210',
    email: 'priya@example.com',
    joinedDate: '2023-05-15'
  },
  { 
    id: '2', 
    name: 'Lakshmi Devi', 
    aadharNumber: '234567890123', 
    occupation: 'Textile Weaver', 
    familyIncome: 95000,
    products: [],
    hubManagerPermission: false,
    phone: '+91 87654 32109',
    email: 'lakshmi@example.com',
    joinedDate: '2023-06-20'
  },
  { 
    id: '3', 
    name: 'Meena Kumari', 
    aadharNumber: '345678901234', 
    occupation: 'Food Processing', 
    familyIncome: 150000,
    products: [
      { id: '2', name: 'Pickles Set', price: 250, category: 'Food' },
      { id: '3', name: 'Papad', price: 120, category: 'Food' }
    ],
    hubManagerPermission: true,
    phone: '+91 76543 21098',
    email: 'meena@example.com',
    joinedDate: '2023-07-10'
  },
  { 
    id: '4', 
    name: 'Anjali Patel', 
    aadharNumber: '456789012345', 
    occupation: 'Jute Products', 
    familyIncome: 110000,
    products: [
      { id: '4', name: 'Jute Bag', price: 350, category: 'Handicrafts' }
    ],
    hubManagerPermission: true,
    phone: '+91 65432 10987',
    email: 'anjali@example.com',
    joinedDate: '2023-08-05'
  }
];

// Mock wholesalers data
const mockWholesalers = [
  {
    id: '1',
    name: 'Ajay Trading Company',
    contactPerson: 'Ajay Gupta',
    phone: '+91 98765 43210',
    email: 'ajay@example.com',
    category: 'Handicrafts, Textiles',
    address: 'Jaipur, Rajasthan',
    previousOrders: 15,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Nationwide Distributors',
    contactPerson: 'Sanjay Patel',
    phone: '+91 87654 32109',
    email: 'sanjay@example.com',
    category: 'Food Products, Spices',
    address: 'Mumbai, Maharashtra',
    previousOrders: 8,
    rating: 4.5
  },
  {
    id: '3',
    name: 'Bharat Exports Ltd.',
    contactPerson: 'Ravi Kumar',
    phone: '+91 76543 21098',
    email: 'ravi@example.com',
    category: 'Textile, Handlooms',
    address: 'Delhi NCR',
    previousOrders: 22,
    rating: 4.9
  },
  {
    id: '4',
    name: 'Heritage Crafts Group',
    contactPerson: 'Sunita Reddy',
    phone: '+91 65432 10987',
    email: 'sunita@example.com',
    category: 'Handicrafts, Home Decor',
    address: 'Bengaluru, Karnataka',
    previousOrders: 12,
    rating: 4.7
  }
];

// Mock orders for management
const mockOrders = [
  {
    id: 'ORD-001',
    product: 'Handwoven Basket',
    buyer: 'Ajay Trading Company',
    entrepreneur: 'Priya Sharma',
    price: 450,
    quantity: 10,
    status: 'processing',
    date: '2023-11-01'
  },
  {
    id: 'ORD-002',
    product: 'Pickles Set',
    buyer: 'Nationwide Distributors',
    entrepreneur: 'Meena Kumari',
    price: 250,
    quantity: 25,
    status: 'shipped',
    date: '2023-10-25'
  },
  {
    id: 'ORD-003',
    product: 'Jute Bag',
    buyer: 'Heritage Crafts Group',
    entrepreneur: 'Anjali Patel',
    price: 350,
    quantity: 15,
    status: 'delivered',
    date: '2023-10-15'
  },
  {
    id: 'ORD-004',
    product: 'Papad',
    buyer: 'Nationwide Distributors',
    entrepreneur: 'Meena Kumari',
    price: 120,
    quantity: 50,
    status: 'processing',
    date: '2023-11-02'
  }
];

const HubManagerDashboard = () => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const [entrepreneurs, setEntrepreneurs] = useState(mockEntrepreneurs);
  const [wholesalers, setWholesalers] = useState(mockWholesalers);
  const [orders, setOrders] = useState(mockOrders);
  const [searchEntrepreneur, setSearchEntrepreneur] = useState("");
  const [searchWholesaler, setSearchWholesaler] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [viewEntrepreneurId, setViewEntrepreneurId] = useState<string | null>(null);

  // Filter entrepreneurs based on search
  const filteredEntrepreneurs = entrepreneurs.filter(
    entrepreneur => entrepreneur.name.toLowerCase().includes(searchEntrepreneur.toLowerCase()) ||
                    entrepreneur.occupation.toLowerCase().includes(searchEntrepreneur.toLowerCase())
  );

  // Filter wholesalers based on search and category
  const filteredWholesalers = wholesalers.filter(
    wholesaler => (wholesaler.name.toLowerCase().includes(searchWholesaler.toLowerCase()) ||
                  wholesaler.category.toLowerCase().includes(searchWholesaler.toLowerCase()) ||
                  wholesaler.address.toLowerCase().includes(searchWholesaler.toLowerCase())) &&
                  (filterCategory ? wholesaler.category.toLowerCase().includes(filterCategory.toLowerCase()) : true)
  );
  
  // Get entrepreneur details by ID
  const getEntrepreneurDetails = (id: string) => {
    return entrepreneurs.find(entrepreneur => entrepreneur.id === id);
  };
  
  // Viewed entrepreneur details
  const viewedEntrepreneur = viewEntrepreneurId ? getEntrepreneurDetails(viewEntrepreneurId) : null;
  
  // Filter orders by status
  const getOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status);
  };
  
  // Generate stats for dashboard
  const dashboardStats = {
    totalEntrepreneurs: entrepreneurs.length,
    activeProducts: entrepreneurs.reduce((total, entrepreneur) => total + (entrepreneur.products?.length || 0), 0),
    pendingOrders: getOrdersByStatus('processing').length,
    completedOrders: getOrdersByStatus('delivered').length,
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
          <TabsTrigger value="dashboard">{t('dashboard.hubManager.tabs.dashboard')}</TabsTrigger>
          <TabsTrigger value="entrepreneurs">{t('dashboard.hubManager.tabs.entrepreneurs')}</TabsTrigger>
          <TabsTrigger value="wholesalers">{t('dashboard.hubManager.tabs.wholesalers')}</TabsTrigger>
          <TabsTrigger value="profile">{t('dashboard.hubManager.tabs.profile')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Entrepreneurs</p>
                    <h3 className="text-2xl font-bold mt-1">{dashboardStats.totalEntrepreneurs}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Products</p>
                    <h3 className="text-2xl font-bold mt-1">{dashboardStats.activeProducts}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <ShoppingBag size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Orders</p>
                    <h3 className="text-2xl font-bold mt-1">{dashboardStats.pendingOrders}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Clock size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed Orders</p>
                    <h3 className="text-2xl font-bold mt-1">{dashboardStats.completedOrders}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Check size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Manage and track recent product orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Entrepreneur</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.slice(0, 5).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell>{order.entrepreneur}</TableCell>
                      <TableCell>{order.buyer}</TableCell>
                      <TableCell>₹{(order.price * order.quantity).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          order.status === 'delivered' ? 'default' : 
                          order.status === 'shipped' ? 'secondary' : 
                          'outline'
                        }>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {orders.length > 5 && (
                <div className="flex justify-center mt-4">
                  <Button variant="outline">View All Orders</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="entrepreneurs" className="mt-6">
          {viewEntrepreneurId ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Entrepreneur Details</CardTitle>
                  <CardDescription>View and manage entrepreneur information</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setViewEntrepreneurId(null)}>
                  Back to List
                </Button>
              </CardHeader>
              <CardContent>
                {viewedEntrepreneur && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-16 w-16 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold">{viewedEntrepreneur.name}</h2>
                        <p className="text-muted-foreground">{viewedEntrepreneur.occupation}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4" />
                          <span>{viewedEntrepreneur.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4" />
                          <span>{viewedEntrepreneur.email}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant={viewedEntrepreneur.hubManagerPermission ? "default" : "outline"}>
                            {viewedEntrepreneur.hubManagerPermission ? "Management Allowed" : "No Management Permission"}
                          </Badge>
                          <Badge variant="outline">Joined: {viewedEntrepreneur.joinedDate}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="text-lg font-medium">Personal Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Aadhar Number</p>
                          <p className="font-medium">{viewedEntrepreneur.aadharNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Family Income</p>
                          <p className="font-medium">₹{viewedEntrepreneur.familyIncome.toLocaleString()} per annum</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 border-t pt-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Products ({viewedEntrepreneur.products?.length || 0})</h3>
                        {viewedEntrepreneur.hubManagerPermission && (
                          <Button>Add Product for Entrepreneur</Button>
                        )}
                      </div>
                      
                      {viewedEntrepreneur.products && viewedEntrepreneur.products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {viewedEntrepreneur.products.map((product) => (
                            <Card key={product.id}>
                              <CardContent className="p-4">
                                <h4 className="font-medium">{product.name}</h4>
                                <p className="text-sm text-muted-foreground">{product.category}</p>
                                <div className="flex justify-between items-center mt-2">
                                  <p className="font-bold">₹{product.price}</p>
                                  {viewedEntrepreneur.hubManagerPermission && (
                                    <Button variant="outline" size="sm">Edit</Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 border rounded-md bg-muted/10">
                          <p className="text-muted-foreground">No products listed yet</p>
                          {viewedEntrepreneur.hubManagerPermission && (
                            <Button className="mt-4">Help Add First Product</Button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between border-t pt-6">
                      <Button variant="outline">Contact Entrepreneur</Button>
                      <Button>Schedule Training</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>{t('dashboard.hubManager.entrepreneurs.title')}</CardTitle>
                    <CardDescription className="mt-1">{t('dashboard.hubManager.entrepreneurs.description')}</CardDescription>
                  </div>
                  <div className="w-full md:w-64">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder={t('dashboard.hubManager.search')}
                        className="pl-8"
                        value={searchEntrepreneur}
                        onChange={(e) => setSearchEntrepreneur(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('dashboard.hubManager.entrepreneurs.name')}</TableHead>
                        <TableHead>{t('dashboard.hubManager.entrepreneurs.occupation')}</TableHead>
                        <TableHead>{t('dashboard.hubManager.entrepreneurs.products')}</TableHead>
                        <TableHead>{t('dashboard.hubManager.entrepreneurs.permission')}</TableHead>
                        <TableHead className="text-right">{t('dashboard.hubManager.entrepreneurs.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEntrepreneurs.map((entrepreneur) => (
                        <TableRow key={entrepreneur.id}>
                          <TableCell className="font-medium">{entrepreneur.name}</TableCell>
                          <TableCell>{entrepreneur.occupation}</TableCell>
                          <TableCell>{entrepreneur.products.length}</TableCell>
                          <TableCell>
                            {entrepreneur.hubManagerPermission ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-red-500" />
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setViewEntrepreneurId(entrepreneur.id)}
                            >
                              <ChevronRight className="h-4 w-4" />
                              <span className="sr-only">{t('dashboard.hubManager.entrepreneurs.view')}</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {filteredEntrepreneurs.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            {t('dashboard.hubManager.entrepreneurs.noResults')}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-6">
                  <Button>Register New Entrepreneur</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="wholesalers" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>{t('dashboard.hubManager.wholesalers.title')}</CardTitle>
                  <CardDescription className="mt-1">{t('dashboard.hubManager.wholesalers.description')}</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={t('dashboard.hubManager.search')}
                      className="pl-8"
                      value={searchWholesaler}
                      onChange={(e) => setSearchWholesaler(e.target.value)}
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      <SelectItem value="handicrafts">Handicrafts</SelectItem>
                      <SelectItem value="textiles">Textiles</SelectItem>
                      <SelectItem value="food">Food Products</SelectItem>
                      <SelectItem value="home">Home Decor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWholesalers.map((wholesaler) => (
                  <Card key={wholesaler.id} className="overflow-hidden">
                    <CardHeader className="pb-2 bg-muted/10">
                      <CardTitle className="text-lg">{wholesaler.name}</CardTitle>
                      <div className="flex justify-between">
                        <CardDescription>{wholesaler.category}</CardDescription>
                        <Badge variant="outline">{wholesaler.previousOrders} Orders</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{wholesaler.contactPerson}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{wholesaler.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{wholesaler.email}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{wholesaler.address}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">Rating: {wholesaler.rating}/5</span>
                        <div className="ml-2 flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`text-sm ${i < Math.floor(wholesaler.rating) ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between">
                      <Button variant="outline" size="sm">View History</Button>
                      <Button size="sm">
                        {t('dashboard.hubManager.wholesalers.contact')}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                {filteredWholesalers.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p>{t('dashboard.hubManager.wholesalers.noResults')}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline">Import Contacts</Button>
                <Button>Add New Wholesaler</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.hubManager.profile.title')}</CardTitle>
              <CardDescription>
                {t('dashboard.hubManager.profile.description')}
              </CardDescription>
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
                    <Badge className="mt-2">Hub Manager</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          {t('dashboard.hubManager.profile.name')}
                        </h4>
                        <p className="font-medium">{userProfile?.name}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          {t('dashboard.hubManager.profile.email')}
                        </h4>
                        <p className="font-medium">{userProfile?.email}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          {t('dashboard.hubManager.profile.phone')}
                        </h4>
                        <p className="font-medium">{userProfile?.phone || "+91 98765 43210"}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Preferred Language
                        </h4>
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
                    <h3 className="text-lg font-medium mb-4">Hub Information</h3>
                    <div className="space-y-4">
                      {userProfile?.role === 'hub_manager' && (
                        <>
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">
                              {t('dashboard.hubManager.profile.hubName')}
                            </h4>
                            <p className="font-medium">{'hubName' in (userProfile as any) ? 
                              (userProfile as any).hubName : 
                              "Rural Women's Empowerment Hub"}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">
                              {t('dashboard.hubManager.profile.location')}
                            </h4>
                            <p className="font-medium">{'location' in (userProfile as any) ? 
                              (userProfile as any).location : 
                              "Pune, Maharashtra"}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">
                              {t('dashboard.hubManager.profile.entrepreneursCount')}
                            </h4>
                            <p className="font-medium">{'managedEntrepreneurs' in (userProfile as any) ? 
                              (userProfile as any).managedEntrepreneurs.length : 
                              entrepreneurs.length}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">
                              Hub ID
                            </h4>
                            <p className="font-medium">{'hubId' in (userProfile as any) ? 
                              (userProfile as any).hubId : 
                              "HUB-2023-001"}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t flex justify-between">
                  <Button variant="outline">Change Password</Button>
                  <Button>
                    {t('dashboard.hubManager.profile.edit')}
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

export default HubManagerDashboard;
