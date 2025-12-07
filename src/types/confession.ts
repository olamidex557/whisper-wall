export type ConfessionTag = 'love' | 'regret' | 'secret' | 'funny' | 'work' | 'family' | 'friendship' | 'other';

export interface Confession {
  id: string;
  content: string;
  tag: ConfessionTag;
  fingerprint: string;
  upvotes: number;
  downvotes: number;
  is_approved: boolean;
  created_at: string;
}

export interface Vote {
  id: string;
  confession_id: string;
  fingerprint: string;
  vote_type: 'up' | 'down';
  created_at: string;
}

export interface Report {
  id: string;
  confession_id: string;
  reason: string;
  fingerprint: string;
  created_at: string;
}

export interface PostLimit {
  id: string;
  fingerprint: string;
  post_date: string;
  post_count: number;
}

export const TAG_LABELS: Record<ConfessionTag, string> = {
  love: '💕 Love',
  regret: '😔 Regret',
  secret: '🤫 Secret',
  funny: '😂 Funny',
  work: '💼 Work',
  family: '👨‍👩‍👧 Family',
  friendship: '🤝 Friendship',
  other: '💭 Other',
};

export const TAG_COLORS: Record<ConfessionTag, string> = {
  love: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  regret: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  secret: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  funny: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  work: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  family: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  friendship: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  other: 'bg-muted text-muted-foreground border-border',
};
