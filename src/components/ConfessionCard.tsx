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
import { Confession, TAG_LABELS } from '@/types/confession';
import { useVote, useReport } from '@/hooks/useConfessions';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ReplySection } from './ReplySection';

interface ConfessionCardProps {
  confession: Confession;
  userVote?: 'up' | 'down';
}

const TAG_STYLES: Record<string, string> = {
  love: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  regret: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  secret: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  funny: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  work: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  family: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  friendship: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  other: 'bg-muted text-muted-foreground border-border',
};

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
      <Card className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        {/* Subtle glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between gap-4 mb-4">
            <Badge 
              variant="outline" 
              className={cn('text-xs font-semibold border', TAG_STYLES[confession.tag])}
            >
              {TAG_LABELS[confession.tag]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(confession.created_at), { addSuffix: true })}
            </span>
          </div>

          <p className="text-foreground leading-relaxed mb-6 whitespace-pre-wrap text-base">
            {confession.content}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('up')}
                className={cn(
                  'gap-1.5 rounded-full transition-all duration-200',
                  userVote === 'up' 
                    ? 'text-primary bg-primary/20 hover:bg-primary/30' 
                    : 'hover:bg-primary/10 hover:text-primary'
                )}
              >
                <ThumbsUp className="h-4 w-4" />
                <span className="font-medium">{confession.upvotes}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('down')}
                className={cn(
                  'gap-1.5 rounded-full transition-all duration-200',
                  userVote === 'down' 
                    ? 'text-destructive bg-destructive/20 hover:bg-destructive/30' 
                    : 'hover:bg-destructive/10 hover:text-destructive'
                )}
              >
                <ThumbsDown className="h-4 w-4" />
                <span className="font-medium">{confession.downvotes}</span>
              </Button>

              <div className={cn(
                'text-sm font-bold px-3 py-1 rounded-full ml-1',
                score > 0 && 'text-primary bg-primary/10',
                score < 0 && 'text-destructive bg-destructive/10',
                score === 0 && 'text-muted-foreground bg-muted/50'
              )}>
                {score > 0 ? '+' : ''}{score}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="rounded-full hover:bg-secondary/10 hover:text-secondary"
              >
                <Share2 className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border/50">
                  <DropdownMenuItem 
                    onClick={() => setReportDialogOpen(true)}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
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
        <DialogContent className="bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="text-foreground">Report Confession</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Help us keep the community safe. Please describe why this confession violates our guidelines.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            placeholder="Describe the issue..."
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="min-h-[100px] bg-background/50 border-border/50"
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialogOpen(false)} className="border-border/50">
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