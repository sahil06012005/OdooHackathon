import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActivitySection = ({ activities }) => {
  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const filterOptions = [
    { value: 'all', label: 'All Activity', icon: 'Activity' },
    { value: 'tickets', label: 'Tickets', icon: 'Ticket' },
    { value: 'comments', label: 'Comments', icon: 'MessageSquare' },
    { value: 'profile', label: 'Profile', icon: 'User' }
  ];

  const getActivityIcon = (type) => {
    const iconMap = {
      'ticket_created': 'Plus',
      'ticket_updated': 'Edit',
      'ticket_closed': 'CheckCircle',
      'comment_added': 'MessageSquare',
      'profile_updated': 'User',
      'password_changed': 'Key',
      'login': 'LogIn',
      'logout': 'LogOut'
    };
    return iconMap?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colorMap = {
      'ticket_created': 'text-blue-500',
      'ticket_updated': 'text-yellow-500',
      'ticket_closed': 'text-green-500',
      'comment_added': 'text-purple-500',
      'profile_updated': 'text-indigo-500',
      'password_changed': 'text-red-500',
      'login': 'text-green-400',
      'logout': 'text-gray-500'
    };
    return colorMap?.[type] || 'text-primary';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return activityTime?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: activityTime?.getFullYear() !== now?.getFullYear() ? 'numeric' : undefined
    });
  };

  const filteredActivities = activities?.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'tickets') return ['ticket_created', 'ticket_updated', 'ticket_closed']?.includes(activity?.type);
    if (filter === 'comments') return activity?.type === 'comment_added';
    if (filter === 'profile') return ['profile_updated', 'password_changed']?.includes(activity?.type);
    return true;
  });

  const displayedActivities = showAll ? filteredActivities : filteredActivities?.slice(0, 10);

  return (
    <div className="bg-card rounded-xl shadow-elevation-2 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Activity" size={20} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          {filterOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setFilter(option?.value)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === option?.value
                  ? 'bg-primary text-primary-foreground shadow-elevation-1'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={option?.icon} size={14} />
              <span className="hidden sm:inline">{option?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {displayedActivities?.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Activity" size={48} className="text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Activity Found</h3>
          <p className="text-muted-foreground">
            {filter === 'all' 
              ? "No recent activity to display" 
              : `No ${filter} activity found`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedActivities?.map((activity, index) => (
            <div
              key={activity?.id}
              className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors duration-200"
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center ${getActivityColor(activity?.type)}`}>
                <Icon name={getActivityIcon(activity?.type)} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {activity?.title}
                  </p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {formatTimeAgo(activity?.timestamp)}
                  </span>
                </div>
                
                {activity?.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity?.description}
                  </p>
                )}
                
                {activity?.metadata && (
                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                    {activity?.metadata?.ticketId && (
                      <span className="flex items-center space-x-1">
                        <Icon name="Hash" size={12} />
                        <span>{activity?.metadata?.ticketId}</span>
                      </span>
                    )}
                    {activity?.metadata?.category && (
                      <span className="flex items-center space-x-1">
                        <Icon name="Tag" size={12} />
                        <span>{activity?.metadata?.category}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {filteredActivities?.length > 10 && (
            <div className="text-center pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                iconName={showAll ? "ChevronUp" : "ChevronDown"}
                iconPosition="right"
              >
                {showAll ? 'Show Less' : `Show ${filteredActivities?.length - 10} More`}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivitySection;