import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TicketForm = ({ onSubmit, onSaveDraft, isSubmitting, isDraftSaving }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium'
  });

  const [errors, setErrors] = useState({});
  const [characterCount, setCharacterCount] = useState(0);

  const categoryOptions = [
    { value: 'technical', label: 'Technical Support' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'account', label: 'Account Management' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'general', label: 'General Inquiry' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'description') {
      setCharacterCount(value?.length);
    }

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.title?.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData?.title?.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData?.description?.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData?.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleSaveDraft = () => {
    if (formData?.title?.trim() || formData?.description?.trim()) {
      onSaveDraft(formData);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Plus" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Create New Ticket</h2>
          <p className="text-sm text-muted-foreground">Describe your issue and we'll help you resolve it</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <Input
          label="Ticket Title"
          type="text"
          placeholder="Brief description of your issue"
          value={formData?.title}
          onChange={(e) => handleInputChange('title', e?.target?.value)}
          error={errors?.title}
          required
          description="Provide a clear, concise title for your support request"
        />

        {/* Description Textarea */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Description <span className="text-error">*</span>
          </label>
          <div className="relative">
            <textarea
              placeholder="Provide detailed information about your issue, including steps to reproduce, error messages, and any relevant context..."
              value={formData?.description}
              onChange={(e) => handleInputChange('description', e?.target?.value)}
              rows={6}
              className={`w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors ${
                errors?.description 
                  ? 'border-error focus:ring-error' :'border-border focus:border-ring'
              }`}
            />
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              {characterCount}/1000
            </div>
          </div>
          {errors?.description && (
            <p className="text-sm text-error flex items-center space-x-1">
              <Icon name="AlertCircle" size={14} />
              <span>{errors?.description}</span>
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Minimum 20 characters. Be as detailed as possible to help us assist you better.
          </p>
        </div>

        {/* Category and Priority Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Category"
            placeholder="Select a category"
            options={categoryOptions}
            value={formData?.category}
            onChange={(value) => handleInputChange('category', value)}
            error={errors?.category}
            required
            searchable
            description="Choose the category that best describes your issue"
          />

          <Select
            label="Priority Level"
            placeholder="Select priority"
            options={priorityOptions}
            value={formData?.priority}
            onChange={(value) => handleInputChange('priority', value)}
            description="How urgent is this issue?"
          />
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Button
            type="submit"
            variant="default"
            loading={isSubmitting}
            iconName="Send"
            iconPosition="right"
            className="sm:order-2"
            fullWidth
          >
            {isSubmitting ? 'Creating Ticket...' : 'Submit Ticket'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            loading={isDraftSaving}
            iconName="Save"
            iconPosition="left"
            className="sm:order-1"
            fullWidth
          >
            {isDraftSaving ? 'Saving...' : 'Save Draft'}
          </Button>
        </div>

        {/* Help Text */}
        <div className="bg-muted/50 rounded-lg p-4 mt-6">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Tips for better support:</p>
              <ul className="space-y-1 text-xs">
                <li>• Include error messages or screenshots if applicable</li>
                <li>• Describe what you were trying to do when the issue occurred</li>
                <li>• Mention your browser, device, or software version if relevant</li>
                <li>• List any troubleshooting steps you've already tried</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;