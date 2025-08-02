import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const TicketSidebar = ({ ticket, onStatusChange, onAssigneeChange, currentUser }) => {
  const statusOptions = [
    { value: 'open', label: 'Open', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { value: 'in progress', label: 'In Progress', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { value: 'resolved', label: 'Resolved', color: 'text-green-600', bgColor: 'bg-green-50' },
    { value: 'closed', label: 'Closed', color: 'text-gray-600', bgColor: 'bg-gray-50' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-orange-600' },
    { value: 'high', label: 'High', color: 'text-red-600' }
  ];

  const agents = [
    {
      id: 'agent1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      status: 'online'
    },
    {
      id: 'agent2',
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      status: 'busy'
    },
    {
      id: 'agent3',
      name: 'Emily Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      status: 'away'
    }
  ];

  const canEdit = currentUser?.role === 'agent' || currentUser?.role === 'admin';

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return 'Circle';
      case 'busy': return 'Minus';
      case 'away': return 'Clock';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'busy': return 'text-red-500';
      case 'away': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Ticket Actions */}
      {canEdit && (
        <div className="bg-card rounded-lg border border-border p-4 shadow-elevation-1">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Icon name="Settings" size={16} className="mr-2" />
            Actions
          </h3>
          
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Edit"
              iconPosition="left"
              iconSize={14}
              fullWidth
            >
              Edit Ticket
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="UserPlus"
              iconPosition="left"
              iconSize={14}
              fullWidth
            >
              Assign Agent
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="MessageSquare"
              iconPosition="left"
              iconSize={14}
              fullWidth
            >
              Internal Note
            </Button>
          </div>
        </div>
      )}
      {/* Ticket Details */}
      <div className="bg-card rounded-lg border border-border p-4 shadow-elevation-1">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
          <Icon name="Info" size={16} className="mr-2" />
          Details
        </h3>
        
        <div className="space-y-3 text-sm">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status:</span>
            <div className="flex items-center space-x-1">
              {statusOptions?.map(option => 
                option?.value === ticket?.status?.toLowerCase() && (
                  <span key={option?.value} className={`px-2 py-1 rounded-full text-xs font-medium ${option?.color} ${option?.bgColor}`}>
                    {option?.label}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Priority */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Priority:</span>
            <div className="flex items-center space-x-1">
              {priorityOptions?.map(option => 
                option?.value === ticket?.priority?.toLowerCase() && (
                  <span key={option?.value} className={`text-xs font-medium ${option?.color}`}>
                    {option?.label}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Category:</span>
            <span className="text-foreground font-medium">{ticket?.category}</span>
          </div>

          {/* Created Date */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Created:</span>
            <span className="text-foreground">
              {new Date(ticket.createdAt)?.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>

          {/* Due Date */}
          {ticket?.dueDate && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Due:</span>
              <span className="text-foreground">
                {new Date(ticket.dueDate)?.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Assigned Agent */}
      <div className="bg-card rounded-lg border border-border p-4 shadow-elevation-1">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
          <Icon name="User" size={16} className="mr-2" />
          Assigned Agent
        </h3>
        
        {ticket?.assignedAgent ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
              <Image
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
                alt={ticket?.assignedAgent}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{ticket?.assignedAgent}</p>
              <div className="flex items-center space-x-1">
                <Icon name="Circle" size={8} className="text-green-500 fill-current" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Icon name="UserX" size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No agent assigned</p>
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                iconName="UserPlus"
                iconPosition="left"
                iconSize={14}
                className="mt-2"
              >
                Assign Agent
              </Button>
            )}
          </div>
        )}
      </div>
      {/* Available Agents */}
      {canEdit && (
        <div className="bg-card rounded-lg border border-border p-4 shadow-elevation-1">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Icon name="Users" size={16} className="mr-2" />
            Available Agents
          </h3>
          
          <div className="space-y-2">
            {agents?.map((agent) => (
              <div
                key={agent?.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors duration-200"
                onClick={() => onAssigneeChange && onAssigneeChange(agent?.id)}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-muted">
                  <Image
                    src={agent?.avatar}
                    alt={agent?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground">{agent?.name}</p>
                </div>
                <Icon 
                  name={getStatusIcon(agent?.status)} 
                  size={8} 
                  className={`${getStatusColor(agent?.status)} fill-current`} 
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Ticket History */}
      <div className="bg-card rounded-lg border border-border p-4 shadow-elevation-1">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
          <Icon name="History" size={16} className="mr-2" />
          Recent Activity
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-2 text-xs">
            <Icon name="MessageSquare" size={12} className="text-blue-500 mt-0.5" />
            <div>
              <p className="text-foreground">Comment added by <span className="font-medium">Sarah Johnson</span></p>
              <p className="text-muted-foreground">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 text-xs">
            <Icon name="Edit" size={12} className="text-orange-500 mt-0.5" />
            <div>
              <p className="text-foreground">Status changed to <span className="font-medium">In Progress</span></p>
              <p className="text-muted-foreground">4 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 text-xs">
            <Icon name="UserPlus" size={12} className="text-green-500 mt-0.5" />
            <div>
              <p className="text-foreground">Assigned to <span className="font-medium">Sarah Johnson</span></p>
              <p className="text-muted-foreground">6 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSidebar;