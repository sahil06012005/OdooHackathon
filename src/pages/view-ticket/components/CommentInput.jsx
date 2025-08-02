import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const CommentInput = ({ onAddComment, currentUser }) => {
  const [comment, setComment] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!comment?.trim()) return;

    setIsSubmitting(true);

    const newComment = {
      id: Date.now(),
      author: currentUser?.name,
      avatar: currentUser?.avatar,
      content: comment,
      timestamp: new Date(),
      parentId: null,
      isAgent: currentUser?.role === 'agent' || currentUser?.role === 'admin',
      attachments: attachments
    };

    try {
      if (onAddComment) {
        await onAddComment(newComment);
      }
      
      setComment('');
      setAttachments([]);
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e?.target?.files);
    const newAttachments = files?.map(file => ({
      id: Date.now() + Math.random(),
      name: file?.name,
      size: file?.size,
      type: file?.type?.startsWith('image/') ? 'image' : 'file',
      url: URL.createObjectURL(file),
      file: file
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (attachmentId) => {
    setAttachments(prev => prev?.filter(att => att?.id !== attachmentId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="sticky bottom-0 bg-background border-t border-border p-4 shadow-elevation-3">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
              <Image
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">
                {currentUser?.name}
              </span>
              {currentUser?.role === 'agent' || currentUser?.role === 'admin' ? (
                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground">
                  Agent
                </span>
              ) : null}
            </div>
          </div>

          {/* Comment Input */}
          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e?.target?.value)}
              placeholder="Add a comment..."
              className="w-full p-4 pr-12 text-sm border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-card"
              rows={4}
              disabled={isSubmitting}
            />
            
            {/* Character Count */}
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              {comment?.length}/1000
            </div>
          </div>

          {/* Attachments Preview */}
          {attachments?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Attachments:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {attachments?.map((attachment) => (
                  <div
                    key={attachment?.id}
                    className="flex items-center p-2 bg-muted rounded-lg border border-border"
                  >
                    {/* File Preview */}
                    <div className="flex-shrink-0 mr-3">
                      {attachment?.type === 'image' ? (
                        <div className="w-8 h-8 rounded overflow-hidden">
                          <Image
                            src={attachment?.url}
                            alt={attachment?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                          <Icon name="File" size={16} className="text-primary" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {attachment?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(attachment?.size)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      iconName="X"
                      iconSize={14}
                      onClick={() => removeAttachment(attachment?.id)}
                      className="flex-shrink-0 ml-2 w-6 h-6"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* File Upload */}
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  iconName="Paperclip"
                  iconPosition="left"
                  iconSize={16}
                  disabled={isSubmitting}
                  asChild
                >
                  <span>Attach</span>
                </Button>
              </label>

              {/* Formatting Help */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                iconName="HelpCircle"
                iconSize={16}
                disabled={isSubmitting}
                className="text-muted-foreground"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="default"
              size="sm"
              iconName="Send"
              iconPosition="right"
              iconSize={16}
              disabled={!comment?.trim() || isSubmitting}
              loading={isSubmitting}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentInput;