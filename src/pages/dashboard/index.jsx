import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../services/ticketService';
import AuthenticatedHeader from '../../components/ui/AuthenticatedHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import DashboardStats from './components/DashboardStats';
import SearchAndFilters from './components/SearchAndFilters';
import TicketGrid from './components/TicketGrid';
import PaginationControls from './components/PaginationControls';
import FloatingCreateButton from './components/FloatingCreateButton';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const itemsPerPage = 9;

  // Load tickets and stats
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (authLoading) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Load tickets with current filters
        const ticketsData = await ticketService?.getTickets({
          search: searchQuery,
          status: statusFilter,
          category: categoryFilter,
          sortBy: sortBy,
          offset: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage * 10 // Load more for filtering
        });
        
        // Load stats
        const statsData = await ticketService?.getTicketStats();
        
        if (isMounted) {
          setTickets(ticketsData || []);
          setStats(statsData || {});
        }
      } catch (error) {
        if (isMounted) {
          if (error?.message?.includes('Failed to fetch') || 
              error?.message?.includes('NetworkError')) {
            setError('Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.');
          } else {
            setError('Failed to load tickets. Please try again.');
          }
          console.error('Error loading dashboard data:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [searchQuery, statusFilter, categoryFilter, sortBy, currentPage, authLoading]);

  // Filter and sort tickets in memory for better UX
  const filteredAndSortedTickets = useMemo(() => {
    let filtered = tickets?.filter(ticket => {
      const matchesSearch = searchQuery === '' || 
        ticket?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        ticket?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        ticket?.ticket_number?.toLowerCase()?.includes(searchQuery?.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        ticket?.status?.toLowerCase() === statusFilter?.toLowerCase();
      
      const matchesCategory = categoryFilter === 'all' || 
        ticket?.category?.toLowerCase() === categoryFilter?.toLowerCase();
      
      return matchesSearch && matchesStatus && matchesCategory;
    });

    return filtered || [];
  }, [tickets, searchQuery, statusFilter, categoryFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTickets?.length / itemsPerPage);
  const paginatedTickets = filteredAndSortedTickets?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter, sortBy]);

  const handleUpvote = async (ticketId) => {
    try {
      await ticketService?.toggleUpvote(ticketId);
      
      // Refresh tickets to get updated upvote counts
      const updatedTickets = await ticketService?.getTickets({
        search: searchQuery,
        status: statusFilter,
        category: categoryFilter,
        sortBy: sortBy,
        offset: 0,
        limit: itemsPerPage * 10
      });
      
      setTickets(updatedTickets || []);
    } catch (error) {
      if (error?.message?.includes('Not authenticated')) {
        setError('Please sign in to upvote tickets.');
      } else {
        setError('Failed to update upvote. Please try again.');
      }
      console.error('Error upvoting ticket:', error);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setSortBy('recent');
    setCurrentPage(1);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedHeader user={userProfile} onNavigate={handleNavigation} />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
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
                <p className="text-error font-medium mb-2">Error Loading Dashboard</p>
                <p className="text-muted-foreground text-sm max-w-md">{error}</p>
                <button 
                  onClick={() => window.location?.reload()} 
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Retry
                </button>
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
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage and track all your support tickets in one place
            </p>
          </div>

          {/* Dashboard Stats */}
          <DashboardStats stats={stats} />

          {/* Create Button (Desktop) */}
          <FloatingCreateButton />

          {/* Search and Filters */}
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearFilters={handleClearFilters}
          />

          {/* Results Summary */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredAndSortedTickets?.length === tickets?.length 
                ? `Showing all ${filteredAndSortedTickets?.length} tickets`
                : `Showing ${filteredAndSortedTickets?.length} of ${tickets?.length} tickets`
              }
            </p>
          </div>

          {/* Ticket Grid */}
          <TicketGrid
            tickets={paginatedTickets}
            onUpvote={handleUpvote}
            loading={false}
          />

          {/* Pagination */}
          {filteredAndSortedTickets?.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredAndSortedTickets?.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </main>
      {/* Floating Create Button (Mobile) */}
      <FloatingCreateButton />
    </div>
  );
};

export default Dashboard;