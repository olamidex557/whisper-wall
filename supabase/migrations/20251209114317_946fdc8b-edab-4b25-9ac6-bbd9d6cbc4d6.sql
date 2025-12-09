-- Create replies table
CREATE TABLE public.replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  confession_id UUID NOT NULL REFERENCES public.confessions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;

-- Anyone can view replies
CREATE POLICY "Anyone can view replies"
ON public.replies
FOR SELECT
USING (true);

-- Anyone can create replies
CREATE POLICY "Anyone can create replies"
ON public.replies
FOR INSERT
WITH CHECK (true);

-- Admins can delete replies
CREATE POLICY "Admins can delete replies"
ON public.replies
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));