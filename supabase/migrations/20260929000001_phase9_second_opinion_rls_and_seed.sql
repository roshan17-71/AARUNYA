-- ==============================================================================
-- PHASE 9 MIGRATION: SECOND MEDICAL OPINION SERVICES, RLS, AND STORAGE POLICIES
-- ==============================================================================

-- 1. SEED 4 SERVICE TIERS INTO second_opinion_services
INSERT INTO public.second_opinion_services (
  name,
  slug,
  description,
  indicative_price
)
VALUES
  (
    'Clinical Review (Basic)',
    'clinical-review',
    'Independent clinical evaluation of primary diagnosis, current symptom profile, and drug regimen by an accredited Indian super-specialist. Deliverable includes an advisory clinical report and pharmacological suggestions within 48–72 hours.',
    99.00
  ),
  (
    'Medical Record & Radiology Review',
    'medical-record-review',
    'In-depth clinical appraisal of your complete medical history combined with expert secondary radiological interpretation (MRI, CT, PET, Ultrasound) and laboratory pathology reviews. Includes treatment alternatives and surgical indications.',
    199.00
  ),
  (
    'Comprehensive Review + Video Consultation',
    'review-video-consultation',
    'Complete diagnostic record and imaging re-assessment coupled with a dedicated 30-minute direct live teleconsultation with a leading super-specialist. Includes pre-consultation notes and post-session priority action plan.',
    349.00
  ),
  (
    'Multidisciplinary Tumor & Case Board Review',
    'multidisciplinary-case-review',
    'Joint multidisciplinary review by a specialized panel of senior clinicians (Surgical Specialist, Medical Oncologist/Physician, Radiologist, and Pathologist). Delivers a formal consensus panel assessment for complex or high-risk cases.',
    599.00
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  indicative_price = EXCLUDED.indicative_price;

-- 2. RLS POLICIES FOR second_opinion_services
DROP POLICY IF EXISTS second_opinion_services_public_read ON public.second_opinion_services;
CREATE POLICY second_opinion_services_public_read ON public.second_opinion_services
  FOR SELECT
  USING (TRUE);

-- 3. RLS POLICIES FOR second_opinion_requests
-- Patient: SELECT own rows
DROP POLICY IF EXISTS second_opinion_requests_patient_select ON public.second_opinion_requests;
CREATE POLICY second_opinion_requests_patient_select ON public.second_opinion_requests
  FOR SELECT TO authenticated
  USING (patient_id = auth.uid() OR public.is_admin());

-- Patient: INSERT own rows
DROP POLICY IF EXISTS second_opinion_requests_patient_insert ON public.second_opinion_requests;
CREATE POLICY second_opinion_requests_patient_insert ON public.second_opinion_requests
  FOR INSERT TO authenticated
  WITH CHECK (patient_id = auth.uid() OR public.is_admin());

-- Assigned Doctor: SELECT assigned requests
DROP POLICY IF EXISTS second_opinion_requests_doctor_select ON public.second_opinion_requests;
CREATE POLICY second_opinion_requests_doctor_select ON public.second_opinion_requests
  FOR SELECT TO authenticated
  USING (
    assigned_doctor_id IN (
      SELECT id FROM public.doctors WHERE profile_id = auth.uid()
    )
  );

-- Assigned Doctor: UPDATE assigned requests (e.g. status progression)
DROP POLICY IF EXISTS second_opinion_requests_doctor_update ON public.second_opinion_requests;
CREATE POLICY second_opinion_requests_doctor_update ON public.second_opinion_requests
  FOR UPDATE TO authenticated
  USING (
    assigned_doctor_id IN (
      SELECT id FROM public.doctors WHERE profile_id = auth.uid()
    )
  )
  WITH CHECK (
    assigned_doctor_id IN (
      SELECT id FROM public.doctors WHERE profile_id = auth.uid()
    )
  );

-- Admin: ALL
DROP POLICY IF EXISTS second_opinion_requests_admin_all ON public.second_opinion_requests;
CREATE POLICY second_opinion_requests_admin_all ON public.second_opinion_requests
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. RLS POLICIES FOR medical_documents
-- Patient: SELECT own documents
DROP POLICY IF EXISTS medical_documents_patient_select ON public.medical_documents;
CREATE POLICY medical_documents_patient_select ON public.medical_documents
  FOR SELECT TO authenticated
  USING (patient_id = auth.uid() OR public.is_admin());

-- Patient: INSERT own documents
DROP POLICY IF EXISTS medical_documents_patient_insert ON public.medical_documents;
CREATE POLICY medical_documents_patient_insert ON public.medical_documents
  FOR INSERT TO authenticated
  WITH CHECK (patient_id = auth.uid() OR public.is_admin());

-- Assigned Doctor: SELECT documents linked to their assigned second opinion requests
DROP POLICY IF EXISTS medical_documents_doctor_select ON public.medical_documents;
CREATE POLICY medical_documents_doctor_select ON public.medical_documents
  FOR SELECT TO authenticated
  USING (
    related_request_type = 'second_opinion' AND
    related_request_id IN (
      SELECT id FROM public.second_opinion_requests
      WHERE assigned_doctor_id IN (
        SELECT id FROM public.doctors WHERE profile_id = auth.uid()
      )
    )
  );

-- Admin: ALL
DROP POLICY IF EXISTS medical_documents_admin_all ON public.medical_documents;
CREATE POLICY medical_documents_admin_all ON public.medical_documents
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. STORAGE POLICIES FOR 'medical-documents' BUCKET
-- Authenticated patient can upload to medical-documents/<user_id>/*
DROP POLICY IF EXISTS "Authenticated Users Upload Medical Documents" ON storage.objects;
CREATE POLICY "Authenticated Users Upload Medical Documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'medical-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated patient can read own uploaded files
DROP POLICY IF EXISTS "Authenticated Users Read Own Medical Documents" ON storage.objects;
CREATE POLICY "Authenticated Users Read Own Medical Documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'medical-documents' AND (
      (storage.foldername(name))[1] = auth.uid()::text OR
      public.is_admin()
    )
  );

