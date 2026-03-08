import { useState } from 'react';
import { Bell, BellOff, BellRing, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationPrimer } from '@/components/NotificationPrimer';
import { TAG_LABELS } from '@/types/confession';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const PRIMER_DISMISSED_KEY = 'confess_notification_primer_dismissed';

export function NotificationBell() {
  const [showPrimer, setShowPrimer] = useState(false);
  const {
    newConfessionsCount,
    recentConfessions,
    markAsSeen,
    pushEnabled,
    pushSupported,
    enablePushNotifications,
    disablePushNotifications,
  } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {newConfessionsCount > 0 ? (
            <BellRing className="h-5 w-5 text-primary animate-pulse" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {newConfessionsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
              <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {newConfessionsCount > 99 ? '99+' : newConfessionsCount}
              </span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Notifications</h4>
            {newConfessionsCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs h-7"
                onClick={markAsSeen}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </Button>
            )}
          </div>

          {recentConfessions.length > 0 ? (
            <ScrollArea className="max-h-60">
              <div className="space-y-2">
                {recentConfessions.map((confession) => (
                  <div
                    key={confession.id}
                    className="rounded-md border border-border bg-muted/50 p-2.5 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {TAG_LABELS[confession.tag]}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatDistanceToNow(new Date(confession.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground line-clamp-2">
                      {confession.content}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground py-2">No new confessions</p>
          )}

          {pushSupported && (
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Push notifications</p>
                  <p className="text-xs text-muted-foreground">Get notified when away</p>
                </div>
                <Button
                  variant={pushEnabled ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => {
                    if (pushEnabled) {
                      disablePushNotifications();
                    } else {
                      const dismissed = localStorage.getItem(PRIMER_DISMISSED_KEY);
                      if (Notification.permission === 'granted' || dismissed === 'true') {
                        enablePushNotifications();
                      } else {
                        setShowPrimer(true);
                      }
                    }
                  }}
                  className={cn(
                    'gap-2',
                    pushEnabled && 'border-destructive text-destructive hover:bg-destructive/10'
                  )}
                >
                  {pushEnabled ? (
                    <>
                      <BellOff className="h-3.5 w-3.5" />
                      Disable
                    </>
                  ) : (
                    <>
                      <BellRing className="h-3.5 w-3.5" />
                      Enable
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>

      <NotificationPrimer
        open={showPrimer}
        onAccept={async () => {
          setShowPrimer(false);
          localStorage.setItem(PRIMER_DISMISSED_KEY, 'true');
          await enablePushNotifications();
        }}
        onDismiss={() => {
          setShowPrimer(false);
          localStorage.setItem(PRIMER_DISMISSED_KEY, 'true');
        }}
      />
    </Popover>
  );
}
