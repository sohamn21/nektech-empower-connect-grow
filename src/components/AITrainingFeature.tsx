
import { useState } from 'react';
import { BookOpen, Mic, MessageCircle, Calendar, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";

const AITrainingFeature = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [trainingContent, setTrainingContent] = useState("");
  const [topic, setTopic] = useState("pricing your products");

  const generateTrainingContent = async () => {
    if (!user) {
      // If not authenticated, show a message to sign in
      setTrainingContent("Please sign in to generate training content.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gemini-training', {
        body: { prompt: topic }
      });

      if (error) throw error;
      
      setTrainingContent(data.content);
    } catch (error) {
      console.error("Error generating training content:", error);
      setTrainingContent("Sorry, we couldn't generate training content at this time. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nektech-orange/10 text-nektech-orange font-medium text-sm">
              <BookOpen size={16} />
              <span>Business Knowledge</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              AI-Powered Training
            </h2>
            <p className="text-lg text-muted-foreground">
              Receive personalized business training through voice calls and WhatsApp messages. Learn essential skills at your own pace, in your preferred language.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-nektech-orange/10">
                  <Mic className="h-5 w-5 text-nektech-orange" />
                </div>
                <div>
                  <h4 className="font-medium">Voice-Based Learning</h4>
                  <p className="text-sm text-muted-foreground">No reading required</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-nektech-orange/10">
                  <Calendar className="h-5 w-5 text-nektech-orange" />
                </div>
                <div>
                  <h4 className="font-medium">Weekly Updates</h4>
                  <p className="text-sm text-muted-foreground">Regular business tips</p>
                </div>
              </div>
            </div>
            
            <Button className="btn-primary mt-4" onClick={generateTrainingContent} disabled={isLoading || !user}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Training Content'
              )}
            </Button>
            {!user && (
              <p className="text-sm text-muted-foreground mt-2">
                Please sign in to generate personalized training content.
              </p>
            )}
          </div>
          
          <div className="w-full lg:w-1/2 bg-card rounded-xl border shadow-sm">
            <Tabs defaultValue="ivr" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="ivr">IVR Training</TabsTrigger>
                <TabsTrigger value="whatsapp">WhatsApp Training</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ivr" className="p-6">
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Mic className="h-4 w-4 text-nektech-orange" />
                      <h4 className="font-medium">Sample Training Call</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {trainingContent || "Hello Meena, this is your NEKTECH business coach. Today we'll learn about setting the right price for your handcrafted items..."}
                    </p>
                    <div className="flex justify-center">
                      <Button variant="outline" size="sm">
                        <div className="w-3 h-3 rounded-full bg-nektech-orange mr-2"></div>
                        Play Sample
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Topics Covered</h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-nektech-orange"></div>
                        <span>Pricing Strategies</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-nektech-orange"></div>
                        <span>Marketing Basics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-nektech-orange"></div>
                        <span>Customer Relations</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-nektech-orange"></div>
                        <span>Financial Management</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="whatsapp" className="p-6">
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <MessageCircle className="h-4 w-4 text-nektech-orange" />
                      <h4 className="font-medium">WhatsApp Tutorial</h4>
                    </div>
                    
                    <div className="bg-background p-3 rounded-lg mb-3">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-nektech-blue flex-shrink-0"></div>
                        <div>
                          <p className="text-xs font-medium text-nektech-blue mb-1">NEKTECH Coach</p>
                          <p className="text-xs bg-blue-50 p-2 rounded-lg">
                            {trainingContent || "Here's today's business tip: Take clear photos of your products to increase sales. Let me show you how..."}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button variant="outline" size="sm">
                        View Full Tutorial
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">WhatsApp Features</h4>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-nektech-orange"></div>
                        <span>Visual Guides with Images</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-nektech-orange"></div>
                        <span>Voice Message Instructions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-nektech-orange"></div>
                        <span>Interactive Q&A Sessions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-nektech-orange"></div>
                        <span>Downloadable Resources</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AITrainingFeature;
