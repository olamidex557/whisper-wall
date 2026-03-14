import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CreateConfession } from '@/components/CreateConfession';
import { ConfessionFeed } from '@/components/ConfessionFeed';
import { TopWhisper } from '@/components/TopWhisper';
import { NotificationPrimer } from '@/components/NotificationPrimer';
import { Link } from 'react-router-dom';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useNotifications } from '@/hooks/useNotifications';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bookmark, MessageSquare } from 'lucide-react';

const AUTO_PRIMER_KEY = 'confess_auto_primer_shown';

const Index = () => {
  const { bookmarkedIds, toggle, isBookmarked } = useBookmarks();
  const [feedView, setFeedView] = useState<'all' | 'saved'>('all');
  const [showAutoPrimer, setShowAutoPrimer] = useState(false);
  const { enablePushNotifications, pushSupported, pushEnabled } = useNotifications();

  useEffect(() => {
    const alreadyShown = localStorage.getItem(AUTO_PRIMER_KEY) === 'true';
    const permissionGranted = 'Notification' in window && Notification.permission === 'granted';
    if (alreadyShown || permissionGranted || !pushSupported) return;

    const timer = setTimeout(() => setShowAutoPrimer(true), 30000);
    return () => clearTimeout(timer);
  }, [pushSupported]);

  return (
    <div className="min-h-screen bg-background" role="document">
      <div className="relative">
        <Header />
        <Hero />
        
        <main className="container mx-auto px-4 pb-20 max-w-xl">
          <div className="mb-10">
            <TopWhisper />
          </div>

          <div className="mb-10">
            <CreateConfession />
          </div>

          <div className="mb-6">
            <Tabs value={feedView} onValueChange={(v) => setFeedView(v as 'all' | 'saved')}>
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger value="all" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md text-sm">
                  <MessageSquare className="h-3.5 w-3.5" />
                  All
                </TabsTrigger>
                <TabsTrigger value="saved" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md text-sm">
                  <Bookmark className="h-3.5 w-3.5" />
                  Saved ({bookmarkedIds.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <ConfessionFeed
            bookmarkedIds={bookmarkedIds}
            showBookmarkedOnly={feedView === 'saved'}
            onToggleBookmark={toggle}
            isBookmarked={isBookmarked}
          />
        </main>

        <footer className="border-t border-border py-10">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>Your privacy matters. We don't collect personal data.</p>
            <nav aria-label="Footer navigation" className="mt-4 flex items-center justify-center gap-4 text-xs">
              <Link to="/privacy" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
              <span className="text-border">·</span>
              <Link to="/terms" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
                Terms of Service
              </Link>
              <span className="text-border">·</span>
              <Link to="/guidelines" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
                Community Guidelines
              </Link>
            </nav>
            <p className="mt-4 text-xs text-muted-foreground/60">
              © {new Date().getFullYear()} Whisper Wall
            </p>
          </div>
        </footer>
      </div>

      <NotificationPrimer
        open={showAutoPrimer}
        onAccept={async () => {
          setShowAutoPrimer(false);
          localStorage.setItem(AUTO_PRIMER_KEY, 'true');
          await enablePushNotifications();
        }}
        onDismiss={() => {
          setShowAutoPrimer(false);
          localStorage.setItem(AUTO_PRIMER_KEY, 'true');
        }}
      />
    </div>
  );
};

export default Index;
