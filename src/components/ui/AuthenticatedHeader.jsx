import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const AuthenticatedHeader = ({ user, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard'
    },
    {
      label: 'Create Ticket',
      path: '/create-ticket',
      icon: 'Plus'
    },
    {
      label: 'Profile',
      path: '/user-profile',
      icon: 'User'
    }
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const Logo = () => (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <Icon name="Headphones" size={20} color="white" />
      </div>
      <span className="text-xl font-bold text-foreground">QuickDesk</span>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-target ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground shadow-elevation-1'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="User" size={16} />
              <span>{user?.name || 'User'}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="LogOut"
              iconSize={16}
              onClick={() => handleNavigation('/login')}
            >
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              iconName={isMobileMenuOpen ? 'X' : 'Menu'}
              iconSize={20}
              onClick={handleMobileMenuToggle}
              className="touch-target"
            />
          </div>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border animate-slide-down">
          <div className="px-4 py-2 space-y-1">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 touch-target ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground shadow-elevation-1'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                <span>{item?.label}</span>
              </Link>
            ))}
            
            {/* Mobile User Section */}
            <div className="border-t border-border pt-3 mt-3">
              <div className="flex items-center space-x-3 px-4 py-2 text-sm text-muted-foreground">
                <Icon name="User" size={18} />
                <span>{user?.name || 'User'}</span>
              </div>
              <button
                onClick={() => handleNavigation('/login')}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 touch-target w-full"
              >
                <Icon name="LogOut" size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AuthenticatedHeader;