
import { useState } from 'react';
import { BookOpen, Mic, MessageCircle, Calendar, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from 'react-i18next';

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
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nektech-orange/10 text-nektech-orange font-medium text-sm">
              <BookOpen size={16} />
              <span>{t('aiTraining.badge')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              {t('aiTraining.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('aiTraining.description')}
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <label htmlFor="topic" className="text-sm font-medium">{t('aiTraining.selectTopic')}:</label>
                <select 
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  {availableTopics.map((availableTopic) => (
                    <option key={availableTopic} value={availableTopic}>
                      {t(`aiTraining.topics.${availableTopic.replace(/\s/g, '')}`)}
                    </option>
                  ))}
                </select>
              </div>
              
              <Button 
                className="btn-primary" 
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
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 bg-card rounded-xl border shadow-sm">
            <Tabs defaultValue="ivr" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="ivr">{t('aiTraining.tabs.ivr')}</TabsTrigger>
                <TabsTrigger value="whatsapp">{t('aiTraining.tabs.whatsapp')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ivr" className="p-6">
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Mic className="h-4 w-4 text-nektech-orange" />
                      <h4 className="font-medium">{t('aiTraining.ivr.title')}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {trainingContent || t('aiTraining.ivr.placeholder')}
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="whatsapp" className="p-6">
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <MessageCircle className="h-4 w-4 text-nektech-orange" />
                      <h4 className="font-medium">{t('aiTraining.whatsapp.title')}</h4>
                    </div>
                    
                    <div className="bg-background p-3 rounded-lg mb-3">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-nektech-blue flex-shrink-0"></div>
                        <div>
                          <p className="text-xs font-medium text-nektech-blue mb-1">{t('aiTraining.whatsapp.coach')}</p>
                          <p className="text-xs bg-blue-50 p-2 rounded-lg">
                            {trainingContent || t('aiTraining.whatsapp.placeholder')}
                          </p>
                        </div>
                      </div>
                    </div>
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
