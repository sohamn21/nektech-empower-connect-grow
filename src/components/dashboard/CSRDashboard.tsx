
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ChevronRight, User, Calendar, Download, FileText } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// Mock impact data
const impactData = {
  totalEntrepreneurs: 125,
  totalProducts: 350,
  averageIncomeIncrease: 32,
  regionsImpacted: 12,
  livesImpacted: 625,
  monthlyGrowth: [
    { month: 'Jan', entrepreneurs: 85, products: 210 },
    { month: 'Feb', entrepreneurs: 90, products: 230 },
    { month: 'Mar', entrepreneurs: 95, products: 250 },
    { month: 'Apr', entrepreneurs: 105, products: 270 },
    { month: 'May', entrepreneurs: 110, products: 290 },
    { month: 'Jun', entrepreneurs: 115, products: 310 },
    { month: 'Jul', entrepreneurs: 125, products: 350 }
  ],
  categoryDistribution: [
    { name: 'Handicrafts', value: 30 },
    { name: 'Textiles', value: 25 },
    { name: 'Food Products', value: 20 },
    { name: 'Home Decor', value: 15 },
    { name: 'Jewelry', value: 10 }
  ],
  regionDistribution: [
    { name: 'Maharashtra', value: 35 },
    { name: 'Rajasthan', value: 25 },
    { name: 'Gujarat', value: 20 },
    { name: 'Karnataka', value: 12 },
    { name: 'Other', value: 8 }
  ]
};

// Mock initiatives
const mockInitiatives = [
  {
    id: '1',
    title: 'Rural Craft Revival Program',
    description: 'Supporting traditional artisans and preserving cultural heritage through technology enablement.',
    budget: 500000,
    progress: 60,
    startDate: '2023-01-15',
    endDate: '2023-12-31',
    status: 'active',
    entrepreneurs: 45,
    location: 'Rajasthan, Maharashtra'
  },
  {
    id: '2',
    title: 'Women\'s Digital Literacy Campaign',
    description: 'Teaching digital skills to women entrepreneurs to help them access online marketplaces.',
    budget: 350000,
    progress: 75,
    startDate: '2023-03-10',
    endDate: '2023-09-30',
    status: 'active',
    entrepreneurs: 60,
    location: 'Gujarat, Karnataka'
  },
  {
    id: '3',
    title: 'Sustainable Agriculture Support',
    description: 'Helping women farmers adopt sustainable practices and find markets for organic produce.',
    budget: 400000,
    progress: 25,
    startDate: '2023-06-01',
    endDate: '2024-05-31',
    status: 'potential',
    entrepreneurs: 0,
    location: 'Maharashtra, Karnataka'
  }
];

// Mock reports
const mockReports = [
  { 
    id: '1', 
    name: 'Q1 2023 Impact Report', 
    period: 'Jan - Mar 2023',
    type: 'quarterly',
    date: '2023-04-15',
    fileUrl: '#'
  },
  { 
    id: '2', 
    name: 'Q2 2023 Impact Report', 
    period: 'Apr - Jun 2023',
    type: 'quarterly',
    date: '2023-07-15',
    fileUrl: '#'
  },
  { 
    id: '3', 
    name: 'CSR Tax Benefit Documentation FY 2022-23', 
    period: 'FY 2022-23',
    type: 'tax',
    date: '2023-05-30',
    fileUrl: '#'
  }
];

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const CSRDashboard = () => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const [activeInitiatives, setActiveInitiatives] = useState(
    mockInitiatives.filter(initiative => initiative.status === 'active')
  );
  const [potentialInitiatives, setPotentialInitiatives] = useState(
    mockInitiatives.filter(initiative => initiative.status === 'potential')
  );
  const [reports, setReports] = useState(mockReports);

  return (
    <div className="space-y-8">
      <Tabs defaultValue="impact" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
          <TabsTrigger value="impact">{t('dashboard.csr.tabs.impact')}</TabsTrigger>
          <TabsTrigger value="initiatives">{t('dashboard.csr.tabs.initiatives')}</TabsTrigger>
          <TabsTrigger value="reports">{t('dashboard.csr.tabs.reports')}</TabsTrigger>
          <TabsTrigger value="profile">{t('dashboard.csr.tabs.profile')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="impact" className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('dashboard.csr.impact.title')}</CardTitle>
              <CardDescription>{t('dashboard.csr.impact.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">{t('dashboard.csr.impact.totalEntrepreneurs')}</p>
                    <p className="text-3xl font-bold">{impactData.totalEntrepreneurs}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">{t('dashboard.csr.impact.totalProducts')}</p>
                    <p className="text-3xl font-bold">{impactData.totalProducts}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">{t('dashboard.csr.impact.averageIncome')}</p>
                    <p className="text-3xl font-bold">+{impactData.averageIncomeIncrease}%</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">{t('dashboard.csr.impact.regionsImpacted')}</p>
                    <p className="text-3xl font-bold">{impactData.regionsImpacted}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">{t('dashboard.csr.impact.livesImpacted')}</p>
                    <p className="text-3xl font-bold">{impactData.livesImpacted}</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Growth Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={impactData.monthlyGrowth}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="entrepreneurs" 
                            stroke="#8884d8" 
                            name="Entrepreneurs" 
                            activeDot={{ r: 8 }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="products" 
                            stroke="#82ca9d" 
                            name="Products" 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Product Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={impactData.categoryDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={0}
                              outerRadius={80}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="value"
                              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {impactData.categoryDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Regional Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={impactData.regionDistribution}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                          >
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8">
                              {impactData.regionDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <Button>
                  {t('dashboard.csr.impact.viewDetailedReport')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="initiatives" className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('dashboard.csr.initiatives.title')}</CardTitle>
              <CardDescription>{t('dashboard.csr.initiatives.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">{t('dashboard.csr.initiatives.activeInitiatives')}</h3>
                  
                  {activeInitiatives.length > 0 ? (
                    <div className="space-y-4">
                      {activeInitiatives.map((initiative) => (
                        <Card key={initiative.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle>{initiative.title}</CardTitle>
                              <Badge>{initiative.entrepreneurs} entrepreneurs</Badge>
                            </div>
                            <CardDescription>{initiative.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span>Progress</span>
                                <span>{initiative.progress}%</span>
                              </div>
                              <Progress value={initiative.progress} className="h-2" />
                              
                              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span>{initiative.startDate} to {initiative.endDate}</span>
                                </div>
                                <div>
                                  <Badge variant="outline" className="font-normal">
                                    Budget: ₹{(initiative.budget / 100000).toFixed(1)} lakh
                                  </Badge>
                                </div>
                                <div>
                                  <Badge variant="secondary" className="font-normal">
                                    {initiative.location}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="border-t pt-4 flex justify-between">
                            <Button variant="outline">
                              {t('dashboard.csr.initiatives.viewDetails')}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border rounded-lg bg-muted/20">
                      <p className="text-muted-foreground">{t('dashboard.csr.initiatives.noInitiatives')}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {t('dashboard.csr.initiatives.noInitiativesDescription')}
                      </p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">{t('dashboard.csr.initiatives.potentialInitiatives')}</h3>
                  
                  <div className="space-y-4">
                    {potentialInitiatives.map((initiative) => (
                      <Card key={initiative.id}>
                        <CardHeader>
                          <CardTitle>{initiative.title}</CardTitle>
                          <CardDescription>{initiative.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>Planned: {initiative.startDate} to {initiative.endDate}</span>
                            </div>
                            <div>
                              <Badge variant="outline" className="font-normal">
                                Budget: ₹{(initiative.budget / 100000).toFixed(1)} lakh
                              </Badge>
                            </div>
                            <div>
                              <Badge variant="secondary" className="font-normal">
                                {initiative.location}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4 flex justify-between">
                          <Button variant="outline">
                            {t('dashboard.csr.initiatives.viewDetails')}
                          </Button>
                          <Button>
                            {t('dashboard.csr.initiatives.contribute')}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.csr.reports.title')}</CardTitle>
              <CardDescription>{t('dashboard.csr.reports.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center space-y-4">
                        <FileText className="h-12 w-12 text-primary" />
                        <h3 className="font-medium">{t('dashboard.csr.reports.downloadTaxBenefits')}</h3>
                        <Button>
                          <Download className="h-4 w-4 mr-2" />
                          Download Document
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center space-y-4">
                        <FileText className="h-12 w-12 text-primary" />
                        <h3 className="font-medium">{t('dashboard.csr.reports.downloadImpactReport')}</h3>
                        <Button>
                          <Download className="h-4 w-4 mr-2" />
                          Download Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">{t('dashboard.csr.reports.quarterlyReports')}</h3>
                  
                  {reports.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">{t('dashboard.csr.reports.period')}</th>
                            <th className="text-left py-3 px-4">Name</th>
                            <th className="text-left py-3 px-4">{t('dashboard.csr.reports.type')}</th>
                            <th className="text-left py-3 px-4">Date</th>
                            <th className="text-right py-3 px-4">{t('dashboard.csr.reports.download')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reports
                            .filter(report => report.type === 'quarterly')
                            .map((report) => (
                              <tr key={report.id} className="border-b hover:bg-muted/50">
                                <td className="py-3 px-4">{report.period}</td>
                                <td className="py-3 px-4 font-medium">{report.name}</td>
                                <td className="py-3 px-4">
                                  <Badge variant="outline">
                                    Quarterly
                                  </Badge>
                                </td>
                                <td className="py-3 px-4">{report.date}</td>
                                <td className="py-3 px-4 text-right">
                                  <Button asChild size="sm" variant="ghost">
                                    <a href={report.fileUrl}>
                                      <Download className="h-4 w-4" />
                                      <span className="sr-only">Download</span>
                                    </a>
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6 border rounded-lg bg-muted/20">
                      <p className="text-muted-foreground">{t('dashboard.csr.reports.noReports')}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">{t('dashboard.csr.reports.annualReports')}</h3>
                  
                  <div className="text-center py-6 border rounded-lg bg-muted/20">
                    <p className="text-muted-foreground">{t('dashboard.csr.reports.noReports')}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {t('dashboard.csr.reports.noReportsDescription')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.csr.profile.title')}</CardTitle>
              <CardDescription>{t('dashboard.csr.profile.description')}</CardDescription>
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
                    {userProfile?.role === 'csr' && 'organizationName' in (userProfile as any) && (
                      <p className="mt-1">{(userProfile as any).organizationName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">{t('dashboard.csr.profile.phone')}</Label>
                    <p className="font-medium">{userProfile?.phone || '-'}</p>
                  </div>
                  
                  {userProfile?.role === 'csr' && (
                    <>
                      <div>
                        <Label className="text-sm text-muted-foreground">{t('dashboard.csr.profile.organization')}</Label>
                        <p className="font-medium">
                          {'organizationName' in (userProfile as any) ? 
                            (userProfile as any).organizationName : 
                            '-'}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-muted-foreground">{t('dashboard.csr.profile.registrationNumber')}</Label>
                        <p className="font-medium">
                          {'registrationNumber' in (userProfile as any) ? 
                            (userProfile as any).registrationNumber : 
                            '-'}
                        </p>
                      </div>
                    </>
                  )}
                  
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
                
                <div className="flex justify-start pt-4">
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
