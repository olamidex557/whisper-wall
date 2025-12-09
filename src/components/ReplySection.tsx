import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useReplies, useCreateReply } from '@/hooks/useReplies';
import { cn } from '@/lib/utils';

interface ReplySectionProps {
  confessionId: string;
}

export function ReplySection({ confessionId }: ReplySectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  const { data: replies, isLoading } = useReplies(confessionId);
  const createReply = useCreateReply();

  const handleSubmitReply = () => {
    if (!replyContent.trim()) return;
    
    createReply.mutate(
      { confessionId, content: replyContent },
      {
        onSuccess: () => {
          setReplyContent('');
          setShowReplyForm(false);
          setIsExpanded(true);
        },
      }
    );
  };

  const replyCount = replies?.length ?? 0;

  return (
    <div className="border-t border-border/30 pt-4 mt-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary/10 rounded-full"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="font-medium">{replyCount} {replyCount === 1 ? 'Reply' : 'Replies'}</span>
          {replyCount > 0 && (
            isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setShowReplyForm(!showReplyForm);
            if (!showReplyForm) setIsExpanded(true);
          }}
          className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
        >
          Reply
        </Button>
      </div>

      {showReplyForm && (
        <div className="mt-4 space-y-3">
          <Textarea
            placeholder="Write an anonymous reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="min-h-[80px] resize-none bg-background/50 border-border/50 focus:border-primary/50"
            maxLength={500}
          />
          <div className="flex items-center justify-between">
            <span className={cn(
              "text-xs",
              replyContent.length > 450 ? "text-accent" : "text-muted-foreground"
            )}>
              {replyContent.length}/500
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyContent('');
                }}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitReply}
                disabled={!replyContent.trim() || createReply.isPending}
                className="gap-2 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <Send className="h-3 w-3" />
                Send
              </Button>
            </div>
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="mt-4 space-y-3">
          {isLoading ? (
            <div className="text-sm text-muted-foreground py-4 text-center">Loading replies...</div>
          ) : replies && replies.length > 0 ? (
            replies.map((reply) => (
              <div
                key={reply.id}
                className={cn(
                  "pl-4 border-l-2 border-primary/40",
                  "bg-primary/5 rounded-r-xl p-4"
                )}
              >
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {reply.content}
                </p>
                <span className="text-xs text-muted-foreground mt-2 block">
                  {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                </span>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground py-4 text-center">
              No replies yet. Be the first to reply!
            </div>
          )}
        </div>
      )}
    </div>
  );
}