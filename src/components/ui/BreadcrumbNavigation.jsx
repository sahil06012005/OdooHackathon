import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BreadcrumbNavigation = ({ customBreadcrumbs = null }) => {
  const location = useLocation();

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location.pathname?.split('/')?.filter(segment => segment);
    const breadcrumbs = [{ label: 'Dashboard', path: '/dashboard', icon: 'Home' }];

    pathSegments?.forEach((segment, index) => {
      const path = '/' + pathSegments?.slice(0, index + 1)?.join('/');
      
      switch (segment) {
        case 'dashboard':
          // Already added as home
          break;
        case 'create-ticket':
          breadcrumbs?.push({ label: 'Create Ticket', path, icon: 'Plus' });
          break;
        case 'view-ticket':
          breadcrumbs?.push({ label: 'View Ticket', path, icon: 'Eye' });
          break;
        case 'user-profile':
          breadcrumbs?.push({ label: 'Profile', path, icon: 'User' });
          break;
        default:
          // Handle dynamic segments like ticket IDs
          if (pathSegments?.[index - 1] === 'view-ticket' || pathSegments?.[index - 1] === 'ticket') {
            breadcrumbs?.push({ label: `Ticket #${segment}`, path, icon: 'FileText' });
          } else {
            breadcrumbs?.push({ 
              label: segment?.charAt(0)?.toUpperCase() + segment?.slice(1)?.replace('-', ' '), 
              path, 
              icon: 'ChevronRight' 
            });
          }
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on dashboard or login
  if (location.pathname === '/dashboard' || location.pathname === '/login' || breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((crumb, index) => (
          <li key={crumb?.path} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="mx-2 text-muted-foreground/60" 
              />
            )}
            
            {index === breadcrumbs?.length - 1 ? (
              // Current page - not clickable
              (<div className="flex items-center space-x-1.5 text-foreground font-medium">
                <Icon name={crumb?.icon} size={14} />
                <span>{crumb?.label}</span>
              </div>)
            ) : (
              // Clickable breadcrumb
              (<Link
                to={crumb?.path}
                className="flex items-center space-x-1.5 hover:text-foreground transition-colors duration-200 rounded px-1 py-0.5 hover:bg-muted/50"
              >
                <Icon name={crumb?.icon} size={14} />
                <span>{crumb?.label}</span>
              </Link>)
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbNavigation;