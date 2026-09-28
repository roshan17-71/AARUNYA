-- ============================================================================
-- AARUNYA PHASE 7: Doctors Module & Consultation Slots RLS + Seed Dataset
-- Migration: 20260928000000_phase7_doctors_slots_rls_and_seed.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. RLS POLICIES FOR DOCTORS
-- ----------------------------------------------------------------------------
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- 1.1 Public read approved doctors (or admin)
DROP POLICY IF EXISTS doctors_public_read ON public.doctors;
CREATE POLICY doctors_public_read ON public.doctors
  FOR SELECT
  USING (status = 'approved' OR public.is_admin());

-- 1.2 Doctor owner can select their own doctor row regardless of status
DROP POLICY IF EXISTS doctors_owner_select ON public.doctors;
CREATE POLICY doctors_owner_select ON public.doctors
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

-- 1.3 Doctor owner can insert their own doctor row during onboarding
DROP POLICY IF EXISTS doctors_owner_insert ON public.doctors;
CREATE POLICY doctors_owner_insert ON public.doctors
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- 1.4 Doctor owner can update their own doctor row (admin can update all)
DROP POLICY IF EXISTS doctors_owner_update ON public.doctors;
CREATE POLICY doctors_owner_update ON public.doctors
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid() OR public.is_admin())
  WITH CHECK (profile_id = auth.uid() OR public.is_admin());

-- ----------------------------------------------------------------------------
-- 2. RLS POLICIES FOR CONSULTATION_SLOTS
-- ----------------------------------------------------------------------------
ALTER TABLE public.consultation_slots ENABLE ROW LEVEL SECURITY;

-- 2.1 Public read available (unbooked) slots of approved doctors
DROP POLICY IF EXISTS consultation_slots_public_read ON public.consultation_slots;
CREATE POLICY consultation_slots_public_read ON public.consultation_slots
  FOR SELECT
  USING (
    (is_booked = FALSE AND EXISTS (
      SELECT 1 FROM public.doctors d
      WHERE d.id = consultation_slots.doctor_id AND d.status = 'approved'
    ))
    OR public.is_admin()
  );

-- 2.2 Doctor owners can manage (select, insert, update, delete) their own slots
DROP POLICY IF EXISTS consultation_slots_doctor_manage ON public.consultation_slots;
CREATE POLICY consultation_slots_doctor_manage ON public.consultation_slots
  FOR ALL TO authenticated
  USING (
    doctor_id IN (
      SELECT id FROM public.doctors WHERE profile_id = auth.uid()
    )
    OR public.is_admin()
  )
  WITH CHECK (
    doctor_id IN (
      SELECT id FROM public.doctors WHERE profile_id = auth.uid()
    )
    OR public.is_admin()
  );

-- ----------------------------------------------------------------------------
-- 3. SEED DATA: 8 ACCREDITED MEDICAL SPECIALISTS
-- ----------------------------------------------------------------------------

INSERT INTO public.doctors (
  id,
  full_name,
  specialty,
  specialties,
  bio,
  qualifications,
  experience_years,
  languages,
  city,
  country,
  hospital_id,
  consultation_fee,
  consultation_duration_minutes,
  video_consultation_enabled,
  profile_image_url,
  status,
  is_demo
)
VALUES
  (
    'd0000000-0000-0000-0000-000000000001',
    'Dr. Naresh Trehan',
    'Cardiothoracic Surgery',
    ARRAY['Cardiothoracic Surgery', 'Cardiology', 'Robotic Cardiac Surgery', 'Off-Pump CABG', 'Aortic Surgery'],
    'Dr. Naresh Trehan is a world-renowned cardiovascular and cardiothoracic surgeon, awarded the Padma Bhushan and Padma Shri by the Government of India. Over four decades of pioneering cardiac surgery, he has personally performed over 50,000 open-heart operations, including complex beating-heart CABG and transcatheter valve repairs.',
    'MBBS (K.G.M.C), Diplomat American Board of Surgery, Diplomat American Board of Cardiothoracic Surgery (USA)',
    44,
    ARRAY['English', 'Hindi', 'Punjabi'],
    'Gurugram',
    'India',
    'a0000000-0000-0000-0000-000000000003', -- Medanta
    100,
    30,
    TRUE,
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    'approved',
    TRUE
  ),
  (
    'd0000000-0000-0000-0000-000000000002',
    'Dr. Ashok Seth',
    'Interventional Cardiology',
    ARRAY['Interventional Cardiology', 'Cardiology', 'TAVI / TAVR', 'Coronary Angioplasty', 'Structural Heart Disease'],
    'Dr. Ashok Seth is one of the most celebrated interventional cardiologists in Asia, having pioneered transcatheter aortic valve implantation (TAVI/TAVR) and bioabsorbable vascular stents in India. Awarded Padma Bhushan, he has contributed over 350 international clinical papers on structural heart diseases.',
    'MBBS, MD, FRCP (London, Edinburgh), FACC, FSCAI (USA)',
    38,
    ARRAY['English', 'Hindi'],
    'Gurugram',
    'India',
    'a0000000-0000-0000-0000-000000000002', -- FMRI
    80,
    30,
    TRUE,
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    'approved',
    TRUE
  ),
  (
    'd0000000-0000-0000-0000-000000000003',
    'Dr. S. K. S. Marya',
    'Orthopedics & Joint Reconstruction',
    ARRAY['Orthopedics', 'Robotic Knee Replacement', 'Total Hip Arthroplasty', 'Revision Joint Surgery'],
    'Dr. Sanjiv K. S. Marya has conducted more than 20,000 joint replacement surgeries during his 35-year career. A pioneer in bilateral simultaneous knee replacements and computer-navigated robotic arthroplasty, he has trained hundreds of international fellows.',
    'MBBS, MS (Orthopedics), DNB, MCh (Orthopedics - Liverpool, UK), FRCS (England)',
    36,
    ARRAY['English', 'Hindi'],
    'New Delhi',
    'India',
    'a0000000-0000-0000-0000-000000000004', -- Max Saket
    70,
    30,
    TRUE,
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    'approved',
    TRUE
  ),
  (
    'd0000000-0000-0000-0000-000000000004',
    'Dr. Sandeep Vaishya',
    'Neurosurgery & Spine Surgery',
    ARRAY['Neurology & Neurosurgery', 'Spine Surgery', 'Deep Brain Stimulation (DBS)', 'Minimally Invasive Spine', 'CyberKnife'],
    'Dr. Sandeep Vaishya is an internationally recognized neurosurgeon specializing in minimally invasive brain and spine surgery, Deep Brain Stimulation (DBS) for movement disorders, and CyberKnife radiosurgery. Former faculty at AIIMS New Delhi with extensive fellowship experience in the USA.',
    'MBBS, MS (General Surgery), MCh (Neurosurgery - AIIMS), Herbert Krause Medalist',
    31,
    ARRAY['English', 'Hindi'],
    'Gurugram',
    'India',
    'a0000000-0000-0000-0000-000000000002', -- FMRI
    75,
    30,
    TRUE,
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
    'approved',
    TRUE
  ),
  (
    'd0000000-0000-0000-0000-000000000005',
    'Dr. Subhash Gupta',
    'Organ Transplant & Hepato-Pancreato-Biliary',
    ARRAY['Organ Transplant', 'Liver Transplant', 'Hepato-Pancreato-Biliary Surgery', 'Gastroenterology'],
    'Dr. Subhash Gupta is a pioneer of living-donor liver transplantation in the Indian subcontinent. With a track record exceeding 3,000 successful liver transplantations, he is globally renowned for microsurgical vascular anastomosis and pediatric liver transplants.',
    'MBBS, MS (General Surgery - AIIMS), Fellowship in Liver Surgery (Queen Elizabeth Hospital, Birmingham, UK)',
    34,
    ARRAY['English', 'Hindi'],
    'New Delhi',
    'India',
    'a0000000-0000-0000-0000-000000000004', -- Max Saket
    90,
    45,
    TRUE,
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    'approved',
    TRUE
  ),
  (
    'd0000000-0000-0000-0000-000000000006',
    'Dr. Vinod Raina',
    'Medical Oncology & Hematology',
    ARRAY['Oncology', 'Hematology', 'Bone Marrow Transplant', 'Solid Tumors', 'Breast Cancer'],
    'Dr. Vinod Raina is one of India''s foremost medical oncologists, having performed the first high-dose chemotherapy and autologous peripheral blood stem cell transplant in India at AIIMS New Delhi. Specialist in breast, lung, and gastrointestinal cancers.',
    'MBBS, MD (Medicine), MRCP (UK), FRCP (Edinburgh, London), Former Professor AIIMS',
    39,
    ARRAY['English', 'Hindi', 'Kashmiri'],
    'Gurugram',
    'India',
    'a0000000-0000-0000-0000-000000000002', -- FMRI
    70,
    30,
    TRUE,
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    'approved',
    TRUE
  ),
  (
    'd0000000-0000-0000-0000-000000000007',
    'Dr. Hrishikesh Pai',
    'Infertility & Reproductive Medicine',
    ARRAY['Infertility & Reproductive Medicine', 'Assisted Reproductive Technology', 'IVF-ICSI', 'Reproductive Endocrinology'],
    'Dr. Hrishikesh Pai is a pioneer of assisted reproduction in India with 32+ years of experience in IVF and clinical embryology. Past President of the Federation of Obstetric and Gynaecological Societies of India (FOGSI) and pioneer of Laser Assisted Hatching and PGT-A screening.',
    'MBBS, MD, FCPS, FICOG, MSc in Clinical Embryology (University of Graz, Austria)',
    32,
    ARRAY['English', 'Hindi', 'Marathi'],
    'Gurugram',
    'India',
    'a0000000-0000-0000-0000-000000000006', -- Artemis
    60,
    30,
    TRUE,
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    'approved',
    TRUE
  ),
  (
    'd0000000-0000-0000-0000-000000000008',
    'Dr. Y. K. Mishra',
    'Cardiothoracic Surgery',
    ARRAY['Cardiothoracic Surgery', 'Cardiology', 'Minimally Invasive Cardiac Surgery (MICS)', 'Valve Repair'],
    'Dr. Y. K. Mishra is an eminent cardiac surgeon with over 14,000 successful open heart operations to his credit. He specializes in minimally invasive cardiac surgery, aortic root reconstructions, and ventricular assist device implantations.',
    'MBBS, MS (Surgery), PhD in Cardiovascular Surgery (Bakulev Institute, Moscow)',
    37,
    ARRAY['English', 'Hindi', 'Russian'],
    'Bengaluru',
    'India',
    'a0000000-0000-0000-0000-000000000005', -- Manipal Bengaluru
    75,
    30,
    TRUE,
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    'approved',
    TRUE
  )
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  specialty = EXCLUDED.specialty,
  specialties = EXCLUDED.specialties,
  bio = EXCLUDED.bio,
  qualifications = EXCLUDED.qualifications,
  experience_years = EXCLUDED.experience_years,
  languages = EXCLUDED.languages,
  city = EXCLUDED.city,
  country = EXCLUDED.country,
  hospital_id = EXCLUDED.hospital_id,
  consultation_fee = EXCLUDED.consultation_fee,
  consultation_duration_minutes = EXCLUDED.consultation_duration_minutes,
  video_consultation_enabled = EXCLUDED.video_consultation_enabled,
  profile_image_url = EXCLUDED.profile_image_url,
  status = EXCLUDED.status,
  updated_at = NOW();

-- ----------------------------------------------------------------------------
-- 4. SEED DATA: UPCOMING CONSULTATION SLOTS
-- ----------------------------------------------------------------------------

-- Add sample availability slots for each doctor starting from tomorrow
INSERT INTO public.consultation_slots (doctor_id, start_time, end_time, is_booked)
SELECT
  d.id,
  (NOW() + (s.day_offset || ' days')::interval + (s.hour_offset || ' hours')::interval),
  (NOW() + (s.day_offset || ' days')::interval + (s.hour_offset || ' hours')::interval + '30 minutes'::interval),
  FALSE
FROM public.doctors d
CROSS JOIN (
  VALUES
    (1, 10),
    (1, 11),
    (2, 14),
    (3, 10),
    (3, 15),
    (5, 11)
) AS s(day_offset, hour_offset)
WHERE d.status = 'approved' AND d.video_consultation_enabled = TRUE
ON CONFLICT DO NOTHING;

