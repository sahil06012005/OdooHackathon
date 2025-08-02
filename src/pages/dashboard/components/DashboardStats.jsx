import React from 'react';
import Icon from '../../../components/AppIcon';

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Tickets',
      value: stats?.total,
      icon: 'FileText',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Open Tickets',
      value: stats?.open,
      icon: 'AlertCircle',
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'In Progress',
      value: stats?.inProgress,
      icon: 'Clock',
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Resolved',
      value: stats?.resolved,
      icon: 'CheckCircle',
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards?.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-1 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat?.title}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat?.value}</p>
            </div>
            <div className={`w-12 h-12 ${stat?.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={stat?.icon} size={24} className={stat?.textColor} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;