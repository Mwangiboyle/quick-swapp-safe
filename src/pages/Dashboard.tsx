// import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, MessageCircle, Wallet, TrendingUp, Loader2 } from "lucide-react";
import DashboardNavigation from "@/components/DashboardNavigation";
import { useDashboardStats, useCurrentProfile, useUserItems } from '@/lib/hooks';
// Removed DatabaseTest component import

const Dashboard = () => {
  const { data: profile, isLoading: profileLoading } = useCurrentProfile();
  const { data: stats, isLoading: statsLoading } = useDashboardStats(profile?.id || '');
  const { data: userItemsData } = useUserItems(profile?.id || '');

  // Mock recent listings for now - in real app this would come from API
  const recentListings = userItemsData?.data?.slice(0, 3).map(item => ({
    id: item.id,
    title: item.title,
    price: `KSh ${item.price.toLocaleString()}`,
    status: item.status,
    views: Math.floor(Math.random() * 50) + 1 // Mock views
  })) || [];

  const statsData = [
    { 
      title: "Active Listings", 
      value: stats?.activeListings?.toString() || "0", 
      icon: Package, 
      color: "text-primary" 
    },
    { 
      title: "Total Sales", 
      value: stats?.totalSales || "KSh 0", 
      icon: TrendingUp, 
      color: "text-success" 
    },
    { 
      title: "Messages", 
      value: stats?.unreadMessages?.toString() || "0", 
      icon: MessageCircle, 
      color: "text-warning" 
    },
    { 
      title: "Items Sold", 
      value: stats?.soldItemsCount?.toString() || "0", 
      icon: Wallet, 
      color: "text-info" 
    },
  ];

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavigation />
        <main className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading dashboard...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavigation />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {profile?.first_name || 'Student'}!
            </h1>
            <p className="text-muted-foreground">Here's what's happening with your marketplace activity</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">
                        {statsLoading ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          stat.value
                        )}
                      </p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/sell">
                  <Button className="h-16 w-full flex flex-col gap-2" variant="outline">
                    <Plus className="w-5 h-5" />
                    List New Item
                  </Button>
                </Link>
                <Link to="/messages">
                  <Button className="h-16 w-full flex flex-col gap-2" variant="outline">
                    <MessageCircle className="w-5 h-5" />
                    Check Messages
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button className="h-16 w-full flex flex-col gap-2" variant="outline">
                    <Wallet className="w-5 h-5" />
                    View Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Listings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Recent Listings</CardTitle>
                <Link to="/browse">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentListings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No listings yet. Create your first listing to get started!</p>
                    <Link to="/sell">
                      <Button className="mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Listing
                      </Button>
                    </Link>
                  </div>
                ) : (
                  recentListings.map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{listing.title}</h3>
                        <p className="text-sm text-muted-foreground">{listing.views} views</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-primary">{listing.price}</span>
                        <Badge 
                          variant={
                            listing.status === 'active' ? 'default' : 
                            listing.status === 'sold' ? 'secondary' : 'outline'
                          }
                        >
                          {listing.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
