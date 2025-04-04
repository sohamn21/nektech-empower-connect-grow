
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import EntrepreneurDashboard from "@/components/dashboard/EntrepreneurDashboard";
import HubManagerDashboard from "@/components/dashboard/HubManagerDashboard";
import BuyerDashboard from "@/components/dashboard/BuyerDashboard";
import CSRDashboard from "@/components/dashboard/CSRDashboard";
import { UserProfile } from "@/types";

const Dashboard = () => {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading, userProfile, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not authenticated and not loading, redirect to login
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

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

  // Show appropriate dashboard based on user role
  const renderDashboardContent = () => {
    if (!userProfile) return null;

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
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              {t('dashboard.welcome')}, {userProfile?.name}
            </h1>
            <p className="text-muted-foreground">
              {t('dashboard.roleDescription', { role: t(`dashboard.roles.${userRole || 'unknown'}`) })}
            </p>
          </div>

          {renderDashboardContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
