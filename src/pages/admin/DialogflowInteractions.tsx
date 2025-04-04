import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserInteraction } from "@/types";
import { formatDistance } from "date-fns";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center mt-4">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        size="sm"
      >
        Previous
      </Button>
      {pageNumbers.map((number) => (
        <Button
          key={number}
          onClick={() => onPageChange(number)}
          variant={currentPage === number ? "default" : "outline"}
          size="sm"
        >
          {number}
        </Button>
      ))}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        size="sm"
      >
        Next
      </Button>
    </div>
  );
};

const DialogflowInteractions = () => {
  const { userRole, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [interactions, setInteractions] = useState<UserInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [phoneFilter, setPhoneFilter] = useState("");
  const [intentFilter, setIntentFilter] = useState("");

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (userRole !== "admin" && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [userRole, isAuthenticated, navigate]);

  useEffect(() => {
    fetchInteractions();
  }, [currentPage, phoneFilter, intentFilter]);

  const fetchInteractions = async () => {
    setLoading(true);
    
    try {
      // Use type assertion for the user_interactions table
      let query = supabase
        .from("user_interactions" as any)
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (phoneFilter) {
        query = query.ilike('phone_number', `%${phoneFilter}%`);
      }
      
      if (intentFilter) {
        query = query.ilike('intent', `%${intentFilter}%`);
      }
      
      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      query = query
        .order('timestamp', { ascending: false })
        .range(from, to);
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error("Error fetching interactions:", error.message);
        setInteractions([]);
        setTotalPages(1);
        setLoading(false);
        return;
      }
      
      // Use type assertion to handle the data
      setInteractions(data as unknown as UserInteraction[]);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error("Error in fetchInteractions:", error);
      setInteractions([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  
  const downloadCSV = async () => {
    try {
      // Use type assertion for the user_interactions table
      let query = supabase
        .from("user_interactions" as any)
        .select('*');
      
      // Apply filters
      if (phoneFilter) {
        query = query.ilike('phone_number', `%${phoneFilter}%`);
      }
      
      if (intentFilter) {
        query = query.ilike('intent', `%${intentFilter}%`);
      }
      
      query = query.order('timestamp', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error downloading data:", error.message);
        return;
      }
      
      if (!data || data.length === 0) {
        console.warn("No data to download");
        return;
      }
      
      // Create CSV content
      const headers = ['ID', 'Phone Number', 'Intent', 'User Input', 'Language', 'Timestamp'];
      const csvRows = [
        headers.join(','),
        ...((data as unknown as UserInteraction[]) || []).map(item => [
          item.id,
          item.phone_number || '',
          item.intent,
          item.user_input || '',
          item.language,
          item.timestamp
        ].map(value => `"${String(value).replace(/"/g, '""')}"`).join(','))
      ];
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'user_interactions.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating CSV:", error);
    }
  };

  if (isLoading || !isAuthenticated || userRole !== "admin") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Dialogflow Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div>
              <Input
                type="text"
                placeholder="Filter by Phone Number"
                value={phoneFilter}
                onChange={(e) => {
                  setPhoneFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Filter by Intent"
                value={intentFilter}
                onChange={(e) => {
                  setIntentFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div>
              <Button onClick={downloadCSV}>Download CSV</Button>
            </div>
          </div>

          {loading ? (
            <div>Loading interactions...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Intent</TableHead>
                    <TableHead>User Input</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Time Ago</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interactions.map((interaction) => (
                    <TableRow key={interaction.id}>
                      <TableCell>{interaction.id}</TableCell>
                      <TableCell>{interaction.phone_number}</TableCell>
                      <TableCell>{interaction.intent}</TableCell>
                      <TableCell>{interaction.user_input}</TableCell>
                      <TableCell>{interaction.language}</TableCell>
                      <TableCell>{interaction.timestamp}</TableCell>
                      <TableCell>
                        {formatDistance(
                          new Date(interaction.timestamp),
                          new Date(),
                          {
                            addSuffix: true,
                          }
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DialogflowInteractions;
