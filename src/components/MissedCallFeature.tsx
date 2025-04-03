
import { Phone, Volume2, Languages } from 'lucide-react';
import { Button } from "@/components/ui/button";

const MissedCallFeature = () => {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nektech-orange/10 text-nektech-orange font-medium text-sm">
              <Phone size={16} />
              <span>Simple Registration</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              One Missed Call is All You Need
            </h2>
            <p className="text-lg text-muted-foreground">
              Our AI-powered Interactive Voice Response (IVR) system makes business registration accessible to anyone with a basic phone. No smartphone or internet required.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-nektech-orange/10">
                  <Volume2 className="h-5 w-5 text-nektech-orange" />
                </div>
                <div>
                  <h4 className="font-medium">Voice Guidance</h4>
                  <p className="text-sm text-muted-foreground">Step-by-step instructions in your language</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-nektech-orange/10">
                  <Languages className="h-5 w-5 text-nektech-orange" />
                </div>
                <div>
                  <h4 className="font-medium">Multiple Languages</h4>
                  <p className="text-sm text-muted-foreground">Currently in English and Hindi</p>
                </div>
              </div>
            </div>
            
            <Button className="btn-primary mt-4">
              Try Demo Registration
            </Button>
          </div>
          
          <div className="w-full lg:w-1/2 bg-card rounded-xl border shadow-sm p-6">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-medium">IVR Registration Demo</h3>
              <p className="text-sm text-muted-foreground">Experience our registration process</p>
            </div>
            
            <div className="bg-muted p-6 rounded-lg flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-nektech-blue text-white flex items-center justify-center">1</div>
                <div className="flex-1 bg-background p-3 rounded-lg">
                  <p className="text-sm">Give a missed call to <span className="font-medium">080-1234-5678</span></p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-nektech-blue text-white flex items-center justify-center">2</div>
                <div className="flex-1 bg-background p-3 rounded-lg">
                  <p className="text-sm">We call back and ask: "Press 1 for English, 2 for Hindi"</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-nektech-blue text-white flex items-center justify-center">3</div>
                <div className="flex-1 bg-background p-3 rounded-lg">
                  <p className="text-sm">Enter your basic information using phone keypad</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-nektech-blue text-white flex items-center justify-center">4</div>
                <div className="flex-1 bg-background p-3 rounded-lg">
                  <p className="text-sm">Your business is registered! You'll receive a confirmation call.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissedCallFeature;
