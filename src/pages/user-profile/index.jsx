import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../services/ticketService';
import AuthenticatedHeader from '../../components/ui/AuthenticatedHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import ProfileHeader from './components/ProfileHeader';
import PersonalInfoSection from './components/PersonalInfoSection';
import SecuritySection from './components/SecuritySection';
import PreferencesSection from './components/PreferencesSection';
import ActivitySection from './components/ActivitySection';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, userProfile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userTickets, setUserTickets] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Load user's tickets
  useEffect(() => {
    let isMounted = true;

    const loadUserTickets = async () => {
      if (!user) return;

      try {
        // Get tickets created by this user
        const tickets = await ticketService?.getTickets({
          userId: user?.id, // This would need to be implemented in the service
          limit: 10
        });
        
        if (isMounted) {
          setUserTickets(tickets || []);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error loading user tickets:', error);
        }
      }
    };

    loadUserTickets();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleUpdateProfile = async (updates) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateProfile(updates);
      
      if (result?.error) {
        setError(result?.error?.message || 'Failed to update profile');
      } else {
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Show loading state for auth
  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedHeader user={userProfile} onNavigate={handleNavigation} />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading profile...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader user={userProfile} onNavigate={handleNavigation} />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />
          
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-success font-medium">{successMessage}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-error/10 border border-error/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-error font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Profile Header */}
          <ProfileHeader 
            user={userProfile} 
            onUpdateProfile={handleUpdateProfile}
            loading={loading}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Left Column */}
            <div className="space-y-8">
              <PersonalInfoSection 
                user={userProfile}
                onUpdateProfile={handleUpdateProfile}
                loading={loading}
              />
              
              <SecuritySection 
                user={userProfile}
                onUpdateProfile={handleUpdateProfile}
                loading={loading}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <PreferencesSection 
                user={userProfile}
                onUpdateProfile={handleUpdateProfile}
                loading={loading}
              />
              
              <ActivitySection 
                tickets={userTickets}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;