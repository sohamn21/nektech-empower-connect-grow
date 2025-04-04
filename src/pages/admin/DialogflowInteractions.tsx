import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download } from "lucide-react";
import { UserInteraction } from "@/types";

const DialogflowInteractions = () => {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading, userProfile, userRole } = useAuth();
  const navigate = useNavigate();
  
  const [interactions, setInteractions] = useState<UserInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [intentFilter, setIntentFilter] = useState<string>("");
  const [languageFilter, setLanguageFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
      return;
    }
    
    // Only admins and CSR role should have access
    if (!isLoading && isAuthenticated && userRole !== "admin" && userRole !== "csr") {
      navigate("/dashboard");
      return;
    }
    
    fetchInteractions();
  }, [isAuthenticated, isLoading, userRole, navigate, page, intentFilter, languageFilter, searchTerm]);
  
  const fetchInteractions = async () => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('user_interactions')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (intentFilter) {
        query = query.eq('intent', intentFilter);
      }
      
      if (languageFilter) {
        query = query.eq('language', languageFilter);
      }
      
      if (searchTerm) {
        query = query.or(`phone_number.ilike.%${searchTerm}%,user_input.ilike.%${searchTerm}%`);
      }
      
      // Pagination
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, count, error } = await query
        .order('timestamp', { ascending: false })
        .range(from, to);
      
      if (error) {
        console.error("Error fetching interactions:", error);
        return;
      }
      
      // Explicitly cast the data to UserInteraction[] type
      const typedData = (data || []) as unknown as UserInteraction[];
      setInteractions(typedData);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error("Error in fetchInteractions:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const downloadCSV = async () => {
    try {
      let query = supabase
        .from('user_interactions')
        .select('*');
      
      // Apply filters
      if (intentFilter) {
        query = query.eq('intent', intentFilter);
      }
      
      if (languageFilter) {
        query = query.eq('language', languageFilter);
      }
      
      if (searchTerm) {
        query = query.or(`phone_number.ilike.%${searchTerm}%,user_input.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('timestamp', { ascending: false });
      
      if (error) {
        console.error("Error fetching data for download:", error);
        return;
      }
      
      // Convert to CSV
      const headers = ['ID', 'Phone Number', 'Intent', 'User Input', 'Language', 'Timestamp'];
      const csvRows = [
        headers.join(','),
        ...((data || []) as unknown as UserInteraction[]).map(item => [
          item.id,
          item.phone_number || '',
          item.intent,
          `"${(item.user_input || '').replace(/"/g, '""')}"`,
          item.language,
          item.timestamp
        ].join(','))
      ];
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', `dialogflow-interactions-${new Date().toISOString().split('T')[0]}.csv`);
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error in downloadCSV:", error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <p className="text-2xl">{t('dashboard.loading')}</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-muted/20 py-8">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Dialogflow User Interactions</CardTitle>
                  <CardDescription>
                    View and analyze user interactions from Dialogflow IVR system
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={downloadCSV}>
                  <Download className="h-4 w-4 mr-2" /> Export CSV
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search by phone number or input..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select
                    value={intentFilter}
                    onValueChange={setIntentFilter}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by intent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All intents</SelectItem>
                      <SelectItem value="Welcome">Welcome</SelectItem>
                      <SelectItem value="Options">Options</SelectItem>
                      <SelectItem value="ProductInfo">Product Info</SelectItem>
                      <SelectItem value="Training">Training</SelectItem>
                      <SelectItem value="Marketplace">Marketplace</SelectItem>
                      <SelectItem value="Goodbye">Goodbye</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={languageFilter}
                    onValueChange={setLanguageFilter}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All languages</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="mr">Marathi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : interactions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No interactions found
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Phone Number</TableHead>
                          <TableHead>Intent</TableHead>
                          <TableHead>User Input</TableHead>
                          <TableHead>Language</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {interactions.map(interaction => (
                          <TableRow key={interaction.id}>
                            <TableCell className="whitespace-nowrap">
                              {formatDate(interaction.timestamp)}
                            </TableCell>
                            <TableCell>
                              {interaction.phone_number || 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {interaction.intent}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {interaction.user_input || 'N/A'}
                            </TableCell>
                            <TableCell>
                              {interaction.language === 'en' ? 'English' : 
                               interaction.language === 'hi' ? 'Hindi' : 
                               interaction.language === 'mr' ? 'Marathi' : 
                               interaction.language}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          let pageNumber;
                          if (totalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (page <= 3) {
                            pageNumber = i + 1;
                          } else if (page >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                          } else {
                            pageNumber = page - 2 + i;
                          }
                          
                          return (
                            <PaginationItem key={i}>
                              <PaginationLink
                                onClick={() => setPage(pageNumber)}
                                isActive={page === pageNumber}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DialogflowInteractions;
