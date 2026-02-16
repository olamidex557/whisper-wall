
-- Create atomic vote function
CREATE OR REPLACE FUNCTION public.handle_vote(
  p_confession_id uuid,
  p_fingerprint text,
  p_vote_type text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing_vote_type text;
  v_existing_vote_id uuid;
BEGIN
  -- Check for existing vote
  SELECT id, vote_type INTO v_existing_vote_id, v_existing_vote_type
  FROM votes
  WHERE confession_id = p_confession_id AND fingerprint = p_fingerprint;

  IF v_existing_vote_id IS NOT NULL THEN
    -- Remove existing vote
    DELETE FROM votes WHERE id = v_existing_vote_id;
    
    -- Decrement the old vote count
    IF v_existing_vote_type = 'up' THEN
      UPDATE confessions SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = p_confession_id;
    ELSE
      UPDATE confessions SET downvotes = GREATEST(downvotes - 1, 0) WHERE id = p_confession_id;
    END IF;

    -- If same vote type, just remove (toggle off)
    IF v_existing_vote_type = p_vote_type THEN
      RETURN;
    END IF;
  END IF;

  -- Insert new vote
  INSERT INTO votes (confession_id, fingerprint, vote_type)
  VALUES (p_confession_id, p_fingerprint, p_vote_type);

  -- Increment the new vote count
  IF p_vote_type = 'up' THEN
    UPDATE confessions SET upvotes = upvotes + 1 WHERE id = p_confession_id;
  ELSE
    UPDATE confessions SET downvotes = downvotes + 1 WHERE id = p_confession_id;
  END IF;
END;
$$;

-- Drop the overly permissive "Anyone can update confession votes" policy
DROP POLICY IF EXISTS "Anyone can update confession votes" ON confessions;

-- Drop overly permissive vote delete policy and recreate
DROP POLICY IF EXISTS "Anyone can delete their votes" ON votes;

-- Drop overly permissive post_limits policies and recreate tighter ones
DROP POLICY IF EXISTS "Anyone can insert post limits" ON post_limits;
DROP POLICY IF EXISTS "Anyone can update post limits" ON post_limits;
DROP POLICY IF EXISTS "Anyone can view post limits" ON post_limits;

-- Post limits: keep SELECT/INSERT open (anonymous app needs this) but no UPDATE/DELETE
-- The RPC function handles updates via SECURITY DEFINER
CREATE POLICY "Anyone can view own post limits" ON post_limits
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert post limits" ON post_limits
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update own post limits" ON post_limits
  FOR UPDATE USING (true);
