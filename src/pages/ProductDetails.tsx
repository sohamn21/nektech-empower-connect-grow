
import { ArrowLeft, Smartphone, Laptop, Headphones, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductDetails = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="relative py-16 bg-gradient-to-br from-nektech-light to-white overflow-hidden">
          <div className="container mx-auto px-4">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-nektech-orange mb-8 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
            
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="w-full md:w-1/2 space-y-6 animate-fade-in">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold">
                  <span className="gradient-text">NekTech Platform</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  A comprehensive technology suite designed to empower rural entrepreneurs with digital tools for business growth and market access.
                </p>
              </div>
              
              <div className="w-full md:w-1/2 p-6 bg-white rounded-2xl shadow-lg hover-lift animate-fade-in">
                <img 
                  src="/lovable-uploads/8ec6ce32-13ed-477c-98dc-481439a49075.png" 
                  alt="Rural entrepreneur using digital technology" 
                  className="w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Features tabs */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-center mb-12">Platform Features</h2>
            
            <Tabs defaultValue="ivr" className="w-full max-w-4xl mx-auto">
              <TabsList className="grid grid-cols-4 w-full mb-8">
                <TabsTrigger value="ivr">IVR System</TabsTrigger>
                <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
                <TabsTrigger value="ai">AI Training</TabsTrigger>
                <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ivr" className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <img
                    src="https://images.unsplash.com/photo-1581538272119-9780d6a30385?auto=format&fit=crop&w=600&h=400"
                    alt="IVR System"
                    className="rounded-lg shadow-md w-full h-64 object-cover"
                  />
                  <div className="space-y-4">
                    <h3 className="text-2xl font-display font-bold text-nektech-orange">Interactive Voice Response</h3>
                    <p className="text-muted-foreground">
                      Our IVR system enables entrepreneurs to access information, place orders, and manage their business through simple voice commands and missed calls, eliminating literacy barriers.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>No smartphone required</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Multiple language support</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Zero cost missed call functionality</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="blockchain" className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <img
                    src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=600&h=400"
                    alt="Blockchain"
                    className="rounded-lg shadow-md w-full h-64 object-cover"
                  />
                  <div className="space-y-4">
                    <h3 className="text-2xl font-display font-bold text-nektech-blue">Blockchain Technology</h3>
                    <p className="text-muted-foreground">
                      Our blockchain implementation provides transparency and trust in supply chains, enabling fair trade verification and product authenticity tracking.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Secure transaction records</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Transparent supply chain</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Fair compensation verification</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="ai" className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&h=400"
                    alt="AI Training"
                    className="rounded-lg shadow-md w-full h-64 object-cover"
                  />
                  <div className="space-y-4">
                    <h3 className="text-2xl font-display font-bold text-nektech-orange">AI-Powered Training</h3>
                    <p className="text-muted-foreground">
                      Customized business skills training delivered through voice calls and WhatsApp in the entrepreneur's native language, making education accessible to all.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Personalized learning paths</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Multi-language support</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Voice & WhatsApp delivery</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="marketplace" className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <img
                    src="https://images.unsplash.com/photo-1597413545419-4013c3f27910?auto=format&fit=crop&w=600&h=400"
                    alt="Marketplace"
                    className="rounded-lg shadow-md w-full h-64 object-cover"
                  />
                  <div className="space-y-4">
                    <h3 className="text-2xl font-display font-bold text-nektech-blue">Digital Marketplace</h3>
                    <p className="text-muted-foreground">
                      Connect rural artisans and producers directly with global customers, eliminating middlemen and enabling fair compensation for products.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Global customer reach</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Simple product listing</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Secure payment processing</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Multi-platform section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-center mb-4">Available Across Devices</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              Our platform works seamlessly across all technology levels, from basic phones to smartphones and computers.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md hover-lift text-center">
                <div className="w-16 h-16 bg-nektech-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-8 w-8 text-nektech-orange" />
                </div>
                <h3 className="text-xl font-bold mb-2">Basic Phones</h3>
                <p className="text-muted-foreground">
                  Access core features through voice calls, missed calls, and SMS, no smartphone required.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md hover-lift text-center">
                <div className="w-16 h-16 bg-nektech-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-8 w-8 text-nektech-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smartphones</h3>
                <p className="text-muted-foreground">
                  Enhanced features through WhatsApp integration and our mobile-optimized web application.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md hover-lift text-center">
                <div className="w-16 h-16 bg-nektech-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Laptop className="h-8 w-8 text-nektech-orange" />
                </div>
                <h3 className="text-xl font-bold mb-2">Computer</h3>
                <p className="text-muted-foreground">
                  Full platform access with comprehensive dashboard and analytics for business growth.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-20 bg-gradient-to-r from-nektech-orange/10 to-nektech-blue/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-display font-bold mb-6">Ready to transform your business?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of rural entrepreneurs already using our platform to grow their businesses and connect with global markets.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" className="btn-primary">
                  Get Started
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetails;
