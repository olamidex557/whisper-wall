import { Crown, ThumbsUp, MessageCircle, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTopWhisper } from '@/hooks/useTopWhisper';
import { TAG_LABELS, TAG_COLORS } from '@/types/confession';
import { formatDistanceToNow } from 'date-fns';

export function TopWhisper() {
  const { data: topWhisper, isLoading } = useTopWhisper();

  if (isLoading) {
    return (
      <Card className="border-primary/30 bg-card/80 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-20 w-full mb-3" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    );
  }

  if (!topWhisper) return null;

  return (
    <Card className="relative border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 backdrop-blur-sm overflow-hidden group">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-50 group-hover:opacity-80 transition-opacity" />
      
      <CardContent className="relative p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
            <Crown className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-bold text-foreground text-lg">Top Whisper of the Week</h3>
          <Flame className="h-4 w-4 text-accent animate-pulse" />
        </div>

        {/* Tag */}
        <Badge variant="outline" className={`mb-3 text-xs ${TAG_COLORS[topWhisper.tag]}`}>
          {TAG_LABELS[topWhisper.tag]}
        </Badge>

        {/* Content */}
        <p className="text-foreground/90 text-base leading-relaxed mb-4 line-clamp-4">
          "{topWhisper.content}"
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ThumbsUp className="h-3.5 w-3.5 text-primary" />
            {topWhisper.upvotes}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="h-3.5 w-3.5 text-secondary" />
            {topWhisper.replyCount}
          </span>
          <span className="ml-auto text-xs">
            {formatDistanceToNow(new Date(topWhisper.created_at), { addSuffix: true })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
