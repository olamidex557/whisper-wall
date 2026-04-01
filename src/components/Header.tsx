import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { Moon, Sun, Download } from 'lucide-react';
import { useTheme } from 'next-themes';
import { NotificationBell } from './NotificationBell';
import { Button } from '@/components/ui/button';
import logoImage from '@/assets/logo.png';

export function Header() {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { theme, setTheme } = useTheme();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
    }

    if (newCount >= 5) {
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
          <img src={logoImage} alt="Whisper Wall logo" className="h-9 w-9 rounded-xl group-hover:scale-105 transition-transform duration-300" />
          <span className="font-bold text-xl gradient-text">Whisper Wall</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="rounded-full h-9 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Link to="/install">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">Install</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <NotificationBell />
        </div>
      </div>
    </header>
  );
}
