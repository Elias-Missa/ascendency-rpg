-- Add multi-image support to face_scans
ALTER TABLE public.face_scans 
ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '{}';

-- Add scan limit fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS scan_count integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS free_scans_remaining integer NOT NULL DEFAULT 2;

-- Create progress_photos table for monthly tracking
CREATE TABLE IF NOT EXISTS public.progress_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  image_path TEXT NOT NULL,
  photo_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on progress_photos
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;

-- RLS policies for progress_photos
CREATE POLICY "Users can view their own progress photos" 
ON public.progress_photos FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress photos" 
ON public.progress_photos FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress photos" 
ON public.progress_photos FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_progress_photos_user_date 
ON public.progress_photos(user_id, photo_date DESC);