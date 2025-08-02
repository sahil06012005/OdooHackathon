import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const FloatingCreateButton = () => {
  return (
    <>
      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <Link to="/create-ticket">
          <Button
            size="lg"
            iconName="Plus"
            iconSize={24}
            className="w-14 h-14 rounded-full shadow-elevation-4 hover:shadow-elevation-5 transition-all duration-200"
          >
            <span className="sr-only">Create Ticket</span>
          </Button>
        </Link>
      </div>

      {/* Desktop Create Button */}
      <div className="hidden md:block mb-6">
        <Link to="/create-ticket">
          <Button
            size="lg"
            iconName="Plus"
            iconPosition="left"
            iconSize={20}
            className="shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-200"
          >
            Create New Ticket
          </Button>
        </Link>
      </div>
    </>
  );
};

export default FloatingCreateButton;