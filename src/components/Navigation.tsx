import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

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
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
              How it Works
            </a>
            <a href="#safety" className="text-muted-foreground hover:text-primary transition-colors">
              Safety
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </a>
          </div>
          
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/signin')}>
              Sign In
            </Button>
            <Button variant="hero" onClick={() => navigate('/signup')}>
              Join Now
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors">
                How it Works
              </a>
              <a href="#safety" className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors">
                Safety
              </a>
              <a href="#pricing" className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </a>
              <div className="px-3 py-2 space-y-2">
                <Button variant="ghost" className="w-full" onClick={() => navigate('/signin')}>
                  Sign In
                </Button>
                <Button variant="hero" className="w-full" onClick={() => navigate('/signup')}>
                  Join Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;