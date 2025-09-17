import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  GraduationCap, 
  LayoutDashboard, 
  Search, 
  Plus, 
  MessageCircle, 
  User, 
  Bell,
  LogOut,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCurrentProfile } from "@/lib/hooks";
import { AuthService } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

const DashboardNavigation = () => {
  const [notifications] = useState(3); // This could come from API later
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const { data: profile, isLoading: profileLoading } = useCurrentProfile();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/browse", label: "Browse", icon: Search },
    { path: "/sell", label: "Sell", icon: Plus },
    { path: "/messages", label: "Messages", icon: MessageCircle, badge: 2 },
    { path: "/profile", label: "Profile", icon: User },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await AuthService.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get user initials for avatar fallback
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

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b shadow-soft">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-soft">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-primary">Quick Swapp</div>
              <Badge variant="secondary" className="text-xs bg-success/10 text-success border-success/20">
                Campus Verified
              </Badge>
            </div>
          </div>
          
          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "default" : "ghost"}
                onClick={() => navigate(item.path)}
                className="relative"
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
                {item.badge && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {notifications}
                </Badge>
              )}
            </Button>
            
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                {profileLoading ? (
                  <div className="space-y-1">
                    <div className="w-20 h-4 bg-muted animate-pulse rounded"></div>
                    <div className="w-32 h-3 bg-muted animate-pulse rounded"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{profile?.email}</p>
                  </>
                )}
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden border-t bg-white/95 backdrop-blur-md">
          <div className="grid grid-cols-5 gap-1 p-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "default" : "ghost"}
                onClick={() => navigate(item.path)}
                className="flex flex-col gap-1 h-16 relative"
                size="sm"
              >
                <item.icon className="w-4 h-4" />
                <span className="text-xs">{item.label}</span>
                {item.badge && (
                  <Badge className="absolute top-1 right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavigation;
