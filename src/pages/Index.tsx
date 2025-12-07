import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CreateConfession } from '@/components/CreateConfession';
import { ConfessionFeed } from '@/components/ConfessionFeed';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      <main className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create Confession - Sidebar on large screens */}
          <aside className="lg:order-2">
            <div className="lg:sticky lg:top-24">
              <CreateConfession />
            </div>
          </aside>

          {/* Confession Feed - Main content */}
          <section className="lg:col-span-2 lg:order-1">
            <ConfessionFeed />
          </section>
        </div>
      </main>

      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            🔒 Your privacy matters. We don't collect personal data or track identity.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Confess. A safe space for anonymous expression.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
