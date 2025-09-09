import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, GraduationCap, MessageCircle, Star, Wallet, Search } from "lucide-react";
import escrowIcon from "@/assets/escrow-icon.jpg";
import verificationIcon from "@/assets/verification-icon.jpg";
import chatIcon from "@/assets/chat-icon.jpg";

const Features = () => {
  const features = [
    {
      icon: Shield,
      image: escrowIcon,
      title: "Secure Escrow Payments",
      description: "Your money stays protected until you confirm receipt. No scams, no worries.",
      badge: "Quick Swapp Secure Pay",
      color: "success"
    },
    {
      icon: GraduationCap,
      image: verificationIcon,
      title: "Student Verification",
      description: "Only verified students with campus emails can join our trusted community.",
      badge: "Campus Verified",
      color: "primary"
    },
    {
      icon: MessageCircle,
      image: chatIcon,
      title: "In-App Communication",
      description: "Chat directly with buyers and sellers to coordinate pickups and ask questions.",
      badge: "Instant Chat",
      color: "secondary"
    },
    {
      icon: Star,
      title: "Ratings & Reviews",
      description: "Build your reputation and shop with confidence using our review system.",
      badge: "Trust Score",
      color: "success"
    },
    {
      icon: Search,
      title: "Smart Discovery",
      description: "Find exactly what you need with advanced filters by price, location, and category.",
      badge: "AI Powered",
      color: "primary"
    },
    {
      icon: Wallet,
      title: "Flexible Withdrawals",
      description: "Get paid via M-Pesa, bank transfer, or keep funds in your wallet for future purchases.",
      badge: "Multiple Options",
      color: "secondary"
    }
  ];

  return (
    <section className="py-20 bg-gradient-accent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Platform Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything You Need for
            <span className="block text-primary">Safe Campus Trading</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built specifically for students, Quick Swapp combines cutting-edge security 
            with intuitive design to create the perfect marketplace experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-strong transition-all duration-500 hover:-translate-y-2 border-0 shadow-soft bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                {feature.image && (
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden shadow-medium">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                {!feature.image && (
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-xl flex items-center justify-center shadow-medium">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                )}
                <Badge 
                  variant="secondary" 
                  className={`mb-2 ${
                    feature.color === 'success' ? 'bg-success/10 text-success border-success/20' :
                    feature.color === 'primary' ? 'bg-primary/10 text-primary border-primary/20' :
                    'bg-secondary/10 text-secondary border-secondary/20'
                  }`}
                >
                  {feature.badge}
                </Badge>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;