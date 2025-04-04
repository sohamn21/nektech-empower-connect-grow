import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Headphones, FileText, User, PenSquare } from "lucide-react";
import { EntrepreneurProfile } from "@/types";

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'Handwoven Basket',
    description: 'Beautifully crafted traditional handwoven basket',
    price: 450,
    category: 'Handicrafts',
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
    images: ['https://placehold.co/600x400/png'],
    status: 'active',
    created_at: '2023-07-22T14:30:00Z'
  }
];

// Mock training resources
const mockTrainings = [
  {
    id: '1',
    title: 'Marketing Basics',
    description: 'Learn how to market your products effectively',
    type: 'audio',
    language: 'Hindi',
    duration: '15 min',
    date: '2023-08-10'
  },
  {
    id: '2',
    title: 'Pricing Strategies',
    description: 'How to price your products for maximum profit',
    type: 'video',
    language: 'English',
    duration: '12 min',
    date: '2023-09-05'
  },
  {
    id: '3',
    title: 'Quality Control',
    description: 'Maintaining consistent quality in your products',
    type: 'audio',
    language: 'Marathi',
    duration: '18 min',
    date: '2023-10-20'
  }
];

// Mock schemes
const mockSchemes = [
  {
    id: '1',
    title: 'Mudra Loan Scheme',
    description: 'Government scheme providing loans up to ₹10 lakh for small enterprises without collateral',
    eligibility: 'Any Indian citizen with a business plan',
    benefits: ['Loans without collateral', 'Low interest rates', 'Flexible repayment options'],
    applicationUrl: 'https://example.com/mudra'
  },
  {
    id: '2',
    title: 'Stand-Up India',
    description: 'Facilitates bank loans between ₹10 lakh and ₹1 crore for SC/ST and women entrepreneurs',
    eligibility: 'Women entrepreneurs or SC/ST entrepreneurs',
    benefits: ['Composite loan', 'Training programs', 'Facilitation support'],
    applicationUrl: 'https://example.com/standup'
  }
];

const EntrepreneurDashboard = () => {
  const { t } = useTranslation();
  const { userProfile, updateUserProfile } = useAuth();
  const [products, setProducts] = useState(mockProducts);
  const [hubManagerPermission, setHubManagerPermission] = useState(
    userProfile?.role === 'entrepreneur' && 
    'hubManagerPermission' in (userProfile as EntrepreneurProfile) ? 
    (userProfile as EntrepreneurProfile).hubManagerPermission : false
  );

  // Toggle hub manager permission
  const handleTogglePermission = async () => {
    const newPermissionValue = !hubManagerPermission;
    setHubManagerPermission(newPermissionValue);
    
    if (userProfile && userProfile.role === 'entrepreneur') {
      try {
        const entrepreneurProfile = userProfile as EntrepreneurProfile;
        await updateUserProfile({
          ...entrepreneurProfile,
          hubManagerPermission: newPermissionValue
        } as EntrepreneurProfile);
      } catch (error) {
        console.error("Failed to update permission:", error);
        setHubManagerPermission(!newPermissionValue);
      }
    }
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
          <TabsTrigger value="products">{t('dashboard.entrepreneur.tabs.products')}</TabsTrigger>
          <TabsTrigger value="training">{t('dashboard.entrepreneur.tabs.training')}</TabsTrigger>
          <TabsTrigger value="schemes">{t('dashboard.entrepreneur.tabs.schemes')}</TabsTrigger>
          <TabsTrigger value="profile">{t('dashboard.entrepreneur.tabs.profile')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.entrepreneur.addProduct')}</CardTitle>
                <CardDescription>{t('dashboard.entrepreneur.addProductDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-name">Product Name</Label>
                      <Input id="product-name" placeholder="Enter product name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-price">Price (₹)</Label>
                      <Input id="product-price" type="number" placeholder="Enter price" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-category">Category</Label>
                      <Input id="product-category" placeholder="e.g. Handicrafts, Textiles" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-image">Product Image</Label>
                      <Input id="product-image" type="file" className="cursor-pointer" accept="image/*" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-description">Description</Label>
                    <Textarea 
                      id="product-description" 
                      placeholder="Describe your product"
                      rows={3}
                    />
                  </div>
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('dashboard.entrepreneur.addProductButton')}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Products</CardTitle>
                    <CardDescription>All your listed products appear here</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hub-permission"
                      checked={hubManagerPermission}
                      onCheckedChange={handleTogglePermission}
                    />
                    <Label htmlFor="hub-permission">{t('dashboard.entrepreneur.hubPermission')}</Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        <div className="aspect-video w-full overflow-hidden">
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="pt-4">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-muted-foreground text-sm">{product.category}</p>
                            <p className="font-medium">₹{product.price}</p>
                          </div>
                          <p className="text-sm mt-2 line-clamp-2">{product.description}</p>
                        </CardContent>
                        <CardFooter className="border-t pt-4 flex justify-between">
                          <Button variant="outline" size="sm">
                            <PenSquare className="h-4 w-4 mr-1" />
                            {t('dashboard.entrepreneur.edit')}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-lg bg-muted/20">
                    <p className="text-muted-foreground mb-2">{t('dashboard.entrepreneur.noProducts')}</p>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      {t('dashboard.entrepreneur.productsDescription')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="training" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Resources</CardTitle>
              <CardDescription>Access voice-based training and educational content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTrainings.map((training) => (
                  <Card key={training.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex items-center justify-center bg-primary/10 p-6 md:w-40">
                        <Headphones className="h-12 w-12 text-primary" />
                      </div>
                      <CardContent className="p-4 md:p-6 flex-1">
                        <div className="flex items-start justify-between flex-col md:flex-row">
                          <div>
                            <h3 className="font-semibold text-lg">{training.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{training.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                {training.language}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {training.duration}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {training.date}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="mt-4 md:mt-0">
                            Listen Now
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schemes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Government Schemes & Support</CardTitle>
              <CardDescription>Access financial and business support offered by government</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSchemes.map((scheme) => (
                  <Card key={scheme.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        <CardTitle className="text-lg">{scheme.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">{scheme.description}</p>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium">Eligibility:</h4>
                          <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Benefits:</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                            {scheme.benefits.map((benefit, index) => (
                              <li key={index}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button asChild>
                        <a href={scheme.applicationUrl} target="_blank" rel="noopener noreferrer">
                          Apply Now
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.entrepreneur.tabs.profile')}</CardTitle>
              <CardDescription>View and edit your profile information</CardDescription>
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
                    {userProfile?.role === 'entrepreneur' && 'occupation' in (userProfile as any) && (
                      <p className="mt-1">{(userProfile as any).occupation}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {userProfile?.role === 'entrepreneur' && (
                    <>
                      <div>
                        <Label className="text-sm text-muted-foreground">Aadhar Number</Label>
                        <p className="font-medium">
                          {'aadharNumber' in (userProfile as any) ? 
                            (userProfile as any).aadharNumber : 
                            "-"}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-muted-foreground">Family Income</Label>
                        <p className="font-medium">
                          {'familyIncome' in (userProfile as any) ? 
                            `₹${(userProfile as any).familyIncome.toLocaleString()}` : 
                            "-"}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-muted-foreground">Preferred Language</Label>
                        <p className="font-medium">
                          {userProfile.preferredLanguage === 'en' ? 'English' : 
                           userProfile.preferredLanguage === 'hi' ? 'हिन्दी' : 
                           userProfile.preferredLanguage === 'mr' ? 'मराठी' : 
                           userProfile.preferredLanguage}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-muted-foreground">Hub Manager Permission</Label>
                        <p className="font-medium">
                          {hubManagerPermission ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex justify-start pt-4">
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
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

export default EntrepreneurDashboard;
