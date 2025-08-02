import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TicketCard = ({ ticket, onUpvote }) => {
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

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'technical':
        return 'bg-purple-100 text-purple-800';
      case 'billing':
        return 'bg-orange-100 text-orange-800';
      case 'general':
        return 'bg-blue-100 text-blue-800';
      case 'bug report':
        return 'bg-red-100 text-red-800';
      case 'feature request':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-all duration-200 hover-elevation">
      <div className="flex flex-col space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link 
              to={`/view-ticket/${ticket?.id}`}
              className="block group"
            >
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                {ticket?.title}
              </h3>
            </Link>
            <p className="text-xs text-muted-foreground mt-1">
              #{ticket?.id}
            </p>
          </div>
          
          {/* Upvote Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpvote(ticket?.id)}
            className="flex-col h-auto py-1 px-2 min-w-0"
          >
            <Icon 
              name="ChevronUp" 
              size={16} 
              className={ticket?.isUpvoted ? 'text-primary' : 'text-muted-foreground'} 
            />
            <span className={`text-xs ${ticket?.isUpvoted ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
              {ticket?.upvotes}
            </span>
          </Button>
        </div>

        {/* Status and Category */}
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket?.status)}`}>
            {ticket?.status}
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(ticket?.category)}`}>
            {ticket?.category}
          </span>
        </div>

        {/* Description Preview */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {ticket?.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="MessageCircle" size={14} />
              <span>{ticket?.commentCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{formatTimeAgo(ticket?.lastModified)}</span>
            </div>
          </div>
          
          {ticket?.assignedAgent && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Icon name="User" size={14} />
              <span className="truncate max-w-20">{ticket?.assignedAgent}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;