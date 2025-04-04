
import { useState } from 'react';
import { BookOpen, Mic, MessageCircle, Calendar, Loader2, Phone, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from 'react-i18next';

const AITrainingFeature = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [trainingContent, setTrainingContent] = useState("");
  const [topic, setTopic] = useState("pricing your products");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

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

      // Auto-animation for the content
      const contentElements = document.querySelectorAll('.training-content');
      contentElements.forEach(element => {
        element.classList.add('animate-fade-in');
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

  const scheduleVoiceCall = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber || !scheduledDate || !scheduledTime) {
      toast({
        title: "Missing Information",
        description: "Please fill all the required fields",
        variant: "destructive"
      });
      return;
    }

    setIsScheduling(true);
    try {
      const { data, error } = await supabase.functions.invoke('schedule-training-call', {
        body: { 
          phoneNumber: phoneNumber,
          scheduledDate: scheduledDate,
          scheduledTime: scheduledTime,
          topic: topic,
          userId: user?.id
        }
      });

      if (error) throw error;
      
      toast({
        title: "Call Scheduled",
        description: `Your training call has been scheduled for ${scheduledDate} at ${scheduledTime}`,
      });

      // Reset form
      setPhoneNumber("");
      setScheduledDate("");
      setScheduledTime("");
    } catch (error) {
      console.error("Error scheduling call:", error);
      toast({
        title: "Scheduling Failed",
        description: "There was an error scheduling your call. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const sendWhatsAppMessage = async () => {
    if (!phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please enter your WhatsApp number",
        variant: "destructive"
      });
      return;
    }

    if (!trainingContent) {
      toast({
        title: "No Content",
        description: "Please generate training content first",
        variant: "destructive"
      });
      return;
    }

    setIsSendingWhatsApp(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp-training', {
        body: { 
          phoneNumber: phoneNumber,
          content: trainingContent,
          topic: topic,
          userId: user?.id
        }
      });

      if (error) throw error;
      
      toast({
        title: "Message Sent",
        description: "Training content has been sent to your WhatsApp",
      });
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      toast({
        title: "Sending Failed",
        description: "There was an error sending the WhatsApp message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSendingWhatsApp(false);
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nektech-orange/10 text-nektech-orange font-medium text-sm animate-fade-in">
              <BookOpen size={16} className="animate-pulse-gentle" />
              <span>{t('aiTraining.badge')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold animate-fade-in" style={{ animationDelay: '100ms' }}>
              {t('aiTraining.title')}
            </h2>
            <p className="text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: '200ms' }}>
              {t('aiTraining.description')}
            </p>
            
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center gap-3">
                <label htmlFor="topic" className="text-sm font-medium">{t('aiTraining.selectTopic')}:</label>
                <select 
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="border rounded px-3 py-2 bg-card shadow-sm transition-all hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {availableTopics.map((availableTopic) => (
                    <option key={availableTopic} value={availableTopic}>
                      {t(`aiTraining.topics.${availableTopic.replace(/\s/g, '')}`)}
                    </option>
                  ))}
                </select>
              </div>
              
              <Button 
                className="btn-primary relative overflow-hidden group"
                onClick={generateTrainingContent} 
                disabled={isLoading || !user}
              >
                <span className="relative z-10 flex items-center">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('aiTraining.generating')}
                    </>
                  ) : (
                    <>
                      <BookOpen className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                      {t('aiTraining.generateButton')}
                    </>
                  )}
                </span>
                <span className="absolute inset-0 bg-nektech-orange/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              </Button>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 bg-card rounded-xl border shadow-sm transition-all duration-500 hover:shadow-lg animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Tabs defaultValue="ivr" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="ivr" className="transition-all data-[state=active]:bg-nektech-orange data-[state=active]:text-white">
                  <Phone className="h-4 w-4 mr-2" />
                  {t('aiTraining.tabs.ivr')}
                </TabsTrigger>
                <TabsTrigger value="whatsapp" className="transition-all data-[state=active]:bg-nektech-blue data-[state=active]:text-white">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {t('aiTraining.tabs.whatsapp')}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="ivr" className="p-6 animate-fade-in">
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <Mic className="h-4 w-4 text-nektech-orange animate-pulse-gentle" />
                      <h4 className="font-medium">{t('aiTraining.ivr.title')}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 training-content">
                      {trainingContent || t('aiTraining.ivr.placeholder')}
                    </p>

                    <div className="mt-6 border-t pt-4">
                      <h5 className="font-medium mb-3">Schedule Voice Training Call</h5>
                      <form onSubmit={scheduleVoiceCall} className="space-y-3">
                        <div>
                          <label htmlFor="phone-number" className="text-sm font-medium block mb-1">Phone Number</label>
                          <Input 
                            id="phone-number" 
                            placeholder="+91 1234567890" 
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className="transition-all duration-300 focus:ring-nektech-orange"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label htmlFor="date" className="text-sm font-medium block mb-1">Date</label>
                            <Input 
                              id="date" 
                              type="date" 
                              value={scheduledDate}
                              onChange={(e) => setScheduledDate(e.target.value)}
                              required
                              className="transition-all duration-300 focus:ring-nektech-orange"
                            />
                          </div>
                          <div>
                            <label htmlFor="time" className="text-sm font-medium block mb-1">Time</label>
                            <Input 
                              id="time" 
                              type="time" 
                              value={scheduledTime}
                              onChange={(e) => setScheduledTime(e.target.value)}
                              required
                              className="transition-all duration-300 focus:ring-nektech-orange"
                            />
                          </div>
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-nektech-orange text-white hover:bg-nektech-orange/90 transition-colors hover:shadow-md"
                          disabled={isScheduling}
                        >
                          {isScheduling ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Scheduling...
                            </>
                          ) : (
                            <>
                              <Phone className="mr-2 h-4 w-4" />
                              Schedule Call
                            </>
                          )}
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="whatsapp" className="p-6 animate-fade-in">
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <MessageCircle className="h-4 w-4 text-nektech-blue animate-pulse-gentle" />
                      <h4 className="font-medium">{t('aiTraining.whatsapp.title')}</h4>
                    </div>
                    
                    <div className="bg-background p-3 rounded-lg mb-3">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-nektech-blue flex-shrink-0"></div>
                        <div>
                          <p className="text-xs font-medium text-nektech-blue mb-1">{t('aiTraining.whatsapp.coach')}</p>
                          <p className="text-xs bg-blue-50 p-2 rounded-lg training-content">
                            {trainingContent || t('aiTraining.whatsapp.placeholder')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 border-t pt-4">
                      <div className="space-y-3">
                        <div>
                          <label htmlFor="whatsapp-number" className="text-sm font-medium block mb-1">WhatsApp Number</label>
                          <Input 
                            id="whatsapp-number" 
                            placeholder="+91 1234567890" 
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="transition-all duration-300 focus:ring-nektech-blue"
                          />
                        </div>
                        <Button 
                          onClick={sendWhatsAppMessage} 
                          className="w-full bg-nektech-blue text-white hover:bg-nektech-blue/90 transition-colors hover:shadow-md"
                          disabled={isSendingWhatsApp || !trainingContent}
                        >
                          {isSendingWhatsApp ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send to WhatsApp
                            </>
                          )}
                        </Button>
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
