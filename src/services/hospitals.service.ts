import { supabase } from '../lib/supabaseClient';
import { Hospital, Treatment, Package } from '../types';

export interface HospitalFilterOptions {
  search?: string;
  city?: string;
  specialty?: string;
  accreditation?: string;
}

export interface HospitalWithRelations {
  hospital: Hospital;
  treatments: Treatment[];
  packages: Package[];
}

export const hospitalsService = {
  /**
   * Fetch approved hospitals with optional search, city, specialty, and accreditation filters.
   * Public discovery only returns approved hospitals (§13).
   */
  async getHospitals(filter?: HospitalFilterOptions): Promise<Hospital[]> {
    try {
      let query = supabase
        .from('hospitals')
        .select('*')
        .eq('status', 'approved')
        .order('name', { ascending: true });

      if (filter?.city && filter.city !== 'All') {
        query = query.ilike('city', filter.city.trim());
      }

      if (filter?.specialty && filter.specialty !== 'All') {
        query = query.contains('specialties', [filter.specialty.trim()]);
      }

      if (filter?.accreditation && filter.accreditation !== 'All') {
        query = query.contains('accreditations', [filter.accreditation.trim()]);
      }

      if (filter?.search && filter.search.trim()) {
        const term = `%${filter.search.trim()}%`;
        query = query.or(`name.ilike.${term},city.ilike.${term},description.ilike.${term}`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('[hospitalsService.getHospitals] Error:', error.message);
        return [];
      }

      return (data as Hospital[]) || [];
    } catch (err) {
      console.error('[hospitalsService.getHospitals] Unexpected error:', err);
      return [];
    }
  },

  /**
   * Fetch a single hospital by slug along with associated treatments and published packages.
   */
  async getHospitalBySlug(slug: string): Promise<HospitalWithRelations | null> {
    try {
      const { data: hospital, error: hospError } = await supabase
        .from('hospitals')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (hospError || !hospital) {
        if (hospError) console.error('[hospitalsService.getHospitalBySlug] Error:', hospError.message);
        return null;
      }

      // Fetch linked treatments via treatment_hospitals
      const { data: thData } = await supabase
        .from('treatment_hospitals')
        .select('treatment_id')
        .eq('hospital_id', hospital.id);

      let treatments: Treatment[] = [];
      if (thData && thData.length > 0) {
        const treatmentIds = thData.map((th) => th.treatment_id);
        const { data: tData } = await supabase
          .from('treatments')
          .select('*')
          .in('id', treatmentIds)
          .eq('is_published', true);
        treatments = (tData as Treatment[]) || [];
      }

      // Fetch published packages for this hospital
      const { data: pData } = await supabase
        .from('packages')
        .select('*')
        .eq('hospital_id', hospital.id)
        .eq('status', 'published')
        .order('estimated_price', { ascending: true });

      const packages = (pData as Package[]) || [];

      return {
        hospital: hospital as Hospital,
        treatments,
        packages,
      };
    } catch (err) {
      console.error('[hospitalsService.getHospitalBySlug] Unexpected error:', err);
      return null;
    }
  },

  /**
   * Fetch the hospital record belonging to the logged-in user profile.
   */
  async getHospitalByProfileId(profileId: string): Promise<Hospital | null> {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .eq('profile_id', profileId)
        .maybeSingle();

      if (error) {
        console.error('[hospitalsService.getHospitalByProfileId] Error:', error.message);
        return null;
      }

      return (data as Hospital) || null;
    } catch (err) {
      console.error('[hospitalsService.getHospitalByProfileId] Unexpected error:', err);
      return null;
    }
  },

  /**
   * Update hospital profile details (restricted by RLS to own row).
   */
  async updateHospitalProfile(id: string, updates: Partial<Hospital>): Promise<{ data: Hospital | null; error: string | null }> {
    try {
      // Exclude fields that hospital accounts cannot self-modify (status, is_demo, id, created_at)
      const allowedUpdates: Partial<Hospital> = {
        name: updates.name,
        city: updates.city,
        country: updates.country || 'India',
        description: updates.description,
        specialties: updates.specialties,
        accreditations: updates.accreditations,
        facilities: updates.facilities,
        international_patient_services: updates.international_patient_services,
        images: updates.images,
      };

      const { data, error } = await supabase
        .from('hospitals')
        .update(allowedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Hospital, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update hospital profile';
      return { data: null, error: message };
    }
  },

  /**
   * Upload hospital image to public-media storage bucket.
   */
  async uploadHospitalImage(file: File, hospitalId: string): Promise<{ url: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${hospitalId}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `hospitals/${fileName}`;

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
      const message = err instanceof Error ? err.message : 'Failed to upload hospital image';
      return { url: null, error: message };
    }
  },

  /**
   * Fetch distinct cities from approved hospitals.
   */
  async getDistinctCities(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('city')
        .eq('status', 'approved');

      if (error || !data) return [];
      const set = new Set(data.map((h) => h.city).filter(Boolean));
      return Array.from(set).sort();
    } catch {
      return [];
    }
  },

  /**
   * Fetch distinct specialties from approved hospitals.
   */
  async getDistinctSpecialties(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('specialties')
        .eq('status', 'approved');

      if (error || !data) return [];
      const set = new Set<string>();
      data.forEach((h) => {
        if (Array.isArray(h.specialties)) {
          h.specialties.forEach((s: string) => set.add(s));
        }
      });
      return Array.from(set).sort();
    } catch {
      return [];
    }
  },

  /**
   * Fetch distinct accreditations from approved hospitals.
   */
  async getDistinctAccreditations(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('accreditations')
        .eq('status', 'approved');

      if (error || !data) return [];
      const set = new Set<string>();
      data.forEach((h) => {
        if (Array.isArray(h.accreditations)) {
          h.accreditations.forEach((a: string) => set.add(a));
        }
      });
      return Array.from(set).sort();
    } catch {
      return [];
    }
  },
};

