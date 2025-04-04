
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Download,
  Users,
  ShoppingBag,
  TrendingUp,
  BadgeIndianRupee
} from "lucide-react";

// Mock data for impact metrics
const impactData = [
  { name: 'Jan', entrepreneurs: 45, products: 78, revenue: 25000 },
  { name: 'Feb', entrepreneurs: 50, products: 90, revenue: 30000 },
  { name: 'Mar', entrepreneurs: 62, products: 110, revenue: 37000 },
  { name: 'Apr', entrepreneurs: 70, products: 125, revenue: 45000 },
  { name: 'May', entrepreneurs: 85, products: 150, revenue: 58000 },
  { name: 'Jun', entrepreneurs: 95, products: 180, revenue: 67000 }
];

// Mock data for initiative funding
const initiativesData = [
  { name: 'Training Programs', value: 35 },
  { name: 'Equipment Support', value: 30 },
  { name: 'Marketing Initiatives', value: 20 },
  { name: 'Logistics Support', value: 15 }
];

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Mock initiatives data
const initiatives = [
  {
    id: '1',
    title: 'Digital Skills Training',
    description: 'Training program for basic digital literacy skills',
    fundingGoal: 100000,
    currentFunding: 75000,
    beneficiaries: 120,
    startDate: '2023-01-15',
    endDate: '2023-12-15',
    status: 'active'
  },
  {
    id: '2',
    title: 'Artisan Equipment Modernization',
    description: 'Providing modern equipment to traditional artisans',
    fundingGoal: 250000,
    currentFunding: 125000,
    beneficiaries: 85,
    startDate: '2023-03-10',
    endDate: '2023-09-10',
    status: 'active'
  },
  {
    id: '3',
    title: 'Rural Market Connect',
    description: 'Connecting rural entrepreneurs to urban markets',
    fundingGoal: 180000,
    currentFunding: 180000,
    beneficiaries: 150,
    startDate: '2022-08-01',
    endDate: '2023-08-01',
    status: 'completed'
  }
];

const CSRDashboard = () => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const [activeInitiatives, setActiveInitiatives] = useState(initiatives.filter(i => i.status === 'active'));
  
  return (
    <div className="space-y-8">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
          <TabsTrigger value="dashboard">{t('dashboard.csr.tabs.dashboard')}</TabsTrigger>
          <TabsTrigger value="initiatives">{t('dashboard.csr.tabs.initiatives')}</TabsTrigger>
          <TabsTrigger value="reports">{t('dashboard.csr.tabs.reports')}</TabsTrigger>
          <TabsTrigger value="profile">{t('dashboard.csr.tabs.profile')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('dashboard.csr.metrics.entrepreneurs')}
                    </p>
                    <h3 className="text-2xl font-bold mt-1">95</h3>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-xs text-green-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+11.8% from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('dashboard.csr.metrics.products')}
                    </p>
                    <h3 className="text-2xl font-bold mt-1">180</h3>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-xs text-green-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+20% from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('dashboard.csr.metrics.revenue')}
                    </p>
                    <h3 className="text-2xl font-bold mt-1">₹67,000</h3>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <BadgeIndianRupee className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-xs text-green-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+15.5% from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('dashboard.csr.metrics.initiatives')}
                    </p>
                    <h3 className="text-2xl font-bold mt-1">3</h3>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-xs">
                  <span>2 active, 1 completed</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.csr.charts.growth')}</CardTitle>
                <CardDescription>{t('dashboard.csr.charts.growthDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={impactData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="entrepreneurs" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="products" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.csr.charts.funding')}</CardTitle>
                <CardDescription>{t('dashboard.csr.charts.fundingDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={initiativesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {initiativesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Active initiatives */}
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.csr.activeInitiatives')}</CardTitle>
              <CardDescription>{t('dashboard.csr.activeInitiativesDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activeInitiatives.map((initiative) => (
                  <div key={initiative.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-medium">{initiative.title}</h3>
                        <p className="text-muted-foreground text-sm mt-1">{initiative.description}</p>
                      </div>
                      <Button size="sm">
                        {t('dashboard.csr.viewDetails')}
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          {t('dashboard.csr.funding', { 
                            current: initiative.currentFunding.toLocaleString(), 
                            goal: initiative.fundingGoal.toLocaleString() 
                          })}
                        </span>
                        <span className="font-medium">
                          {((initiative.currentFunding / initiative.fundingGoal) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress 
                        value={(initiative.currentFunding / initiative.fundingGoal) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="flex flex-wrap justify-between mt-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">{t('dashboard.csr.beneficiaries')}: </span>
                        <span className="font-medium">{initiative.beneficiaries}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('dashboard.csr.timeline')}: </span>
                        <span className="font-medium">
                          {new Date(initiative.startDate).toLocaleDateString()} - 
                          {new Date(initiative.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="initiatives" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>{t('dashboard.csr.initiatives.title')}</CardTitle>
                  <CardDescription className="mt-1">{t('dashboard.csr.initiatives.description')}</CardDescription>
                </div>
                <Button>
                  {t('dashboard.csr.initiatives.newInitiative')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {initiatives.map((initiative) => (
                  <div 
                    key={initiative.id} 
                    className={`border rounded-lg p-4 ${initiative.status === 'completed' ? 'bg-muted/20' : ''}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium">{initiative.title}</h3>
                          {initiative.status === 'completed' ? (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              {t('dashboard.csr.initiatives.completed')}
                            </span>
                          ) : (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              {t('dashboard.csr.initiatives.active')}
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">{initiative.description}</p>
                      </div>
                      <Button size="sm" variant={initiative.status === 'completed' ? 'outline' : 'default'}>
                        {t('dashboard.csr.initiatives.manage')}
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          {t('dashboard.csr.funding', { 
                            current: initiative.currentFunding.toLocaleString(), 
                            goal: initiative.fundingGoal.toLocaleString() 
                          })}
                        </span>
                        <span className="font-medium">
                          {((initiative.currentFunding / initiative.fundingGoal) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress 
                        value={(initiative.currentFunding / initiative.fundingGoal) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="flex flex-wrap justify-between mt-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">{t('dashboard.csr.beneficiaries')}: </span>
                        <span className="font-medium">{initiative.beneficiaries}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('dashboard.csr.timeline')}: </span>
                        <span className="font-medium">
                          {new Date(initiative.startDate).toLocaleDateString()} - 
                          {new Date(initiative.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.csr.reports.title')}</CardTitle>
              <CardDescription>
                {t('dashboard.csr.reports.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['monthlyImpact', 'quarterlyAnalytics', 'annualReport', 'taxBenefits'].map((reportType, index) => (
                  <div key={index} className="flex items-center justify-between border rounded-lg p-4">
                    <div>
                      <h3 className="font-medium">{t(`dashboard.csr.reports.types.${reportType}.title`)}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t(`dashboard.csr.reports.types.${reportType}.description`)}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      {t('dashboard.csr.reports.download')}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.csr.profile.title')}</CardTitle>
              <CardDescription>
                {t('dashboard.csr.profile.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      {t('dashboard.csr.profile.name')}
                    </h4>
                    <p className="font-medium">{userProfile?.name}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      {t('dashboard.csr.profile.email')}
                    </h4>
                    <p className="font-medium">{userProfile?.email}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      {t('dashboard.csr.profile.phone')}
                    </h4>
                    <p className="font-medium">{userProfile?.phone || "-"}</p>
                  </div>
                  
                  {userProfile?.role === 'csr' && (
                    <>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          {t('dashboard.csr.profile.organization')}
                        </h4>
                        <p className="font-medium">{'organizationName' in (userProfile as any) ? 
                          (userProfile as any).organizationName : 
                          "-"}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          {t('dashboard.csr.profile.registrationNumber')}
                        </h4>
                        <p className="font-medium">{'registrationNumber' in (userProfile as any) ? 
                          (userProfile as any).registrationNumber : 
                          "-"}</p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="pt-4">
                  <Button>
                    {t('dashboard.csr.profile.edit')}
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

export default CSRDashboard;
