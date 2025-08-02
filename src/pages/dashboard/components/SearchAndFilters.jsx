import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SearchAndFilters = ({ 
  searchQuery, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortChange,
  onClearFilters
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'in progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'technical', label: 'Technical' },
    { value: 'billing', label: 'Billing' },
    { value: 'general', label: 'General' },
    { value: 'bug report', label: 'Bug Report' },
    { value: 'feature request', label: 'Feature Request' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'commented', label: 'Most Commented' },
    { value: 'upvoted', label: 'Most Upvoted' },
    { value: 'oldest', label: 'Oldest First' }
  ];

  const hasActiveFilters = statusFilter !== 'all' || categoryFilter !== 'all' || searchQuery?.trim() !== '';

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Input
            type="search"
            placeholder="Search tickets by title, description, or ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="pl-10"
          />
          <Icon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <Select
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={onStatusFilterChange}
            className="w-full"
          />

          {/* Category Filter */}
          <Select
            label="Category"
            options={categoryOptions}
            value={categoryFilter}
            onChange={onCategoryFilterChange}
            className="w-full"
          />

          {/* Sort By */}
          <Select
            label="Sort By"
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            className="w-full"
          />

          {/* Clear Filters */}
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
              iconName="X"
              iconPosition="left"
              iconSize={16}
              className="w-full sm:w-auto"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            
            {searchQuery?.trim() && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Search: "{searchQuery?.trim()}"
              </span>
            )}
            
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Status: {statusOptions?.find(opt => opt?.value === statusFilter)?.label}
              </span>
            )}
            
            {categoryFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Category: {categoryOptions?.find(opt => opt?.value === categoryFilter)?.label}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilters;