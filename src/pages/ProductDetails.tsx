
import { ArrowLeft, Smartphone, Laptop, Headphones, Check, MapPin, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductDetails = () => {
  // Sample product data
  const featuredProducts = [
    {
      id: "1",
      name: "Handwoven Wool Rug",
      price: 4999,
      location: "Rajasthan",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&h=300"
    },
    {
      id: "2",
      name: "Handmade Ceramic Bowl Set",
      price: 1599,
      location: "Uttar Pradesh",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&h=300"
    },
    {
      id: "3",
      name: "Organic Spice Collection",
      price: 899,
      location: "Kerala",
      image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=300&h=300"
    },
    {
      id: "4",
      name: "Handcrafted Wooden Toys",
      price: 1299,
      location: "Tamil Nadu",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=300&h=300"
    }
  ];
  
  // More products for browsing
  const moreProducts = [
    {
      id: "5",
      name: "Hand-Embroidered Cushion Cover",
      price: 799,
      location: "Gujarat",
      image: "https://images.unsplash.com/photo-1603204077380-48c755682cbe?auto=format&fit=crop&w=300&h=300"
    },
    {
      id: "6",
      name: "Natural Jute Basket",
      price: 549,
      location: "West Bengal",
      image: "https://images.unsplash.com/photo-1520218508822-998633d997e6?auto=format&fit=crop&w=300&h=300"
    },
    {
      id: "7",
      name: "Handmade Paper Journal",
      price: 349,
      location: "Rajasthan",
      image: "https://images.unsplash.com/photo-1537103645242-38f48d6c0cbb?auto=format&fit=crop&w=300&h=300"
    },
    {
      id: "8",
      name: "Natural Indigo Dyed Scarf",
      price: 1299,
      location: "Karnataka",
      image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=300&h=300"
    }
  ];
  
  // Categories for filtering
  const categories = [
    { name: "Home Decor", count: 127 },
    { name: "Kitchenware", count: 84 },
    { name: "Textiles", count: 152 },
    { name: "Fashion", count: 93 },
    { name: "Food Products", count: 68 },
    { name: "Crafts", count: 201 },
    { name: "Toys & Games", count: 45 },
    { name: "Jewelry", count: 78 }
  ];

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
                  <span className="gradient-text">NekTech Marketplace</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  Discover unique handcrafted products from rural artisans across India. Every purchase supports local entrepreneurs and preserves traditional craftsmanship.
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
        
        {/* Featured Products */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-center mb-4">Featured Products</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              Discover our handpicked selection of traditional crafts and products from rural artisans.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id}>
                  <Card className="overflow-hidden group hover:shadow-md transition-shadow h-full">
                    <div className="aspect-square bg-muted relative">
                      <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                        <Share2 size={16} className="text-nektech-orange" />
                      </div>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-base font-medium">{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-nektech-blue">₹{product.price.toLocaleString()}</span>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin size={12} className="mr-1" />
                          <span>{product.location}</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4 btn-primary" size="sm">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Browse Products */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-center mb-4">Browse Marketplace</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              Explore our full collection of authentic handcrafted products from artisans across rural India.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Categories Sidebar */}
              <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="font-bold text-lg mb-4">Categories</h3>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category.name}>
                        <button className="w-full text-left p-2 hover:bg-muted rounded-md flex justify-between items-center transition-colors">
                          <span>{category.name}</span>
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{category.count}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6">
                    <h3 className="font-bold text-lg mb-4">Price Range</h3>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <div className="w-full">
                          <label className="text-sm text-muted-foreground">Min</label>
                          <input type="number" placeholder="₹0" className="w-full p-2 border rounded-md" />
                        </div>
                        <div className="w-full">
                          <label className="text-sm text-muted-foreground">Max</label>
                          <input type="number" placeholder="₹10000" className="w-full p-2 border rounded-md" />
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2">Apply Filter</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Products Grid */}
              <div className="md:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {moreProducts.map((product) => (
                    <Link to={`/product/${product.id}`} key={product.id}>
                      <Card className="overflow-hidden group hover:shadow-md transition-shadow h-full">
                        <div className="aspect-square bg-muted relative">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardHeader className="p-4">
                          <CardTitle className="text-base font-medium">{product.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-nektech-blue">₹{product.price.toLocaleString()}</span>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MapPin size={12} className="mr-1" />
                              <span>{product.location}</span>
                            </div>
                          </div>
                          <Button className="w-full mt-4 btn-primary" size="sm">
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
                
                <div className="text-center mt-8">
                  <Button>Load More Products</Button>
                </div>
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
