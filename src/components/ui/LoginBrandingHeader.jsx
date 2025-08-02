import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const LoginBrandingHeader = () => {
  const Logo = () => (
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-elevation-2">
        <Icon name="Headphones" size={28} color="white" />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-foreground">QuickDesk</span>
        <span className="text-sm text-muted-foreground">Help Desk Platform</span>
      </div>
    </div>
  );

  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo for Login */}
          <Link to="/login" className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Minimal Navigation for Login */}
          <nav className="flex items-center space-x-6">
            <a
              href="#help"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Help
            </a>
            <a
              href="#support"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Support
            </a>
          </nav>
        </div>
      </div>

      {/* Hero Section for Login */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome to QuickDesk
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Streamline your customer support with our comprehensive help desk platform. 
              Manage tickets, track progress, and deliver exceptional customer service.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 mt-8">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Shield" size={16} color="var(--color-success)" />
                <span>Secure & Reliable</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={16} color="var(--color-primary)" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Users" size={16} color="var(--color-accent)" />
                <span>Trusted by 10k+ Teams</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LoginBrandingHeader;