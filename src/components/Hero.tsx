import { Ghost, Lock, Eye, EyeOff } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Lock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">100% Anonymous</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
            Share Your Secrets,{' '}
            <span className="text-primary">Stay Anonymous</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A safe space to confess your deepest thoughts, secrets, and feelings. 
            No accounts, no tracking, just honest anonymous expression.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Ghost className="h-5 w-5 text-primary" />
              <span>No accounts required</span>
            </div>
            <div className="flex items-center gap-2">
              <EyeOff className="h-5 w-5 text-primary" />
              <span>No personal data collected</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <span>Community moderated</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
