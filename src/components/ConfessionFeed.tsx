import { useState } from 'react';
import { Search, TrendingUp, Clock, Filter, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ConfessionCard } from './ConfessionCard';
import { ConfessionFeedSkeleton } from './ConfessionCardSkeleton';
import { ConfessionTag, TAG_LABELS } from '@/types/confession';
import { useConfessions, useUserVotes } from '@/hooks/useConfessions';
import { cn } from '@/lib/utils';

type SortType = 'trending' | 'newest';

const TAG_FILTER_STYLES: Record<string, string> = {
  love: 'bg-pink-500/20 text-pink-400 border-pink-500/30 hover:bg-pink-500/30',
  regret: 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30',
  secret: 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30',
  funny: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30',
  work: 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
  family: 'bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30',
  friendship: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30',
  other: 'bg-muted/50 text-muted-foreground border-border hover:bg-muted/70',
};

export function ConfessionFeed() {
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState<ConfessionTag | null>(null);

  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useConfessions(sortBy, searchQuery, tagFilter);
  const { data: userVotes } = useUserVotes();

  const confessions = data?.pages.flat() ?? [];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search confessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 bg-card/50 border-border/50 focus:border-primary/50 rounded-xl"
          />
        </form>

        <div className="flex flex-wrap gap-3 items-center justify-between">
          <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as SortType)}>
            <TabsList className="bg-card/50 border border-border/50 p-1">
              <TabsTrigger 
                value="trending" 
                className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-lg"
              >
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger 
                value="newest" 
                className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-lg"
              >
                <Clock className="h-4 w-4" />
                Newest
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  'gap-2 border-border/50 bg-card/50 hover:bg-card',
                  tagFilter && TAG_FILTER_STYLES[tagFilter]
                )}
              >
                <Filter className="h-4 w-4" />
                {tagFilter ? TAG_LABELS[tagFilter] : 'All Tags'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card border-border/50">
              <DropdownMenuItem onClick={() => setTagFilter(null)} className="focus:bg-primary/10">
                All Tags
              </DropdownMenuItem>
              {(Object.entries(TAG_LABELS) as [ConfessionTag, string][]).map(([value, label]) => (
                <DropdownMenuItem 
                  key={value} 
                  onClick={() => setTagFilter(value)}
                  className="focus:bg-primary/10"
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters */}
      {(searchQuery || tagFilter) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <Badge 
              variant="secondary" 
              className="cursor-pointer bg-secondary/20 text-secondary hover:bg-secondary/30 border border-secondary/30"
              onClick={() => setSearchQuery('')}
            >
              "{searchQuery}" ×
            </Badge>
          )}
          {tagFilter && (
            <Badge 
              variant="outline"
              className={cn('cursor-pointer border', TAG_FILTER_STYLES[tagFilter])}
              onClick={() => setTagFilter(null)}
            >
              {TAG_LABELS[tagFilter]} ×
            </Badge>
          )}
        </div>
      )}

      {/* Confessions List */}
      {isLoading ? (
        <ConfessionFeedSkeleton count={4} />
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-destructive font-medium">Failed to load confessions.</p>
          <p className="text-muted-foreground text-sm mt-1">Please try again later.</p>
        </div>
      ) : confessions.length > 0 ? (
        <div className="space-y-4">
          {confessions.map((confession) => (
            <ConfessionCard
              key={confession.id}
              confession={confession}
              userVote={userVotes?.[confession.id]}
            />
          ))}
          
          {hasNextPage && (
            <div className="flex justify-center pt-6">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="gap-2 px-8 h-12 rounded-xl bg-card/50 border-border/50 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Confessions'
                )}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🤫</span>
          </div>
          <p className="text-lg font-medium text-foreground mb-2">No confessions yet</p>
          <p className="text-sm text-muted-foreground">Be the first to share your anonymous confession!</p>
        </div>
      )}
    </div>
  );
}