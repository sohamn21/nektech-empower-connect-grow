
import { Landmark, ShieldCheck, RefreshCw, CreditCard } from 'lucide-react';
import { Button } from "@/components/ui/button";

const BlockchainFeature = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 bg-card rounded-xl border shadow-sm p-6">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-medium">Payment Demo</h3>
              <p className="text-sm text-muted-foreground">See how secure transactions work</p>
            </div>
            
            <div className="bg-muted p-6 rounded-lg space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Transaction Fee</p>
                  <p className="text-xl font-medium text-nektech-blue">0.1%</p>
                  <p className="text-xs text-muted-foreground">vs 2-3% traditional</p>
                </div>
                <div className="bg-background p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Settlement Time</p>
                  <p className="text-xl font-medium text-nektech-blue">Minutes</p>
                  <p className="text-xs text-muted-foreground">vs 3-5 days traditional</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-0 h-full w-0.5 bg-nektech-blue/30"></div>
                
                <div className="relative pl-10 pb-6">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-nektech-blue text-white flex items-center justify-center">
                    <ShieldCheck size={16} />
                  </div>
                  <h4 className="font-medium">Secure Transaction</h4>
                  <p className="text-sm text-muted-foreground">Customer payment is securely processed on blockchain</p>
                </div>
                
                <div className="relative pl-10 pb-6">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-nektech-blue text-white flex items-center justify-center">
                    <RefreshCw size={16} />
                  </div>
                  <h4 className="font-medium">Instant Verification</h4>
                  <p className="text-sm text-muted-foreground">Both parties receive confirmation</p>
                </div>
                
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-nektech-blue text-white flex items-center justify-center">
                    <CreditCard size={16} />
                  </div>
                  <h4 className="font-medium">Easy Withdrawal</h4>
                  <p className="text-sm text-muted-foreground">Visit any NEKTECH hub to collect cash</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nektech-blue/10 text-nektech-blue font-medium text-sm">
              <Landmark size={16} />
              <span>Secure Finances</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Blockchain-Powered Payments
            </h2>
            <p className="text-lg text-muted-foreground">
              Our blockchain technology ensures your transactions are secure, transparent, and affordable. No middlemen means more profit stays in your pocket.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">No Hidden Fees</h4>
                <p className="text-sm text-muted-foreground">Transparent pricing with minimal transaction costs</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Easy Cash Withdrawal</h4>
                <p className="text-sm text-muted-foreground">Visit any NEKTECH hub in your community</p>
              </div>
            </div>
            
            <Button className="btn-secondary mt-4">
              Learn About Blockchain
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlockchainFeature;
