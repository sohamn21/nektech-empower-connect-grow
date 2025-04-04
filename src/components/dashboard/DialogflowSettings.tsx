
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { InfoIcon, ClipboardCopy, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

const DialogflowSettings = () => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  
  const webhookUrl = `${window.location.protocol}//${window.location.host}/functions/v1/dialogflow-webhook`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    
    toast({
      title: "URL Copied",
      description: "Webhook URL has been copied to clipboard"
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Dialogflow Integration
          <Badge variant="outline" className="ml-2">
            Active
          </Badge>
        </CardTitle>
        <CardDescription>
          Configure your Dialogflow agent to use this webhook for fulfillment
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex gap-2">
            <InfoIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Integration Steps</h4>
              <ol className="mt-2 text-sm text-amber-700 list-decimal list-inside space-y-2">
                <li>Go to Dialogflow ES console and select your agent</li>
                <li>Navigate to Fulfillment in the sidebar</li>
                <li>Enable webhook and paste the URL below</li>
                <li>Add the header: <code className="bg-amber-100 px-1 py-0.5 rounded">Authorization: Bearer YOUR_API_KEY</code></li>
                <li>Set the API key in your Supabase Edge Function secrets</li>
              </ol>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <Label htmlFor="webhook-url">Webhook URL</Label>
          <div className="flex gap-2">
            <Input 
              id="webhook-url" 
              value={webhookUrl} 
              readOnly 
              className="font-mono text-sm"
            />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleCopy}
              className="flex-shrink-0"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <ClipboardCopy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Use this URL in your Dialogflow agent's fulfillment settings
          </p>
        </div>
        
        <div className="space-y-2 mt-4">
          <Label htmlFor="api-key">API Key</Label>
          <p className="text-sm text-muted-foreground">
            You need to set the <code className="bg-muted px-1 py-0.5 rounded">DIALOGFLOW_API_KEY</code> secret in your Supabase project.
            Also set <code className="bg-muted px-1 py-0.5 rounded">TWILIO_ACCOUNT_SID</code> and <code className="bg-muted px-1 py-0.5 rounded">TWILIO_AUTH_TOKEN</code> for Twilio integration.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Supports English, Hindi, and Marathi responses
        </div>
      </CardFooter>
    </Card>
  );
};

export default DialogflowSettings;
