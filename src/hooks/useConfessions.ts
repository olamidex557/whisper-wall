import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Confession, ConfessionTag, Vote } from '@/types/confession';
import { useFingerprint } from './useFingerprint';
import { toast } from '@/hooks/use-toast';
import { containsProfanity, isSpam, filterProfanity } from '@/lib/profanity';

type SortType = 'trending' | 'newest';

export function useConfessions(sortBy: SortType = 'newest', searchQuery: string = '', tagFilter: ConfessionTag | null = null) {
  const { fingerprint } = useFingerprint();

  return useQuery({
    queryKey: ['confessions', sortBy, searchQuery, tagFilter],
    queryFn: async () => {
      let query = supabase
        .from('confessions')
        .select('*')
        .eq('is_approved', true);

      if (searchQuery) {
        query = query.ilike('content', `%${searchQuery}%`);
      }

      if (tagFilter) {
        query = query.eq('tag', tagFilter);
      }

      if (sortBy === 'trending') {
        query = query.order('upvotes', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Confession[];
    },
  });
}

export function useUserVotes() {
  const { fingerprint } = useFingerprint();

  return useQuery({
    queryKey: ['votes', fingerprint],
    queryFn: async () => {
      if (!fingerprint) return {};

      const { data, error } = await supabase
        .from('votes')
        .select('*')
        .eq('fingerprint', fingerprint);

      if (error) throw error;

      const voteMap: Record<string, 'up' | 'down'> = {};
      (data as Vote[]).forEach(vote => {
        voteMap[vote.confession_id] = vote.vote_type as 'up' | 'down';
      });

      return voteMap;
    },
    enabled: !!fingerprint,
  });
}

export function useCreateConfession() {
  const queryClient = useQueryClient();
  const { fingerprint } = useFingerprint();

  return useMutation({
    mutationFn: async ({ content, tag }: { content: string; tag: ConfessionTag }) => {
      if (!fingerprint) throw new Error('Unable to verify identity');

      // Check rate limit
      const today = new Date().toISOString().split('T')[0];
      const { data: limitData } = await supabase
        .from('post_limits')
        .select('*')
        .eq('fingerprint', fingerprint)
        .eq('post_date', today)
        .maybeSingle();

      if (limitData && limitData.post_count >= 3) {
        throw new Error('You have reached your daily limit of 3 confessions');
      }

      // Check for spam
      if (isSpam(content)) {
        throw new Error('Your confession was detected as spam. Please try again.');
      }

      // Filter profanity
      const filteredContent = containsProfanity(content) ? filterProfanity(content) : content;

      // Create confession
      const { data, error } = await supabase
        .from('confessions')
        .insert({
          content: filteredContent,
          tag,
          fingerprint,
        })
        .select()
        .single();

      if (error) throw error;

      // Update rate limit
      if (limitData) {
        await supabase
          .from('post_limits')
          .update({ post_count: limitData.post_count + 1 })
          .eq('id', limitData.id);
      } else {
        await supabase
          .from('post_limits')
          .insert({ fingerprint, post_date: today, post_count: 1 });
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
      toast({
        title: 'Confession posted!',
        description: 'Your anonymous confession is now live.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useVote() {
  const queryClient = useQueryClient();
  const { fingerprint } = useFingerprint();

  return useMutation({
    mutationFn: async ({ confessionId, voteType }: { confessionId: string; voteType: 'up' | 'down' }) => {
      if (!fingerprint) throw new Error('Unable to vote');

      // Check existing vote
      const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('confession_id', confessionId)
        .eq('fingerprint', fingerprint)
        .maybeSingle();

      // Get current confession
      const { data: confession } = await supabase
        .from('confessions')
        .select('upvotes, downvotes')
        .eq('id', confessionId)
        .single();

      if (!confession) throw new Error('Confession not found');

      let newUpvotes = confession.upvotes;
      let newDownvotes = confession.downvotes;

      if (existingVote) {
        // Remove existing vote
        await supabase.from('votes').delete().eq('id', existingVote.id);
        
        if (existingVote.vote_type === 'up') {
          newUpvotes--;
        } else {
          newDownvotes--;
        }

        // If clicking same vote type, just remove it
        if (existingVote.vote_type === voteType) {
          await supabase
            .from('confessions')
            .update({ upvotes: newUpvotes, downvotes: newDownvotes })
            .eq('id', confessionId);
          return;
        }
      }

      // Add new vote
      await supabase.from('votes').insert({
        confession_id: confessionId,
        fingerprint,
        vote_type: voteType,
      });

      if (voteType === 'up') {
        newUpvotes++;
      } else {
        newDownvotes++;
      }

      await supabase
        .from('confessions')
        .update({ upvotes: newUpvotes, downvotes: newDownvotes })
        .eq('id', confessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
      queryClient.invalidateQueries({ queryKey: ['votes'] });
    },
  });
}

export function useReport() {
  const { fingerprint } = useFingerprint();

  return useMutation({
    mutationFn: async ({ confessionId, reason, confessionContent }: { confessionId: string; reason: string; confessionContent: string }) => {
      if (!fingerprint) throw new Error('Unable to report');

      const { error } = await supabase.from('reports').insert({
        confession_id: confessionId,
        reason,
        fingerprint,
      });

      if (error) throw error;

      // Notify admins via edge function (fire and forget)
      supabase.functions.invoke('notify-report', {
        body: { confessionId, reason, confessionContent },
      }).catch(err => console.error('Failed to send notification:', err));
    },
    onSuccess: () => {
      toast({
        title: 'Report submitted',
        description: 'Thank you for helping keep our community safe.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to submit report. Please try again.',
        variant: 'destructive',
      });
    },
  });
}

export function usePostLimit() {
  const { fingerprint } = useFingerprint();

  return useQuery({
    queryKey: ['postLimit', fingerprint],
    queryFn: async () => {
      if (!fingerprint) return { remaining: 3 };

      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('post_limits')
        .select('post_count')
        .eq('fingerprint', fingerprint)
        .eq('post_date', today)
        .maybeSingle();

      return { remaining: 3 - (data?.post_count || 0) };
    },
    enabled: !!fingerprint,
  });
}
