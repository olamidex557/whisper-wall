import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Confession } from '@/types/confession';

export function useTopWhisper() {
  return useQuery({
    queryKey: ['top-whisper-of-week'],
    queryFn: async () => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // Get confessions from the last 7 days
      const { data: confessions, error } = await supabase
        .from('confessions_public')
        .select('*')
        .eq('is_approved', true)
        .gte('created_at', oneWeekAgo.toISOString())
        .order('upvotes', { ascending: false })
        .limit(20);

      if (error) throw error;
      if (!confessions || confessions.length === 0) return null;

      // Get reply counts for these confessions
      const ids = confessions.map(c => c.id);
      const { data: replies } = await supabase
        .from('replies_public')
        .select('confession_id')
        .in('confession_id', ids);

      const replyCounts: Record<string, number> = {};
      replies?.forEach(r => {
        replyCounts[r.confession_id] = (replyCounts[r.confession_id] || 0) + 1;
      });

      // Score: upvotes * 2 + replies * 3 - downvotes (emotional tags get a bonus)
      const emotionalTags = ['love', 'regret', 'secret', 'family'];
      const scored = confessions.map(c => {
        const replyCount = replyCounts[c.id] || 0;
        const emotionalBonus = emotionalTags.includes(c.tag) ? 5 : 0;
        const score = (c.upvotes * 2) + (replyCount * 3) - c.downvotes + emotionalBonus;
        return { ...c, score, replyCount };
      });

      scored.sort((a, b) => b.score - a.score);
      return scored[0] as Confession & { score: number; replyCount: number };
    },
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
}
