import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../services/ticketService';
import AuthenticatedHeader from '../../components/ui/AuthenticatedHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import TicketHeader from './components/TicketHeader';
import TicketDescription from './components/TicketDescription';
import CommentThread from './components/CommentThread';
import CommentInput from './components/CommentInput';
import TicketSidebar from './components/TicketSidebar';

const ViewTicket = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const ticketId = searchParams?.get('id');
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadTicket = async () => {
      if (!ticketId) {
        navigate('/dashboard');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const ticketData = await ticketService?.getTicketById(ticketId);
        
        if (isMounted) {
          setTicket(ticketData);
          setComments(ticketData?.comments || []);
        }
      } catch (error) {
        if (isMounted) {
          if (error?.message?.includes('Failed to fetch') || 
              error?.message?.includes('NetworkError')) {
            setError('Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.');
          } else {
            setError('Failed to load ticket. Please try again.');
          }
          console.error('Error loading ticket:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTicket();

    return () => {
      isMounted = false;
    };
  }, [ticketId, navigate]);

  const handleAddComment = async (content) => {
    try {
      const newComment = await ticketService?.addComment(ticketId, content);
      setComments(prev => [...prev, newComment]);
      
      // Update ticket's last_modified
      if (ticket) {
        setTicket(prev => ({
          ...prev,
          last_modified: new Date()?.toISOString()
        }));
      }
    } catch (error) {
      if (error?.message?.includes('Not authenticated')) {
        navigate('/login');
      } else {
        setError('Failed to add comment. Please try again.');
      }
      console.error('Error adding comment:', error);
    }
  };

  const handleUpvote = async () => {
    try {
      const result = await ticketService?.toggleUpvote(ticketId);
      
      setTicket(prev => ({
        ...prev,
        upvotes: result?.upvoted 
          ? (prev?.upvotes || 0) + 1 
          : Math.max((prev?.upvotes || 0) - 1, 0),
        isUpvoted: result?.upvoted
      }));
    } catch (error) {
      if (error?.message?.includes('Not authenticated')) {
        navigate('/login');
      } else {
        setError('Failed to update upvote. Please try again.');
      }
      console.error('Error upvoting ticket:', error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedHeader user={userProfile} onNavigate={handleNavigation} />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading ticket...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedHeader user={userProfile} onNavigate={handleNavigation} />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-error mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-error font-medium mb-2">
                  {error ? 'Error Loading Ticket' : 'Ticket Not Found'}
                </p>
                <p className="text-muted-foreground text-sm max-w-md mb-4">
                  {error || 'The ticket you are looking for does not exist or has been removed.'}
                </p>
                <div className="space-x-4">
                  <button 
                    onClick={() => navigate('/dashboard')} 
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                  {error && (
                    <button 
                      onClick={() => window.location?.reload()} 
                      className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      Retry
                    </button>
                  )}
                </div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Ticket Header */}
              <TicketHeader 
                ticket={ticket} 
                onUpvote={handleUpvote}
                isUpvoted={ticket?.isUpvoted}
              />
              
              {/* Ticket Description */}
              <TicketDescription ticket={ticket} />
              
              {/* Comments */}
              <CommentThread comments={comments} />
              
              {/* Comment Input */}
              {user && (
                <CommentInput onSubmit={handleAddComment} />
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <TicketSidebar 
                ticket={ticket}
                user={userProfile}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewTicket;