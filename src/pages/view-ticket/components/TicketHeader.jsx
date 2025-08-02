import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TicketHeader = ({ ticket, onUpvote, currentUser }) => {
  const [isUpvoted, setIsUpvoted] = useState(ticket?.isUpvoted || false);
  const [upvoteCount, setUpvoteCount] = useState(ticket?.upvotes || 0);

  const handleUpvote = () => {
    const newUpvoted = !isUpvoted;
    setIsUpvoted(newUpvoted);
    setUpvoteCount(prev => newUpvoted ? prev + 1 : prev - 1);
    if (onUpvote) {
      onUpvote(ticket?.id, newUpvoted);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-elevation-1">
      {/* Title and Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground mb-2 break-words">
            {ticket?.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ticket?.status)}`}>
              {ticket?.status}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(ticket?.priority)}`}>
              {ticket?.priority} Priority
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
              {ticket?.category}
            </span>
          </div>
        </div>

        {/* Upvote Button */}
        <div className="flex items-center gap-2">
          <Button
            variant={isUpvoted ? "default" : "outline"}
            size="sm"
            iconName="ThumbsUp"
            iconPosition="left"
            iconSize={16}
            onClick={handleUpvote}
            className={`transition-all duration-200 ${isUpvoted ? 'shadow-elevation-2' : ''}`}
          >
            {upvoteCount}
          </Button>
        </div>
      </div>
      {/* Ticket Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        {/* Created Info */}
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={16} className="text-muted-foreground" />
          <div>
            <span className="text-muted-foreground">Created:</span>
            <span className="ml-1 text-foreground font-medium">
              {new Date(ticket.createdAt)?.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>

        {/* Assigned Agent */}
        <div className="flex items-center space-x-2">
          <Icon name="User" size={16} className="text-muted-foreground" />
          <div>
            <span className="text-muted-foreground">Assigned to:</span>
            <span className="ml-1 text-foreground font-medium">
              {ticket?.assignedAgent || 'Unassigned'}
            </span>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={16} className="text-muted-foreground" />
          <div>
            <span className="text-muted-foreground">Updated:</span>
            <span className="ml-1 text-foreground font-medium">
              {new Date(ticket.updatedAt)?.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
      {/* Ticket ID and Share */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Hash" size={14} />
          <span>Ticket ID: {ticket?.id}</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          iconName="Share2"
          iconPosition="left"
          iconSize={14}
          onClick={() => {
            navigator.clipboard?.writeText(window.location?.href);
            // Toast notification would be triggered here
          }}
        >
          Share
        </Button>
      </div>
    </div>
  );
};

export default TicketHeader;