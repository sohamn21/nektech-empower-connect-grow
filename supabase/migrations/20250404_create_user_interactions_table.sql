
-- Create table for storing user interactions from Dialogflow
CREATE TABLE IF NOT EXISTS public.user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT,
  intent TEXT NOT NULL,
  user_input TEXT,
  language TEXT DEFAULT 'en',
  timestamp TIMESTAMPTZ DEFAULT now(),
  additional_data JSONB DEFAULT '{}'::jsonb
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS user_interactions_phone_number_idx ON public.user_interactions(phone_number);
CREATE INDEX IF NOT EXISTS user_interactions_intent_idx ON public.user_interactions(intent);
CREATE INDEX IF NOT EXISTS user_interactions_timestamp_idx ON public.user_interactions(timestamp);

-- Add RLS policies for security
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;

-- Only authenticated users with admin role can view interactions
CREATE POLICY "Admins can view all interactions" 
  ON public.user_interactions 
  FOR SELECT 
  USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- API can insert new interactions
CREATE POLICY "Service role can insert interactions" 
  ON public.user_interactions 
  FOR INSERT 
  WITH CHECK (true);

-- Add comment to table
COMMENT ON TABLE public.user_interactions IS 'Stores user interactions from Dialogflow webhook';
