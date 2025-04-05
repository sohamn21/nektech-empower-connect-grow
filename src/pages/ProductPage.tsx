
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Share2, ShoppingBag, Camera, Star, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Product } from "@/types";

// Sample product data (would normally come from an API)
const sampleProducts: Product[] = [
  {
    id: "1",
    owner_id: "user123",
    name: "Handwoven Wool Rug",
    description: "Traditional handwoven wool rug made with natural dyes and traditional techniques passed down through generations. Each piece is unique and showcases the artisan's skill and cultural heritage.",
    price: 4999,
    category: "Home Decor",
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1561549641-3a5755d5715d?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800&h=600"
    ],
    location: "Rajasthan",
    created_at: "2025-02-15T10:00:00Z",
    updated_at: "2025-04-01T14:30:00Z",
    status: "active",
    owner: { name: "Meena Devi" }
  },
  {
    id: "2",
    owner_id: "user456",
    name: "Handmade Ceramic Bowl Set",
    description: "Set of 4 handmade ceramic bowls, perfect for serving soups, salads, or desserts. Each bowl is individually crafted and features traditional designs.",
    price: 1599,
    category: "Kitchenware",
    images: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&h=600"
    ],
    location: "Uttar Pradesh",
    created_at: "2025-03-10T12:00:00Z",
    updated_at: "2025-04-02T09:15:00Z",
    status: "active",
    owner: { name: "Rajesh Kumar" }
  },
  {
    id: "3",
    owner_id: "user789",
    name: "Organic Spice Collection",
    description: "Set of 6 organic spices grown and processed naturally by local farmers. Includes turmeric, cumin, coriander, cardamom, cinnamon, and black pepper.",
    price: 899,
    category: "Food Products",
    images: [
      "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&h=600"
    ],
    location: "Kerala",
    created_at: "2025-03-15T15:30:00Z",
    updated_at: "2025-04-03T11:45:00Z",
    status: "active",
    owner: { name: "Priya Nair" }
  },
  {
    id: "4",
    owner_id: "user101",
    name: "Handcrafted Wooden Toys",
    description: "Set of educational wooden toys handcrafted from sustainable wood sources. Safe, non-toxic, and designed to stimulate creativity and learning.",
    price: 1299,
    category: "Toys & Games",
    images: [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&h=600"
    ],
    location: "Tamil Nadu",
    created_at: "2025-03-20T09:45:00Z",
    updated_at: "2025-04-04T10:30:00Z",
    status: "active",
    owner: { name: "Suresh Rajan" }
  }
];

// Similar product recommendations (simplified for this example)
const getSimilarProducts = (currentId: string, category: string) => {
  return sampleProducts.filter(product => product.id !== currentId && product.category === category).slice(0, 3);
};

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching product data
    setTimeout(() => {
      const foundProduct = sampleProducts.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setSimilarProducts(getSimilarProducts(foundProduct.id, foundProduct.category));
      }
      setLoading(false);
    }, 500);
  }, [productId]);

  const handleBuy = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase this product",
        variant: "destructive",
      });
      navigate("/auth", { state: { returnUrl: `/product/${productId}` } });
      return;
    }

    // In a real app, this would initiate the checkout process
    toast({
      title: "Purchase initiated",
      description: `${quantity} x ${product?.name} added to cart`,
    });
    
    // For demonstration, show a success message and simulate a redirect
    setTimeout(() => {
      toast({
        title: "Purchase successful",
        description: "Thank you for your purchase!",
        variant: "default",
      });
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-56 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 w-full max-w-lg bg-gray-200 rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">The product you're looking for doesn't seem to exist.</p>
            <Link to="/product-details">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <Link to="/product-details" className="inline-flex items-center text-muted-foreground hover:text-nektech-orange mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to products
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <Carousel className="w-full max-w-xl mx-auto">
                <CarouselContent>
                  {product.images.map((img, i) => (
                    <CarouselItem key={i}>
                      <div className="aspect-square relative rounded-lg overflow-hidden border">
                        <img 
                          src={img} 
                          alt={`${product.name} - view ${i+1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
              
              <div className="flex mt-4 gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <div 
                    key={i} 
                    className="w-20 h-20 flex-shrink-0 rounded-md border overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${i+1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-start">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{product.status}</Badge>
                  <Button variant="ghost" size="icon" aria-label="Share">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
                
                <h1 className="text-3xl font-display font-bold mt-2">{product.name}</h1>
                
                <div className="flex items-center mt-2 gap-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin size={14} className="mr-1" />
                    <span>{product.location}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground ml-1">(24 reviews)</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <span className="text-2xl font-bold text-nektech-blue">₹{product.price.toLocaleString()}</span>
                  <span className="text-green-600 text-sm ml-2">Free shipping</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Artisan Information</h3>
                <div className="flex items-center bg-muted/30 p-3 rounded-lg">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    {product.owner?.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{product.owner?.name}</p>
                    <p className="text-sm text-muted-foreground">Artisan since 2020</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-6">
                <div className="space-y-1">
                  <label htmlFor="quantity" className="text-sm font-medium">
                    Quantity
                  </label>
                  <div className="flex items-center border rounded-md w-32">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 border-r" 
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-center p-2 focus:outline-none"
                    />
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 border-l"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="btn-primary w-full flex-1" 
                    size="lg"
                    onClick={handleBuy}
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Buy Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full flex-1" 
                    size="lg"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    View in 3D
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Description Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid grid-cols-3 max-w-lg mx-auto">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <p className="text-muted-foreground">{product.description}</p>
                  <p className="text-muted-foreground mt-4">
                    This product is handcrafted by skilled artisans, preserving traditional techniques passed down through generations.
                    Each piece is unique and may vary slightly from the photos due to its handmade nature.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Product Specifications</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium">{product.category}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Material</span>
                        <span className="font-medium">Natural fibers</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Made in</span>
                        <span className="font-medium">{product.location}, India</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Certification</span>
                        <span className="font-medium">Fair Trade</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Shipping Information</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Processing time</span>
                        <span className="font-medium">1-2 business days</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Shipping time</span>
                        <span className="font-medium">3-5 business days</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Returns</span>
                        <span className="font-medium">7-day return policy</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Warranty</span>
                        <span className="font-medium">30 days</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Customer Reviews</h3>
                    <Button variant="outline" size="sm">Write a Review</Button>
                  </div>
                  
                  <div className="space-y-4">
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="border-b pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex gap-0.5 mb-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                                />
                              ))}
                            </div>
                            <h4 className="font-medium">Great quality!</h4>
                          </div>
                          <span className="text-xs text-muted-foreground">3 months ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          The product exceeded my expectations. Very well made and beautiful. Will definitely buy more!
                        </p>
                        <div className="mt-2 text-sm font-medium">
                          Verified Buyer - {["Anita", "Rahul", "Meera"][review - 1]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="mt-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold">Similar Products</h2>
                <Link to="/product-details" className="text-nektech-blue hover:text-nektech-orange flex items-center">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarProducts.map((item) => (
                  <Link to={`/product/${item.id}`} key={item.id}>
                    <div className="group border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-muted relative overflow-hidden">
                        <img 
                          src={item.images[0]} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-medium text-nektech-blue">₹{item.price.toLocaleString()}</span>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin size={12} className="mr-1" />
                            <span>{item.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductPage;
