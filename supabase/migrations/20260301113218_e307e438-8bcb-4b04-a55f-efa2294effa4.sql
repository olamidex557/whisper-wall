
-- 1. Hide fingerprints: Create secure views for public access

-- Confessions public view (no fingerprint)
CREATE VIEW public.confessions_public
WITH (security_invoker=on) AS
  SELECT id, content, tag, upvotes, downvotes, created_at, is_approved
  FROM public.confessions;

-- Replies public view (no fingerprint)
CREATE VIEW public.replies_public
WITH (security_invoker=on) AS
  SELECT id, confession_id, content, created_at
  FROM public.replies;

-- Votes public view (no fingerprint)  
CREATE VIEW public.votes_public
WITH (security_invoker=on) AS
  SELECT id, confession_id, vote_type, created_at
  FROM public.votes;

-- 2. Restrict reports to admin-only SELECT
DROP POLICY IF EXISTS "Anyone can view reports" ON public.reports;
CREATE POLICY "Only admins can view reports"
  ON public.reports FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Tighten post_limits policies
DROP POLICY IF EXISTS "Anyone can view own post limits" ON public.post_limits;
DROP POLICY IF EXISTS "Anyone can update own post limits" ON public.post_limits;
DROP POLICY IF EXISTS "Anyone can insert post limits" ON public.post_limits;

CREATE POLICY "Users can view own post limits"
  ON public.post_limits FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own post limits"
  ON public.post_limits FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own post limits"
  ON public.post_limits FOR UPDATE
  USING (true);
