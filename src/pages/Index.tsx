import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CreateConfession } from '@/components/CreateConfession';
import { ConfessionFeed } from '@/components/ConfessionFeed';
import { TopWhisper } from '@/components/TopWhisper';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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

          {/* Confession Feed - Single column */}
          <ConfessionFeed />
        </main>

        <footer className="border-t border-border/30 py-8 relative z-10">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
              Your privacy matters. We don't collect personal data.
            </p>
            <div className="mt-4 flex items-center justify-center gap-4">
              <Link to="/privacy" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
              <span className="text-border">•</span>
              <Link to="/terms" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
                Terms of Service
              </Link>
              <span className="text-border">•</span>
              <Link to="/guidelines" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
                Community Guidelines
              </Link>
            </div>
            <p className="mt-4 opacity-70">
              © {new Date().getFullYear()} Confess. A safe space for anonymous expression.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;