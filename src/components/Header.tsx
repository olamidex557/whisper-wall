import { Link, useNavigate } from 'react-router-dom';
import { Ghost } from 'lucide-react';
import { useState, useRef } from 'react';
import { NotificationBell } from './NotificationBell';

export function Header() {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
    }

    if (newCount >= 3) {
      setClickCount(0);
      navigate('/admin');
      return;
    }

    clickTimer.current = setTimeout(() => {
      setClickCount(0);
    }, 1000);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3 group">
          <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
            <Ghost className="h-6 w-6 text-primary" />
            <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-bold text-xl gradient-text">Confess</span>
        </Link>

        <NotificationBell />
      </div>
    </header>
  );
}
