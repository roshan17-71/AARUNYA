-- ==============================================================================
-- AARUNYA — International Healthcare Platform
-- Phase 3 Migration: Auth Trigger Enhancement & Entity RLS Policies
-- Matches implementation-plan.md (§4, §13, §873, §876)
-- ==============================================================================

-- 1. ENHANCE handle_new_user TRIGGER FUNCTION (§4.1 & §873)
-- Automatically creates profiles row AND inserts doctor/hospital entity rows
-- with status='pending_review' upon role-specific signup.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
  user_name TEXT;
  user_country TEXT;
  user_specialty TEXT;
  user_city TEXT;
  generated_slug TEXT;
BEGIN
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'patient');
  user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  user_country := COALESCE(NEW.raw_user_meta_data->>'country', 'India');
  user_specialty := COALESCE(NEW.raw_user_meta_data->>'specialty', 'General Medicine');
  user_city := COALESCE(NEW.raw_user_meta_data->>'city', 'New Delhi');

  -- 1. Insert into public.profiles
  INSERT INTO public.profiles (
    id,
    role,
    full_name,
    country,
    phone_country_code,
    phone_number,
    email
  )
  VALUES (
    NEW.id,
    user_role,
    user_name,
    NEW.raw_user_meta_data->>'country',
    NEW.raw_user_meta_data->>'phone_country_code',
    NEW.raw_user_meta_data->>'phone_number',
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    country = EXCLUDED.country,
    phone_country_code = EXCLUDED.phone_country_code,
    phone_number = EXCLUDED.phone_number,
    email = EXCLUDED.email,
    updated_at = NOW();

  -- 2. If role is 'doctor', automatically create entity row in public.doctors (§4.1 Step J)
  IF user_role = 'doctor' THEN
    INSERT INTO public.doctors (
      profile_id,
      full_name,
      specialty,
      specialties,
      qualifications,
      experience_years,
      city,
      country,
      status
    )
    VALUES (
      NEW.id,
      user_name,
      user_specialty,
      ARRAY[user_specialty],
      COALESCE(NEW.raw_user_meta_data->>'qualifications', ''),
      COALESCE((NEW.raw_user_meta_data->>'experience_years')::INT, 0),
      user_city,
      user_country,
      'pending_review'
    )
    ON CONFLICT (profile_id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      specialty = EXCLUDED.specialty,
      updated_at = NOW();
  END IF;

  -- 3. If role is 'hospital', automatically create entity row in public.hospitals (§4.1 Step K)
  IF user_role = 'hospital' THEN
    -- Generate URL-safe unique slug
    generated_slug := lower(regexp_replace(user_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substring(NEW.id::text from 1 for 6);

    INSERT INTO public.hospitals (
      profile_id,
      name,
      slug,
      city,
      country,
      specialties,
      status
    )
    VALUES (
      NEW.id,
      user_name,
      generated_slug,
      user_city,
      user_country,
      ARRAY['Multi-specialty'],
      'pending_review'
    )
    ON CONFLICT (profile_id) DO UPDATE SET
      name = EXCLUDED.name,
      updated_at = NOW();
  END IF;

  RETURN NEW;
END;
$$;

-- Ensure trigger is active on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 2. ROLE-BASED ROW LEVEL SECURITY POLICIES (§13)
-- ==============================================================================

-- 2.1 PROFILES POLICIES
-- Users view and update their own profile; admins have full access.
DROP POLICY IF EXISTS profiles_select_own_or_admin ON public.profiles;
CREATE POLICY profiles_select_own_or_admin ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS profiles_update_own_or_admin ON public.profiles;
CREATE POLICY profiles_update_own_or_admin ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (id = auth.uid() OR public.is_admin());

-- 2.2 DOCTORS POLICIES
-- Public can SELECT approved doctors. Doctor owner can SELECT & UPDATE own row regardless of status. Admin full access.
DROP POLICY IF EXISTS doctors_select_policy ON public.doctors;
CREATE POLICY doctors_select_policy ON public.doctors
  FOR SELECT
  USING (status = 'approved' OR profile_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS doctors_update_own_or_admin ON public.doctors;
CREATE POLICY doctors_update_own_or_admin ON public.doctors
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid() OR public.is_admin())
  WITH CHECK (profile_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS doctors_insert_own_or_admin ON public.doctors;
CREATE POLICY doctors_insert_own_or_admin ON public.doctors
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid() OR public.is_admin());

-- 2.3 HOSPITALS POLICIES
-- Public can SELECT approved hospitals. Hospital owner can SELECT & UPDATE own row regardless of status. Admin full access.
DROP POLICY IF EXISTS hospitals_select_policy ON public.hospitals;
CREATE POLICY hospitals_select_policy ON public.hospitals
  FOR SELECT
  USING (status = 'approved' OR profile_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS hospitals_update_own_or_admin ON public.hospitals;
CREATE POLICY hospitals_update_own_or_admin ON public.hospitals
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid() OR public.is_admin())
  WITH CHECK (profile_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS hospitals_insert_own_or_admin ON public.hospitals;
CREATE POLICY hospitals_insert_own_or_admin ON public.hospitals
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid() OR public.is_admin());

