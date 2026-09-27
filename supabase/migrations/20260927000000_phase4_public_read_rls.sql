-- ==============================================================================
-- AARUNYA — International Healthcare Platform
-- Phase 4 Migration: Public Read RLS Policies for Website Shell
-- Matches implementation-plan.md (§13 & §889)
-- ==============================================================================

-- 1. TREATMENTS PUBLIC READ POLICY
-- Allows anonymous and authenticated visitors to read published treatments
DROP POLICY IF EXISTS treatments_public_read ON public.treatments;
CREATE POLICY treatments_public_read ON public.treatments
  FOR SELECT
  USING (is_published = TRUE OR public.is_admin());

-- 2. PATIENT STORIES PUBLIC READ POLICY
-- Allows visitors to view published patient stories
DROP POLICY IF EXISTS patient_stories_public_read ON public.patient_stories;
CREATE POLICY patient_stories_public_read ON public.patient_stories
  FOR SELECT
  USING (is_published = TRUE OR public.is_admin());

-- 3. ADVISOR REQUESTS INSERT POLICY
-- Allows any visitor (including guests) to submit an inquiry through the contact form
DROP POLICY IF EXISTS advisor_requests_insert_public ON public.advisor_requests;
CREATE POLICY advisor_requests_insert_public ON public.advisor_requests
  FOR INSERT
  WITH CHECK (TRUE);

-- 4. ADVISOR REQUESTS SELECT POLICY
-- Only admin can view all requests; logged-in patient can view their own
DROP POLICY IF EXISTS advisor_requests_select_policy ON public.advisor_requests;
CREATE POLICY advisor_requests_select_policy ON public.advisor_requests
  FOR SELECT TO authenticated
  USING (patient_id = auth.uid() OR public.is_admin());

