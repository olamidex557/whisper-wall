import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { NotificationBell } from './NotificationBell';
import logoImage from '@/assets/logo.png';

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
          <img src={logoImage} alt="Confess logo" className="h-9 w-9 rounded-xl group-hover:scale-105 transition-transform duration-300" />
          <span className="font-bold text-xl gradient-text">Confess</span>
        </Link>

        <NotificationBell />
      </div>
    </header>
  );
}
