import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Star, Shield, MapPin, Calendar, Edit3, Loader2, Package } from "lucide-react";
import Navigation from "@/components/DashboardNavigation";
import { useCurrentProfile, useUpdateProfile, useUserReviews, useUserItems } from "@/lib/hooks";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    bio: ''
  });

  const { toast } = useToast();
  const { data: profile, isLoading: profileLoading } = useCurrentProfile();
  const { data: reviewsData } = useUserReviews(profile?.id || '');
  const { data: userItemsData } = useUserItems(profile?.id || '');
  const updateProfileMutation = useUpdateProfile();

  // Initialize form when profile loads
  useEffect(() => {
    if (profile) {
      setEditForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: '', // Add phone field to your profile schema if needed
        bio: '' // Add bio field to your profile schema if needed
      });
    }
  }, [profile]);

  const reviews = reviewsData?.data || [];
  const soldItems = userItemsData?.data?.filter(item => item.status === 'sold') || [];

  const userStats = [
    { label: "Items Sold", value: soldItems.length.toString() },
    { label: "Rating", value: "4.9" }, // Calculate from reviews
    { label: "Reviews", value: reviews.length.toString() },
    { label: "Member Since", value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A' }
  ];

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (profile?.first_name) {
      return profile.first_name[0].toUpperCase();
    }
    return profile?.email?.[0]?.toUpperCase() || 'U';
  };

  const displayName = profile?.first_name 
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : 'User';

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form to original values
      if (profile) {
        setEditForm({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          phone: '',
          bio: ''
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      await updateProfileMutation.mutateAsync({
        userId: profile.id,
        updates: editForm
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 pb-16">
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading profile...</span>
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
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your account and view your activity</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt="Profile" />
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                      </Avatar>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-foreground mb-1">{displayName}</h2>
                    <p className="text-muted-foreground mb-3">{profile?.email}</p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-success/10 text-success border-success/20">
                        <Shield className="w-3 h-3 mr-1" />
                        {profile?.is_verified ? 'Verified Student' : 'Unverified'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-4">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">4.9 ({reviews.length} reviews)</span>
                    </div>
                    
                    <div className="w-full space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{profile?.university_domain || 'University Campus'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {userStats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <p className="text-2xl font-bold text-primary">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="sold">Sold Items</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Profile Information</CardTitle>
                        <Button
                          variant="outline"
                          onClick={handleEditToggle}
                          disabled={updateProfileMutation.isPending}
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          {isEditing ? 'Cancel' : 'Edit'}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            value={isEditing ? editForm.first_name : profile?.first_name || ''} 
                            onChange={(e) => setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            value={isEditing ? editForm.last_name : profile?.last_name || ''} 
                            onChange={(e) => setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          value={profile?.email || ''} 
                          disabled={true}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="university">University Domain</Label>
                        <Input 
                          id="university" 
                          value={profile?.university_domain || ''} 
                          disabled={true}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={isEditing ? editForm.phone : ''} 
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+254 700 000 000"
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          placeholder="Tell other users about yourself..."
                          value={isEditing ? editForm.bio : ''} 
                          onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                          disabled={!isEditing}
                          rows={3}
                        />
                      </div>
                      
                      {isEditing && (
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleSaveProfile}
                            disabled={updateProfileMutation.isPending}
                          >
                            {updateProfileMutation.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              'Save Changes'
                            )}
                          </Button>
                          <Button variant="outline" onClick={handleEditToggle}>
                            Cancel
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reviews & Ratings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {reviews.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No reviews yet. Start selling to get reviews!</p>
                          </div>
                        ) : (
                          reviews.map((review) => (
                            <div key={review.id} className="border border-border/50 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-medium text-foreground">
                                    {review.reviewer?.first_name} {review.reviewer?.last_name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {review.items?.title && `Bought: ${review.items.title}`}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(review.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              {review.comment && (
                                <p className="text-foreground">{review.comment}</p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sold">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recently Sold Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {soldItems.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No sold items yet. Start listing items to track your sales!</p>
                          </div>
                        ) : (
                          soldItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-4 border border-border/50 rounded-lg">
                              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                {item.images?.[0] ? (
                                  <img
                                    src={item.images[0]}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Package className="w-6 h-6 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-foreground">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Sold on {new Date(item.updated_at).toLocaleDateString()}
                                </p>
                                {item.location && (
                                  <p className="text-sm text-muted-foreground">{item.location}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-primary">KSh {item.price.toLocaleString()}</p>
                                <Badge variant="secondary">Completed</Badge>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-foreground">Email Notifications</h4>
                            <p className="text-sm text-muted-foreground">Receive updates about messages and transactions</p>
                          </div>
                          <Button variant="outline">Configure</Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-foreground">Privacy Settings</h4>
                            <p className="text-sm text-muted-foreground">Control who can see your profile information</p>
                          </div>
                          <Button variant="outline">Manage</Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-foreground">Account Verification</h4>
                            <p className="text-sm text-muted-foreground">
                              {profile?.is_verified ? 'Your account is verified' : 'Verify your student status'}
                            </p>
                          </div>
                          <Button variant="outline">
                            {profile?.is_verified ? 'Verified' : 'Verify Now'}
                          </Button>
                        </div>
                        
                        <div className="pt-4 border-t border-border/50">
                          <Button variant="destructive">Delete Account</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
