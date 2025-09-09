import { GraduationCap, Twitter, Instagram, Facebook, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold">Quick Swapp</div>
                <Badge variant="secondary" className="text-xs bg-success/20 text-success border-success/30">
                  Campus Verified
                </Badge>
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-6">
              The trusted marketplace connecting students across campus for safe, secure trading.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-white/20 text-white hover:text-white">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/20 text-white hover:text-white">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/20 text-white hover:text-white">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/20 text-white hover:text-white">
                <Mail className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dispute Resolution</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/60 text-sm">
            © 2024 Quick Swapp. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              🏆 Trusted by 10K+ Students
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              🛡️ $2M+ Protected
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;