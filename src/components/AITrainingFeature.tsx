
import { useState } from 'react';
import { BookOpen, Mic, MessageCircle, Loader2, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const AITrainingFeature = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [trainingContent, setTrainingContent] = useState("");
  const [topic, setTopic] = useState("pricing your products");

  const generateTrainingContent = async () => {
    if (!user) {
      toast({
        title: t('aiTraining.authRequired.title'),
        description: t('aiTraining.authRequired.description'),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gemini-training', {
        body: { 
          prompt: topic,
          language: "English" // Default language, can be made dynamic
        }
      });

      if (error) throw error;
      
      setTrainingContent(data.content);
      toast({
        title: t('aiTraining.contentGenerated.title'),
        description: t('aiTraining.contentGenerated.description'),
      });
    } catch (error) {
      console.error("Error generating training content:", error);
      toast({
        title: t('aiTraining.error.title'),
        description: t('aiTraining.error.description'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const availableTopics = [
    "pricing your products",
    "marketing basics",
    "financial management",
    "customer relations",
    "digital marketing"
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-white to-muted/50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-nektech-orange/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-nektech-blue/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nektech-orange/10 text-nektech-orange font-medium text-sm animate-fade-in">
              <Sparkles size={16} />
              <span>{t('aiTraining.badge')}</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold animate-fade-in" style={{ animationDelay: '100ms' }}>
              <span className="gradient-text">{t('aiTraining.title')}</span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
              {t('aiTraining.description')}
            </p>
            
            <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label htmlFor="topic" className="text-sm font-medium min-w-24">
                  {t('aiTraining.selectTopic')}:
                </label>
                <select 
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full sm:w-auto border rounded-md px-3 py-2 bg-background focus:border-nektech-orange focus:ring-1 focus:ring-nektech-orange outline-none"
                >
                  {availableTopics.map((availableTopic) => (
                    <option key={availableTopic} value={availableTopic}>
                      {t(`aiTraining.topics.${availableTopic.replace(/\s/g, '')}`)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button 
                  className="btn-primary group" 
                  onClick={generateTrainingContent} 
                  disabled={isLoading || !user}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('aiTraining.generating')}
                    </>
                  ) : (
                    t('aiTraining.generateButton')
                  )}
                </Button>
                
                {!user && (
                  <Link to="/auth">
                    <Button variant="outline">
                      {t('hero.getStarted')}
                    </Button>
                  </Link>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground">
                {user ? "Generate personalized training content based on your business needs." : "Sign in to generate personalized training content."}
              </p>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 bg-card rounded-xl border shadow-md overflow-hidden animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Tabs defaultValue="ivr" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger 
                  value="ivr" 
                  className="data-[state=active]:bg-nektech-orange/10 data-[state=active]:text-nektech-orange"
                >
                  {t('aiTraining.tabs.ivr')}
                </TabsTrigger>
                <TabsTrigger 
                  value="whatsapp"
                  className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-600"
                >
                  {t('aiTraining.tabs.whatsapp')}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="ivr" className="p-6 bg-gradient-to-br from-white to-nektech-orange/5">
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-nektech-orange/10 rounded-full flex items-center justify-center">
                        <Mic className="h-5 w-5 text-nektech-orange" />
                      </div>
                      <h4 className="font-medium">{t('aiTraining.ivr.title')}</h4>
                    </div>
                    
                    {trainingContent ? (
                      <div className="prose prose-sm max-w-none">
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                          {trainingContent}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground">
                          {t('aiTraining.ivr.placeholder')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="whatsapp" className="p-6 bg-gradient-to-br from-white to-green-500/5">
                <div className="space-y-4">
                  <div className="bg-[#E6F7EC] p-5 rounded-lg shadow-sm border border-green-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <h4 className="font-medium">{t('aiTraining.whatsapp.title')}</h4>
                    </div>
                    
                    {trainingContent ? (
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">AI</div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-green-700 mb-1">{t('aiTraining.whatsapp.coach')}</p>
                            <div className="bg-green-50 p-3 rounded-lg text-sm">
                              {trainingContent}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground">
                          {t('aiTraining.whatsapp.placeholder')}
                        </p>
                      </div>
                    )}
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
