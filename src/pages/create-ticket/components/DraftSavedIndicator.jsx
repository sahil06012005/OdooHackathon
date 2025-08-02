import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';

const DraftSavedIndicator = ({ isVisible, onHide, autoHide = true, duration = 3000 }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      
      if (autoHide) {
        const timer = setTimeout(() => {
          setShow(false);
          setTimeout(() => {
            onHide();
          }, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, autoHide, duration, onHide]);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-300 ${
      show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    }`}>
      <div className="bg-card border border-border rounded-full shadow-elevation-3 px-4 py-2">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center">
            <Icon name="Save" size={12} color="var(--color-success)" />
          </div>
          <span className="text-sm font-medium text-foreground">Draft saved</span>
          <div className="w-1 h-1 bg-success rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default DraftSavedIndicator;