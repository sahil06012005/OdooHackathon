import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TicketDescription = ({ ticket }) => {
  const formatDescription = (text) => {
    return text?.split('\n')?.map((line, index) => (
      <p key={index} className="mb-2 last:mb-0">
        {line}
      </p>
    ));
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.')?.pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'FileText';
      case 'jpg': case'jpeg': case'png': case'gif':
        return 'Image';
      case 'doc': case'docx':
        return 'FileText';
      case 'xls': case'xlsx':
        return 'FileSpreadsheet';
      case 'zip': case'rar':
        return 'Archive';
      default:
        return 'File';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-elevation-1">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon name="FileText" size={20} className="mr-2" />
        Description
      </h2>
      <div className="prose prose-sm max-w-none text-foreground mb-6">
        {formatDescription(ticket?.description)}
      </div>
      {/* Attachments */}
      {ticket?.attachments && ticket?.attachments?.length > 0 && (
        <div className="border-t border-border pt-6">
          <h3 className="text-md font-medium text-foreground mb-4 flex items-center">
            <Icon name="Paperclip" size={18} className="mr-2" />
            Attachments ({ticket?.attachments?.length})
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ticket?.attachments?.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-muted rounded-lg border border-border hover:bg-muted/80 transition-colors duration-200 cursor-pointer group"
              >
                {/* File Preview/Icon */}
                <div className="flex-shrink-0 mr-3">
                  {attachment?.type === 'image' ? (
                    <div className="w-10 h-10 rounded overflow-hidden">
                      <Image
                        src={attachment?.thumbnail || attachment?.url}
                        alt={attachment?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                      <Icon 
                        name={getFileIcon(attachment?.name)} 
                        size={20} 
                        className="text-primary" 
                      />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors duration-200">
                    {attachment?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(attachment?.size)}
                  </p>
                </div>

                {/* Download Icon */}
                <div className="flex-shrink-0 ml-2">
                  <Icon 
                    name="Download" 
                    size={16} 
                    className="text-muted-foreground group-hover:text-primary transition-colors duration-200" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDescription;