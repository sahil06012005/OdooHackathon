import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const FileUploadZone = ({ onFileUpload, attachments = [], onRemoveAttachment, error }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/jpg',
    'application/pdf', 'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    const validFiles = files?.filter(file => {
      if (!allowedTypes?.includes(file?.type)) {
        alert(`File type ${file?.type} is not supported`);
        return false;
      }
      
      if (file?.size > maxFileSize) {
        alert(`File ${file?.name} is too large. Maximum size is 10MB`);
        return false;
      }
      
      return true;
    });

    if (validFiles?.length === 0) return;

    setUploading(true);
    
    try {
      await onFileUpload?.(validFiles);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      // Clear the input
      if (fileInputRef?.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image/')) return 'Image';
    if (fileType?.includes('pdf')) return 'FileText';
    if (fileType?.includes('word')) return 'FileText';
    return 'File';
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200
          ${isDragOver 
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes?.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-4">
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
              <p className="text-sm text-muted-foreground">Uploading files...</p>
            </div>
          ) : (
            <>
              <Icon name="Upload" size={48} className="mx-auto text-muted-foreground" />
              
              <div>
                <p className="text-lg font-medium text-foreground mb-2">
                  Drop files here or click to upload
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports: Images, PDF, Word documents, Text files (Max 10MB each)
                </p>
              </div>
              
              <button
                type="button"
                onClick={() => fileInputRef?.current?.click()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
              >
                Choose Files
              </button>
            </>
          )}
        </div>
      </div>
      {/* Error Message */}
      {error && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <span className="text-error text-sm font-medium">{error}</span>
          </div>
        </div>
      )}
      {/* Attached Files */}
      {attachments?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">
            Attached Files ({attachments?.length})
          </h4>
          
          <div className="space-y-2">
            {attachments?.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={getFileIcon(file?.type)} 
                    size={20} 
                    className="text-muted-foreground" 
                  />
                  
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {file?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file?.size)}
                    </p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => onRemoveAttachment?.(index)}
                  className="p-1 hover:bg-error/10 rounded transition-colors duration-200"
                  title="Remove file"
                >
                  <Icon name="X" size={16} className="text-error" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;