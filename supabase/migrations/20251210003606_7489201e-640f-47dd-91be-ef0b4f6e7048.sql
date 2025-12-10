-- Function to get user email by id (for admin management display)
CREATE OR REPLACE FUNCTION public.get_user_email_by_id(user_id_input uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM auth.users WHERE id = user_id_input LIMIT 1;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_email_by_id(uuid) TO authenticated;