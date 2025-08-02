import React from 'react';
import TicketCard from './TicketCard';
import Icon from '../../../components/AppIcon';

const TicketGrid = ({ tickets, onUpvote, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)]?.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4 animate-pulse">
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
                <div className="w-8 h-8 bg-muted rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-6 bg-muted rounded w-16"></div>
                <div className="h-6 bg-muted rounded w-20"></div>
              </div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="flex justify-between">
                <div className="flex space-x-4">
                  <div className="h-4 bg-muted rounded w-8"></div>
                  <div className="h-4 bg-muted rounded w-12"></div>
                </div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tickets?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon name="FileText" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No tickets found</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          No tickets match your current search and filter criteria. Try adjusting your filters or create a new ticket.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tickets?.map((ticket) => (
        <TicketCard
          key={ticket?.id}
          ticket={ticket}
          onUpvote={onUpvote}
        />
      ))}
    </div>
  );
};

export default TicketGrid;