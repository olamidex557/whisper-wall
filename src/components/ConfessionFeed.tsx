import { useState, useEffect } from 'react';
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

interface ConfessionFeedProps {
  bookmarkedIds?: string[];
  showBookmarkedOnly?: boolean;
  onToggleBookmark?: (id: string) => void;
  isBookmarked?: (id: string) => boolean;
}

export function ConfessionFeed({ bookmarkedIds, showBookmarkedOnly, onToggleBookmark, isBookmarked }: ConfessionFeedProps) {
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState<ConfessionTag | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useConfessions(sortBy, searchQuery, tagFilter);
  const { data: userVotes } = useUserVotes();

  const allConfessions = data?.pages.flat() ?? [];
  const confessions = showBookmarkedOnly && bookmarkedIds
    ? allConfessions.filter((c) => bookmarkedIds.includes(c.id))
    : allConfessions;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search confessions..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 h-10"
          />
        </form>

        <div className="flex flex-wrap gap-2 items-center justify-between">
          <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as SortType)}>
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger 
                value="trending" 
                className="gap-1.5 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                Trending
              </TabsTrigger>
              <TabsTrigger 
                value="newest" 
                className="gap-1.5 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
              >
                <Clock className="h-3.5 w-3.5" />
                Newest
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-1.5 text-xs h-9"
              >
                <Filter className="h-3.5 w-3.5" />
                {tagFilter ? TAG_LABELS[tagFilter] : 'All Tags'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => setTagFilter(null)}>
                All Tags
              </DropdownMenuItem>
              {(Object.entries(TAG_LABELS) as [ConfessionTag, string][]).map(([value, label]) => (
                <DropdownMenuItem 
                  key={value} 
                  onClick={() => setTagFilter(value)}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {(searchInput || tagFilter) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Filters:</span>
          {searchInput && (
            <Badge 
              variant="secondary" 
              className="cursor-pointer text-xs"
              onClick={() => { setSearchInput(''); setSearchQuery(''); }}
            >
              "{searchInput}" ×
            </Badge>
          )}
          {tagFilter && (
            <Badge 
              variant="outline"
              className="cursor-pointer text-xs"
              onClick={() => setTagFilter(null)}
            >
              {TAG_LABELS[tagFilter]} ×
            </Badge>
          )}
        </div>
      )}

      {isLoading ? (
        <ConfessionFeedSkeleton count={4} />
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-destructive text-sm font-medium">Failed to load confessions.</p>
          <p className="text-muted-foreground text-xs mt-1">Please try again later.</p>
        </div>
      ) : confessions.length > 0 ? (
        <div className="space-y-3">
          {confessions.map((confession) => (
            <ConfessionCard
              key={confession.id}
              confession={confession}
              userVote={userVotes?.[confession.id]}
              isBookmarked={isBookmarked?.(confession.id)}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
          
          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="gap-2 text-sm h-10"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 space-y-4">
          <p className="text-4xl">{showBookmarkedOnly ? '🔖' : '🤫'}</p>
          <div>
            <h3 className="font-display text-xl text-foreground mb-1">
              {showBookmarkedOnly ? 'No saved confessions yet' : 'The wall is empty...'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              {showBookmarkedOnly 
                ? 'Tap the bookmark icon on any confession to save it here.'
                : 'Be the first to share what\'s on your mind. Your identity stays completely anonymous.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
