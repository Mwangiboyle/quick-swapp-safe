import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, MessageCircle, Wallet, TrendingUp } from "lucide-react";
import DashboardNavigation from "@/components/DashboardNavigation";
import { useDashboardStats, UseCurrentProfile } from '@/lib/hooks';

const Dashboard = () => {
  const { data: profile } = useCurrentProfile();
  const { data: stats } = useDashboardStats(profile?.id || '');

  // Use real data instead of mock stats
  // Rest of your component...
}
  return (
    <div className="min-h-screen bg-background">
      <DashboardNavigation />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, Alex!</h1>
            <p className="text-muted-foreground">Here's what's happening with your marketplace activity</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
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
                <Button className="h-16 flex flex-col gap-2" variant="outline">
                  <Plus className="w-5 h-5" />
                  List New Item
                </Button>
                <Button className="h-16 flex flex-col gap-2" variant="outline">
                  <MessageCircle className="w-5 h-5" />
                  Check Messages
                </Button>
                <Button className="h-16 flex flex-col gap-2" variant="outline">
                  <Wallet className="w-5 h-5" />
                  Withdraw Funds
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Listings */}
          <Card>
            <CardHeader>
              <CardTitle>Your Recent Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentListings.map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground">{listing.views} views</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-primary">{listing.price}</span>
                      <Badge 
                        variant={listing.status === 'active' ? 'default' : 
                                listing.status === 'sold' ? 'secondary' : 'outline'}
                      >
                        {listing.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
