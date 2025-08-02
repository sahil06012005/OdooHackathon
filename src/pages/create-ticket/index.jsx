import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../services/ticketService';
import { storageService } from '../../services/storageService';
import AuthenticatedHeader from '../../components/ui/AuthenticatedHeader';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import TicketForm from './components/TicketForm';
import QuickActions from './components/QuickActions';
import DraftSavedIndicator from './components/DraftSavedIndicator';
import SuccessToast from './components/SuccessToast';

const CreateTicketPage = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general'
  });
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData?.title || formData?.description) {
        localStorage.setItem('quickdesk_draft', JSON.stringify(formData));
        setIsDraftSaved(true);
        setTimeout(() => setIsDraftSaved(false), 2000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData]);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('quickdesk_draft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = async (files) => {
    try {
      const uploadPromises = files?.map(async (file) => {
        const uploadResult = await storageService?.uploadFile(file, 'tickets');
        return {
          name: file?.name,
          size: file?.size,
          type: file?.type,
          path: uploadResult?.path,
          url: uploadResult?.publicUrl
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setAttachments(prev => [...prev, ...uploadedFiles]);
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        attachments: 'Failed to upload files. Please try again.' 
      }));
      console.error('Error uploading files:', error);
    }
  };

  const handleRemoveAttachment = async (index) => {
    const attachment = attachments?.[index];
    
    try {
      if (attachment?.path) {
        await storageService?.deleteFile(attachment?.path);
      }
      
      setAttachments(prev => prev?.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error removing attachment:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.title?.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData?.title?.length < 10) {
      newErrors.title = 'Title must be at least 10 characters long';
    }
    
    if (!formData?.description?.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData?.description?.length < 20) {
      newErrors.description = 'Description must be at least 20 characters long';
    }
    
    if (!formData?.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !validateForm()) {
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const ticketData = {
        title: formData?.title,
        description: formData?.description,
        category: formData?.category,
        user_id: user?.id,
        status: isDraft ? 'draft' : 'open'
      };

      const newTicket = await ticketService?.createTicket(ticketData);
      
      // Clear draft from localStorage
      localStorage.removeItem('quickdesk_draft');
      
      if (isDraft) {
        setShowSuccess({ message: 'Ticket saved as draft successfully!' });
      } else {
        setShowSuccess({ 
          message: 'Ticket created successfully!',
          ticketNumber: newTicket?.ticket_number 
        });
        
        // Navigate to the new ticket after a delay
        setTimeout(() => {
          navigate(`/view-ticket?id=${newTicket?.id}`);
        }, 2000);
      }
    } catch (error) {
      if (error?.message?.includes('Not authenticated')) {
        navigate('/login');
      } else {
        setErrors({ 
          general: 'Failed to create ticket. Please try again.' 
        });
      }
      console.error('Error creating ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAction = (template) => {
    setFormData({
      title: template?.title,
      description: template?.description,
      category: template?.category
    });
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader user={userProfile} onNavigate={handleNavigation} />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create New Ticket</h1>
            <p className="text-muted-foreground">
              Describe your issue or request in detail to get the best support
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <TicketForm
                formData={formData}
                errors={errors}
                isSubmitting={isSubmitting}
                attachments={attachments}
                onInputChange={handleInputChange}
                onFileUpload={handleFileUpload}
                onRemoveAttachment={handleRemoveAttachment}
                onSubmit={handleSubmit}
              />
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <QuickActions onSelectTemplate={handleQuickAction} />
            </div>
          </div>

          {/* Draft Saved Indicator */}
          {isDraftSaved && <DraftSavedIndicator />}
          
          {/* Success Toast */}
          {showSuccess && (
            <SuccessToast 
              message={showSuccess?.message}
              ticketNumber={showSuccess?.ticketNumber}
              onClose={() => setShowSuccess(false)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateTicketPage;