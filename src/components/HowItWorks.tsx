import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Upload, CreditCard, MessageSquare, HandHeart } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "List Your Item",
      description: "Upload photos, write a description, and set your price. It's that simple.",
      color: "primary"
    },
    {
      icon: MessageSquare,
      title: "Connect with Buyers",
      description: "Chat with interested students and answer their questions directly in-app.",
      color: "secondary"
    },
    {
      icon: CreditCard,
      title: "Secure Payment",
      description: "Buyer pays into escrow. Money stays safe until they confirm receipt.",
      color: "success"
    },
    {
      icon: HandHeart,
      title: "Complete Transaction",
      description: "Meet up, hand over the item, and get paid instantly. Everyone's happy!",
      color: "primary"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Simple Process
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How Quick Swapp
            <span className="block text-primary">Works for You</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From listing to payment, we've streamlined every step to make trading 
            on campus as easy and secure as possible.
          </p>
        </div>
        
        <div className="relative">
          {/* Desktop flow */}
          <div className="hidden md:flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-medium mb-4 ${
                    step.color === 'primary' ? 'bg-gradient-primary' :
                    step.color === 'secondary' ? 'bg-secondary' :
                    'bg-success'
                  }`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <Badge variant="secondary" className="mb-2">
                    Step {index + 1}
                  </Badge>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-8 h-8 text-muted-foreground mx-8 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
          
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <Card key={index} className="text-center shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  {/* Mobile icon */}
                  <div className={`md:hidden w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-medium mb-4 ${
                    step.color === 'primary' ? 'bg-gradient-primary' :
                    step.color === 'secondary' ? 'bg-secondary' :
                    'bg-success'
                  }`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <Badge variant="secondary" className="mb-4 md:hidden">
                    Step {index + 1}
                  </Badge>
                  
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-accent rounded-2xl p-8 shadow-soft">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Start Trading?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of students already using Quick Swapp to buy and sell safely on campus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                🎓 Student Email Required
              </Badge>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                💸 0% Listing Fees
              </Badge>
              <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                🛡️ 100% Secure Payments
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;