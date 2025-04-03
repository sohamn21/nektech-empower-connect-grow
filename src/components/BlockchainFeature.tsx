
import { Landmark, ShieldCheck, RefreshCw, CreditCard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

const BlockchainFeature = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 bg-card rounded-xl border shadow-sm p-6">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-medium">{t('blockchainFeature.demo.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('blockchainFeature.demo.subtitle')}</p>
            </div>
            
            <div className="bg-muted p-6 rounded-lg space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">{t('blockchainFeature.demo.transactionFee.label')}</p>
                  <p className="text-xl font-medium text-nektech-blue">{t('blockchainFeature.demo.transactionFee.value')}</p>
                  <p className="text-xs text-muted-foreground">{t('blockchainFeature.demo.transactionFee.comparison')}</p>
                </div>
                <div className="bg-background p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">{t('blockchainFeature.demo.settlementTime.label')}</p>
                  <p className="text-xl font-medium text-nektech-blue">{t('blockchainFeature.demo.settlementTime.value')}</p>
                  <p className="text-xs text-muted-foreground">{t('blockchainFeature.demo.settlementTime.comparison')}</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-0 h-full w-0.5 bg-nektech-blue/30"></div>
                
                <div className="relative pl-10 pb-6">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-nektech-blue text-white flex items-center justify-center">
                    <ShieldCheck size={16} />
                  </div>
                  <h4 className="font-medium">{t('blockchainFeature.demo.secureTransaction.title')}</h4>
                  <p className="text-sm text-muted-foreground">{t('blockchainFeature.demo.secureTransaction.description')}</p>
                </div>
                
                <div className="relative pl-10 pb-6">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-nektech-blue text-white flex items-center justify-center">
                    <RefreshCw size={16} />
                  </div>
                  <h4 className="font-medium">{t('blockchainFeature.demo.instantVerification.title')}</h4>
                  <p className="text-sm text-muted-foreground">{t('blockchainFeature.demo.instantVerification.description')}</p>
                </div>
                
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-nektech-blue text-white flex items-center justify-center">
                    <CreditCard size={16} />
                  </div>
                  <h4 className="font-medium">{t('blockchainFeature.demo.easyWithdrawal.title')}</h4>
                  <p className="text-sm text-muted-foreground">{t('blockchainFeature.demo.easyWithdrawal.description')}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nektech-blue/10 text-nektech-blue font-medium text-sm">
              <Landmark size={16} />
              <span>{t('blockchainFeature.badge')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              {t('blockchainFeature.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('blockchainFeature.description')}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{t('blockchainFeature.noHiddenFees.title')}</h4>
                <p className="text-sm text-muted-foreground">{t('blockchainFeature.noHiddenFees.description')}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{t('blockchainFeature.easyWithdrawal.title')}</h4>
                <p className="text-sm text-muted-foreground">{t('blockchainFeature.easyWithdrawal.description')}</p>
              </div>
            </div>
            
            <Button className="btn-secondary mt-4">
              {t('blockchainFeature.learnMore')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlockchainFeature;
