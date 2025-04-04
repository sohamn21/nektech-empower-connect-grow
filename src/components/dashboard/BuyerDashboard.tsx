
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Product, TableNames } from "@/types";
import { ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";

const BuyerDashboard = () => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Using as const to specify the exact table name
        const tableName = "products" as const;
        const { data, error } = await supabase
          .from(tableName)
          .select(`
            *,
            profiles:owner_id(name)
          `)
          .eq('status', 'active');
          
        if (error) throw error;
        
        // Transform the data to match our Product interface
        const transformedProducts = data.map((product: any) => ({
          ...product,
          owner: product.profiles
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
  
  return (
    <div className="space-y-8">
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="products">{t('dashboard.buyer.tabs.products')}</TabsTrigger>
          <TabsTrigger value="profile">{t('dashboard.buyer.tabs.profile')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{formatCurrency(product.price)}</span>
                    <Button variant="outline" size="sm">
                      {t('dashboard.buyer.view')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {products.length === 0 && !isLoading && (
              <div className="col-span-full text-center py-6 text-muted-foreground">
                {t('dashboard.buyer.noProducts')}
              </div>
            )}
          </div>
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
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      {t('dashboard.buyer.profile.language')}
                    </h4>
                    <p className="font-medium">{userProfile?.preferredLanguage === 'en' ? 'English' : 
                      userProfile?.preferredLanguage === 'hi' ? 'हिन्दी (Hindi)' : 
                      userProfile?.preferredLanguage === 'mr' ? 'मराठी (Marathi)' : 
                      userProfile?.preferredLanguage}</p>
                  </div>
                  
                  {userProfile?.role === 'buyer' && (
                    <>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          {t('dashboard.buyer.profile.companyName')}
                        </h4>
                        <p className="font-medium">{(userProfile as any).companyName || "-"}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          {t('dashboard.buyer.profile.businessType')}
                        </h4>
                        <p className="font-medium">{(userProfile as any).businessType || "-"}</p>
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
