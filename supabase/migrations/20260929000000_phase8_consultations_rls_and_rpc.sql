-- ============================================================================
-- AARUNYA PHASE 8: Video Consultation Booking RLS & Atomic Stored Procedure
-- Migration: 20260929000000_phase8_consultations_rls_and_rpc.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. RLS POLICIES FOR CONSULTATIONS
-- ----------------------------------------------------------------------------
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- 1.1 Patient can view their own consultation bookings
DROP POLICY IF EXISTS consultations_patient_select ON public.consultations;
CREATE POLICY consultations_patient_select ON public.consultations
  FOR SELECT TO authenticated
  USING (patient_id = auth.uid());

-- 1.2 Patient can create their own consultation request
DROP POLICY IF EXISTS consultations_patient_insert ON public.consultations;
CREATE POLICY consultations_patient_insert ON public.consultations
  FOR INSERT TO authenticated
  WITH CHECK (patient_id = auth.uid());

-- 1.3 Doctor can view consultations booked with them
DROP POLICY IF EXISTS consultations_doctor_select ON public.consultations;
CREATE POLICY consultations_doctor_select ON public.consultations
  FOR SELECT TO authenticated
  USING (
    doctor_id IN (
      SELECT id FROM public.doctors WHERE profile_id = auth.uid()
    )
  );

-- 1.4 Doctor can update meeting status/notes for consultations with them
DROP POLICY IF EXISTS consultations_doctor_update ON public.consultations;
CREATE POLICY consultations_doctor_update ON public.consultations
  FOR UPDATE TO authenticated
  USING (
    doctor_id IN (
      SELECT id FROM public.doctors WHERE profile_id = auth.uid()
    )
  )
  WITH CHECK (
    doctor_id IN (
      SELECT id FROM public.doctors WHERE profile_id = auth.uid()
    )
  );

-- 1.5 Admin has full access to all consultations
DROP POLICY IF EXISTS consultations_admin_all ON public.consultations;
CREATE POLICY consultations_admin_all ON public.consultations
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 2. ATOMIC STORED FUNCTION: book_consultation
-- Prevents double-booking race conditions by locking the slot row FOR UPDATE
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.book_consultation(
  p_doctor_id UUID,
  p_slot_id UUID,
  p_patient_id UUID,
  p_patient_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_slot_booked BOOLEAN;
  v_consultation RECORD;
BEGIN
  -- Lock the slot row to eliminate concurrency races
  SELECT is_booked INTO v_slot_booked
  FROM public.consultation_slots
  WHERE id = p_slot_id AND doctor_id = p_doctor_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Consultation slot does not exist or does not match doctor.';
  END IF;

  IF v_slot_booked THEN
    RAISE EXCEPTION 'This consultation slot has already been booked by another patient.';
  END IF;

  -- 1. Mark the slot as booked
  UPDATE public.consultation_slots
  SET is_booked = TRUE
  WHERE id = p_slot_id;

  -- 2. Insert the consultation request
  INSERT INTO public.consultations (
    doctor_id,
    slot_id,
    patient_id,
    patient_notes,
    status,
    payment_status
  )
  VALUES (
    p_doctor_id,
    p_slot_id,
    p_patient_id,
    p_patient_notes,
    'requested',
    'unpaid'
  )
  RETURNING * INTO v_consultation;

  RETURN to_jsonb(v_consultation);
END;
$$;

GRANT EXECUTE ON FUNCTION public.book_consultation(UUID, UUID, UUID, TEXT) TO authenticated, service_role;

