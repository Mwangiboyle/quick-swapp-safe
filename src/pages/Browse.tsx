import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Heart, MapPin, Loader2, Package, MessageCircle, ShoppingCart } from "lucide-react";
import Navigation from "@/components/DashboardNavigation";
import { useItems, useCategories, useCurrentProfile } from '@/lib/hooks';
import { useToast } from "@/components/ui/use-toast";
import { messagesApi } from "@/lib/api";

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [messagingItem, setMessagingItem] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Use real data from hooks
  const { data: itemsData, isLoading: itemsLoading, error: itemsError } = useItems({
    search: searchQuery,
    category: selectedCategory === 'all' ? undefined : selectedCategory
  });
  
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: profile } = useCurrentProfile();

  const items = itemsData?.data || [];
  const categories = ['All', ...(categoriesData?.data?.map(c => c.name) || [])];

  // Format price
  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString()}`;
  };

  // Get seller name
  const getSellerName = (profiles: any) => {
    if (profiles?.first_name && profiles?.last_name) {
      return `${profiles.first_name} ${profiles.last_name}`;
    }
    if (profiles?.first_name) {
      return profiles.first_name;
    }
    return 'Anonymous';
  };

  // Handle message seller
  const handleMessageSeller = async (item: any) => {
    if (!profile) {
      toast({
        title: "Sign in required",
        description: "Please sign in to message sellers",
        variant: "destructive"
      });
      return;
    }

    if (item.user_id === profile.id) {
      toast({
        title: "Cannot message yourself",
        description: "This is your own item",
        variant: "destructive"
      });
      return;
    }

    setMessagingItem(item.id);

    try {
      // Create conversation ID
      const conversationId = await messagesApi.createConversation(
        profile.id,
        item.user_id,
        item.id
      );

      // Send initial message
      await messagesApi.sendMessage({
        conversation_id: conversationId,
        sender_id: profile.id,
        receiver_id: item.user_id,
        item_id: item.id,
        message: `Hi! I'm interested in your ${item.title}. Is it still available?`
      });

      toast({
        title: "Message sent!",
        description: "Your message has been sent to the seller",
      });

      // Navigate to messages
      setTimeout(() => {
        navigate('/messages');
      }, 1500);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setMessagingItem(null);
    }
  };

  // Handle buy now
  const handleBuyNow = (item: any) => {
    if (!profile) {
      toast({
        title: "Sign in required",
        description: "Please sign in to make purchases",
        variant: "destructive"
      });
      return;
    }

    if (item.user_id === profile.id) {
      toast({
        title: "Cannot buy your own item",
        description: "This is your own listing",
        variant: "destructive"
      });
      return;
    }

    // Navigate to checkout page for purchase
    navigate(`/checkout/${item.id}`);
  };

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
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
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
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No items found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters.' 
                  : 'Be the first to list an item!'}
              </p>
              <Link to="/sell">
                <Button>List Your First Item</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <Card key={item.id} className="group hover:shadow-elevated transition-all duration-300">
                  <div className="relative">
                    {/* Make the whole image area clickable */}
                    <Link to={`/product/${item.id}`}>
                      <div className="w-full h-48 bg-muted rounded-t-lg overflow-hidden">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-muted-foreground opacity-50" />
                          </div>
                        )}
                      </div>
                    </Link>
                    
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
                    {/* Make title clickable */}
                    <Link to={`/product/${item.id}`}>
                      <h3 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 cursor-pointer">
                        {item.title}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(item.price)}
                      </span>
                      {item.profiles?.is_verified && (
                        <Badge variant="secondary" className="text-xs bg-success/10 text-success border-success/20">
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <span>By {getSellerName(item.profiles)}</span>
                      </div>
                      {item.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{item.location}</span>
                        </div>
                      )}
                      <div className="text-xs">
                        Listed {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {/* Buy Now Button */}
                      <Button 
                        className="w-full" 
                        onClick={() => handleBuyNow(item)}
                        disabled={item.user_id === profile?.id}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {item.user_id === profile?.id ? 'Your Item' : 'Buy Now'}
                      </Button>
                      
                      {/* Message Seller Button */}
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleMessageSeller(item)}
                        disabled={item.user_id === profile?.id || messagingItem === item.id}
                      >
                        {messagingItem === item.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <MessageCircle className="w-4 h-4 mr-2" />
                            {item.user_id === profile?.id ? 'Your Item' : 'Message'}
                          </>
                        )}
                      </Button>
                      
                      {/* View Details Button */}
                      <Link to={`/product/${item.id}`}>
                        <Button variant="ghost" className="w-full text-sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
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
