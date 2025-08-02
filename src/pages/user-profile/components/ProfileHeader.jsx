import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProfileHeader = ({ user, onImageUpload, isUploading }) => {
  const handleImageUpload = (event) => {
    const file = event.target?.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-elevation-2 p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        {/* Profile Image */}
        <div className="relative group">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-muted border-4 border-primary/20">
            <Image
              src={user?.avatar}
              alt={`${user?.name}'s profile picture`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Upload Overlay */}
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <label htmlFor="profile-image" className="cursor-pointer">
              <Icon name="Camera" size={20} color="white" />
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
          
          {isUploading && (
            <div className="absolute inset-0 bg-primary/20 rounded-full flex items-center justify-center">
              <Icon name="Loader2" size={20} className="animate-spin text-primary" />
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {user?.name}
          </h1>
          <p className="text-muted-foreground mb-1">{user?.email}</p>
          <p className="text-sm text-muted-foreground mb-4">
            Member since {new Date(user.joinDate)?.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long' 
            })}
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center space-x-2 text-sm">
              <Icon name="Ticket" size={16} className="text-primary" />
              <span className="text-muted-foreground">
                {user?.stats?.totalTickets} Tickets
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-muted-foreground">
                {user?.stats?.resolvedTickets} Resolved
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Icon name="Clock" size={16} className="text-warning" />
              <span className="text-muted-foreground">
                {user?.stats?.avgResponseTime}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Settings"
            iconPosition="left"
            className="whitespace-nowrap"
          >
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;