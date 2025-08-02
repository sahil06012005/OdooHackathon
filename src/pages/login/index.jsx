import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginBrandingHeader from '../../components/ui/LoginBrandingHeader';
import HeroSection from './components/HeroSection';
import LoginForm from './components/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('quickdesk_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        navigate('/dashboard');
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('quickdesk_user');
      }
    }
  }, [navigate]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <LoginBrandingHeader />
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Hero Section - Left Side */}
        <div className="hidden lg:block">
          <HeroSection />
        </div>
        
        {/* Login Form - Right Side */}
        <div className="flex items-center justify-center p-4 lg:p-8 bg-muted/30">
          <div className="w-full max-w-md">
            {/* Mobile Hero Summary */}
            <div className="lg:hidden mb-8 text-center">
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Welcome to <span className="text-primary">QuickDesk</span>
              </h1>
              <p className="text-muted-foreground">
                Your comprehensive help desk solution for exceptional customer support.
              </p>
            </div>
            
            {/* Login Form */}
            <LoginForm onLogin={handleLogin} />
            
            {/* Mobile Trust Signals */}
            <div className="lg:hidden mt-8 text-center">
              <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span>Reliable</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span>Trusted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-card border-t border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date()?.getFullYear()} QuickDesk. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#privacy" className="hover:text-foreground transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-foreground transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#support" className="hover:text-foreground transition-colors duration-200">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;