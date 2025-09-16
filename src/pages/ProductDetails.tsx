import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/DashboardNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, ShoppingCart, MapPin, Shield, Star, ArrowLeft } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const [isFavorited, setIsFavorited] = useState(false);

  // Mock data - in real app this would come from API
  const items = [
    {
      id: 1,
      title: "MacBook Pro 13-inch",
      price: "$800",
      originalPrice: "$1200",
      image: "/placeholder.svg",
      seller: "Sarah M.",
      location: "Campus North",
      category: "Electronics",
      verified: true,
      rating: 4.8,
      description: "2020 MacBook Pro 13-inch in excellent condition. Has been well maintained with minimal wear. Includes original charger, box, and documentation. Perfect for students and professionals. Battery health is at 87%. No dents or scratches on the screen.",
      specifications: {
        "Processor": "Apple M1 Chip",
        "Memory": "8GB Unified Memory",
        "Storage": "256GB SSD",
        "Display": "13.3-inch Retina Display",
        "Battery": "Up to 17 hours",
        "Condition": "Excellent"
      },
      sellerInfo: {
        name: "Sarah M.",
        memberSince: "2023",
        totalSales: 15,
        rating: 4.9
      }
    },
    {
      id: 2,
      title: "Calculus Textbook",
      price: "$45",
      originalPrice: "$80",
      image: "/placeholder.svg",
      seller: "Mike J.",
      location: "Campus South",
      category: "Books",
      verified: true,
      rating: 4.5,
      description: "Stewart's Calculus 8th Edition in good condition. Minor highlighting and notes, but all pages intact. Great for MATH 101 and 102 courses.",
      specifications: {
        "Edition": "8th Edition",
        "Author": "James Stewart",
        "ISBN": "978-1285740621",
        "Condition": "Good",
        "Pages": "1368",
        "Course": "MATH 101/102"
      },
      sellerInfo: {
        name: "Mike J.",
        memberSince: "2022",
        totalSales: 8,
        rating: 4.7
      }
    }
  ];

  const allItems = [
    ...items,
    {
      id: 3,
      title: "iPad Pro 11-inch",
      price: "$600",
      image: "/placeholder.svg",
      seller: "Tom K.",
      location: "Campus East",
      category: "Electronics",
      verified: true
    },
    {
      id: 4,
      title: "iPhone 13",
      price: "$650",
      image: "/placeholder.svg",
      seller: "Lisa P.",
      location: "Campus West",
      category: "Electronics",
      verified: false
    },
    {
      id: 5,
      title: "Dell XPS 13",
      price: "$700",
      image: "/placeholder.svg",
      seller: "John D.",
      location: "Campus North",
      category: "Electronics",
      verified: true
    }
  ];

  const currentItem = items.find(item => item.id === parseInt(id || "1")) || items[0];
  const similarItems = allItems.filter(item => 
    item.category === currentItem.category && item.id !== currentItem.id
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/browse" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img 
                src={currentItem.image} 
                alt={currentItem.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{currentItem.title}</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFavorited(!isFavorited)}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{currentItem.category}</Badge>
                {currentItem.verified && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Verified Seller
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary">{currentItem.price}</span>
                {currentItem.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">{currentItem.originalPrice}</span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                {currentItem.location}
              </div>

              <div className="flex items-center gap-1 mb-6">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{currentItem.rating}</span>
                <span className="text-muted-foreground">(24 reviews)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button size="lg" className="w-full">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy Now
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message Seller
              </Button>
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Seller Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{currentItem.sellerInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member since:</span>
                    <span>{currentItem.sellerInfo.memberSince}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total sales:</span>
                    <span>{currentItem.sellerInfo.totalSales}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Rating:</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{currentItem.sellerInfo.rating}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Description and Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {currentItem.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Specifications</h2>
              <div className="space-y-3">
                {Object.entries(currentItem.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-border/50 last:border-b-0">
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Similar Products */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarItems.map((item) => (
              <Link key={item.id} to={`/product/${item.id}`}>
                <Card className="group hover:shadow-medium transition-all duration-300 hover:scale-105">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-medium mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-lg font-bold text-primary mb-2">{item.price}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{item.seller}</span>
                      {item.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetails;
