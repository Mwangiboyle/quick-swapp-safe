import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Star, Shield, MapPin, Calendar, Edit3 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const userStats = [
    { label: "Items Sold", value: "23" },
    { label: "Rating", value: "4.9" },
    { label: "Reviews", value: "18" },
    { label: "Member Since", value: "Jan 2024" }
  ];

  const reviews = [
    {
      id: 1,
      reviewer: "Sarah M.",
      rating: 5,
      comment: "Great seller! Item exactly as described and fast delivery.",
      item: "MacBook Pro",
      date: "2 days ago"
    },
    {
      id: 2,
      reviewer: "Mike J.",
      rating: 5,
      comment: "Smooth transaction, highly recommend!",
      item: "Calculus Textbook",
      date: "1 week ago"
    },
    {
      id: 3,
      reviewer: "Emma L.",
      rating: 4,
      comment: "Good condition as promised. Quick meetup.",
      item: "Study Desk",
      date: "2 weeks ago"
    }
  ];

  const soldItems = [
    {
      id: 1,
      title: "MacBook Pro 2021",
      price: "$1,200",
      image: "/placeholder.svg",
      soldDate: "2 days ago",
      buyer: "Sarah M."
    },
    {
      id: 2,
      title: "Calculus Textbook",
      price: "$45",
      image: "/placeholder.svg",
      soldDate: "1 week ago",
      buyer: "Mike J."
    }
  ];

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
                        <AvatarImage src="/placeholder.svg" alt="Profile" />
                        <AvatarFallback>AJ</AvatarFallback>
                      </Avatar>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-foreground mb-1">Alex Johnson</h2>
                    <p className="text-muted-foreground mb-3">alex.johnson@university.edu</p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-success/10 text-success border-success/20">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified Student
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-4">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground ml-2">4.9 (18 reviews)</span>
                    </div>
                    
                    <div className="w-full space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>University Campus</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Member since January 2024</span>
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
                          onClick={() => setIsEditing(!isEditing)}
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
                            defaultValue="Alex" 
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            defaultValue="Johnson" 
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          defaultValue="alex.johnson@university.edu" 
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          defaultValue="+1 (555) 123-4567" 
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          placeholder="Tell other users about yourself..."
                          defaultValue="Computer Science student looking to buy and sell quality items with fellow students."
                          disabled={!isEditing}
                          rows={3}
                        />
                      </div>
                      
                      {isEditing && (
                        <div className="flex gap-2">
                          <Button>Save Changes</Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
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
                        {reviews.map((review) => (
                          <div key={review.id} className="border border-border/50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-foreground">{review.reviewer}</h4>
                                <p className="text-sm text-muted-foreground">Bought: {review.item}</p>
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
                                <p className="text-sm text-muted-foreground">{review.date}</p>
                              </div>
                            </div>
                            <p className="text-foreground">{review.comment}</p>
                          </div>
                        ))}
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
                        {soldItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-4 border border-border/50 rounded-lg">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">Sold to {item.buyer}</p>
                              <p className="text-sm text-muted-foreground">{item.soldDate}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">{item.price}</p>
                              <Badge variant="secondary">Completed</Badge>
                            </div>
                          </div>
                        ))}
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
                            <h4 className="font-medium text-foreground">Payment Methods</h4>
                            <p className="text-sm text-muted-foreground">Manage your payment and withdrawal options</p>
                          </div>
                          <Button variant="outline">Update</Button>
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

      <Footer />
    </div>
  );
};

export default Profile;