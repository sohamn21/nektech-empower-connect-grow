
import { PhoneCall, Landmark, BookOpen, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';

const Features = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: <PhoneCall className="h-10 w-10 text-nektech-orange" />,
      title: t('features.missedCall.title'),
      description: t('features.missedCall.description'),
    },
    {
      icon: <Landmark className="h-10 w-10 text-nektech-orange" />,
      title: t('features.blockchain.title'),
      description: t('features.blockchain.description'),
    },
    {
      icon: <BookOpen className="h-10 w-10 text-nektech-orange" />,
      title: t('features.aiTraining.title'),
      description: t('features.aiTraining.description'),
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-nektech-orange" />,
      title: t('features.marketplace.title'),
      description: t('features.marketplace.description'),
    },
  ];

  return (
    <section id="features" className="section-container">
      <h2 className="section-title gradient-text">{t('features.sectionTitle')}</h2>
      <p className="section-subtitle">
        {t('features.sectionSubtitle')}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {features.map((feature, index) => (
          <Card key={index} className="feature-card">
            <CardHeader>
              <div className="mb-4">{feature.icon}</div>
              <CardTitle className="text-xl font-display">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-foreground/80">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Features;
