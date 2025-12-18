-- Add streak tracking columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS current_streak integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS best_streak integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_task_date date;