import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UseInactivityTimeoutOptions {
  timeoutMs?: number; // Default 15 minutes
  warningMs?: number; // Warning before logout, default 1 minute
}

export function useInactivityTimeout({
  timeoutMs = 15 * 60 * 1000,
  warningMs = 60 * 1000,
}: UseInactivityTimeoutOptions = {}) {
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasWarnedRef = useRef(false);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Session expired',
      description: 'You have been logged out due to inactivity.',
      variant: 'destructive',
    });
    navigate('/admin');
  }, [navigate]);

  const showWarning = useCallback(() => {
    if (!hasWarnedRef.current) {
      hasWarnedRef.current = true;
      toast({
        title: 'Session expiring soon',
        description: 'You will be logged out in 1 minute due to inactivity.',
      });
    }
  }, []);

  const resetTimer = useCallback(() => {
    hasWarnedRef.current = false;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }

    warningRef.current = setTimeout(showWarning, timeoutMs - warningMs);
    timeoutRef.current = setTimeout(handleLogout, timeoutMs);
  }, [timeoutMs, warningMs, handleLogout, showWarning]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => {
      resetTimer();
    };

    // Start the timer
    resetTimer();

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      // Cleanup
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }
    };
  }, [resetTimer]);

  return { resetTimer };
}
