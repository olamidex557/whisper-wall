import { Bell, BellOff, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const {
    newConfessionsCount,
    markAsSeen,
    pushEnabled,
    pushSupported,
    enablePushNotifications,
    disablePushNotifications,
  } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={markAsSeen}
        >
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
      <PopoverContent className="w-72" align="end">
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="font-semibold">Notifications</h4>
            <p className="text-sm text-muted-foreground">
              {newConfessionsCount > 0
                ? `${newConfessionsCount} new confession${newConfessionsCount > 1 ? 's' : ''} since your last visit`
                : 'No new confessions'}
            </p>
          </div>

          {pushSupported && (
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Push notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Get notified when away
                  </p>
                </div>
                <Button
                  variant={pushEnabled ? 'outline' : 'default'}
                  size="sm"
                  onClick={pushEnabled ? disablePushNotifications : enablePushNotifications}
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
    </Popover>
  );
}
