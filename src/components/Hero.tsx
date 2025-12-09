import { Ghost, Lock, EyeOff, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/20 blur-2xl animate-pulse" />
      <div className="absolute bottom-10 right-20 w-32 h-32 rounded-full bg-accent/20 blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-secondary/20 blur-2xl animate-pulse delay-500" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 mb-8 glow-primary">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">100% Anonymous & Safe</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Share Your{' '}
            <span className="gradient-text">Secrets</span>
            <br />
            <span className="text-foreground">Stay </span>
            <span className="text-accent">Anonymous</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            A bold space to confess your deepest thoughts without judgment. 
            No accounts, no tracking — just raw, honest expression.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 text-sm">
              <Ghost className="h-4 w-4 text-primary" />
              <span className="text-foreground font-medium">No accounts</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 text-sm">
              <Lock className="h-4 w-4 text-secondary" />
              <span className="text-foreground font-medium">Encrypted</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 text-sm">
              <EyeOff className="h-4 w-4 text-accent" />
              <span className="text-foreground font-medium">Zero tracking</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}