
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ChevronRight, Check, X, User, Phone, Mail, Building } from "lucide-react";

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
    hubManagerPermission: true
  },
  { 
    id: '2', 
    name: 'Lakshmi Devi', 
    aadharNumber: '234567890123', 
    occupation: 'Textile Weaver', 
    familyIncome: 95000,
    products: [],
    hubManagerPermission: false
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
    hubManagerPermission: true
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
    address: 'Jaipur, Rajasthan'
  },
  {
    id: '2',
    name: 'Nationwide Distributors',
    contactPerson: 'Sanjay Patel',
    phone: '+91 87654 32109',
    email: 'sanjay@example.com',
    category: 'Food Products, Spices',
    address: 'Mumbai, Maharashtra'
  },
  {
    id: '3',
    name: 'Bharat Exports Ltd.',
    contactPerson: 'Ravi Kumar',
    phone: '+91 76543 21098',
    email: 'ravi@example.com',
    category: 'Textile, Handlooms',
    address: 'Delhi NCR'
  }
];

const HubManagerDashboard = () => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const [entrepreneurs, setEntrepreneurs] = useState(mockEntrepreneurs);
  const [wholesalers, setWholesalers] = useState(mockWholesalers);
  const [searchEntrepreneur, setSearchEntrepreneur] = useState("");
  const [searchWholesaler, setSearchWholesaler] = useState("");

  // Filter entrepreneurs based on search
  const filteredEntrepreneurs = entrepreneurs.filter(
    entrepreneur => entrepreneur.name.toLowerCase().includes(searchEntrepreneur.toLowerCase()) ||
                    entrepreneur.occupation.toLowerCase().includes(searchEntrepreneur.toLowerCase())
  );

  // Filter wholesalers based on search
  const filteredWholesalers = wholesalers.filter(
    wholesaler => wholesaler.name.toLowerCase().includes(searchWholesaler.toLowerCase()) ||
                  wholesaler.category.toLowerCase().includes(searchWholesaler.toLowerCase()) ||
                  wholesaler.address.toLowerCase().includes(searchWholesaler.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <Tabs defaultValue="entrepreneurs" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto">
          <TabsTrigger value="entrepreneurs">{t('dashboard.hubManager.tabs.entrepreneurs')}</TabsTrigger>
          <TabsTrigger value="wholesalers">{t('dashboard.hubManager.tabs.wholesalers')}</TabsTrigger>
          <TabsTrigger value="profile">{t('dashboard.hubManager.tabs.profile')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="entrepreneurs" className="mt-6">
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
                          <Button variant="ghost" size="sm">
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="wholesalers" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>{t('dashboard.hubManager.wholesalers.title')}</CardTitle>
                  <CardDescription className="mt-1">{t('dashboard.hubManager.wholesalers.description')}</CardDescription>
                </div>
                <div className="w-full md:w-64">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={t('dashboard.hubManager.search')}
                      className="pl-8"
                      value={searchWholesaler}
                      onChange={(e) => setSearchWholesaler(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWholesalers.map((wholesaler) => (
                  <Card key={wholesaler.id} className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{wholesaler.name}</CardTitle>
                      <CardDescription>{wholesaler.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
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
                        <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{wholesaler.address}</span>
                      </div>
                      <div className="pt-2">
                        <Button size="sm" className="w-full">
                          {t('dashboard.hubManager.wholesalers.contact')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredWholesalers.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p>{t('dashboard.hubManager.wholesalers.noResults')}</p>
                  </div>
                )}
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
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <p className="font-medium">{userProfile?.phone || "-"}</p>
                  </div>
                  
                  {userProfile?.role === 'hub_manager' && (
                    <>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          {t('dashboard.hubManager.profile.hubName')}
                        </h4>
                        <p className="font-medium">{'hubName' in (userProfile as any) ? 
                          (userProfile as any).hubName : 
                          "-"}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          {t('dashboard.hubManager.profile.location')}
                        </h4>
                        <p className="font-medium">{'location' in (userProfile as any) ? 
                          (userProfile as any).location : 
                          "-"}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          {t('dashboard.hubManager.profile.entrepreneursCount')}
                        </h4>
                        <p className="font-medium">{'managedEntrepreneurs' in (userProfile as any) ? 
                          (userProfile as any).managedEntrepreneurs.length : 
                          "0"}</p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="pt-4">
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
