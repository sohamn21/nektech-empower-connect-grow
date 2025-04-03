
import { Phone, Volume2, Languages } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

const MissedCallFeature = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nektech-orange/10 text-nektech-orange font-medium text-sm">
              <Phone size={16} />
              <span>{t('missedCallFeature.badge')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              {t('missedCallFeature.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('missedCallFeature.description')}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-nektech-orange/10">
                  <Volume2 className="h-5 w-5 text-nektech-orange" />
                </div>
                <div>
                  <h4 className="font-medium">{t('missedCallFeature.voiceGuidance.title')}</h4>
                  <p className="text-sm text-muted-foreground">{t('missedCallFeature.voiceGuidance.description')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-nektech-orange/10">
                  <Languages className="h-5 w-5 text-nektech-orange" />
                </div>
                <div>
                  <h4 className="font-medium">{t('missedCallFeature.multipleLanguages.title')}</h4>
                  <p className="text-sm text-muted-foreground">{t('missedCallFeature.multipleLanguages.description')}</p>
                </div>
              </div>
            </div>
            
            <Button className="btn-primary mt-4">
              {t('missedCallFeature.tryDemo')}
            </Button>
          </div>
          
          <div className="w-full lg:w-1/2 bg-card rounded-xl border shadow-sm p-6">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-medium">{t('missedCallFeature.demo.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('missedCallFeature.demo.subtitle')}</p>
            </div>
            
            <div className="bg-muted p-6 rounded-lg flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-nektech-blue text-white flex items-center justify-center">1</div>
                <div className="flex-1 bg-background p-3 rounded-lg">
                  <p className="text-sm">{t('missedCallFeature.demo.step1')}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-nektech-blue text-white flex items-center justify-center">2</div>
                <div className="flex-1 bg-background p-3 rounded-lg">
                  <p className="text-sm">{t('missedCallFeature.demo.step2')}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-nektech-blue text-white flex items-center justify-center">3</div>
                <div className="flex-1 bg-background p-3 rounded-lg">
                  <p className="text-sm">{t('missedCallFeature.demo.step3')}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-nektech-blue text-white flex items-center justify-center">4</div>
                <div className="flex-1 bg-background p-3 rounded-lg">
                  <p className="text-sm">{t('missedCallFeature.demo.step4')}</p>
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
