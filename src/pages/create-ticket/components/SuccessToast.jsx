import React, { useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SuccessToast = ({ 
  isVisible, 
  onClose, 
  title = "Success!", 
  message = "Your ticket has been created successfully.",
  ticketId = null,
  onViewTicket = null,
  autoClose = true,
  duration = 5000 
}) => {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-down">
      <div className="bg-card border border-border rounded-lg shadow-elevation-4 p-4 max-w-sm w-full">
        <div className="flex items-start space-x-3">
          {/* Success Icon */}
          <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="CheckCircle" size={18} color="var(--color-success)" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  {title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {message}
                </p>
                
                {ticketId && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Ticket ID: <span className="font-mono text-foreground">#{ticketId}</span>
                  </p>
                )}
              </div>
              
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                iconName="X"
                iconSize={14}
                className="ml-2 -mt-1 -mr-1"
              />
            </div>
            
            {/* Action Buttons */}
            {onViewTicket && (
              <div className="flex items-center space-x-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewTicket}
                  iconName="Eye"
                  iconPosition="left"
                  iconSize={14}
                >
                  View Ticket
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress Bar */}
        {autoClose && (
          <div className="mt-3 w-full bg-muted rounded-full h-1">
            <div 
              className="bg-success h-1 rounded-full animate-pulse"
              style={{
                animation: `shrink ${duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default SuccessToast;