import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const LAST_SEEN_KEY = 'confess_last_seen_timestamp';
const PUSH_ENABLED_KEY = 'confess_push_notifications_enabled';

export function useNotifications() {
  const [newConfessionsCount, setNewConfessionsCount] = useState(0);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);

  // Check push notification support
  useEffect(() => {
    setPushSupported('Notification' in window && 'serviceWorker' in navigator);
    const enabled = localStorage.getItem(PUSH_ENABLED_KEY) === 'true';
    setPushEnabled(enabled && Notification.permission === 'granted');
  }, []);

  // Get last seen timestamp
  const getLastSeen = useCallback(() => {
    const stored = localStorage.getItem(LAST_SEEN_KEY);
    return stored ? new Date(stored) : new Date();
  }, []);

  // Update last seen timestamp
  const markAsSeen = useCallback(() => {
    localStorage.setItem(LAST_SEEN_KEY, new Date().toISOString());
    setNewConfessionsCount(0);
  }, []);

  // Fetch count of new confessions since last visit
  const fetchNewCount = useCallback(async () => {
    const lastSeen = getLastSeen();
    
    const { count, error } = await supabase
      .from('confessions')
      .select('*', { count: 'exact', head: true })
      .eq('is_approved', true)
      .gt('created_at', lastSeen.toISOString());

    if (!error && count !== null) {
      setNewConfessionsCount(count);
    }
  }, [getLastSeen]);

  // Enable push notifications
  const enablePushNotifications = useCallback(async () => {
    if (!pushSupported) {
      toast({
        title: 'Not supported',
        description: 'Push notifications are not supported in your browser.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        localStorage.setItem(PUSH_ENABLED_KEY, 'true');
        setPushEnabled(true);
        toast({
          title: 'Notifications enabled',
          description: "You'll receive notifications for new confessions.",
        });
        return true;
      } else {
        toast({
          title: 'Permission denied',
          description: 'Please enable notifications in your browser settings.',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Error enabling push notifications:', error);
      return false;
    }
  }, [pushSupported]);

  // Disable push notifications
  const disablePushNotifications = useCallback(() => {
    localStorage.setItem(PUSH_ENABLED_KEY, 'false');
    setPushEnabled(false);
    toast({
      title: 'Notifications disabled',
      description: "You won't receive notifications anymore.",
    });
  }, []);

  // Show browser notification
  const showBrowserNotification = useCallback((title: string, body: string) => {
    if (pushEnabled && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.png',
        badge: '/favicon.png',
      });
    }
  }, [pushEnabled]);

  // Listen for new confessions in real-time
  useEffect(() => {
    fetchNewCount();

    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'confessions',
          filter: 'is_approved=eq.true',
        },
        (payload) => {
          // Increment count
          setNewConfessionsCount(prev => prev + 1);

          // Show in-app toast
          const content = payload.new.content as string;
          const preview = content.length > 50 ? content.substring(0, 50) + '...' : content;
          
          toast({
            title: 'New confession posted!',
            description: preview,
          });

          // Show browser notification if enabled
          showBrowserNotification('New Confession', preview);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchNewCount, showBrowserNotification]);

  return {
    newConfessionsCount,
    markAsSeen,
    pushEnabled,
    pushSupported,
    enablePushNotifications,
    disablePushNotifications,
  };
}
