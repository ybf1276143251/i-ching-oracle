-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- I Ching Oracle — Supabase Schema
-- Run this in Supabase SQL Editor to set up the database
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ─── Users table (extends Supabase auth.users) ───────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  readings_count INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_until TIMESTAMPTZ,
  gumroad_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Readings (divination history) ───────────────────────
CREATE TABLE IF NOT EXISTS public.readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  cast_type TEXT NOT NULL DEFAULT 'three-coins',
  primary_hexagram INTEGER NOT NULL CHECK (primary_hexagram BETWEEN 1 AND 64),
  related_hexagram INTEGER CHECK (related_hexagram BETWEEN 1 AND 64),
  changing_lines INTEGER[] DEFAULT '{}',
  summary TEXT NOT NULL,
  interpretation TEXT,  -- Full interpretation (premium)
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Hexagram SEO pages metadata ─────────────────────────
CREATE TABLE IF NOT EXISTS public.hexagram_pages (
  id INTEGER PRIMARY KEY CHECK (id BETWEEN 1 AND 64),
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  meta_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  content_markdown TEXT,  -- Extended content for SEO page
  historical_context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_readings_user_id ON public.readings(user_id);
CREATE INDEX IF NOT EXISTS idx_readings_created_at ON public.readings(created_at DESC);
-- ─── Auto-update timestamps ──────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_readings_updated_at ON public.readings;
CREATE TRIGGER trigger_readings_updated_at
  BEFORE UPDATE ON public.readings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Auto-create profile on signup ───────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Row Level Security ──────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hexagram_pages ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own, admins can read all
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Readings: users can CRUD their own, public can read premium content
CREATE POLICY "Anyone can read readings"
  ON public.readings FOR SELECT
  USING (TRUE);

CREATE POLICY "Authenticated users can create readings"
  ON public.readings FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own readings"
  ON public.readings FOR UPDATE
  USING (auth.uid() = user_id);

-- Hexagram pages: public read
CREATE POLICY "Public can read hexagram pages"
  ON public.hexagram_pages FOR SELECT
  USING (TRUE);

-- ─── Seed hexagram SEO pages ─────────────────────────────
-- Run this separately if you need to seed SEO data
-- INSERT INTO public.hexagram_pages (id, name_zh, name_en, slug, meta_title, meta_description)
-- SELECT
--   id, name, nameEn, LOWER(REPLACE(nameEn, ' ', '-')),
--   name || ' - ' || nameEn || ' | 易经占卜 I Ching Oracle',
--   '易经第' || id || '卦' || name || '（' || nameEn || '）的完整解读。' || description
-- FROM (VALUES ...) AS h(id, name, nameEn, description);
