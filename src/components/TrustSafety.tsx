import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, CheckCircle, AlertTriangle, Users, Award } from "lucide-react";

const TrustSafety = () => {
  const safetyFeatures = [
    {
      icon: Shield,
      title: "Escrow Protection",
      description: "Every transaction is secured through our escrow system. Money is only released when you confirm receipt.",
      highlight: "100% Protected"
    },
    {
      icon: CheckCircle,
      title: "Identity Verification",
      description: "All users must verify their student status with official campus email addresses.",
      highlight: "Campus Verified"
    },
    {
      icon: Users,
      title: "Community Reviews",
      description: "Rate and review every transaction to help build a trusted community ecosystem.",
      highlight: "Peer Reviewed"
    },
    {
      icon: AlertTriangle,
      title: "Dispute Resolution",
      description: "Our admin team is ready to step in and resolve any issues quickly and fairly.",
      highlight: "24/7 Support"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-success/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <Badge variant="outline" className="mb-4 bg-success/10 text-success border-success/20">
              <Lock className="w-4 h-4 mr-2" />
              Security First
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Trade with Complete
              <span className="block text-primary">Peace of Mind</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Quick Swapp prioritizes your safety above all else. Our multi-layered security 
              approach ensures every transaction is protected, every user is verified, and 
              every dispute is resolved fairly.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-foreground font-medium">Student-only verified community</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-foreground font-medium">Funds held in secure escrow until delivery</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-foreground font-medium">Real-time chat monitoring and support</span>
              </div>
            </div>
            
            <Button variant="hero" size="lg" className="mr-4">
              Learn More About Security
            </Button>
          </div>
          
          {/* Right content */}
          <div className="space-y-6">
            {safetyFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-medium transition-all duration-300 border-0 shadow-soft bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {feature.title}
                        </CardTitle>
                        <Badge variant="secondary" className="bg-success/10 text-success border-success/20 text-xs">
                          {feature.highlight}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Trust stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
            <div className="text-muted-foreground">Successful Transactions</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">10K+</div>
            <div className="text-muted-foreground">Verified Students</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">$2M+</div>
            <div className="text-muted-foreground">Protected in Escrow</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
            <div className="text-muted-foreground">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSafety;