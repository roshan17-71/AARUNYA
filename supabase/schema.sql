-- ==============================================================================
-- AARUNYA — International Healthcare Platform
-- Complete Master Database Schema (Phase 2)
-- Paste directly into Supabase Studio -> SQL Editor -> Run
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. HELPER FUNCTIONS & TRIGGERS
-- ==============================================================================

-- 2.1 Trigger function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 3. CORE RELATIONAL TABLES
-- ==============================================================================

-- 3.1 PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'hospital', 'admin')),
  full_name TEXT NOT NULL DEFAULT '',
  country TEXT,
  phone_country_code TEXT,
  phone_number TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Helper function to check if current authenticated user is an administrator
-- Defined here after profiles table is created
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Trigger: on_auth_user_created -> inserts into profiles reading metadata from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
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

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3.2 HOSPITALS
CREATE TABLE IF NOT EXISTS public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  description TEXT,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  accreditations TEXT[] NOT NULL DEFAULT '{}',
  facilities TEXT[] NOT NULL DEFAULT '{}',
  international_patient_services TEXT[] NOT NULL DEFAULT '{}',
  images TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected', 'suspended')),
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hospitals_status ON public.hospitals(status);
CREATE INDEX IF NOT EXISTS idx_hospitals_city ON public.hospitals(city);

DROP TRIGGER IF EXISTS trigger_hospitals_updated_at ON public.hospitals;
CREATE TRIGGER trigger_hospitals_updated_at
  BEFORE UPDATE ON public.hospitals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3.3 DOCTORS
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  qualifications TEXT,
  experience_years INT NOT NULL DEFAULT 0,
  languages TEXT[] NOT NULL DEFAULT '{}',
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  consultation_fee NUMERIC(10,2),
  consultation_duration_minutes INT DEFAULT 30,
  video_consultation_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  profile_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected', 'suspended')),
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctors_status ON public.doctors(status);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON public.doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_city ON public.doctors(city);
CREATE INDEX IF NOT EXISTS idx_doctors_hospital_id ON public.doctors(hospital_id);

DROP TRIGGER IF EXISTS trigger_doctors_updated_at ON public.doctors;
CREATE TRIGGER trigger_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3.4 TREATMENTS
CREATE TABLE IF NOT EXISTS public.treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  specialty TEXT NOT NULL,
  category TEXT NOT NULL,
  overview TEXT,
  description TEXT,
  indications TEXT,
  process TEXT,
  recovery_info TEXT,
  estimated_duration TEXT,
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_treatments_slug ON public.treatments(slug);
CREATE INDEX IF NOT EXISTS idx_treatments_specialty ON public.treatments(specialty);

DROP TRIGGER IF EXISTS trigger_treatments_updated_at ON public.treatments;
CREATE TRIGGER trigger_treatments_updated_at
  BEFORE UPDATE ON public.treatments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3.5 TREATMENT_HOSPITALS
CREATE TABLE IF NOT EXISTS public.treatment_hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  treatment_id UUID NOT NULL REFERENCES public.treatments(id) ON DELETE CASCADE,
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_treatment_hospital UNIQUE (treatment_id, hospital_id)
);

-- 3.6 TREATMENT_DOCTORS
CREATE TABLE IF NOT EXISTS public.treatment_doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  treatment_id UUID NOT NULL REFERENCES public.treatments(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_treatment_doctor UNIQUE (treatment_id, doctor_id)
);

-- 3.7 PACKAGES
CREATE TABLE IF NOT EXISTS public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  included_services TEXT[] NOT NULL DEFAULT '{}',
  estimated_price NUMERIC(10,2),
  currency TEXT NOT NULL DEFAULT 'USD',
  duration TEXT,
  eligibility_info TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_packages_hospital ON public.packages(hospital_id);
CREATE INDEX IF NOT EXISTS idx_packages_status ON public.packages(status);

DROP TRIGGER IF EXISTS trigger_packages_updated_at ON public.packages;
CREATE TRIGGER trigger_packages_updated_at
  BEFORE UPDATE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3.8 CONSULTATION_SLOTS
CREATE TABLE IF NOT EXISTS public.consultation_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_booked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_slots_doctor_id ON public.consultation_slots(doctor_id);
CREATE INDEX IF NOT EXISTS idx_slots_start_time ON public.consultation_slots(start_time);

-- 3.9 CONSULTATIONS
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  slot_id UUID REFERENCES public.consultation_slots(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'mock_paid', 'waived')),
  meeting_url TEXT,
  patient_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consultations_patient ON public.consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_doctor ON public.consultations(doctor_id);

DROP TRIGGER IF EXISTS trigger_consultations_updated_at ON public.consultations;
CREATE TRIGGER trigger_consultations_updated_at
  BEFORE UPDATE ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3.10 SECOND_OPINION_SERVICES
CREATE TABLE IF NOT EXISTS public.second_opinion_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  indicative_price NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.11 SECOND_OPINION_REQUESTS
CREATE TABLE IF NOT EXISTS public.second_opinion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.second_opinion_services(id),
  condition_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'specialist_assigned', 'responded', 'closed')),
  assigned_doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_second_opinion_patient ON public.second_opinion_requests(patient_id);

DROP TRIGGER IF EXISTS trigger_second_opinion_updated_at ON public.second_opinion_requests;
CREATE TRIGGER trigger_second_opinion_updated_at
  BEFORE UPDATE ON public.second_opinion_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3.12 MEDICAL_DOCUMENTS
CREATE TABLE IF NOT EXISTS public.medical_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  related_request_type TEXT NOT NULL CHECK (related_request_type IN ('second_opinion', 'quote', 'consultation', 'general')),
  related_request_id UUID,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size_bytes INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_med_docs_patient ON public.medical_documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_med_docs_request ON public.medical_documents(related_request_id);

-- 3.13 TREATMENT_QUOTE_REQUESTS
CREATE TABLE IF NOT EXISTS public.treatment_quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  treatment_id UUID REFERENCES public.treatments(id) ON DELETE SET NULL,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  country TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  medical_condition TEXT NOT NULL,
  preferred_travel_date DATE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'under_review', 'contacted', 'quote_prepared', 'awaiting_patient', 'confirmed', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quote_patient ON public.treatment_quote_requests(patient_id);
CREATE INDEX IF NOT EXISTS idx_quote_status ON public.treatment_quote_requests(status);

DROP TRIGGER IF EXISTS trigger_quotes_updated_at ON public.treatment_quote_requests;
CREATE TRIGGER trigger_quotes_updated_at
  BEFORE UPDATE ON public.treatment_quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3.14 ADVISOR_REQUESTS
CREATE TABLE IF NOT EXISTS public.advisor_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  country TEXT NOT NULL,
  contact TEXT NOT NULL,
  treatment_or_condition TEXT NOT NULL,
  preferred_communication_method TEXT NOT NULL,
  preferred_time TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_advisor_status ON public.advisor_requests(status);

DROP TRIGGER IF EXISTS trigger_advisor_updated_at ON public.advisor_requests;
CREATE TRIGGER trigger_advisor_updated_at
  BEFORE UPDATE ON public.advisor_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3.15 PATIENT_STORIES
CREATE TABLE IF NOT EXISTS public.patient_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  country TEXT NOT NULL,
  treatment_id UUID REFERENCES public.treatments(id) ON DELETE SET NULL,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  story TEXT NOT NULL,
  image_url TEXT,
  consent_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patient_stories_published ON public.patient_stories(is_published);

-- 3.16 VISA_INFORMATION
CREATE TABLE IF NOT EXISTS public.visa_information (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  official_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_reviewed_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trigger_visa_updated_at ON public.visa_information;
CREATE TRIGGER trigger_visa_updated_at
  BEFORE UPDATE ON public.visa_information
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3.17 SAVED_DOCTORS & SAVED_HOSPITALS
CREATE TABLE IF NOT EXISTS public.saved_doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_saved_doctor UNIQUE (patient_id, doctor_id)
);

CREATE TABLE IF NOT EXISTS public.saved_hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_saved_hospital UNIQUE (patient_id, hospital_id)
);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) INITIAL ENABLEMENT (§13 & §847)
-- ==============================================================================

DO $$
DECLARE
  tbl_name TEXT;
  tbl_list TEXT[] := ARRAY[
    'profiles',
    'doctors',
    'hospitals',
    'treatments',
    'treatment_hospitals',
    'treatment_doctors',
    'packages',
    'consultation_slots',
    'consultations',
    'second_opinion_services',
    'second_opinion_requests',
    'medical_documents',
    'treatment_quote_requests',
    'advisor_requests',
    'patient_stories',
    'visa_information',
    'saved_doctors',
    'saved_hospitals'
  ];
BEGIN
  FOREACH tbl_name IN ARRAY tbl_list LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl_name);
    EXECUTE format('DROP POLICY IF EXISTS admin_full_access ON public.%I;', tbl_name);
    EXECUTE format('CREATE POLICY admin_full_access ON public.%I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());', tbl_name);
  END LOOP;
END $$;

-- ==============================================================================
-- 5. STORAGE BUCKETS (§14 & §854)
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('public-media', 'public-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-documents', 'medical-documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

DROP POLICY IF EXISTS "Public Media Read Access" ON storage.objects;
CREATE POLICY "Public Media Read Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'public-media');

DROP POLICY IF EXISTS "Admin Full Storage Access" ON storage.objects;
CREATE POLICY "Admin Full Storage Access"
  ON storage.objects FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 6. PHASE 3 ROLE-BASED POLICIES (§13)
-- ==============================================================================

-- Profiles: users read and update their own row; admin full access
DROP POLICY IF EXISTS profiles_select_own_or_admin ON public.profiles;
CREATE POLICY profiles_select_own_or_admin ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS profiles_update_own_or_admin ON public.profiles;
CREATE POLICY profiles_update_own_or_admin ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (id = auth.uid() OR public.is_admin());

-- Doctors: public read approved; doctor owner can read & update own; admin full access
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

-- Hospitals: public read approved; hospital owner can read & update own; admin full access
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

-- ==============================================================================
-- 7. PHASE 4 POLICIES (PUBLIC SHELL & INQUIRIES)
-- ==============================================================================

-- Treatments: public read where is_published = true
DROP POLICY IF EXISTS treatments_public_read ON public.treatments;
CREATE POLICY treatments_public_read ON public.treatments
  FOR SELECT
  USING (is_published = TRUE OR public.is_admin());

-- Patient Stories: public read where is_published = true
DROP POLICY IF EXISTS patient_stories_public_read ON public.patient_stories;
CREATE POLICY patient_stories_public_read ON public.patient_stories
  FOR SELECT
  USING (is_published = TRUE OR public.is_admin());

-- Advisor Requests: allow public/guest submission
DROP POLICY IF EXISTS advisor_requests_insert_public ON public.advisor_requests;
CREATE POLICY advisor_requests_insert_public ON public.advisor_requests
  FOR INSERT
  WITH CHECK (TRUE);

-- Advisor Requests: view restricted to owner or admin
DROP POLICY IF EXISTS advisor_requests_select_policy ON public.advisor_requests;
CREATE POLICY advisor_requests_select_policy ON public.advisor_requests
  FOR SELECT TO authenticated
  USING (patient_id = auth.uid() OR public.is_admin());

