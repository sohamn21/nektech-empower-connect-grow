
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Bell, HelpCircle, Download, AlertCircle } from "lucide-react";
import EntrepreneurDashboard from "@/components/dashboard/EntrepreneurDashboard";
import HubManagerDashboard from "@/components/dashboard/HubManagerDashboard";
import BuyerDashboard from "@/components/dashboard/BuyerDashboard";
import CSRDashboard from "@/components/dashboard/CSRDashboard";
import { UserProfile } from "@/types";
import LanguageSelector from "@/components/LanguageSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, isLoading, userProfile, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [isComponentLoading, setIsComponentLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // If user is not authenticated and not loading, redirect to login
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
    
    // Add a small delay to ensure dashboard components have time to load
    const timer = setTimeout(() => {
      setIsComponentLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    // Check for authentication errors
    if (!isLoading && isAuthenticated && !userProfile) {
      setAuthError("Unable to load your profile. Please sign out and try again.");
      
      // Show toast notification
      toast({
        title: "Profile Loading Error",
        description: "We had trouble loading your profile data. Please try signing out and back in.",
        variant: "destructive",
      });
      
      console.log("Authentication issue: User is authenticated but profile data is missing");
    } else {
      setAuthError(null);
    }
  }, [isLoading, isAuthenticated, userProfile]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <p className="text-2xl">{t('dashboard.loading')}</p>
      </div>
    );
  }

  // If no role is set yet, show role selection
  if (!userRole && userProfile) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{t('dashboard.selectRole')}</CardTitle>
              <CardDescription>
                {t('dashboard.selectRoleDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => navigate("/auth")} 
                className="w-full"
                variant="outline"
              >
                {t('dashboard.goToAuth')}
              </Button>
              <Button 
                onClick={() => signOut()} 
                className="w-full"
                variant="destructive"
              >
                {t('dashboard.signOut')}
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // If there's an auth error, show error state
  if (authError) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Card className="w-full max-w-md border-red-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <CardTitle className="text-red-600">{t('dashboard.error')}</CardTitle>
              </div>
              <CardDescription>
                {authError}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This could be due to a database issue or missing profile information.
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-800">
                  <strong>Debugging Info:</strong><br />
                  User Role: {userRole || 'Not set'}<br />
                  Authenticated: {isAuthenticated ? 'Yes' : 'No'}<br />
                  Profile Data: {userProfile ? 'Available' : 'Missing'}
                </p>
              </div>
              <Button 
                onClick={() => signOut()} 
                className="w-full"
                variant="destructive"
              >
                {t('dashboard.signOut')}
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Show appropriate dashboard based on user role
  const renderDashboardContent = () => {
    if (!userProfile) return null;
    
    // Show loading indicator while dashboard components are initializing
    if (isComponentLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>{t('dashboard.loadingContent')}</p>
        </div>
      );
    }
    
    console.log("Current user role:", userRole);
    
    switch (userRole) {
      case "entrepreneur":
        return <EntrepreneurDashboard />;
      case "hub_manager":
        return <HubManagerDashboard />;
      case "buyer":
        return <BuyerDashboard />;
      case "csr":
        return <CSRDashboard />;
      default:
        return (
          <div className="p-8 text-center">
            <p className="text-xl">{t('dashboard.roleNotConfigured')}</p>
            <p className="mt-2">Current role: {userRole || 'Unknown'}</p>
            <div className="mt-6">
              <Button variant="outline" onClick={() => navigate("/auth")}>
                Return to Login
              </Button>
            </div>
          </div>
        );
    }
  };

  // Dashboard header with additional functionality
  const renderDashboardHeader = () => (
    <div className="bg-background border-b py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">
            {t('dashboard.welcome')}, {userProfile?.name}
          </h1>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Bell size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {t('dashboard.notifications')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {t('dashboard.downloadReports')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <HelpCircle size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {t('dashboard.helpCenter')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <LanguageSelector />
          </div>
        </div>
        
        <div className="mt-4">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {t(`dashboard.roles.${userRole || 'unknown'}`)}
          </Badge>
          <p className="text-muted-foreground mt-1">
            {t('dashboard.roleDescription', { role: t(`dashboard.roles.${userRole || 'unknown'}`) })}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {renderDashboardHeader()}
      <main className="flex-grow bg-muted/20">
        <div className="container mx-auto px-4 py-8">
          {renderDashboardContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
