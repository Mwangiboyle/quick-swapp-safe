import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Heart, MapPin, Loader2 } from "lucide-react";
import Navigation from "@/components/DashboardNavigation";
import { useItems, useCategories } from '@/lib/hooks';

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Use real data from hooks
  const { data: itemsData, isLoading: itemsLoading, error: itemsError } = useItems({
    search: searchQuery,
    category: selectedCategory === 'all' ? undefined : selectedCategory
  });
  
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  const items = itemsData?.data || [];
  const categories = ['All', ...(categoriesData?.data?.map(c => c.name) || [])];

  if (itemsLoading && !items.length) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading items...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (itemsError) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center py-12">
              <p className="text-destructive">Error loading items. Please try again.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
              {categoriesLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading categories...</span>
                </div>
              ) : (
                categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category.toLowerCase() ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.toLowerCase())}
                    className="whitespace-nowrap"
                  >
                    {category}
                  </Button>
                ))
              )}
            </div>
          </div>

          {/* Items Grid */}
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No items found. Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <Card key={item.id} className="group hover:shadow-elevated transition-all duration-300 cursor-pointer">
                  <div className="relative">
                    <img
                      src={item.images?.[0] || "/placeholder.svg"}
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
                      {item.categories?.name || 'Other'}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-primary">
                        KSh {item.price.toLocaleString()}
                      </span>
                      {item.profiles?.is_verified && (
                        <Badge variant="secondary" className="text-xs bg-success/10 text-success border-success/20">
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span>
                          By {item.profiles?.first_name} {item.profiles?.last_name}
                        </span>
                      </div>
                      {item.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <Link to={`/product/${item.id}`}>
                      <Button className="w-full mt-4" variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {itemsLoading && items.length > 0 && (
            <div className="text-center py-4">
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Browse;
