-- ===========================================
-- ASCENDENCY DATABASE SCHEMA
-- Production-Ready Looksmaxing RPG App
-- ===========================================

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  current_xp INTEGER NOT NULL DEFAULT 0,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  face_potential_score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create onboarding_surveys table (sensitive data)
CREATE TABLE public.onboarding_surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  height_cm INTEGER,
  weight_kg INTEGER,
  age INTEGER,
  ethnicity TEXT,
  habits JSONB DEFAULT '{}'::jsonb,
  consented_to_biometrics BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_survey UNIQUE (user_id)
);

-- Create face_scans table
CREATE TABLE public.face_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_path TEXT NOT NULL,
  analysis_data JSONB DEFAULT '{}'::jsonb,
  is_latest BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create recommendations table (the logic engine)
CREATE TABLE public.recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  issue TEXT NOT NULL,
  action_plan TEXT,
  product_recommendation TEXT,
  impact_score INTEGER CHECK (impact_score >= 1 AND impact_score <= 10),
  effort_score INTEGER CHECK (effort_score >= 1 AND effort_score <= 10),
  roi_score FLOAT GENERATED ALWAYS AS (
    CASE WHEN effort_score > 0 THEN impact_score::float / effort_score::float ELSE 0 END
  ) STORED,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create daily_tasks table (gamification)
CREATE TABLE public.daily_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  date_assigned DATE NOT NULL DEFAULT CURRENT_DATE,
  xp_reward INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_face_scans_user_latest ON public.face_scans(user_id, is_latest) WHERE is_latest = true;
CREATE INDEX idx_recommendations_user_category ON public.recommendations(user_id, category);
CREATE INDEX idx_recommendations_roi ON public.recommendations(roi_score DESC);
CREATE INDEX idx_daily_tasks_user_date ON public.daily_tasks(user_id, date_assigned);

-- ===========================================
-- ROW LEVEL SECURITY POLICIES
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.face_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ONBOARDING_SURVEYS policies (sensitive - only own data)
CREATE POLICY "Users can view their own survey"
  ON public.onboarding_surveys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own survey"
  ON public.onboarding_surveys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own survey"
  ON public.onboarding_surveys FOR UPDATE
  USING (auth.uid() = user_id);

-- FACE_SCANS policies
CREATE POLICY "Users can view their own face scans"
  ON public.face_scans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own face scans"
  ON public.face_scans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own face scans"
  ON public.face_scans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own face scans"
  ON public.face_scans FOR DELETE
  USING (auth.uid() = user_id);

-- RECOMMENDATIONS policies
CREATE POLICY "Users can view their own recommendations"
  ON public.recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recommendations"
  ON public.recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recommendations"
  ON public.recommendations FOR UPDATE
  USING (auth.uid() = user_id);

-- DAILY_TASKS policies
CREATE POLICY "Users can view their own daily tasks"
  ON public.daily_tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily tasks"
  ON public.daily_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily tasks"
  ON public.daily_tasks FOR UPDATE
  USING (auth.uid() = user_id);

-- ===========================================
-- FUNCTIONS AND TRIGGERS
-- ===========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_onboarding_surveys_updated_at
  BEFORE UPDATE ON public.onboarding_surveys
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recommendations_updated_at
  BEFORE UPDATE ON public.recommendations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'username');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to ensure only one latest face scan per user
CREATE OR REPLACE FUNCTION public.set_latest_face_scan()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_latest = true THEN
    UPDATE public.face_scans
    SET is_latest = false
    WHERE user_id = NEW.user_id AND id != NEW.id AND is_latest = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_face_scan_insert
  BEFORE INSERT OR UPDATE ON public.face_scans
  FOR EACH ROW EXECUTE FUNCTION public.set_latest_face_scan();

-- ===========================================
-- STORAGE BUCKET FOR FACE SCANS
-- ===========================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'face-scans',
  'face-scans',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Storage policies for face-scans bucket
CREATE POLICY "Users can upload their own face scans"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'face-scans' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own face scans"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'face-scans' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own face scans"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'face-scans' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );