import { Ghost, Lock, EyeOff } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-6">
            Anonymous · Encrypted · Private
          </p>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display leading-[1.1] mb-6 text-foreground">
            Share your truth,
            <br />
            <em className="text-primary">stay invisible</em>
          </h1>

          <p className="text-lg text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed font-body">
            A quiet corner of the internet where you can whisper what you can't say out loud.
            No accounts. No tracking. Just honesty.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Ghost className="h-4 w-4 text-primary" />
              <span>No accounts</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-secondary" />
              <span>Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <EyeOff className="h-4 w-4 text-accent" />
              <span>Zero tracking</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
