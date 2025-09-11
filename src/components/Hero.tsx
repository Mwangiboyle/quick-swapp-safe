import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, MessageCircle, GraduationCap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-marketplace.jpg";

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Students using Quick Swapp marketplace" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-secondary/80"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
          <GraduationCap className="w-4 h-4 mr-2" />
          Student-Verified Marketplace
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Buy & Sell
          <span className="block bg-gradient-to-r from-secondary to-yellow-300 bg-clip-text text-transparent">
            Safely on Campus
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          Quick Swapp connects students with a secure marketplace featuring escrow payments, 
          verified users, and seamless communication. Trade textbooks, electronics, and more with confidence.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button variant="hero" size="lg" className="text-lg px-8 py-4" onClick={() => navigate('/dashboard')}>
            Start Selling Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="outline-hero" size="lg" className="text-lg px-8 py-4" onClick={() => navigate('/dashboard')}>
            Browse Marketplace
          </Button>
        </div>
        
        {/* Trust indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <Shield className="w-6 h-6 text-success" />
            <span className="text-white font-medium">Escrow Protected</span>
          </div>
          <div className="flex items-center justify-center space-x-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <Users className="w-6 h-6 text-success" />
            <span className="text-white font-medium">Student Verified</span>
          </div>
          <div className="flex items-center justify-center space-x-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <MessageCircle className="w-6 h-6 text-success" />
            <span className="text-white font-medium">In-App Chat</span>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;