import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Heart, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "All", "Electronics", "Books", "Fashion", "Furniture", "Sports", "Beauty"
  ];

  const items = [
    {
      id: 1,
      title: "MacBook Pro 2021",
      price: "$1,200",
      image: "/placeholder.svg",
      seller: "Sarah M.",
      location: "Campus North",
      category: "Electronics",
      verified: true
    },
    {
      id: 2,
      title: "Calculus Textbook",
      price: "$45",
      image: "/placeholder.svg",
      seller: "Mike J.",
      location: "Campus South",
      category: "Books",
      verified: true
    },
    {
      id: 3,
      title: "Nike Air Max",
      price: "$80",
      image: "/placeholder.svg",
      seller: "Emma L.",
      location: "Campus East",
      category: "Fashion",
      verified: false
    },
    {
      id: 4,
      title: "Study Desk",
      price: "$120",
      image: "/placeholder.svg",
      seller: "Alex R.",
      location: "Campus West",
      category: "Furniture",
      verified: true
    },
    {
      id: 5,
      title: "iPhone 13",
      price: "$650",
      image: "/placeholder.svg",
      seller: "John D.",
      location: "Campus North",
      category: "Electronics",
      verified: true
    },
    {
      id: 6,
      title: "Chemistry Lab Kit",
      price: "$35",
      image: "/placeholder.svg",
      seller: "Lisa K.",
      location: "Campus South",
      category: "Books",
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Browse Marketplace</h1>
            <p className="text-muted-foreground">Discover great deals from fellow students</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search for items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category.toLowerCase() ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.toLowerCase())}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="group hover:shadow-elevated transition-all duration-300 cursor-pointer">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                    {item.category}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-primary">{item.price}</span>
                    {item.verified && (
                      <Badge variant="secondary" className="text-xs bg-success/10 text-success border-success/20">
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>By {item.seller}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4" variant="outline">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Browse;