import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CreateConfession } from '@/components/CreateConfession';
import { ConfessionFeed } from '@/components/ConfessionFeed';
import { TopWhisper } from '@/components/TopWhisper';
import { Link } from 'react-router-dom';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bookmark, MessageSquare } from 'lucide-react';

const Index = () => {
  const { bookmarkedIds, toggle, isBookmarked } = useBookmarks();
  const [feedView, setFeedView] = useState<'all' | 'saved'>('all');

  return (
    <div className="min-h-screen bg-background" role="document">
      {/* Animated background gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />
        <Hero />
        
        <main className="container mx-auto px-4 pb-16 max-w-2xl">
          {/* Top Whisper of the Week */}
          <div className="mb-8">
            <TopWhisper />
          </div>

          {/* Create Confession - Full width on top */}
          <div className="mb-8">
            <CreateConfession />
          </div>

          {/* Feed View Toggle */}
          <div className="mb-6">
            <Tabs value={feedView} onValueChange={(v) => setFeedView(v as 'all' | 'saved')}>
              <TabsList className="bg-card/50 border border-border/50 p-1">
                <TabsTrigger value="all" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-lg">
                  <MessageSquare className="h-4 w-4" />
                  All
                </TabsTrigger>
                <TabsTrigger value="saved" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-lg">
                  <Bookmark className="h-4 w-4" />
                  Saved ({bookmarkedIds.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Confession Feed */}
          <ConfessionFeed
            bookmarkedIds={bookmarkedIds}
            showBookmarkedOnly={feedView === 'saved'}
            onToggleBookmark={toggle}
            isBookmarked={isBookmarked}
          />
        </main>

        <footer className="border-t border-border/30 py-8 relative z-10">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
              Your privacy matters. We don't collect personal data.
            </p>
            <nav aria-label="Footer navigation" className="mt-4 flex items-center justify-center gap-4">
              <Link to="/privacy" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
              <span className="text-border" aria-hidden="true">•</span>
              <Link to="/terms" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
                Terms of Service
              </Link>
              <span className="text-border" aria-hidden="true">•</span>
              <Link to="/guidelines" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
                Community Guidelines
              </Link>
            </nav>
            <p className="mt-4 opacity-70">
              © {new Date().getFullYear()} Whisper Wall. A safe space for anonymous expression.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;