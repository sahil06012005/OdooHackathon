import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CommentThread = ({ comments, onAddComment, currentUser }) => {
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleReply = (commentId) => {
    if (replyText?.trim()) {
      const newComment = {
        id: Date.now(),
        author: currentUser?.name,
        avatar: currentUser?.avatar,
        content: replyText,
        timestamp: new Date(),
        parentId: commentId,
        isAgent: currentUser?.role === 'agent' || currentUser?.role === 'admin'
      };
      
      if (onAddComment) {
        onAddComment(newComment);
      }
      
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - commentTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    
    return commentTime?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: commentTime?.getFullYear() !== now?.getFullYear() ? 'numeric' : undefined
    });
  };

  const getReplies = (parentId) => {
    return comments?.filter(comment => comment?.parentId === parentId);
  };

  const getTopLevelComments = () => {
    return comments?.filter(comment => !comment?.parentId);
  };

  const CommentItem = ({ comment, isReply = false }) => (
    <div className={`${isReply ? 'ml-8 mt-3' : 'mb-6'}`}>
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
            <Image
              src={comment?.avatar}
              alt={comment?.author}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-muted rounded-lg p-3">
            {/* Author and Timestamp */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-foreground">
                  {comment?.author}
                </span>
                {comment?.isAgent && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground">
                    Agent
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(comment?.timestamp)}
              </span>
            </div>

            {/* Comment Text */}
            <div className="text-sm text-foreground whitespace-pre-wrap">
              {comment?.content}
            </div>
          </div>

          {/* Reply Button */}
          {!isReply && (
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                iconName="Reply"
                iconPosition="left"
                iconSize={14}
                onClick={() => setReplyingTo(comment?.id)}
                className="text-xs"
              >
                Reply
              </Button>
            </div>
          )}

          {/* Reply Input */}
          {replyingTo === comment?.id && (
            <div className="mt-3 space-y-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e?.target?.value)}
                placeholder="Write a reply..."
                className="w-full p-3 text-sm border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                rows={3}
              />
              <div className="flex items-center space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleReply(comment?.id)}
                  disabled={!replyText?.trim()}
                >
                  Reply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Nested Replies */}
          {getReplies(comment?.id)?.map(reply => (
            <CommentItem key={reply?.id} comment={reply} isReply={true} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-elevation-1">
      <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center">
        <Icon name="MessageSquare" size={20} className="mr-2" />
        Comments ({comments?.length})
      </h2>
      {/* Comments List */}
      <div className="space-y-4">
        {getTopLevelComments()?.length > 0 ? (
          getTopLevelComments()?.map(comment => (
            <CommentItem key={comment?.id} comment={comment} />
          ))
        ) : (
          <div className="text-center py-8">
            <Icon name="MessageSquare" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentThread;