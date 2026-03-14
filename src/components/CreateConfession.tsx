import { useState, useCallback } from 'react';
import { Send, AlertCircle, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ConfessionTag, TAG_LABELS } from '@/types/confession';
import { useCreateConfession, usePostLimit } from '@/hooks/useConfessions';
import { ConfettiCelebration } from './ConfettiCelebration';

export function CreateConfession() {
  const [content, setContent] = useState('');
  const [tag, setTag] = useState<ConfessionTag>('other');
  const [showConfetti, setShowConfetti] = useState(false);
  
  const createConfession = useCreateConfession();
  const { data: postLimit } = usePostLimit();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || content.length < 10) return;

    createConfession.mutate(
      { content: content.trim(), tag },
      {
        onSuccess: () => {
          setContent('');
          setTag('other');
          setShowConfetti(true);
        },
      }
    );
  };

  const remaining = postLimit?.remaining ?? 3;
  const canPost = remaining > 0;
  const handleConfettiComplete = useCallback(() => setShowConfetti(false), []);

  return (
    <>
      <ConfettiCelebration show={showConfetti} onComplete={handleConfettiComplete} />
      <Card className="border-border">
        <CardContent className="p-6">
          <h2 className="font-display text-2xl text-foreground mb-5">Share your confession</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!canPost && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You've reached your daily limit of 3 confessions. Come back tomorrow!
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="confession" className="text-sm font-medium text-muted-foreground">
                What's on your mind?
              </Label>
              <Textarea
                id="confession"
                placeholder="Speak your truth... Your identity is completely anonymous."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[140px] resize-none text-base"
                maxLength={1000}
                disabled={!canPost}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className={content.length > 900 ? 'text-accent' : ''}>
                  {content.length}/1000
                </span>
                <span className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${remaining > 1 ? 'bg-secondary' : remaining === 1 ? 'bg-primary' : 'bg-destructive'}`} />
                  {remaining} posts left today
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag" className="text-sm font-medium text-muted-foreground">Category</Label>
              <Select value={tag} onValueChange={(v) => setTag(v as ConfessionTag)} disabled={!canPost}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(TAG_LABELS) as [ConfessionTag, string][]).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full gap-2 h-11 text-sm font-semibold"
              disabled={!canPost || content.length < 10 || createConfession.isPending}
            >
              <Send className="h-4 w-4" />
              {createConfession.isPending ? 'Posting...' : 'Post Anonymously'}
            </Button>

            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
              <BookOpen className="h-3 w-3" />
              By posting, you agree to our{' '}
              <Link to="/guidelines" className="text-primary hover:underline underline-offset-2">
                Community Guidelines
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
