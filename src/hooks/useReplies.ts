import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Reply } from '@/types/reply';
import { useFingerprint } from './useFingerprint';
import { toast } from '@/hooks/use-toast';
import { containsProfanity, isSpam, filterProfanity } from '@/lib/profanity';

export function useReplies(confessionId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`replies-${confessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'replies',
          filter: `confession_id=eq.${confessionId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['replies', confessionId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [confessionId, queryClient]);

  return useQuery({
    queryKey: ['replies', confessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('replies')
        .select('*')
        .eq('confession_id', confessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Reply[];
    },
  });
}

export function useCreateReply() {
  const queryClient = useQueryClient();
  const { fingerprint } = useFingerprint();

  return useMutation({
    mutationFn: async ({ confessionId, content }: { confessionId: string; content: string }) => {
      if (!fingerprint) throw new Error('Unable to verify identity');

      if (isSpam(content)) {
        throw new Error('Your reply was detected as spam. Please try again.');
      }

      const filteredContent = containsProfanity(content) ? filterProfanity(content) : content;

      const { data, error } = await supabase
        .from('replies')
        .insert({
          confession_id: confessionId,
          content: filteredContent,
          fingerprint,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { confessionId }) => {
      queryClient.invalidateQueries({ queryKey: ['replies', confessionId] });
      toast({
        title: 'Reply posted!',
        description: 'Your anonymous reply is now visible.',
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
