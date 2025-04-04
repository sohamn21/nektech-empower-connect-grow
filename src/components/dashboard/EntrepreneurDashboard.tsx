
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GovScheme, Product, DatabaseScheme, Json } from "@/types";
import { Play, Upload, ShoppingBag, School, FileText, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  category: z.string().min(1, { message: "Please select a category" }),
  location: z.string().min(2, { message: "Location must be at least 2 characters" }),
});

const EntrepreneurDashboard = () => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const [eligibleSchemes, setEligibleSchemes] = useState<GovScheme[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      location: "",
    },
  });

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      if (!userProfile) return;
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('owner_id', userProfile.id);
          
        if (error) throw error;
        
        setProducts(data as Product[]);
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
  }, [userProfile, toast]);

  // Fetch schemes from Supabase
  useEffect(() => {
    const fetchSchemes = async () => {
      if (!userProfile) return;
      
      try {
        const { data: rawData, error } = await supabase
          .from('schemes')
          .select('*');
          
        if (error) throw error;
        
        // Convert database schemes to our application GovScheme format
        const dbSchemes = rawData as DatabaseScheme[];
        const schemes: GovScheme[] = dbSchemes.map(scheme => {
          // Parse eligibility_criteria JSON
          const criteria = scheme.eligibility_criteria as Record<string, any>;
          
          return {
            id: scheme.id,
            title: scheme.title,
            description: scheme.description,
            eligibility_criteria: {
              minIncome: criteria?.minIncome,
              maxIncome: criteria?.maxIncome,
              eligibleOccupations: criteria?.eligibleOccupations,
              eligibleLocations: criteria?.eligibleLocations,
              eligibleCategories: criteria?.eligibleCategories,
              minAge: criteria?.minAge,
              maxAge: criteria?.maxAge,
            },
            benefits: scheme.benefits,
            application_url: scheme.application_url,
            created_at: scheme.created_at
          };
        });
        
        // Filter schemes based on user profile criteria
        if (schemes && userProfile.role === 'entrepreneur') {
          const filteredSchemes = schemes.filter(scheme => {
            const criteria = scheme.eligibility_criteria;
            if (!criteria) return true;
            
            // Check income criteria
            if (criteria.maxIncome && (userProfile as any).familyIncome > criteria.maxIncome) {
              return false;
            }
            
            // Check occupation criteria
            if (criteria.eligibleOccupations && 
                !criteria.eligibleOccupations.includes((userProfile as any).occupation)) {
              return false;
            }
            
            return true;
          });
          
          setEligibleSchemes(filteredSchemes);
        }
      } catch (error: any) {
        console.error('Error fetching schemes:', error.message);
      }
    };

    fetchSchemes();
  }, [userProfile]);

  const onSubmitProduct = async (data: z.infer<typeof productSchema>) => {
    if (!userProfile) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          owner_id: userProfile.id,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          location: data.location,
          images: [],
          status: 'active'
        });
        
      if (error) throw error;
      
      toast({
        title: "Product added",
        description: "Your product has been successfully added.",
      });
      
      // Reload products
      const { data: newProducts, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('owner_id', userProfile.id);
        
      if (fetchError) throw fetchError;
      
      setProducts(newProducts as Product[]);
      setIsProductDialogOpen(false);
      form.reset();
    } catch (error: any) {
      console.error('Error adding product:', error.message);
      toast({
        variant: "destructive",
        title: "Failed to add product",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const playVoiceGuidance = (text: string) => {
    // In a real app, this would use a text-to-speech API
    console.log("Playing voice guidance:", text);
    toast({
      title: "Voice Guidance",
      description: "Playing: " + text,
    });
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Add product card */}
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Card className="border-dashed border-2 cursor-pointer hover:bg-accent/10 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                    <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">{t('dashboard.entrepreneur.addProduct')}</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      {t('dashboard.entrepreneur.addProductDescription')}
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{t('dashboard.entrepreneur.addProductTitle')}</DialogTitle>
                  <DialogDescription>
                    {t('dashboard.entrepreneur.addProductDialogDescription')}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmitProduct)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter product name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe your product" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (₹)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Handicrafts">Handicrafts</SelectItem>
                                <SelectItem value="Textiles">Textiles</SelectItem>
                                <SelectItem value="Food">Food</SelectItem>
                                <SelectItem value="Jewelry">Jewelry</SelectItem>
                                <SelectItem value="Home Decor">Home Decor</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Your location" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Product"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            
            {/* Product cards */}
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
                    <span className="font-medium">₹{product.price}</span>
                    <Button variant="outline" size="sm">
                      {t('dashboard.entrepreneur.edit')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {products.length === 0 && !isLoading && (
              <div className="col-span-full text-center py-6 text-muted-foreground">
                {t('dashboard.entrepreneur.noProducts')}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="training" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.entrepreneur.training.voice')}</CardTitle>
                <CardDescription>
                  {t('dashboard.entrepreneur.training.voiceDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    'marketingBasics', 
                    'productPricing', 
                    'customerService'
                  ].map((module, index) => (
                    <div key={index} className="flex items-center justify-between border p-4 rounded-md">
                      <div className="flex items-center">
                        <School className="h-5 w-5 mr-3 text-primary" />
                        <span>{t(`dashboard.entrepreneur.training.modules.${module}`)}</span>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => 
                        playVoiceGuidance(t(`dashboard.entrepreneur.training.modules.${module}`))
                      }>
                        <Play className="h-4 w-4 mr-1" />
                        {t('dashboard.entrepreneur.training.play')}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.entrepreneur.training.whatsapp')}</CardTitle>
                <CardDescription>
                  {t('dashboard.entrepreneur.training.whatsappDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4 space-y-4">
                  <p className="text-sm">{t('dashboard.entrepreneur.training.whatsappInstructions')}</p>
                  <Button className="w-full">
                    {t('dashboard.entrepreneur.training.subscribe')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="schemes" className="mt-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{t('dashboard.entrepreneur.schemes.title')}</h3>
            <p className="text-muted-foreground">{t('dashboard.entrepreneur.schemes.description')}</p>
          </div>
          
          <div className="space-y-6">
            {eligibleSchemes.map((scheme) => (
              <Card key={scheme.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{scheme.title}</CardTitle>
                      <CardDescription className="mt-1">{scheme.description}</CardDescription>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => playVoiceGuidance(`${scheme.title}. ${scheme.description}`)}
                    >
                      <Play className="h-4 w-4 mr-1" /> 
                      {t('dashboard.entrepreneur.schemes.listen')}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">{t('dashboard.entrepreneur.schemes.benefits')}</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {scheme.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm">{benefit}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={scheme.applicationUrl} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4 mr-2" />
                          {t('dashboard.entrepreneur.schemes.apply')}
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {eligibleSchemes.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p>{t('dashboard.entrepreneur.schemes.noSchemes')}</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.entrepreneur.profile.title')}</CardTitle>
              <CardDescription>
                {t('dashboard.entrepreneur.profile.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      {t('dashboard.entrepreneur.profile.name')}
                    </h4>
                    <p className="font-medium">{userProfile?.name}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      {t('dashboard.entrepreneur.profile.email')}
                    </h4>
                    <p className="font-medium">{userProfile?.email}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      {t('dashboard.entrepreneur.profile.phone')}
                    </h4>
                    <p className="font-medium">{userProfile?.phone || "-"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      {t('dashboard.entrepreneur.profile.language')}
                    </h4>
                    <p className="font-medium">{userProfile?.preferredLanguage === 'en' ? 'English' : 
                      userProfile?.preferredLanguage === 'hi' ? 'हिन्दी (Hindi)' : 
                      userProfile?.preferredLanguage === 'mr' ? 'मराठी (Marathi)' : 
                      userProfile?.preferredLanguage}</p>
                  </div>
                  
                  {userProfile?.role === 'entrepreneur' && (
                    <>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          {t('dashboard.entrepreneur.profile.aadhar')}
                        </h4>
                        <p className="font-medium">{'aadharNumber' in (userProfile as any) ? 
                          (userProfile as any).aadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3') : 
                          "-"}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          {t('dashboard.entrepreneur.profile.occupation')}
                        </h4>
                        <p className="font-medium">{'occupation' in (userProfile as any) ? 
                          (userProfile as any).occupation : 
                          "-"}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          {t('dashboard.entrepreneur.profile.income')}
                        </h4>
                        <p className="font-medium">{'familyIncome' in (userProfile as any) ? 
                          `₹${(userProfile as any).familyIncome.toLocaleString()}` : 
                          "-"}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          {t('dashboard.entrepreneur.profile.hubManagerPermission')}
                        </h4>
                        <p className="font-medium">{'hubManagerPermission' in (userProfile as any) ? 
                          ((userProfile as any).hubManagerPermission ? 'Granted' : 'Not Granted') : 
                          "Not Granted"}</p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="pt-4">
                  <Button>
                    {t('dashboard.entrepreneur.profile.edit')}
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
