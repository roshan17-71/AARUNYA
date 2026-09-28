import { supabase } from '../lib/supabaseClient';
import { Doctor, Hospital, ConsultationSlot } from '../types';

export interface DoctorWithRelations extends Doctor {
  hospital?: Hospital | null;
}

export interface DoctorFilterOptions {
  search?: string;
  specialty?: string;
  hospitalId?: string;
  city?: string;
  videoOnly?: boolean;
}

export const doctorsService = {
  /**
   * Fetch approved doctors with optional search, specialty, city, hospital, and video consultation filters.
   */
  async getDoctors(filter?: DoctorFilterOptions): Promise<DoctorWithRelations[]> {
    try {
      let query = supabase
        .from('doctors')
        .select('*, hospital:hospitals(*)')
        .eq('status', 'approved')
        .order('experience_years', { ascending: false });

      if (filter?.specialty && filter.specialty !== 'All') {
        query = query.or(`specialty.eq.${filter.specialty.trim()},specialties.cs.{${filter.specialty.trim()}}`);
      }

      if (filter?.city && filter.city !== 'All') {
        query = query.ilike('city', filter.city.trim());
      }

      if (filter?.hospitalId && filter.hospitalId !== 'All') {
        query = query.eq('hospital_id', filter.hospitalId);
      }

      if (filter?.videoOnly) {
        query = query.eq('video_consultation_enabled', true);
      }

      if (filter?.search && filter.search.trim()) {
        const term = `%${filter.search.trim()}%`;
        query = query.or(
          `full_name.ilike.${term},specialty.ilike.${term},qualifications.ilike.${term},city.ilike.${term}`
        );
      }

      const { data, error } = await query;
      if (error) {
        console.error('[doctorsService.getDoctors] Error:', error.message);
        return [];
      }

      return (data as DoctorWithRelations[]) || [];
    } catch (err) {
      console.error('[doctorsService.getDoctors] Unexpected error:', err);
      return [];
    }
  },

  /**
   * Fetch a doctor by ID with hospital details and upcoming unbooked slots.
   */
  async getDoctorById(id: string): Promise<{ doctor: DoctorWithRelations; slots: ConsultationSlot[] } | null> {
    try {
      const { data: doctor, error: docError } = await supabase
        .from('doctors')
        .select('*, hospital:hospitals(*)')
        .eq('id', id)
        .maybeSingle();

      if (docError || !doctor) {
        if (docError) console.error('[doctorsService.getDoctorById] Error:', docError.message);
        return null;
      }

      // Fetch upcoming available slots
      const now = new Date().toISOString();
      const { data: slots, error: slotError } = await supabase
        .from('consultation_slots')
        .select('*')
        .eq('doctor_id', id)
        .eq('is_booked', false)
        .gte('start_time', now)
        .order('start_time', { ascending: true })
        .limit(20);

      if (slotError) {
        console.error('[doctorsService.getDoctorById] Slot query error:', slotError.message);
      }

      return {
        doctor: doctor as DoctorWithRelations,
        slots: (slots as ConsultationSlot[]) || [],
      };
    } catch (err) {
      console.error('[doctorsService.getDoctorById] Unexpected error:', err);
      return null;
    }
  },

  /**
   * Fetch the doctor record belonging to the logged-in profile.
   */
  async getDoctorByProfileId(profileId: string): Promise<DoctorWithRelations | null> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*, hospital:hospitals(*)')
        .eq('profile_id', profileId)
        .maybeSingle();

      if (error) {
        console.error('[doctorsService.getDoctorByProfileId] Error:', error.message);
        return null;
      }

      return (data as DoctorWithRelations) || null;
    } catch (err) {
      console.error('[doctorsService.getDoctorByProfileId] Unexpected error:', err);
      return null;
    }
  },

  /**
   * Update doctor profile details.
   */
  async updateDoctorProfile(
    id: string,
    updates: Partial<Doctor>
  ): Promise<{ data: Doctor | null; error: string | null }> {
    try {
      const allowedUpdates: Partial<Doctor> = {
        full_name: updates.full_name,
        hospital_id: updates.hospital_id,
        specialty: updates.specialty,
        specialties: updates.specialties,
        bio: updates.bio,
        qualifications: updates.qualifications,
        experience_years: updates.experience_years,
        languages: updates.languages,
        city: updates.city,
        country: updates.country || 'India',
        profile_image_url: updates.profile_image_url,
      };

      const { data, error } = await supabase
        .from('doctors')
        .update(allowedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Doctor, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update doctor profile';
      return { data: null, error: message };
    }
  },

  /**
   * Update consultation settings (fee, duration, video toggle).
   */
  async updateConsultationSettings(
    id: string,
    settings: {
      consultation_fee: number | null;
      consultation_duration_minutes: number | null;
      video_consultation_enabled: boolean;
    }
  ): Promise<{ data: Doctor | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .update({
          consultation_fee: settings.consultation_fee,
          consultation_duration_minutes: settings.consultation_duration_minutes,
          video_consultation_enabled: settings.video_consultation_enabled,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Doctor, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update settings';
      return { data: null, error: message };
    }
  },

  /**
   * Upload doctor photo to public-media storage.
   */
  async uploadDoctorPhoto(file: File, doctorId: string): Promise<{ url: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${doctorId}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `doctors/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        return { url: null, error: uploadError.message };
      }

      const { data: publicData } = supabase.storage
        .from('public-media')
        .getPublicUrl(filePath);

      return { url: publicData.publicUrl, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload photo';
      return { url: null, error: message };
    }
  },

  /**
   * Get all slots for a doctor (including booked & unbooked).
   */
  async getDoctorSlots(doctorId: string): Promise<ConsultationSlot[]> {
    try {
      const { data, error } = await supabase
        .from('consultation_slots')
        .select('*')
        .eq('doctor_id', doctorId)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('[doctorsService.getDoctorSlots] Error:', error.message);
        return [];
      }

      return (data as ConsultationSlot[]) || [];
    } catch (err) {
      console.error('[doctorsService.getDoctorSlots] Unexpected error:', err);
      return [];
    }
  },

  /**
   * Add a new consultation slot.
   */
  async addConsultationSlot(
    doctorId: string,
    startTime: string,
    endTime: string
  ): Promise<{ data: ConsultationSlot | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('consultation_slots')
        .insert({
          doctor_id: doctorId,
          start_time: startTime,
          end_time: endTime,
          is_booked: false,
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as ConsultationSlot, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add slot';
      return { data: null, error: message };
    }
  },

  /**
   * Delete an unbooked consultation slot.
   */
  async deleteConsultationSlot(slotId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('consultation_slots')
        .delete()
        .eq('id', slotId)
        .eq('is_booked', false);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete slot';
      return { success: false, error: message };
    }
  },

  /**
   * Fetch distinct doctor specialties.
   */
  async getDistinctSpecialties(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('specialty, specialties')
        .eq('status', 'approved');

      if (error || !data) return [];
      const set = new Set<string>();
      data.forEach((d) => {
        if (d.specialty) set.add(d.specialty);
        if (Array.isArray(d.specialties)) {
          d.specialties.forEach((s: string) => set.add(s));
        }
      });
      return Array.from(set).sort();
    } catch {
      return [];
    }
  },

  /**
   * Fetch distinct doctor cities.
   */
  async getDistinctCities(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('city')
        .eq('status', 'approved');

      if (error || !data) return [];
      const set = new Set(data.map((d) => d.city).filter(Boolean));
      return Array.from(set).sort();
    } catch {
      return [];
    }
  },

  /**
   * Fetch approved hospitals for affiliation dropdown.
   */
  async getApprovedHospitals(): Promise<{ id: string; name: string; city: string }[]> {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('id, name, city')
        .eq('status', 'approved')
        .order('name', { ascending: true });

      if (error || !data) return [];
      return data;
    } catch {
      return [];
    }
  },
};

