import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  const features = [
    {
      icon: 'Ticket',
      title: 'Smart Ticketing',
      description: 'Automated ticket routing and prioritization'
    },
    {
      icon: 'Users',
      title: 'Team Collaboration',
      description: 'Seamless communication between agents'
    },
    {
      icon: 'BarChart3',
      title: 'Analytics & Reports',
      description: 'Comprehensive performance insights'
    },
    {
      icon: 'Clock',
      title: '24/7 Support',
      description: 'Round-the-clock customer assistance'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'IT Manager',
      company: 'TechCorp',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
      quote: 'QuickDesk transformed our support operations. Response times improved by 60%.'
    },
    {
      name: 'Michael Chen',
      role: 'Customer Success Lead',
      company: 'StartupXYZ',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      quote: 'The best help desk solution we have ever used. Intuitive and powerful.'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-success/5 min-h-screen">
      {/* Main Hero Content */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-accent rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-success rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Exceptional Support
              <span className="block text-primary">Made Simple</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Transform your customer support experience with QuickDesk's powerful ticketing system. 
              Streamline workflows, boost productivity, and deliver outstanding service that keeps customers coming back.
            </p>

            {/* Hero Image */}
            <div className="relative max-w-4xl mx-auto mb-16">
              <div className="relative overflow-hidden rounded-2xl shadow-elevation-4">
                <Image
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=500&fit=crop"
                  alt="Modern customer support team working collaboratively"
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl">
                <div className="bg-card rounded-2xl shadow-elevation-3 border border-border p-6">
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary mb-1">10k+</div>
                      <div className="text-sm text-muted-foreground">Active Users</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-success mb-1">99.9%</div>
                      <div className="text-sm text-muted-foreground">Uptime</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent mb-1">&lt;2min</div>
                      <div className="text-sm text-muted-foreground">Avg Response</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 mt-16">
            {features?.map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 shadow-elevation-2 border border-border hover:shadow-elevation-3 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name={feature?.icon} size={24} color="var(--color-primary)" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature?.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature?.description}</p>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="bg-card rounded-2xl p-8 shadow-elevation-3 border border-border">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Trusted by Industry Leaders</h2>
              <p className="text-muted-foreground">See what our customers say about QuickDesk</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials?.map((testimonial, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4">
                    <div className="flex justify-center mb-2">
                      {[...Array(5)]?.map((_, i) => (
                        <Icon key={i} name="Star" size={16} color="var(--color-accent)" className="fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-foreground italic text-lg mb-4">
                      "{testimonial?.quote}"
                    </blockquote>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <Image
                      src={testimonial?.avatar}
                      alt={`${testimonial?.name} profile picture`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-foreground">{testimonial?.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial?.role}, {testimonial?.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Signals */}
          <div className="text-center mt-16">
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} color="var(--color-success)" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Lock" size={16} color="var(--color-primary)" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Award" size={16} color="var(--color-accent)" />
                <span>ISO 27001 Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;