import { supabase } from '../lib/supabaseClient';
import { Consultation, ConsultationSlot, Doctor, Hospital } from '../types';

export interface ConsultationWithRelations extends Consultation {
  doctor?: (Doctor & { hospital?: Hospital | null }) | null;
  slot?: ConsultationSlot | null;
}

export interface BookConsultationInput {
  doctorId: string;
  slotId: string;
  patientId: string;
  patientNotes?: string;
}

export interface SpecialtyWithCount {
  name: string;
  doctorCount: number;
}

export const consultationsService = {
  /**
   * Book a consultation slot atomically.
   * Calls the Postgres stored function `book_consultation` to lock and mark the slot `is_booked = true`.
   * Includes a resilient client-side fallback in case RPC has not yet been executed in Supabase.
   */
  async bookConsultation(input: BookConsultationInput): Promise<{
    data: Consultation | null;
    error: string | null;
  }> {
    try {
      // 1. Try atomic stored procedure RPC
      const { data: rpcData, error: rpcError } = await supabase.rpc('book_consultation', {
        p_doctor_id: input.doctorId,
        p_slot_id: input.slotId,
        p_patient_id: input.patientId,
        p_patient_notes: input.patientNotes || null,
      });

      if (!rpcError && rpcData) {
        return { data: rpcData as Consultation, error: null };
      }

      // If RPC fails because of concurrency / already booked
      if (rpcError && rpcError.message.includes('already been booked')) {
        return { data: null, error: 'This appointment slot was just booked by another patient. Please pick another time slot.' };
      }

      // 2. Resilient Direct Fallback (if RPC not yet installed in Supabase)
      // Check if slot is booked
      const { data: slot, error: slotCheckError } = await supabase
        .from('consultation_slots')
        .select('*')
        .eq('id', input.slotId)
        .single();

      if (slotCheckError || !slot) {
        return { data: null, error: 'Selected slot does not exist.' };
      }

      if (slot.is_booked) {
        return { data: null, error: 'This appointment slot has already been booked. Please choose another time.' };
      }

      // Mark slot as booked
      const { error: slotUpdateError } = await supabase
        .from('consultation_slots')
        .update({ is_booked: true })
        .eq('id', input.slotId);

      if (slotUpdateError) {
        return { data: null, error: 'Failed to reserve appointment slot: ' + slotUpdateError.message };
      }

      // Insert consultation
      const { data: consultation, error: consultError } = await supabase
        .from('consultations')
        .insert({
          patient_id: input.patientId,
          doctor_id: input.doctorId,
          slot_id: input.slotId,
          status: 'requested',
          payment_status: 'unpaid',
          patient_notes: input.patientNotes || null,
        })
        .select()
        .single();

      if (consultError) {
        // Rollback slot
        await supabase.from('consultation_slots').update({ is_booked: false }).eq('id', input.slotId);
        return { data: null, error: consultError.message };
      }

      return { data: consultation as Consultation, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to book consultation';
      return { data: null, error: message };
    }
  },

  /**
   * Fetch distinct specialties with active video consultation doctors.
   */
  async getTelehealthSpecialties(): Promise<SpecialtyWithCount[]> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('specialty, specialties')
        .eq('status', 'approved')
        .eq('video_consultation_enabled', true);

      if (error || !data) return [];

      const countMap: Record<string, number> = {};
      data.forEach((d) => {
        if (d.specialty) {
          countMap[d.specialty] = (countMap[d.specialty] || 0) + 1;
        }
      });

      return Object.entries(countMap).map(([name, doctorCount]) => ({
        name,
        doctorCount,
      })).sort((a, b) => b.doctorCount - a.doctorCount);
    } catch {
      return [];
    }
  },

  /**
   * Fetch approved telehealth doctors for a specific specialty.
   */
  async getDoctorsBySpecialty(specialty: string): Promise<(Doctor & { hospital?: Hospital | null })[]> {
    try {
      let query = supabase
        .from('doctors')
        .select('*, hospital:hospitals(*)')
        .eq('status', 'approved')
        .eq('video_consultation_enabled', true)
        .order('experience_years', { ascending: false });

      if (specialty && specialty !== 'All') {
        query = query.or(`specialty.eq.${specialty},specialties.cs.{${specialty}}`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('[consultationsService.getDoctorsBySpecialty] Error:', error.message);
        return [];
      }

      return (data as (Doctor & { hospital?: Hospital | null })[]) || [];
    } catch {
      return [];
    }
  },

  /**
   * Fetch future available unbooked slots for a doctor.
   */
  async getDoctorAvailableSlots(doctorId: string): Promise<ConsultationSlot[]> {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('consultation_slots')
        .select('*')
        .eq('doctor_id', doctorId)
        .eq('is_booked', false)
        .gte('start_time', now)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('[consultationsService.getDoctorAvailableSlots] Error:', error.message);
        return [];
      }

      return (data as ConsultationSlot[]) || [];
    } catch {
      return [];
    }
  },

  /**
   * Fetch consultations booked by a patient.
   */
  async getPatientConsultations(patientId: string): Promise<ConsultationWithRelations[]> {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('*, doctor:doctors(*, hospital:hospitals(*)), slot:consultation_slots(*)')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[consultationsService.getPatientConsultations] Error:', error.message);
        return [];
      }

      return (data as ConsultationWithRelations[]) || [];
    } catch {
      return [];
    }
  },
};

