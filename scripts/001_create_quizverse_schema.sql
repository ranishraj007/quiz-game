-- QuizVerse Database Schema

-- Profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  total_score INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_select_all" ON public.categories FOR SELECT USING (true);

-- Questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  wrong_answers TEXT[] NOT NULL,
  difficulty INTEGER DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 3),
  media_url TEXT,
  media_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "questions_select_all" ON public.questions FOR SELECT USING (true);

-- Game sessions table
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  time_taken INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "game_sessions_select_own" ON public.game_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "game_sessions_insert_own" ON public.game_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "game_sessions_update_own" ON public.game_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Leaderboard view
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  p.id,
  p.username,
  p.display_name,
  p.avatar_url,
  p.total_score,
  p.games_played,
  RANK() OVER (ORDER BY p.total_score DESC) as rank
FROM public.profiles p
WHERE p.total_score > 0
ORDER BY p.total_score DESC
LIMIT 100;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', 'player_' || LEFT(NEW.id::TEXT, 8)),
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', 'Player')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
