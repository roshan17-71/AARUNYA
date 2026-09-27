-- ============================================================================
-- AARUNYA PHASE 6: Hospitals Module & Packages RLS + Seed Dataset
-- Migration: 20260927000002_phase6_hospitals_packages_rls_and_seed.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. RLS POLICIES FOR HOSPITALS
-- ----------------------------------------------------------------------------
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;

-- 1.1 Public read approved hospitals (or admin)
DROP POLICY IF EXISTS hospitals_public_read ON public.hospitals;
CREATE POLICY hospitals_public_read ON public.hospitals
  FOR SELECT
  USING (status = 'approved' OR public.is_admin());

-- 1.2 Hospital owner can select their own hospital row regardless of status
DROP POLICY IF EXISTS hospitals_owner_select ON public.hospitals;
CREATE POLICY hospitals_owner_select ON public.hospitals
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

-- 1.3 Hospital owner can insert their own hospital row during onboarding
DROP POLICY IF EXISTS hospitals_owner_insert ON public.hospitals;
CREATE POLICY hospitals_owner_insert ON public.hospitals
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- 1.4 Hospital owner can update their own hospital row (admin can update all)
DROP POLICY IF EXISTS hospitals_owner_update ON public.hospitals;
CREATE POLICY hospitals_owner_update ON public.hospitals
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid() OR public.is_admin())
  WITH CHECK (profile_id = auth.uid() OR public.is_admin());

-- ----------------------------------------------------------------------------
-- 2. RLS POLICIES FOR PACKAGES
-- ----------------------------------------------------------------------------
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- 2.1 Public read published packages belonging to approved hospitals
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

-- 2.2 Hospital owners can manage (select, insert, update, delete) their own packages
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

-- ----------------------------------------------------------------------------
-- 3. RLS POLICIES FOR TREATMENT_HOSPITALS
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- 4. STORAGE POLICIES (public-media bucket)
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-media', 'public-media', TRUE)
ON CONFLICT (id) DO UPDATE SET public = TRUE;

DROP POLICY IF EXISTS "Public media read access" ON storage.objects;
CREATE POLICY "Public media read access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'public-media');

DROP POLICY IF EXISTS "Authenticated users upload media" ON storage.objects;
CREATE POLICY "Authenticated users upload media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'public-media');

-- ----------------------------------------------------------------------------
-- 5. SEED DATA: 6 ACCREDITED PREMIER HOSPITALS
-- ----------------------------------------------------------------------------

INSERT INTO public.hospitals (
  id,
  name,
  slug,
  city,
  country,
  description,
  specialties,
  accreditations,
  facilities,
  international_patient_services,
  images,
  status,
  is_demo
)
VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    'Apollo Hospitals, Greams Road',
    'apollo-hospitals-chennai',
    'Chennai',
    'India',
    'Apollo Hospitals Chennai is the flagship hospital of the Apollo Group, globally renowned as a pioneer of modern healthcare in India. Accredited by JCI and NABH, the 600-bed facility features robotic surgical suites, cutting-edge organ transplant programs, and over 60 clinical departments staffed by internationally renowned medical specialists.',
    ARRAY['Cardiology', 'Orthopedics', 'Oncology', 'Organ Transplant', 'Neurology & Neurosurgery', 'Nephrology', 'Robotic Surgery'],
    ARRAY['JCI', 'NABH', 'NABL'],
    ARRAY['600 Inpatient Beds', 'Robotic Surgery Suites (Da Vinci Xi)', 'Advanced 3T Digital MRI & Dual-Source CT', 'Dedicated Bone Marrow Cleanrooms', '24/7 Level-1 Emergency & Trauma Care'],
    ARRAY['Medical Visa Invitation Letters', 'Dedicated Multilingual Lounge', 'Airport Ambulance Pickup & Transfers', 'In-house Currency Exchange', 'Arabic, Russian & French Translators', 'Post-Discharge Teleconsultation'],
    ARRAY[
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80'
    ],
    'approved',
    TRUE
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    'Fortis Memorial Research Institute (FMRI)',
    'fortis-memorial-research-institute-gurugram',
    'Gurugram',
    'India',
    'Fortis Memorial Research Institute (FMRI) in Gurugram (Delhi NCR) is a multi-super-speciality, quaternary care hospital recognized among the world''s most technologically advanced medical institutions. Featuring the CyberKnife VSI robotic radiosurgery system, dual-room intraoperative MRI, and robotic cardiac OTs.',
    ARRAY['Oncology', 'Cardiology', 'Neurology & Neurosurgery', 'Spine Surgery', 'Bone Marrow Transplant', 'Orthopedics'],
    ARRAY['JCI', 'NABH', 'NABL'],
    ARRAY['1000 Beds Capacity', 'CyberKnife Robotic Radiosurgery', 'Brain Suite Intra-operative CT & MRI', '4K Ultra-HD Robotic Operating Theatres', 'Comprehensive Stem Cell Processing Lab'],
    ARRAY['Personalized International Concierge', 'Complimentary High-Speed Wi-Fi & Lounge', 'Airport VIP Meet & Greet', 'Local SIM Card & Currency Exchange', 'Custom Dietary & Halal Food Options'],
    ARRAY[
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80'
    ],
    'approved',
    TRUE
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    'Medanta - The Medicity',
    'medanta-the-medicity-gurugram',
    'Gurugram',
    'India',
    'Spanning 43 acres in Gurugram, Medanta The Medicity was founded by world-renowned cardiac surgeon Dr. Naresh Trehan. Housing over 1,250 beds, 37 operation theaters, and 6 specialized institutes, Medanta performs thousands of complex beating-heart CABG, living-donor liver transplants, and robotic joint reconstructions each year.',
    ARRAY['Cardiology', 'Organ Transplant', 'Orthopedics', 'Neurology & Neurosurgery', 'Urology', 'Liver Transplant'],
    ARRAY['JCI', 'NABH', 'NABL'],
    ARRAY['1250+ Inpatient Beds', '37 Modular Operation Theatres', 'Flying Doctors India Air Ambulance', 'Artis Zeego Hybrid Cath Lab', 'Robotic Da Vinci Surgical Systems'],
    ARRAY['Dedicated International Patient Tower', 'Multi-Language Interpreter Services', 'Airport Transfer Fleet', 'Foreign Exchange Counter', 'Hotel & Guest House Booking Assistance'],
    ARRAY[
      'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80'
    ],
    'approved',
    TRUE
  ),
  (
    'a0000000-0000-0000-0000-000000000004',
    'Max Super Speciality Hospital, Saket',
    'max-super-speciality-hospital-saket',
    'New Delhi',
    'India',
    'Max Super Speciality Hospital in Saket, South Delhi, is a prestigious 530+ bed quaternary care facility accredited by JCI and NABH. Celebrated for its comprehensive cancer care center, neurosciences department, minimally invasive spine surgery, and bone marrow transplantation.',
    ARRAY['Oncology', 'Cardiology', 'Neurology & Neurosurgery', 'Spine Surgery', 'Organ Transplant', 'Bariatric Surgery'],
    ARRAY['JCI', 'NABH', 'NABL'],
    ARRAY['530+ Beds', 'TrueBeam Novalis Tx Linear Accelerator', 'Bi-Plane Digital Cath Lab', 'Next-Generation NextSeq Gene Sequencer', 'Dedicated Paediatric Intensive Care Unit (PICU)'],
    ARRAY['International Relationship Managers', 'Medical Visa Expedited Documentation', 'Airport Ambulance & Sedan Pick-up', 'International Cuisine & Halal Certification', 'Telehealth Follow-up Sessions'],
    ARRAY[
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80'
    ],
    'approved',
    TRUE
  ),
  (
    'a0000000-0000-0000-0000-000000000005',
    'Manipal Hospital, HAL Airport Road',
    'manipal-hospital-bengaluru',
    'Bengaluru',
    'India',
    'Located in India''s Silicon Valley, Manipal Hospital Bengaluru is a premier 600-bed tertiary institution known for clinical precision, pediatric cardiology, robotic joint replacement, and living-donor organ transplants. Pioneers in medical tourism in Southern India for over 30 years.',
    ARRAY['Cardiology', 'Orthopedics', 'Infertility & Reproductive Medicine', 'Organ Transplant', 'Gastroenterology', 'Spine Surgery'],
    ARRAY['NABH', 'NABL', 'ISO 9001'],
    ARRAY['600 Beds', 'Mako Robotic Knee Arthroplasty', 'Comprehensive Embryology IVF Cleanroom', 'Advanced Neonatal ICU (Level 3 NICU)', 'Cardiac Catheterization Laboratory'],
    ARRAY['Bengaluru International Airport Meet & Assist', 'Foreign Currency Services', 'Medical Visa Coordination', 'Language Interpreters (Arabic, Russian, Swahili)', 'Long-Stay Serviced Apartments Nearby'],
    ARRAY[
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1200&q=80'
    ],
    'approved',
    TRUE
  ),
  (
    'a0000000-0000-0000-0000-000000000006',
    'Artemis Hospital, Gurugram',
    'artemis-hospital-gurugram',
    'Gurugram',
    'India',
    'Artemis Hospital was the first hospital in Gurugram and Delhi NCR to receive JCI and NABH accreditations within 3 years of inception. Spanning a 400-bed modern medical campus, Artemis is widely acclaimed for functional neurosurgery (DBS), advanced pediatric oncology, and complex cardiovascular surgery.',
    ARRAY['Neurology & Neurosurgery', 'Cardiology', 'Oncology', 'Orthopedics', 'Infertility & Reproductive Medicine'],
    ARRAY['JCI', 'NABH'],
    ARRAY['400 Inpatient Beds', 'Intra-Operative MRI & Navigation System', 'Robotic Joint Reconstruction Lab', 'Endoscopic Spine Surgery Suites', 'Advanced Infertility & IVF Laboratory'],
    ARRAY['Dedicated Overseas Patient Helpdesk', 'Delhi Airport Pick-up & Drop', 'Medical Visa Support Letters', 'Prayer Rooms & Halal Dietary Choices', 'Multilingual Coordinators'],
    ARRAY[
      'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80'
    ],
    'approved',
    TRUE
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  country = EXCLUDED.country,
  description = EXCLUDED.description,
  specialties = EXCLUDED.specialties,
  accreditations = EXCLUDED.accreditations,
  facilities = EXCLUDED.facilities,
  international_patient_services = EXCLUDED.international_patient_services,
  images = EXCLUDED.images,
  status = EXCLUDED.status,
  updated_at = NOW();

-- ----------------------------------------------------------------------------
-- 6. SEED DATA: MEDICAL & HEALTH CHECKUP PACKAGES
-- ----------------------------------------------------------------------------

INSERT INTO public.packages (
  hospital_id,
  name,
  slug,
  category,
  description,
  included_services,
  estimated_price,
  currency,
  duration,
  eligibility_info,
  status,
  is_demo
)
VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    'Apollo Executive Full-Body Health Checkup',
    'apollo-executive-full-body-health-checkup',
    'Preventive Health',
    'A comprehensive, whole-body diagnostic and preventive screening designed for international executives, identifying early cardiovascular, metabolic, and oncological markers.',
    ARRAY[
      'Complete Hemogram & ESR',
      '2D Echocardiogram & Color Doppler',
      'TMT (Treadmill Stress Test)',
      'Ultrasound Abdomen & Pelvis',
      'High-Resolution Chest X-Ray',
      'Lipid Profile & Liver Function Tests',
      'HbA1c & Fasting Blood Sugar',
      'Senior Physician & Cardiologist Consultation'
    ],
    450,
    'USD',
    '1 Day',
    '10–12 hours overnight fasting mandatory. Ideal for adults aged 30+.',
    'published',
    TRUE
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    'FMRI CyberKnife Precision Oncology Evaluation',
    'fmri-cyberknife-precision-oncology-evaluation',
    'Oncology',
    'Multi-disciplinary tumor board review and high-resolution radiomic simulation for stereotactic radiosurgery (SRS/SBRT) candidacy.',
    ARRAY[
      'High-Field 3T Brain / Body MRI',
      'CT Simulation Scan with Immobilization',
      'Multi-Criteria Dosimetry Physics Planning',
      'Multidisciplinary Tumor Board Clinical Review',
      'Senior Radiation Oncologist In-Person Consultation'
    ],
    850,
    'USD',
    '2 Days',
    'Please bring all prior histology biopsy reports, IHC slides, and PET-CT scan discs.',
    'published',
    TRUE
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    'Medanta Advanced Robotic Knee Arthroplasty Package',
    'medanta-advanced-robotic-knee-arthroplasty-package',
    'Orthopedics',
    'All-inclusive bundled robotic total knee reconstruction package with sub-millimeter Mako robotic navigation, premium FDA-approved prosthesis, and in-hospital rehabilitation.',
    ARRAY[
      'Pre-Op 3D CT Virtual Kinematic Modeling',
      'Robotic Arm-Assisted Total Knee Surgery',
      'FDA-Approved Cobalt-Chromium Implant',
      '4 Days Inpatient Private Room Stay',
      'Daily Physiotherapy & Mobilization Sessions',
      'Post-Op X-rays & Fit-to-Fly Medical Certification'
    ],
    5500,
    'USD',
    '4–5 Days Inpatient',
    'Indicated for end-stage knee osteoarthritis. Blood clearance required.',
    'published',
    TRUE
  ),
  (
    'a0000000-0000-0000-0000-000000000004',
    'Max Comprehensive Cardiac Diagnostic Package',
    'max-comprehensive-cardiac-diagnostic-package',
    'Cardiology',
    'Intensive cardiovascular diagnostic workup including coronary CT angiography and invasive angiography if clinically recommended.',
    ARRAY[
      '2D-Echo with Strain Imaging',
      '640-Slice Coronary CT Angiography',
      'High-Sensitivity Troponin-T & Lipid Subfractions',
      'Carotid Doppler Ultrasound',
      'Chief Interventional Cardiologist Evaluation'
    ],
    650,
    'USD',
    '1–2 Days',
    'Overnight fasting. Creatinine blood test required before contrast CT.',
    'published',
    TRUE
  ),
  (
    'a0000000-0000-0000-0000-000000000005',
    'Manipal Advanced IVF-ICSI Conception Package',
    'manipal-advanced-ivf-icsi-conception-package',
    'Infertility & Reproductive Medicine',
    'Complete Assisted Reproductive Technology cycle including ovarian stimulation monitoring, ultrasound-guided egg retrieval, micro-ICSI fertilization, and blastocyst transfer.',
    ARRAY[
      'Transvaginal Ultrasound Folliculometry Monitoring',
      'Ovum Pick-Up (OPU) under General Sedation',
      'Intracytoplasmic Sperm Injection (ICSI)',
      'Blastocyst Stage Embryo Incubation',
      'Ultrasound-Guided Embryo Transfer',
      'Embryology Specialist & Fertility Consultation'
    ],
    3200,
    'USD',
    '18–21 Days in India',
    'Initiated on Day 2 of the female partner menstrual cycle.',
    'published',
    TRUE
  ),
  (
    'a0000000-0000-0000-0000-000000000006',
    'Artemis Functional Neurosurgery & DBS Assessment',
    'artemis-functional-neurosurgery-dbs-assessment',
    'Neurology & Neurosurgery',
    'Pre-surgical multidisciplinary candidate evaluation for Deep Brain Stimulation in patients with Parkinson''s Disease, Tremors, or Dystonia.',
    ARRAY[
      'High-Field 3T Brain MRI Volumetric Protocol',
      'UPDRS Motor Score Testing (ON vs OFF Levodopa)',
      'Neuro-Psychological & Cognitive Assessment',
      'Senior Functional Neurosurgeon & Movement Disorder Specialist Review'
    ],
    950,
    'USD',
    '2–3 Days',
    'Must be accompanied by family attendant. Current anti-Parkinson medication list required.',
    'published',
    TRUE
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  included_services = EXCLUDED.included_services,
  estimated_price = EXCLUDED.estimated_price,
  currency = EXCLUDED.currency,
  duration = EXCLUDED.duration,
  eligibility_info = EXCLUDED.eligibility_info,
  status = EXCLUDED.status,
  updated_at = NOW();

-- ----------------------------------------------------------------------------
-- 7. LINK HOSPITALS TO PHASE 5 TREATMENTS (treatment_hospitals)
-- ----------------------------------------------------------------------------

-- Connect treatments with accredited hospitals
DO $$
DECLARE
  v_cabg UUID;
  v_tavi UUID;
  v_knee UUID;
  v_hip UUID;
  v_cyberknife UUID;
  v_bmt UUID;
  v_liver UUID;
  v_dbs UUID;
  v_miss UUID;
  v_ivf UUID;

  v_apollo UUID := 'a0000000-0000-0000-0000-000000000001';
  v_fortis UUID := 'a0000000-0000-0000-0000-000000000002';
  v_medanta UUID := 'a0000000-0000-0000-0000-000000000003';
  v_max UUID := 'a0000000-0000-0000-0000-000000000004';
  v_manipal UUID := 'a0000000-0000-0000-0000-000000000005';
  v_artemis UUID := 'a0000000-0000-0000-0000-000000000006';
BEGIN
  SELECT id INTO v_cabg FROM public.treatments WHERE slug = 'coronary-artery-bypass-graft-cabg';
  SELECT id INTO v_tavi FROM public.treatments WHERE slug = 'transcatheter-aortic-valve-implantation-tavi';
  SELECT id INTO v_knee FROM public.treatments WHERE slug = 'robotic-total-knee-replacement';
  SELECT id INTO v_hip FROM public.treatments WHERE slug = 'total-hip-arthroplasty';
  SELECT id INTO v_cyberknife FROM public.treatments WHERE slug = 'cyberknife-robotic-radiosurgery';
  SELECT id INTO v_bmt FROM public.treatments WHERE slug = 'allogeneic-bone-marrow-transplant';
  SELECT id INTO v_liver FROM public.treatments WHERE slug = 'living-donor-liver-transplantation';
  SELECT id INTO v_dbs FROM public.treatments WHERE slug = 'deep-brain-stimulation-dbs';
  SELECT id INTO v_miss FROM public.treatments WHERE slug = 'minimally-invasive-spine-surgery-miss';
  SELECT id INTO v_ivf FROM public.treatments WHERE slug = 'ivf-with-icsi-treatment';

  -- Apollo Hospital links
  IF v_cabg IS NOT NULL THEN
    INSERT INTO public.treatment_hospitals (treatment_id, hospital_id) VALUES (v_cabg, v_apollo) ON CONFLICT DO NOTHING;
  END IF;
  IF v_tavi IS NOT NULL THEN
    INSERT INTO public.treatment_hospitals (treatment_id, hospital_id) VALUES (v_tavi, v_apollo) ON CONFLICT DO NOTHING;
  END IF;
  IF v_liver IS NOT NULL THEN
    INSERT INTO public.treatment_hospitals (treatment_id, hospital_id) VALUES (v_liver, v_apollo) ON CONFLICT DO NOTHING;
  END IF;
  IF v_bmt IS NOT NULL THEN
    INSERT INTO public.treatment_hospitals (treatment_id, hospital_id) VALUES (v_bmt, v_apollo) ON CONFLICT DO NOTHING;
  END IF;

  -- Fortis Memorial links
  IF v_cyberknife IS NOT NULL THEN
    INSERT INTO public.treatment_hospitals (treatment_id, hospital_id) VALUES (v_cyberknife, v_fortis) ON CONFLICT DO NOTHING;
  END IF;
  IF v_bmt IS NOT NULL THEN
    INSERT INTO public.treatment_hospitals (treatment_id, hospital_id) VALUES (v_bmt, v_fortis) ON CONFLICT DO NOTHING;
  END IF;
  IF v_dbs IS NOT NULL THEN
    INSERT INTO public.treatment_hospitals (treatment_id, hospital_id) VALUES (v_dbs, v_fortis) ON CONFLICT DO NOTHING;
  END IF;

  -- Medanta links
  IF v_cabg IS NOT NULL THEN
    INSERT INTO public.treatment_hospitals (treatment_id, hospital_id) VALUES (v_cabg, v_medanta) ON CONFLICT DO NOTHING;
  END IF;
  IF v_knee IS NOT NULL THEN
    INSERT INTO public.treatment_hospitals (treatment_id, hospital_id) VALUES (v_knee, v_medanta) ON CONFLICT DO NOTHING;
  END IF;
  IF v_liver IS NOT NULL THEN
    INSERT INTO public.treatment_hospitals (treatment_id, hospital_id) VALUES (v_liver, v_medanta) ON CONFLICT DO NOTHING;
  END IF;

  -- Max Saket links
  IF v_cyberknife IS NOT NULL THEN
    INSERT INTO public.treatment_hospitals (treatment_id, hospital_id) VALUES (v_cyberknife, v_max) ON CONFLICT DO NOTHING;
  END IF;
  IF v_miss IS NOT NULL THEN
    INSERT INTO public.treatment_hospitals (treatment_id, hospital_id) VALUES (v_miss, v_max) ON CONFLICT DO NOTHING;
  END IF;
  IF v_tavi IS NOT NULL THEN
    INSERT INTO public.treatment_hospitals (treatment_id, hospital_id) VALUES (v_tavi, v_max) ON CONFLICT DO NOTHING;
  END IF;

  -- Manipal Hospital links
  IF v_knee IS NOT NULL THEN
    INSERT INTO public.treatment_hospitals (treatment_id, hospital_id) VALUES (v_knee, v_manipal) ON CONFLICT DO NOTHING;
  END IF;
  IF v_hip IS NOT NULL THEN
    INSERT INTO public.treatment_hospitals (treatment_id, hospital_id) VALUES (v_hip, v_manipal) ON CONFLICT DO NOTHING;
  END IF;
  IF v_ivf IS NOT NULL THEN
    INSERT INTO public.treatment_hospitals (treatment_id, hospital_id) VALUES (v_ivf, v_manipal) ON CONFLICT DO NOTHING;
  END IF;

  -- Artemis links
  IF v_dbs IS NOT NULL THEN
    INSERT INTO public.treatment_hospitals (treatment_id, hospital_id) VALUES (v_dbs, v_artemis) ON CONFLICT DO NOTHING;
  END IF;
  IF v_miss IS NOT NULL THEN
    INSERT INTO public.treatment_hospitals (treatment_id, hospital_id) VALUES (v_miss, v_artemis) ON CONFLICT DO NOTHING;
  END IF;
  IF v_ivf IS NOT NULL THEN
    INSERT INTO public.treatment_hospitals (treatment_id, hospital_id) VALUES (v_ivf, v_artemis) ON CONFLICT DO NOTHING;
  END IF;

END $$;

