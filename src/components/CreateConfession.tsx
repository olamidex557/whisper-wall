import { useState } from 'react';
import { Send, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
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

export function CreateConfession() {
  const [content, setContent] = useState('');
  const [tag, setTag] = useState<ConfessionTag>('other');
  
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
        },
      }
    );
  };

  const remaining = postLimit?.remaining ?? 3;
  const canPost = remaining > 0;

  return (
    <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 gradient-border">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <CardContent className="p-6 relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Share Your Confession</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!canPost && (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You've reached your daily limit of 3 confessions. Come back tomorrow!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="confession" className="text-foreground font-medium">
              What's on your mind?
            </Label>
            <Textarea
              id="confession"
              placeholder="Speak your truth... Your identity is completely anonymous."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[140px] resize-none bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 placeholder:text-muted-foreground/70"
              maxLength={1000}
              disabled={!canPost}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className={content.length > 900 ? 'text-accent' : ''}>
                {content.length}/1000
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${remaining > 1 ? 'bg-primary' : remaining === 1 ? 'bg-accent' : 'bg-destructive'}`} />
                {remaining} posts left today
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag" className="text-foreground font-medium">Category</Label>
            <Select value={tag} onValueChange={(v) => setTag(v as ConfessionTag)} disabled={!canPost}>
              <SelectTrigger className="bg-background/50 border-border/50">
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
            className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold h-12 text-base glow-primary"
            disabled={!canPost || content.length < 10 || createConfession.isPending}
          >
            <Send className="h-4 w-4" />
            {createConfession.isPending ? 'Posting...' : 'Post Anonymously'}
          </Button>

          <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-2">
            <BookOpen className="h-3 w-3 text-muted-foreground/70" />
            By posting, you agree to our{' '}
            <Link to="/guidelines" className="text-primary hover:underline underline-offset-2">
              Community Guidelines
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}