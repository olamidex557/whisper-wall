import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ConfessionCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/30">
      <CardContent className="p-6">
        {/* Header: Tag and time */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Content lines */}
        <div className="space-y-2 mb-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-6 w-10 rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ConfessionFeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ConfessionCardSkeleton key={i} />
      ))}
    </div>
  );
}
