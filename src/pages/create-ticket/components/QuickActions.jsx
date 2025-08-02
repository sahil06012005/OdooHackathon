import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickActions = ({ onTemplateSelect, onClearForm, hasContent }) => {
  const templates = [
    {
      id: 'bug-report',
      title: 'Bug Report',
      icon: 'Bug',
      description: 'Report a software bug or error',
      category: 'bug',
      priority: 'medium',
      content: {
        title: 'Bug Report: [Brief description]',
        description: `**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**


**Actual Behavior:**


**Environment:**
- Browser: 
- Operating System: 
- Device: 

**Additional Information:**
`
      }
    },
    {
      id: 'feature-request',
      title: 'Feature Request',
      icon: 'Lightbulb',
      description: 'Suggest a new feature or improvement',
      category: 'feature',
      priority: 'low',
      content: {
        title: 'Feature Request: [Feature name]',
        description: `**Feature Description:**


**Use Case:**


**Benefits:**


**Additional Context:**
`
      }
    },
    {
      id: 'account-issue',
      title: 'Account Issue',
      icon: 'UserX',
      description: 'Problems with login or account access',
      category: 'account',
      priority: 'high',
      content: {
        title: 'Account Access Issue',
        description: `**Issue Type:**
[ ] Cannot log in
[ ] Password reset not working
[ ] Account locked
[ ] Other: 

**Account Details:**
- Email: 
- Last successful login: 

**Error Messages:**


**Steps Taken:**
`
      }
    }
  ];

  return (
    <div className="bg-card rounded-lg shadow-elevation-1 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={16} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">Use templates or manage your form</p>
          </div>
        </div>
        
        {hasContent && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearForm}
            iconName="RotateCcw"
            iconPosition="left"
            iconSize={14}
          >
            Clear Form
          </Button>
        )}
      </div>
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Use Template</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {templates?.map((template) => (
            <button
              key={template?.id}
              onClick={() => onTemplateSelect(template)}
              className="p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left group"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Icon 
                    name={template?.icon} 
                    size={16} 
                    color="var(--color-muted-foreground)"
                    className="group-hover:text-primary"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {template?.title}
                  </h5>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {template?.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Tips Section */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={14} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Pro Tips:</p>
            <ul className="space-y-0.5">
              <li>• Use templates to save time and ensure you include all necessary details</li>
              <li>• Clear, descriptive titles help our team prioritize your request</li>
              <li>• Include screenshots or files when relevant to your issue</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;