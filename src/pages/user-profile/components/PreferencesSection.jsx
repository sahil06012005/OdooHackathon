import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const PreferencesSection = ({ user, onSave, isSaving }) => {
  const [preferences, setPreferences] = useState({
    language: user?.preferences?.language || 'en',
    theme: user?.preferences?.theme || 'light',
    timezone: user?.preferences?.timezone || 'America/New_York',
    dateFormat: user?.preferences?.dateFormat || 'MM/DD/YYYY',
    timeFormat: user?.preferences?.timeFormat || '12h',
    emailNotifications: {
      ticketUpdates: user?.preferences?.emailNotifications?.ticketUpdates ?? true,
      newAssignments: user?.preferences?.emailNotifications?.newAssignments ?? true,
      systemAlerts: user?.preferences?.emailNotifications?.systemAlerts ?? true,
      weeklyDigest: user?.preferences?.emailNotifications?.weeklyDigest ?? false,
      marketingEmails: user?.preferences?.emailNotifications?.marketingEmails ?? false
    },
    dashboardSettings: {
      defaultView: user?.preferences?.dashboardSettings?.defaultView || 'cards',
      ticketsPerPage: user?.preferences?.dashboardSettings?.ticketsPerPage || 10,
      autoRefresh: user?.preferences?.dashboardSettings?.autoRefresh ?? true,
      showClosedTickets: user?.preferences?.dashboardSettings?.showClosedTickets ?? false
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Português' },
    { value: 'zh', label: '中文' },
    { value: 'ja', label: '日本語' }
  ];

  const themeOptions = [
    { value: 'light', label: 'Light Mode' },
    { value: 'dark', label: 'Dark Mode' },
    { value: 'auto', label: 'System Default' }
  ];

  const timezoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' }
  ];

  const dateFormatOptions = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (UK)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
    { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY (DE)' }
  ];

  const timeFormatOptions = [
    { value: '12h', label: '12-hour (AM/PM)' },
    { value: '24h', label: '24-hour' }
  ];

  const viewOptions = [
    { value: 'cards', label: 'Card View' },
    { value: 'list', label: 'List View' },
    { value: 'table', label: 'Table View' }
  ];

  const ticketsPerPageOptions = [
    { value: 5, label: '5 per page' },
    { value: 10, label: '10 per page' },
    { value: 20, label: '20 per page' },
    { value: 50, label: '50 per page' }
  ];

  const handlePreferenceChange = (section, field, value) => {
    setPreferences(prev => ({
      ...prev,
      [section]: typeof prev?.[section] === 'object' && prev?.[section] !== null
        ? { ...prev?.[section], [field]: value }
        : value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(preferences);
    setHasChanges(false);
  };

  const handleReset = () => {
    setPreferences({
      language: user?.preferences?.language || 'en',
      theme: user?.preferences?.theme || 'light',
      timezone: user?.preferences?.timezone || 'America/New_York',
      dateFormat: user?.preferences?.dateFormat || 'MM/DD/YYYY',
      timeFormat: user?.preferences?.timeFormat || '12h',
      emailNotifications: {
        ticketUpdates: user?.preferences?.emailNotifications?.ticketUpdates ?? true,
        newAssignments: user?.preferences?.emailNotifications?.newAssignments ?? true,
        systemAlerts: user?.preferences?.emailNotifications?.systemAlerts ?? true,
        weeklyDigest: user?.preferences?.emailNotifications?.weeklyDigest ?? false,
        marketingEmails: user?.preferences?.emailNotifications?.marketingEmails ?? false
      },
      dashboardSettings: {
        defaultView: user?.preferences?.dashboardSettings?.defaultView || 'cards',
        ticketsPerPage: user?.preferences?.dashboardSettings?.ticketsPerPage || 10,
        autoRefresh: user?.preferences?.dashboardSettings?.autoRefresh ?? true,
        showClosedTickets: user?.preferences?.dashboardSettings?.showClosedTickets ?? false
      }
    });
    setHasChanges(false);
  };

  return (
    <div className="bg-card rounded-xl shadow-elevation-2 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Settings" size={20} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Preferences</h2>
        </div>
        
        {hasChanges && (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={isSaving}
            >
              Reset
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Save"
              iconPosition="left"
              onClick={handleSave}
              loading={isSaving}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
      <div className="space-y-8">
        {/* Localization Settings */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Globe" size={18} className="text-primary" />
            <span>Localization</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Language"
              options={languageOptions}
              value={preferences?.language}
              onChange={(value) => handlePreferenceChange('language', null, value)}
            />
            
            <Select
              label="Timezone"
              options={timezoneOptions}
              value={preferences?.timezone}
              onChange={(value) => handlePreferenceChange('timezone', null, value)}
              searchable
            />
            
            <Select
              label="Date Format"
              options={dateFormatOptions}
              value={preferences?.dateFormat}
              onChange={(value) => handlePreferenceChange('dateFormat', null, value)}
            />
            
            <Select
              label="Time Format"
              options={timeFormatOptions}
              value={preferences?.timeFormat}
              onChange={(value) => handlePreferenceChange('timeFormat', null, value)}
            />
          </div>
        </div>

        {/* Appearance Settings */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Palette" size={18} className="text-primary" />
            <span>Appearance</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Theme"
              options={themeOptions}
              value={preferences?.theme}
              onChange={(value) => handlePreferenceChange('theme', null, value)}
            />
          </div>
        </div>

        {/* Email Notifications */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Mail" size={18} className="text-primary" />
            <span>Email Notifications</span>
          </h3>
          
          <div className="space-y-3">
            <Checkbox
              label="Ticket Updates"
              description="Receive emails when tickets are updated or commented on"
              checked={preferences?.emailNotifications?.ticketUpdates}
              onChange={(e) => handlePreferenceChange('emailNotifications', 'ticketUpdates', e?.target?.checked)}
            />
            
            <Checkbox
              label="New Assignments"
              description="Get notified when new tickets are assigned to you"
              checked={preferences?.emailNotifications?.newAssignments}
              onChange={(e) => handlePreferenceChange('emailNotifications', 'newAssignments', e?.target?.checked)}
            />
            
            <Checkbox
              label="System Alerts"
              description="Important system notifications and maintenance updates"
              checked={preferences?.emailNotifications?.systemAlerts}
              onChange={(e) => handlePreferenceChange('emailNotifications', 'systemAlerts', e?.target?.checked)}
            />
            
            <Checkbox
              label="Weekly Digest"
              description="Summary of your ticket activity and team updates"
              checked={preferences?.emailNotifications?.weeklyDigest}
              onChange={(e) => handlePreferenceChange('emailNotifications', 'weeklyDigest', e?.target?.checked)}
            />
            
            <Checkbox
              label="Marketing Emails"
              description="Product updates, tips, and promotional content"
              checked={preferences?.emailNotifications?.marketingEmails}
              onChange={(e) => handlePreferenceChange('emailNotifications', 'marketingEmails', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Dashboard Settings */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4 flex items-center space-x-2">
            <Icon name="LayoutDashboard" size={18} className="text-primary" />
            <span>Dashboard Settings</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Select
              label="Default View"
              options={viewOptions}
              value={preferences?.dashboardSettings?.defaultView}
              onChange={(value) => handlePreferenceChange('dashboardSettings', 'defaultView', value)}
            />
            
            <Select
              label="Tickets Per Page"
              options={ticketsPerPageOptions}
              value={preferences?.dashboardSettings?.ticketsPerPage}
              onChange={(value) => handlePreferenceChange('dashboardSettings', 'ticketsPerPage', value)}
            />
          </div>
          
          <div className="space-y-3">
            <Checkbox
              label="Auto Refresh"
              description="Automatically refresh dashboard data every 30 seconds"
              checked={preferences?.dashboardSettings?.autoRefresh}
              onChange={(e) => handlePreferenceChange('dashboardSettings', 'autoRefresh', e?.target?.checked)}
            />
            
            <Checkbox
              label="Show Closed Tickets"
              description="Include resolved and closed tickets in dashboard view"
              checked={preferences?.dashboardSettings?.showClosedTickets}
              onChange={(e) => handlePreferenceChange('dashboardSettings', 'showClosedTickets', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesSection;