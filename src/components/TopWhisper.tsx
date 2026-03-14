import { Crown, ThumbsUp, MessageCircle } from 'lucide-react';
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
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <Skeleton className="h-5 w-48 mb-4" />
          <Skeleton className="h-16 w-full mb-3" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    );
  }

  if (!topWhisper) return null;

  return (
    <Card className="border-primary/20 bg-primary/[0.03]">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="h-4 w-4 text-primary" />
          <h3 className="font-display text-lg text-foreground">Top Whisper of the Week</h3>
        </div>

        <Badge variant="outline" className={`mb-3 text-xs ${TAG_COLORS[topWhisper.tag]}`}>
          {TAG_LABELS[topWhisper.tag]}
        </Badge>

        <p className="text-foreground/90 leading-relaxed mb-4 line-clamp-4 italic">
          "{topWhisper.content}"
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <ThumbsUp className="h-3 w-3 text-primary" />
            {topWhisper.upvotes}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3 text-secondary" />
            {topWhisper.replyCount}
          </span>
          <span className="ml-auto">
            {formatDistanceToNow(new Date(topWhisper.created_at), { addSuffix: true })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
