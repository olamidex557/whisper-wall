import { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <span className="text-2xl">🤫</span>
          Share Your Confession
        </CardTitle>
      </CardHeader>
      <CardContent>
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
            <Label htmlFor="confession">Your anonymous confession</Label>
            <Textarea
              id="confession"
              placeholder="What's on your mind? Your identity is completely anonymous..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={1000}
              disabled={!canPost}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{content.length}/1000 characters</span>
              <span>{remaining} posts remaining today</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag">Category</Label>
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
            className="w-full gap-2"
            disabled={!canPost || content.length < 10 || createConfession.isPending}
          >
            <Send className="h-4 w-4" />
            {createConfession.isPending ? 'Posting...' : 'Post Anonymously'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            🔒 We don't collect any personal data. Your confession is truly anonymous.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
