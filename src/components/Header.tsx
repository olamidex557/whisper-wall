import { Link } from 'react-router-dom';
import { Shield, Ghost } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Ghost className="h-6 w-6 text-primary" />
          </div>
          <span className="font-bold text-xl text-foreground">Confess</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
