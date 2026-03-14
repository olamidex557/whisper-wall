import { Bell, MessageSquare, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface NotificationPrimerProps {
  open: boolean;
  onAccept: () => void;
  onDismiss: () => void;
}

export function NotificationPrimer({ open, onAccept, onDismiss }: NotificationPrimerProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Bell className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center font-display text-xl">Stay in the loop</DialogTitle>
          <DialogDescription className="text-center">
            Get notified when new whispers are posted so you never miss a confession.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <div className="flex items-start gap-3 rounded-md border border-border bg-muted/30 p-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">
              Instant alerts when fresh confessions drop
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-md border border-border bg-muted/30 p-3">
            <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">
              Quick previews — read without opening the app
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={onAccept} className="w-full gap-2">
            <Bell className="h-4 w-4" />
            Enable notifications
          </Button>
          <Button variant="ghost" onClick={onDismiss} className="w-full text-muted-foreground">
            Not now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
