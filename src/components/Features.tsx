
import { PhoneCall, Landmark, BookOpen, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: <PhoneCall className="h-10 w-10 text-nektech-orange" />,
    title: "Missed Call Registration",
    description: "Register your business with just one missed call. Our AI-powered IVR system guides you through simple steps in English and Hindi.",
  },
  {
    icon: <Landmark className="h-10 w-10 text-nektech-orange" />,
    title: "Blockchain Payments",
    description: "Secure, transparent transactions without middlemen. Withdraw earnings easily at any NEKTECH hub in your community.",
  },
  {
    icon: <BookOpen className="h-10 w-10 text-nektech-orange" />,
    title: "AI-powered Training",
    description: "Receive weekly business tips and training via voice calls and WhatsApp messages. Learn and grow at your own pace.",
  },
  {
    icon: <ShoppingBag className="h-10 w-10 text-nektech-orange" />,
    title: "Marketplace Access",
    description: "Sell your products globally through our marketplace. We connect you to platforms like Amazon Saheli and Flipkart Samarth.",
  },
];

const Features = () => {
  return (
    <section id="features" className="section-container">
      <h2 className="section-title gradient-text">Our Features</h2>
      <p className="section-subtitle">
        Technology that empowers, connects, and grows with you.
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
