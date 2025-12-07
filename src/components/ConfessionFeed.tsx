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
import { ConfessionTag, TAG_LABELS, TAG_COLORS } from '@/types/confession';
import { useConfessions, useUserVotes } from '@/hooks/useConfessions';
import { cn } from '@/lib/utils';

type SortType = 'trending' | 'newest';

export function ConfessionFeed() {
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState<ConfessionTag | null>(null);

  const { data: confessions, isLoading, error } = useConfessions(sortBy, searchQuery, tagFilter);
  const { data: userVotes } = useUserVotes();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Query is already reactive
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search confessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </form>

        <div className="flex gap-2">
          <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as SortType)}>
            <TabsList>
              <TabsTrigger value="trending" className="gap-1.5">
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="newest" className="gap-1.5">
                <Clock className="h-4 w-4" />
                Newest
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1.5">
                <Filter className="h-4 w-4" />
                {tagFilter ? TAG_LABELS[tagFilter] : 'All Tags'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setTagFilter(null)}>
                All Tags
              </DropdownMenuItem>
              {(Object.entries(TAG_LABELS) as [ConfessionTag, string][]).map(([value, label]) => (
                <DropdownMenuItem key={value} onClick={() => setTagFilter(value)}>
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
          <span className="text-sm text-muted-foreground">Filters:</span>
          {searchQuery && (
            <Badge 
              variant="secondary" 
              className="cursor-pointer"
              onClick={() => setSearchQuery('')}
            >
              "{searchQuery}" ×
            </Badge>
          )}
          {tagFilter && (
            <Badge 
              variant="outline"
              className={cn('cursor-pointer', TAG_COLORS[tagFilter])}
              onClick={() => setTagFilter(null)}
            >
              {TAG_LABELS[tagFilter]} ×
            </Badge>
          )}
        </div>
      )}

      {/* Confessions List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-destructive">
          Failed to load confessions. Please try again.
        </div>
      ) : confessions && confessions.length > 0 ? (
        <div className="space-y-4">
          {confessions.map((confession) => (
            <ConfessionCard
              key={confession.id}
              confession={confession}
              userVote={userVotes?.[confession.id]}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">No confessions yet</p>
          <p className="text-sm">Be the first to share your anonymous confession!</p>
        </div>
      )}
    </div>
  );
}
