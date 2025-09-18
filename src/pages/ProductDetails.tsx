import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/DashboardNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, ShoppingCart, MapPin, Shield, Star, ArrowLeft, Loader2, Package } from "lucide-react";
import { useItem, useSimilarItems, useCurrentProfile } from "@/lib/hooks";
import { useToast } from "@/components/ui/use-toast";
import { messagesApi } from "@/lib/api";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: profile } = useCurrentProfile();
  const { data: itemData, isLoading: itemLoading, error: itemError } = useItem(id || '');
  
  const item = itemData?.data;
  
  const { data: similarItemsData } = useSimilarItems(
    item?.category_id || '',
    item?.id || ''
  );
  
  const similarItems = similarItemsData?.data || [];

  const handleMessageSeller = async () => {
    if (!profile) {
      toast({
        title: "Sign in required",
        description: "Please sign in to message the seller",
        variant: "destructive"
      });
      return;
    }
    
    if (item?.user_id === profile.id) {
      toast({
        title: "Cannot message yourself",
        description: "You cannot message yourself about your own item",
        variant: "destructive"
      });
      return;
    }

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
    }
  };

  const handleBuyNow = () => {
    if (!profile) {
      toast({
        title: "Sign in required",
        description: "Please sign in to make purchases",
        variant: "destructive"
      });
      return;
    }

    if (item?.user_id === profile.id) {
      toast({
        title: "Cannot buy your own item",
        description: "This is your own listing",
        variant: "destructive"
      });
      return;
    }

    // Navigate to checkout page with item details
    navigate(`/checkout/${item?.id}`);
  };

  if (itemLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Loading item details...</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (itemError || !item) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 py-8">
            <Link to="/browse" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Browse
            </Link>
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Item Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The item you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/browse">
                <Button>Browse Other Items</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Format price
  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString()}`;
  };

  // Format condition
  const formatCondition = (condition: string) => {
    return condition.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get seller name
  const sellerName = item.profiles?.first_name && item.profiles?.last_name
    ? `${item.profiles.first_name} ${item.profiles.last_name}`
    : item.profiles?.first_name
    ? item.profiles.first_name
    : 'Anonymous Seller';

  // Get seller initials for fallback
  const getSellerInitials = () => {
    if (item.profiles?.first_name && item.profiles?.last_name) {
      return `${item.profiles.first_name[0]}${item.profiles.last_name[0]}`.toUpperCase();
    }
    if (item.profiles?.first_name) {
      return item.profiles.first_name[0].toUpperCase();
    }
    return 'AS';
  };

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
              {item.images && item.images.length > 0 ? (
                <img 
                  src={item.images[0]} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-muted-foreground opacity-50" />
                </div>
              )}
            </div>
            
            {/* Additional Images */}
            {item.images && item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${item.title} ${index + 2}`}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{item.title}</h1>
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
                <Badge variant="secondary">{item.categories?.name || 'Other'}</Badge>
                <Badge variant="outline" className="capitalize">
                  {formatCondition(item.condition)}
                </Badge>
                {item.profiles?.is_verified && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Verified Seller
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary">{formatPrice(item.price)}</span>
              </div>

              {item.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  {item.location}
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <span>Listed {new Date(item.created_at).toLocaleDateString()}</span>
                {item.created_at !== item.updated_at && (
                  <span>• Updated {new Date(item.updated_at).toLocaleDateString()}</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                size="lg" 
                className="w-full"
                onClick={handleBuyNow}
                disabled={item.user_id === profile?.id}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {item.user_id === profile?.id ? 'Your Item' : 'Buy Now'}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
                onClick={handleMessageSeller}
                disabled={item.user_id === profile?.id}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {item.user_id === profile?.id ? 'Your Item' : 'Message Seller'}
              </Button>
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Seller Information</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    {item.profiles?.avatar_url ? (
                      <img 
                        src={item.profiles.avatar_url} 
                        alt={sellerName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium">{getSellerInitials()}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{sellerName}</p>
                    <p className="text-sm text-muted-foreground">
                      Member since {new Date(item.profiles?.created_at || item.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">University:</span>
                    <span className="font-medium">{item.profiles?.university_domain || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <div className="flex items-center gap-1">
                      {item.profiles?.is_verified ? (
                        <Badge variant="default" className="bg-success/10 text-success border-success/20">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline">Unverified</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Similar Products */}
        {similarItems.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarItems.map((similarItem) => (
                <Link key={similarItem.id} to={`/product/${similarItem.id}`}>
                  <Card className="group hover:shadow-medium transition-all duration-300 hover:scale-105">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3">
                        {similarItem.images && similarItem.images.length > 0 ? (
                          <img 
                            src={similarItem.images[0]} 
                            alt={similarItem.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
                      <h3 className="font-medium mb-2 line-clamp-2">{similarItem.title}</h3>
                      <p className="text-lg font-bold text-primary mb-2">{formatPrice(similarItem.price)}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {similarItem.profiles?.first_name || 'Anonymous'}
                        </span>
                        {similarItem.profiles?.is_verified && (
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
        )}
      </main>
    </div>
  );
};

export default ProductDetails;
