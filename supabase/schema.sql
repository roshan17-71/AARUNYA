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



-- ============================================================================
-- 10. PHASE 5 SEED: Medical Treatments Dataset
-- ============================================================================

INSERT INTO public.treatments (
  name,
  slug,
  specialty,
  category,
  overview,
  description,
  indications,
  process,
  recovery_info,
  estimated_duration,
  faqs,
  image_url,
  is_published
)
VALUES
  (
    'Coronary Artery Bypass Graft (CABG)',
    'coronary-artery-bypass-graft-cabg',
    'Cardiology',
    'Adult Cardiac Surgery',
    'Coronary Artery Bypass Graft (CABG) is an advanced open-heart surgical intervention used to restore healthy myocardial blood flow in patients suffering from severe multivessel coronary artery disease.',
    'Performed by premier cardiothoracic surgical teams across India using modern off-pump (beating heart) or minimally invasive endoscopic vessel harvesting (EVH) techniques, drastically lowering intraoperative risk and surgical trauma.',
    E'• Severe triple vessel coronary disease (CAD) confirmed via coronary angiogram\n• Significant stenosis (>50%) of the Left Main Coronary Artery\n• Refractory angina pectoris unresponsive to aggressive medical therapy and PCI stenting\n• Diabetic coronary disease with multi-vessel diffuse blockages',
    E'1. Comprehensive Pre-Operative Assessment: 2D-Echocardiography, coronary angiography, carotid Doppler, and pulmonary function testing.\n2. Conduit Harvesting: Endoscopic harvesting of the internal mammary artery (LIMA) and great saphenous vein.\n3. Surgical Bypass Grafting: Precision microsurgical anastomosis of vascular conduits past arterial blockages on a beating heart (off-pump CABG).\n4. Cardiac Intensive Care Stabilization: 48 hours of continuous hemodynamic monitoring in a specialized CCU.',
    E'• Hospital Stay: 6 to 8 days total (including 2 days in cardiac ICU).\n• Step-down Ward: Mobilization, spirometry breathing therapy, and early ambulation from post-op day 3.\n• International Flight Clearance: Fit-to-fly clearance provided 14–21 days after procedure following final 2D-Echo review.\n• Full Functional Recovery: 6–8 weeks with structured outpatient cardiac rehab guidelines.',
    '7–9 Days in Hospital / 14 Days in India',
    '[
      {"question": "What is the difference between beating-heart (off-pump) and conventional CABG?", "answer": "In off-pump (beating-heart) CABG, the cardiac surgeon operates while your heart continues to pump blood, using advanced tissue stabilizers without needing the heart-lung bypass machine. This significantly reduces inflammation, bleeding risks, and stroke rates, especially in elderly or high-risk patients."},
      {"question": "How soon can international patients fly home after heart bypass surgery?", "answer": "Most international patients are medically cleared for long-haul air travel 14 to 21 days following CABG, after comprehensive wound inspection, follow-up echocardiogram, and issuance of fit-to-fly medical documentation."},
      {"question": "What is the expected long-term patency of arterial grafts used in India?", "answer": "The Left Internal Mammary Artery (LIMA) grafted to the Left Anterior Descending (LAD) artery demonstrates exceptional long-term survival, with patency rates exceeding 90–95% at 10 to 15 years post-surgery."}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    'Transcatheter Aortic Valve Implantation (TAVI / TAVR)',
    'transcatheter-aortic-valve-implantation-tavi',
    'Cardiology',
    'Interventional Cardiology',
    'Transcatheter Aortic Valve Implantation (TAVI/TAVR) is a minimally invasive percutaneous cardiac procedure replacing a diseased, calcified aortic valve without opening the chest or placing the patient on cardiopulmonary bypass.',
    'A transformative procedure for elderly patients or individuals with high surgical risk who cannot undergo standard open-heart sternotomy. Performed in state-of-the-art biplane cardiac catheterization labs using balloon-expandable or self-expanding bioprosthetic valves.',
    E'• Severe symptomatic native aortic stenosis (valve area < 1.0 cm²)\n• Moderate-to-high surgical risk as evaluated by STS / EuroSCORE II predictive risk algorithms\n• Degenerated previously implanted surgical bioprosthetic aortic valve (Valve-in-Valve TAVI)\n• Patient preference for minimally invasive catheter-based intervention without general sternotomy',
    E'1. Transfemoral Catheter Delivery: Introducer sheath placed into the common femoral artery under fluoroscopic and transesophageal echocardiography (TEE) guidance.\n2. Balloon Valvuloplasty: Dilatation of the stenotic native valve calcification.\n3. Valve Deployment: Precise positioning and expansion of the bioprosthetic heart valve across the native aortic annulus.\n4. Hemodynamic Confirmation: Immediate invasive gradient measurement and aortogram verifying minimal paravalvular regurgitation.',
    E'• Hospital Stay: 3 to 4 days total (including 24 hours in coronary care observation).\n• Immediate Ambulation: Patients are safely walking within 24 hours post-implantation.\n• International Flight Clearance: Fit-to-fly issued within 7–10 days post-procedure.\n• Rapid Recovery: Near-immediate relief of shortness of breath and angina, with normal activities resuming in 1–2 weeks.',
    '3–4 Days in Hospital / 7–10 Days in India',
    '[
      {"question": "Is general anesthesia mandatory for TAVI?", "answer": "In most modern Indian cardiac centers of excellence, TAVI is performed under conscious sedation (local anesthesia with mild sedation) rather than full general endotracheal anesthesia, expediting recovery and discharge."},
      {"question": "How durable are transcatheter bioprosthetic heart valves?", "answer": "Contemporary clinical registry data demonstrates robust hemodynamic performance and durability comparable to surgical bioprostheses for over 8–10 years."}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    'Robotic Total Knee Replacement',
    'robotic-total-knee-replacement',
    'Orthopedics',
    'Joint Reconstruction',
    'Robotic-assisted Total Knee Arthroplasty (TKA) utilizes autonomous robotic arms (Mako, Rosa, or Cuvis) and CT-based 3D computer navigation to replace degenerated knee cartilage with sub-millimeter prosthetic precision.',
    'Advanced robotic instrumentation provides real-time ligament balance assessment and custom cuts, maximizing implant longevity, reducing soft-tissue trauma, and allowing patients to walk hours after surgery.',
    E'• Severe end-stage osteoarthritis or rheumatoid arthritis of the knee joint with persistent disability\n• Failure of non-surgical conservative treatments (physiotherapy, hyaluronic acid, intra-articular injections)\n• Significant varus (bow-legged) or valgus (knock-kneed) angular joint deformities\n• Chronic nocturnal knee pain severely restricting basic mobility and quality of life',
    E'1. 3D CT Virtual Planning: Pre-operative pelvic-to-ankle CT scan converted into a patient-specific 3D anatomical bone model.\n2. Intraoperative Kinematic Balancing: Robotic sensors evaluate natural ligament tension across full extension and flexion arcs.\n3. Robotic Bone Preparation: Robotic arm guides bone resurfacing with high accuracy, protecting collateral ligaments.\n4. Implant Fixation & Verification: Premium FDA/CE-approved cobalt-chromium or titanium components cemented with bone cement.',
    E'• Hospital Stay: 4 to 5 days in a private orthopedics suite.\n• Same-Day Ambulation: Physical therapists assist standing and walking with a walker within 6–12 hours post-surgery.\n• Intensive Physiotherapy: 5–7 days of daily in-hospital gait and range-of-motion training.\n• International Flight Clearance: Medically cleared to fly 10–14 days post-op with deep vein thrombosis (DVT) prophylaxis.',
    '4–5 Days in Hospital / 12–14 Days in India',
    '[
      {"question": "Does the robot perform the knee surgery automatically?", "answer": "No. The orthopedic surgeon maintains total tactile and visual control at all times. The robotic arm provides active haptic boundary constraints and ultra-precise guidance to prevent deviations from the pre-planned bone resection plane."},
      {"question": "How long will my robotic knee replacement last?", "answer": "With precise robotic alignment and modern cross-linked polyethylene inserts, contemporary total knee implants are clinically documented to survive 20 to 25+ years in over 90% of recipients."}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    'Total Hip Arthroplasty (Anterior / Posterior Approach)',
    'total-hip-arthroplasty',
    'Orthopedics',
    'Joint Replacement',
    'Total Hip Replacement (Arthroplasty) surgically replaces arthritic or damaged femoral head and acetabulum components with biocompatible ceramic-on-polyethylene or ceramic-on-ceramic prosthetic bearing surfaces.',
    'Indian orthopedic centers specialize in direct anterior approach (muscle-sparing) and dual-mobility articulations that eliminate post-operative hip dislocation precautions and accelerate unassisted walking.',
    E'• Avascular Necrosis (AVN) of the femoral head caused by steroid use, trauma, or sickle cell disease\n• End-stage secondary osteoarthritis, ankylosing spondylitis, or dysplastic hip pathology\n• Femoral neck fractures in active adults requiring joint reconstruction\n• Intractable groin pain radiating down the anterior thigh with severe flexion contracture',
    E'1. Pre-Op Digital Templating: Digital templating to determine optimal femoral neck offset, leg length, and acetabular version.\n2. Surgical Exposure: Muscle-sparing anterior incision or posterolateral approach preserving abductor muscle integrity.\n3. Acetabular Reaming & Cup Placement: Press-fit porous titanium acetabular shell with ultra-high molecular weight polyethylene liner.\n4. Femoral Broaching & Head Reductions: Tapered femoral stem insertion with delta-ceramic ball head reduction and stability testing.',
    E'• Hospital Stay: 4 to 5 days.\n• Weight-Bearing: Full weight-bearing allowed on postoperative day 1 using elbow crutches or walker.\n• Leg Length Restoration: Symmetry verified via post-op standing digital pelvis X-rays.\n• Flight Clearance: 12–14 days post-op with compression stockings and low-molecular-weight heparin.',
    '4–5 Days in Hospital / 12–14 Days in India',
    '[
      {"question": "What is the advantage of Ceramic-on-Ceramic bearing surfaces?", "answer": "Delta ceramic bearing couples produce near-zero wear debris, virtually eliminating osteolysis (bone loss) and significantly lowering the lifetime probability of revision surgery in young, active international patients."},
      {"question": "Can I sit cross-legged or use Indian toilets after hip replacement?", "answer": "With contemporary large-diameter ceramic femoral heads or dual-mobility designs, high ranges of flexion are safely achievable, though heavy high-impact contact sports are generally discouraged."}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    'CyberKnife Robotic Radiosurgery',
    'cyberknife-robotic-radiosurgery',
    'Oncology',
    'Radiation Oncology',
    'CyberKnife is a non-invasive, robotic stereotactic radiosurgery (SRS) and stereotactic body radiation therapy (SBRT) platform that delivers sub-millimeter targeted radiation to tumors throughout the body without surgical incisions.',
    'Equipped with real-time tumor tracking (Synchrony system) that dynamically synchronizes radiation beams with patient respiratory motion, shielding surrounding healthy brain, lung, or spinal tissues from collateral radiation damage.',
    E'• Intracranial brain tumors: Vestibular schwannoma / acoustic neuroma, meningiomas, brain metastases\n• Early-stage medically inoperable Non-Small Cell Lung Cancer (NSCLC)\n• Localized organ-confined prostate carcinoma\n• Inoperable liver tumors (hepatocellular carcinoma and oligometastases)\n• Complex recurrent spinal tumors adjacent to the spinal cord',
    E'1. High-Resolution Imaging & Fiducial Marking: CT simulation with MRI/PET fusion for millimeter-accurate volumetric tumor delineation.\n2. Inverse Dose Treatment Planning: Multi-criteria radiation physics calculation focusing hundreds of non-coplanar beam angles.\n3. Outpatient Radiation Delivery: Patient rests comfortably on a RoboCouch while the robotic linear accelerator targets tumor voxels.\n4. Complete Non-Invasiveness: Zero incisions, no rigid stereotactic head frames, and no general anesthesia required.',
    E'• Outpatient Treatment: 1 to 5 treatment sessions (fractions) delivered over consecutive or alternating days.\n• Zero Hospitalization: Patients return to their hotel immediately following each 30–60 minute session.\n• Side Effects: Minimal acute fatigue or transient local inflammation; no hair loss (unless treating superficial brain tumors).\n• Flight Clearance: Medically safe to fly 24–48 hours after concluding the final treatment fraction.',
    'Outpatient (1–5 Sessions) / 5–7 Days in India',
    '[
      {"question": "Is CyberKnife painful?", "answer": "No. The procedure is entirely painless, non-invasive, and silent. Patients lie comfortably on an ergonomic treatment couch while listening to music. No surgical cuts or pinning head frames are used."},
      {"question": "How many days must an international patient stay in India for CyberKnife?", "answer": "The total overseas stay is typically 5 to 7 days, allowing for pre-treatment MRI/CT simulation mapping, dosimetric plan calculation, and 1 to 5 daily delivery sessions."}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    'Allogeneic Bone Marrow Transplant (BMT)',
    'allogeneic-bone-marrow-transplant',
    'Oncology',
    'Hematology & Stem Cell Transplantation',
    'Allogeneic Hematopoietic Stem Cell Transplantation (BMT) replaces a diseased, malignant, or failed bone marrow system with healthy matched sibling, matched unrelated donor (MUD), or haploidentical family donor stem cells.',
    'Conducted in HEPA-filtered positive-pressure BMT units with comprehensive HLA typing, flow cytometry, post-transplant cyclophosphamide (PTCy) haplo-identical protocols, and strict infection control monitoring.',
    E'• Acute Myeloid Leukemia (AML) and Acute Lymphoblastic Leukemia (ALL) in first or subsequent remission\n• Severe Aplastic Anemia refractory to immunosuppressive therapy\n• Thalassemia Major and Sickle Cell Anemia in pediatric or adolescent candidates\n• High-Risk Myelodysplastic Syndromes (MDS) and Primary Myelofibrosis',
    E'1. Donor HLA Typing & Harvesting: Full 10/10 high-resolution HLA matching or haploidentical donor mobilization using G-CSF.\n2. Conditioning Chemotherapy: High-dose preparatory chemotherapy ± total body irradiation (TBI) to eradicate diseased marrow.\n3. Stem Cell Infusion (Day 0): Painless intravenous transfusion of peripheral blood stem cells (PBSC) or bone marrow harvest.\n4. Aplasia & Engraftment Phase: Neutrophil and platelet engraftment monitoring in sterile isolation with IV antimicrobial support.',
    E'• In-Hospital Isolation Stay: 3 to 4 weeks in a laminar airflow HEPA-filtered clean room.\n• Engraftment Confirmation: Absolute neutrophil count (ANC) > 500/µL achieved between Days 14–21.\n• Outpatient Monitoring in India: 60 to 90 days of close outpatient clinic monitoring for chimerism and GVHD management.\n• Return Flight Clearance: Approximately 90–100 days post-transplantation following bone marrow biopsy confirmation.',
    '25–30 Days in Inpatient Isolation / 90 Days in India',
    '[
      {"question": "What if no full 10/10 HLA matched sibling donor exists in our family?", "answer": "Indian transplant centers are world pioneers in Haploidentical (half-matched) family donor BMT using post-transplant cyclophosphamide, allowing parents or children to serve as successful donors with excellent disease-free survival rates."},
      {"question": "How are infections prevented in the BMT clean room?", "answer": "Patients reside in positive-pressure suites with HEPA air filtration (>99.97% particulate removal), reverse osmosis water treatment, sterile dietary protocols, and continuous prophylactic antiviral, antifungal, and antibacterial regimens."}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    'Living Donor Liver Transplantation (LDLT)',
    'living-donor-liver-transplantation',
    'Organ Transplant',
    'Hepato-Pancreato-Biliary Surgery',
    'Living Donor Liver Transplantation (LDLT) is a lifesaving surgical operation in which a portion of a healthy family donor liver (typically the right hepatic lobe) is surgically resected and transplanted into an end-stage liver failure recipient.',
    'India is an undisputed global capital for LDLT, executing over 2,500 successful liver transplants each year with >95% success rates, dual-surgeon donor/recipient synchronization, and microvascular biliary reconstruction.',
    E'• End-stage liver cirrhosis resulting from Hepatitis B/C, NASH/MASH, or alcoholic liver disease\n• Hepatocellular Carcinoma (HCC) fulfilling Milan or UCSF staging criteria\n• Acute on Chronic Liver Failure (ACLF) with decompensated ascites, encephalopathy, or hepatorenal syndrome\n• Biliary Atresia and metabolic liver diseases in pediatric patients',
    E'1. High-Resolution Donor & Recipient Evaluation: 3D CT volumetry, vascular anatomy delineation, and government authorization committee vetting.\n2. Synchronized Hepatectomy: Donor right hepatectomy (leaving ~35-40% remnant liver) while diseased recipient liver is explanted.\n3. Microvascular Anastomosis: Microsurgical reconnection of recipient portal vein, hepatic artery, hepatic veins, and biliary ducts.\n4. Dual ICU Recovery: Intensive hepatic monitoring with Doppler ultrasound tracking vascular graft patency.',
    E'• Donor Hospital Stay: 7 to 9 days; full natural liver regeneration occurs within 6–8 weeks.\n• Recipient Hospital Stay: 18 to 22 days (including 7–10 days in dedicated transplant ICU).\n• Post-Discharge Stay in India: 6 to 8 weeks for immunosuppressive drug level (tacrolimus) titration and LFT monitoring.\n• International Flight Clearance: 8–10 weeks post-transplant after complete wound healing and stable graft function.',
    '20–25 Days in Hospital / 60–75 Days in India',
    '[
      {"question": "Is living liver donation safe for the healthy donor?", "answer": "Donor safety is the paramount priority. The liver possesses unique regenerative capability, regrowing to >90% of original anatomical volume within 6 to 8 weeks. Healthy donors experience minimal long-term health impact and return to normal life within 1–2 months."},
      {"question": "What legal permissions are required for international organ transplant in India?", "answer": "Indian law (THOTA Act) requires all living donors to be genetically or legally related family members. The case undergoes comprehensive scrutiny and personal interview before an independent State Government Authorization Committee."}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    'Deep Brain Stimulation (DBS)',
    'deep-brain-stimulation-dbs',
    'Neurology & Neurosurgery',
    'Functional Neurosurgery',
    'Deep Brain Stimulation (DBS) is a cutting-edge surgical procedure that implants medical neurostimulator leads into specific basal ganglia structures (STN or GPi) to deliver regulated electrical pulses, dramatically suppressing motor symptoms.',
    'Performed by elite functional neurosurgeons utilizing frame-based microelectrode recording (MER), intraoperative neurological testing, and directional steering leads (Boston Scientific, Medtronic, or Abbott systems).',
    E'• Advanced Parkinson’s Disease with significant motor fluctuations, "wearing-off", and levodopa-induced dyskinesia\n• Severe medically refractory Essential Tremor interfering with eating, writing, and self-care\n• Primary or secondary generalized Dystonia unresponsive to pharmacological treatment\n• Severe refractory Obsessive-Compulsive Disorder (OCD) meeting psychiatric neurosurgery criteria',
    E'1. Stereotactic Framework & MRI-CT Fusion: High-field 3T brain MRI merged with stereotactic head frame CT scans.\n2. Microelectrode Recording (MER): Intraoperative physiological mapping pinpointing exact subthalamic nucleus boundaries.\n3. Awake / Asleep Lead Implantation: Real-time clinical confirmation of tremor cessation and rigidity relief.\n4. Subclavicular IPG Placement: Subcutaneous pocket created under the collarbone to house the rechargeable pulse generator battery.',
    E'• Hospital Stay: 4 to 6 days.\n• Initial Neurostimulation Programming: Commenced 2 to 4 weeks post-surgery after temporary brain microlesion effect resolves.\n• Levodopa Medication Reduction: Most patients successfully lower Parkinsonian oral medications by 40–60%.\n• International Flight Clearance: Medically cleared for flight 10–14 days post-implantation.',
    '4–6 Days in Hospital / 14–21 Days in India',
    '[
      {"question": "Can Parkinson''s disease medications be stopped completely after DBS?", "answer": "While rarely eliminated 100%, most patients reduce their daily dopaminergic medication dosage by 40% to 60%, drastically reducing troublesome dyskinesias and motor fluctuations while significantly enhancing on-time quality of life."},
      {"question": "How long does the implanted DBS battery last?", "answer": "Modern rechargeable neurostimulators last between 15 to 25 years with weekly transcutaneous charging pads, avoiding repeated surgical procedures for battery replacements."}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    'Minimally Invasive Spine Surgery (MISS)',
    'minimally-invasive-spine-surgery-miss',
    'Spine Surgery',
    'Orthopedic & Neuro-Spine',
    'Minimally Invasive Spine Surgery (MISS) employs tubular retractor systems, endoscopes, and intraoperative O-arm 3D fluoroscopy to treat spinal stenosis, herniated discs, and instability through tiny keyhole incisions without dissecting spinal musculature.',
    'Preserves critical paravertebral muscles and posterior spinal ligaments, reducing blood loss to negligible levels, eliminating postoperative muscle spasms, and slashing hospital convalescence times.',
    E'• Lumbar disc herniation (sciatica) refractory to 6 weeks of conservative care\n• Lumbar spinal canal stenosis with neurogenic claudication (inability to walk >100 meters without calf pain)\n• Spondylolisthesis (vertebral slippage) requiring transforaminal lumbar interbody fusion (TLIF)\n• Recurrent disc prolapse or degenerative facet hypertrophy with radiculopathy',
    E'1. Tubular Retractor Insertion: Sequential muscle-dilating tubular ports inserted under real-time fluoroscopic precision.\n2. Microscopic Nerve Decompression: High-magnification surgical microscope or spine endoscope provides pristine illumination.\n3. Fragmentectomy / Discectomy: Direct excision of the extruded disc fragment impinging upon the nerve root.\n4. Percutaneous Pedicle Screws (if fusion indicated): Titanium cannulated screws and PEEK cage placed through small stab incisions.',
    E'• Hospital Stay: 2 to 3 days.\n• Immediate Mobilization: Walking unassisted within 12–24 hours post-surgery wearing a supportive lumbar brace.\n• Minimal Wound Care: Small keyhole waterproof dressing; no stitches requiring removal (subcuticular dissolvable sutures).\n• Flight Clearance: Medically cleared for international flights 7–10 days post-procedure.',
    '2–3 Days in Hospital / 7–10 Days in India',
    '[
      {"question": "How does MISS compare to traditional open spine surgery?", "answer": "Traditional open surgery requires large incisions and stripping paraspinal muscles from the spine, causing long post-op pain. MISS dilates rather than cuts the muscle, resulting in 80% less blood loss, lower infection rates, and much faster return to normal activity."},
      {"question": "Is spine surgery safe in India?", "answer": "Leading Indian neuro-spine centers utilize continuous intraoperative neuromonitoring (IONM) to track nerve integrity in real time, virtually eliminating surgical nerve injury risks."}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&w=800&q=80',
    TRUE
  ),
  (
    'In Vitro Fertilization (IVF) with ICSI',
    'ivf-with-icsi-treatment',
    'Infertility & Reproductive Medicine',
    'Assisted Reproductive Technology',
    'In Vitro Fertilization with Intracytoplasmic Sperm Injection (IVF-ICSI) is an advanced assisted reproduction method where a single healthy sperm is micro-injected directly into a mature harvested egg cell under micromanipulation.',
    'Coupled with Laser-Assisted Hatching, Preimplantation Genetic Testing for Aneuploidies (PGT-A), and blastocyst vitrification in state-of-the-art cleanroom embryology laboratories with world-class clinical pregnancy rates.',
    E'• Severe male factor infertility (oligozoospermia, asthenospermia, or azoospermia requiring TESA/PESA)\n• Tubal factor infertility: Bilateral fallopian tube blockages or previous ectopic pregnancy salpingectomy\n• Advanced maternal age (>35 years) with diminished ovarian reserve (low AMH)\n• Multiple unexplained failed IUI (intrauterine insemination) cycles or recurrent pregnancy loss',
    E'1. Controlled Ovarian Stimulation: 10–12 days of customized gonadotropin injections with transvaginal ultrasound monitoring.\n2. Ovum Pick-Up (OPU): Short 15-minute ultrasound-guided transvaginal aspiration under painless light sedation.\n3. Micro-ICSI Fertilization & Culture: Micromanipulator-assisted sperm injection and incubation to Day 5 blastocyst stage.\n4. Blastocyst Embryo Transfer: Gentle ultrasound-guided transfer of 1–2 top-grade blastocysts into the receptive endometrium.',
    E'• Clinic Visits: Outpatient procedure throughout; zero overnight hospital stay required.\n• Rest Period: 24–48 hours of relaxed movement post-embryo transfer before resuming light activities.\n• Pregnancy Blood Test: Beta-hCG blood draw conducted 12–14 days following embryo transfer.\n• International Flight Clearance: Safe for air travel 24–48 hours post-embryo transfer.',
    'Outpatient Treatment / 18–21 Days in India',
    '[
      {"question": "How long must couples stay in India for a full IVF-ICSI cycle?", "answer": "A standard fresh cycle requires approximately 18 to 21 days from day 2 of the menstrual cycle through ovarian stimulation, egg retrieval, fertilization, and embryo transfer. Alternatively, egg retrieval can be performed in trip 1 and frozen embryo transfer in trip 2."},
      {"question": "What is the clinical success rate of IVF-ICSI in India?", "answer": "For women under 35 utilizing blastocyst-stage transfers with PGT-A chromosomal screening, clinical cumulative pregnancy success rates reach 65% to 75% at premier accredited Indian fertility centers."}
    ]'::jsonb,
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    TRUE
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  specialty = EXCLUDED.specialty,
  category = EXCLUDED.category,
  overview = EXCLUDED.overview,
  description = EXCLUDED.description,
  indications = EXCLUDED.indications,
  process = EXCLUDED.process,
  recovery_info = EXCLUDED.recovery_info,
  estimated_duration = EXCLUDED.estimated_duration,
  faqs = EXCLUDED.faqs,
  image_url = EXCLUDED.image_url,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();


-- ============================================================================
-- 11. PHASE 6: Hospitals & Packages Policies and Seed Dataset
-- ============================================================================

ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS hospitals_public_read ON public.hospitals;
CREATE POLICY hospitals_public_read ON public.hospitals
  FOR SELECT
  USING (status = 'approved' OR public.is_admin());

DROP POLICY IF EXISTS hospitals_owner_select ON public.hospitals;
CREATE POLICY hospitals_owner_select ON public.hospitals
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

DROP POLICY IF EXISTS hospitals_owner_insert ON public.hospitals;
CREATE POLICY hospitals_owner_insert ON public.hospitals
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS hospitals_owner_update ON public.hospitals;
CREATE POLICY hospitals_owner_update ON public.hospitals
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid() OR public.is_admin())
  WITH CHECK (profile_id = auth.uid() OR public.is_admin());

ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS packages_public_read ON public.packages;
CREATE POLICY packages_public_read ON public.packages
  FOR SELECT
  USING (
    (status = 'published' AND EXISTS (
      SELECT 1 FROM public.hospitals h
      WHERE h.id = packages.hospital_id AND h.status = 'approved'
    ))
    OR public.is_admin()
  );

DROP POLICY IF EXISTS packages_hospital_manage ON public.packages;
CREATE POLICY packages_hospital_manage ON public.packages
  FOR ALL TO authenticated
  USING (
    hospital_id IN (
      SELECT id FROM public.hospitals WHERE profile_id = auth.uid()
    )
    OR public.is_admin()
  )
  WITH CHECK (
    hospital_id IN (
      SELECT id FROM public.hospitals WHERE profile_id = auth.uid()
    )
    OR public.is_admin()
  );

ALTER TABLE public.treatment_hospitals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS treatment_hospitals_public_read ON public.treatment_hospitals;
CREATE POLICY treatment_hospitals_public_read ON public.treatment_hospitals
  FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS treatment_hospitals_admin_manage ON public.treatment_hospitals;
CREATE POLICY treatment_hospitals_admin_manage ON public.treatment_hospitals
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
