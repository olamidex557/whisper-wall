import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, ThumbsDown, Flag, Share2, MoreHorizontal } from 'lucide-react';
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
import { Confession, TAG_LABELS, TAG_COLORS } from '@/types/confession';
import { useVote, useReport } from '@/hooks/useConfessions';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ConfessionCardProps {
  confession: Confession;
  userVote?: 'up' | 'down';
}

export function ConfessionCard({ confession, userVote }: ConfessionCardProps) {
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
      <Card className="group transition-all duration-300 hover:shadow-lg hover:border-primary/30 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <Badge 
              variant="outline" 
              className={cn('text-xs font-medium', TAG_COLORS[confession.tag])}
            >
              {TAG_LABELS[confession.tag]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(confession.created_at), { addSuffix: true })}
            </span>
          </div>

          <p className="text-foreground leading-relaxed mb-6 whitespace-pre-wrap">
            {confession.content}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('up')}
                className={cn(
                  'gap-1.5 transition-colors',
                  userVote === 'up' && 'text-primary bg-primary/10'
                )}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{confession.upvotes}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('down')}
                className={cn(
                  'gap-1.5 transition-colors',
                  userVote === 'down' && 'text-destructive bg-destructive/10'
                )}
              >
                <ThumbsDown className="h-4 w-4" />
                <span>{confession.downvotes}</span>
              </Button>

              <span className={cn(
                'text-sm font-medium px-2',
                score > 0 && 'text-primary',
                score < 0 && 'text-destructive',
                score === 0 && 'text-muted-foreground'
              )}>
                {score > 0 ? '+' : ''}{score}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="gap-1.5"
              >
                <Share2 className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
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
        </CardContent>
      </Card>

      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Confession</DialogTitle>
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
