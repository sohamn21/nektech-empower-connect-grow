
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GovScheme } from "@/types";
import { Play, Upload, ShoppingBag, School, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Mock government schemes data
const mockGovSchemes: GovScheme[] = [
  {
    id: "1",
    title: "Pradhan Mantri Mudra Yojana",
    description: "Financial support up to ₹10 lakh for small entrepreneurs to help them start or expand their business",
    eligibilityCriteria: {
      maxIncome: 300000,
      eligibleOccupations: ["artisan", "farmer", "small business"]
    },
    benefits: [
      "Collateral-free loans",
      "Flexible repayment options",
      "Low interest rates"
    ],
    applicationUrl: "https://www.mudra.org.in"
  },
  {
    id: "2",
    title: "Deen Dayal Upadhyaya Grameen Kaushalya Yojana",
    description: "Skills training program for rural youth to enhance their employability",
    eligibilityCriteria: {
      maxAge: 35,
      eligibleLocations: ["rural"]
    },
    benefits: [
      "Free skills training",
      "Certification",
      "Placement assistance"
    ],
    applicationUrl: "https://ddugky.gov.in"
  },
  {
    id: "3",
    title: "PM SVANidhi",
    description: "Micro credit scheme for street vendors",
    eligibilityCriteria: {
      eligibleOccupations: ["street vendor"]
    },
    benefits: [
      "Working capital loan up to ₹10,000",
      "Interest subsidy",
      "Cashback incentives for digital transactions"
    ],
    applicationUrl: "https://pmsvanidhi.mohua.gov.in"
  }
];

const EntrepreneurDashboard = () => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const [eligibleSchemes, setEligibleSchemes] = useState<GovScheme[]>([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Filter schemes based on user profile
    if (userProfile) {
      // In a real app, this would be a backend API call
      const filteredSchemes = mockGovSchemes.filter(scheme => {
        // Filter based on income if applicable
        if (scheme.eligibilityCriteria.maxIncome && 
            userProfile.role === 'entrepreneur' && 
            (userProfile as any).familyIncome > scheme.eligibilityCriteria.maxIncome) {
          return false;
        }
        
        // Filter based on occupation if applicable
        if (scheme.eligibilityCriteria.eligibleOccupations && 
            userProfile.role === 'entrepreneur' && 
            !scheme.eligibilityCriteria.eligibleOccupations.includes((userProfile as any).occupation)) {
          return false;
        }
        
        return true;
      });
      
      setEligibleSchemes(filteredSchemes);
      setIsLoading(false);
    }
  }, [userProfile]);

  const playVoiceGuidance = (text: string) => {
    // In a real app, this would use a text-to-speech API
    console.log("Playing voice guidance:", text);
    // Text-to-speech implementation would go here
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
            <Card className="border-dashed border-2">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('dashboard.entrepreneur.addProduct')}</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  {t('dashboard.entrepreneur.addProductDescription')}
                </p>
                <Button className="mt-auto">
                  {t('dashboard.entrepreneur.addProductButton')}
                </Button>
              </CardContent>
            </Card>
            
            {/* Placeholder for product cards */}
            <Card className="opacity-40">
              <CardHeader>
                <CardTitle>{t('dashboard.entrepreneur.sampleProduct')}</CardTitle>
                <CardDescription>{t('dashboard.entrepreneur.sampleCategory')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted rounded-md flex items-center justify-center mb-4">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">₹500</span>
                  <Button variant="outline" size="sm" disabled>
                    {t('dashboard.entrepreneur.edit')}
                  </Button>
                </div>
              </CardContent>
            </Card>
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
                        <School className="h-5 w-5 mr-3 text-nektech-orange" />
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
