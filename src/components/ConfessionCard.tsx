import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, ThumbsDown, Flag, Share2, MoreHorizontal, Bookmark, BookmarkCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Confession, TAG_LABELS } from '@/types/confession';
import { useVote, useReport } from '@/hooks/useConfessions';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ReplySection } from './ReplySection';

interface ConfessionCardProps {
  confession: Confession;
  userVote?: 'up' | 'down';
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
}

const TAG_STYLES: Record<string, string> = {
  love: 'bg-accent/10 text-accent border-accent/20',
  regret: 'bg-primary/10 text-primary border-primary/20',
  secret: 'bg-secondary/10 text-secondary border-secondary/20',
  funny: 'bg-secondary/10 text-secondary border-secondary/20',
  work: 'bg-primary/10 text-primary border-primary/20',
  family: 'bg-accent/10 text-accent border-accent/20',
  friendship: 'bg-secondary/10 text-secondary border-secondary/20',
  other: 'bg-muted text-muted-foreground border-border',
};

export function ConfessionCard({ confession, userVote, isBookmarked, onToggleBookmark }: ConfessionCardProps) {
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  
  const vote = useVote();
  const report = useReport();

  const handleVote = (type: 'up' | 'down') => {
    vote.mutate({ confessionId: confession.id, voteType: type });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}?c=${confession.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Anonymous Confession',
          text: confession.content.substring(0, 100) + '...',
          url,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link copied!',
        description: 'Share link has been copied to clipboard.',
      });
    }
  };

  const handleReport = () => {
    if (!reportReason.trim()) return;
    
    report.mutate(
      { confessionId: confession.id, reason: reportReason, confessionContent: confession.content },
      {
        onSuccess: () => {
          setReportDialogOpen(false);
          setReportReason('');
        },
      }
    );
  };

  const score = confession.upvotes - confession.downvotes;

  return (
    <>
      <Card className="border-border hover:border-primary/20 transition-colors duration-200">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <Badge 
              variant="outline" 
              className={cn('text-xs font-medium border', TAG_STYLES[confession.tag])}
            >
              {TAG_LABELS[confession.tag]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(confession.created_at), { addSuffix: true })}
            </span>
          </div>

          <p className="text-foreground leading-relaxed mb-5 whitespace-pre-wrap">
            {confession.content}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('up')}
                className={cn(
                  'gap-1 rounded-full h-8 px-2.5 text-xs',
                  userVote === 'up' 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-primary'
                )}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>{confession.upvotes}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('down')}
                className={cn(
                  'gap-1 rounded-full h-8 px-2.5 text-xs',
                  userVote === 'down' 
                    ? 'text-destructive bg-destructive/10' 
                    : 'text-muted-foreground hover:text-destructive'
                )}
              >
                <ThumbsDown className="h-3.5 w-3.5" />
                <span>{confession.downvotes}</span>
              </Button>

              <span className={cn(
                'text-xs font-semibold px-2 py-0.5 rounded-full ml-1',
                score > 0 && 'text-primary',
                score < 0 && 'text-destructive',
                score === 0 && 'text-muted-foreground'
              )}>
                {score > 0 ? '+' : ''}{score}
              </span>
            </div>

            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleBookmark?.(confession.id)}
                className={cn(
                  'rounded-full h-8 w-8 p-0',
                  isBookmarked
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                )}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
              >
                {isBookmarked ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="rounded-full h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <Share2 className="h-3.5 w-3.5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0 text-muted-foreground">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => setReportDialogOpen(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <ReplySection confessionId={confession.id} />
        </CardContent>
      </Card>

      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Report Confession</DialogTitle>
            <DialogDescription>
              Help us keep the community safe. Please describe why this confession violates our guidelines.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            placeholder="Describe the issue..."
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="min-h-[100px]"
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReport}
              disabled={!reportReason.trim() || report.isPending}
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
