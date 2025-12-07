-- Create enum for confession tags
CREATE TYPE public.confession_tag AS ENUM ('love', 'regret', 'secret', 'funny', 'work', 'family', 'friendship', 'other');

-- Create confessions table
CREATE TABLE public.confessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  tag confession_tag NOT NULL DEFAULT 'other',
  fingerprint TEXT NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  downvotes INTEGER NOT NULL DEFAULT 0,
  is_approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create votes table for tracking user votes (using fingerprint for anonymity)
CREATE TABLE public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  confession_id UUID NOT NULL REFERENCES public.confessions(id) ON DELETE CASCADE,
  fingerprint TEXT NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(confession_id, fingerprint)
);

-- Create reports table
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  confession_id UUID NOT NULL REFERENCES public.confessions(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rate limiting table
CREATE TABLE public.post_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fingerprint TEXT NOT NULL,
  post_date DATE NOT NULL DEFAULT CURRENT_DATE,
  post_count INTEGER NOT NULL DEFAULT 1,
  UNIQUE(fingerprint, post_date)
);

-- Enable RLS on all tables
ALTER TABLE public.confessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for confessions (public read for approved, anyone can insert)
CREATE POLICY "Anyone can view approved confessions"
ON public.confessions FOR SELECT
USING (is_approved = true);

CREATE POLICY "Anyone can create confessions"
ON public.confessions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update confession votes"
ON public.confessions FOR UPDATE
USING (true)
WITH CHECK (true);

-- RLS Policies for votes (public access for anonymous voting)
CREATE POLICY "Anyone can view votes"
ON public.votes FOR SELECT
USING (true);

CREATE POLICY "Anyone can create votes"
ON public.votes FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can delete their votes"
ON public.votes FOR DELETE
USING (true);

-- RLS Policies for reports
CREATE POLICY "Anyone can create reports"
ON public.reports FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view reports"
ON public.reports FOR SELECT
USING (true);

-- RLS Policies for post_limits
CREATE POLICY "Anyone can view post limits"
ON public.post_limits FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert post limits"
ON public.post_limits FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update post limits"
ON public.post_limits FOR UPDATE
USING (true);

-- Create indexes for performance
CREATE INDEX idx_confessions_created_at ON public.confessions(created_at DESC);
CREATE INDEX idx_confessions_upvotes ON public.confessions(upvotes DESC);
CREATE INDEX idx_confessions_tag ON public.confessions(tag);
CREATE INDEX idx_votes_confession_id ON public.votes(confession_id);
CREATE INDEX idx_post_limits_fingerprint_date ON public.post_limits(fingerprint, post_date);

-- Enable realtime for confessions
ALTER PUBLICATION supabase_realtime ADD TABLE public.confessions;