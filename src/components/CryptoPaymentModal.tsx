
import { useState, useEffect } from 'react';
import { X, ExternalLink, Copy, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { createCryptoPayment, getAvailableCurrencies, CreatePaymentResponse, getPaymentStatus } from '@/utils/nowPayments';

interface CryptoPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  productId: string;
  amount: number;
  onSuccess?: () => void;
}

const CryptoPaymentModal = ({
  open,
  onOpenChange,
  productName,
  productId,
  amount,
  onSuccess
}: CryptoPaymentModalProps) => {
  const [selectedCrypto, setSelectedCrypto] = useState('btc');
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<CreatePaymentResponse | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  // Fetch available currencies when modal opens
  useEffect(() => {
    if (open) {
      fetchAvailableCurrencies();
    } else {
      // Reset state when modal closes
      setPayment(null);
      setPaymentStatus(null);
      setLoading(false);
      setCopied(false);
    }
  }, [open]);

  // Check payment status periodically if payment exists
  useEffect(() => {
    let interval: number | null = null;
    
    if (payment?.payment_id && open) {
      interval = window.setInterval(checkPaymentStatus, 10000); // Check every 10 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [payment, open]);

  const fetchAvailableCurrencies = async () => {
    try {
      const currencies = await getAvailableCurrencies();
      setAvailableCurrencies(currencies);
    } catch (error) {
      console.error('Error fetching currencies:', error);
      toast({
        title: "Couldn't fetch cryptocurrencies",
        description: "Using default options instead.",
        variant: "destructive",
      });
      setAvailableCurrencies(['btc', 'eth', 'ltc', 'doge', 'xrp']);
    }
  };

  const initiatePayment = async () => {
    setLoading(true);
    try {
      const paymentResponse = await createCryptoPayment(
        amount,
        `order-${productId}-${Date.now()}`,
        `Payment for ${productName}`,
        'inr', // price currency
        selectedCrypto // crypto currency
      );
      
      setPayment(paymentResponse);
      setPaymentStatus(paymentResponse.payment_status);
      
      toast({
        title: "Payment created",
        description: "Send the exact amount to complete your purchase.",
      });
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast({
        title: "Payment creation failed",
        description: "Please try again or choose a different payment method.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!payment?.payment_id) return;
    
    setCheckingStatus(true);
    try {
      const status = await getPaymentStatus(payment.payment_id);
      setPaymentStatus(status.payment_status);
      
      if (status.payment_status === 'confirmed' || status.payment_status === 'finished') {
        toast({
          title: "Payment confirmed",
          description: "Your purchase was successful!",
        });
        
        if (onSuccess) {
          setTimeout(() => {
            onOpenChange(false);
            onSuccess();
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pay with Cryptocurrency</DialogTitle>
          <DialogDescription>
            {!payment ? "Choose your preferred cryptocurrency to pay for this product." 
              : "Send the exact amount to the address below to complete your purchase."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {!payment ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="crypto">Select Cryptocurrency</Label>
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <SelectTrigger id="crypto">
                    <SelectValue placeholder="Select Cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCurrencies.map(currency => (
                      <SelectItem key={currency} value={currency}>
                        {currency.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="px-1">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Product:</span>
                  <span className="font-medium">{productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Amount:</span>
                  <span className="font-medium">₹{amount}</span>
                </div>
              </div>
              
              <Button 
                onClick={initiatePayment} 
                className="w-full" 
                disabled={loading || !selectedCrypto}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Payment...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md bg-secondary p-4">
                <div className="mb-3">
                  <span className="text-sm font-medium">Send exactly:</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xl font-bold">{payment.pay_amount} {payment.pay_currency.toUpperCase()}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyToClipboard(payment.pay_amount.toString())}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium">To this address:</span>
                  <div className="flex items-center justify-between mt-1 break-all">
                    <span className="text-sm mr-2">{payment.pay_address}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyToClipboard(payment.pay_address)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between px-1">
                <span className="text-sm text-muted-foreground">Status:</span>
                <div className="flex items-center">
                  {checkingStatus ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    paymentStatus === 'waiting' && <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                  )}
                  <span className="capitalize font-medium">
                    {paymentStatus || 'waiting'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={checkPaymentStatus} 
                  variant="outline"
                  disabled={checkingStatus}
                >
                  {checkingStatus ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Check Payment Status"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CryptoPaymentModal;
