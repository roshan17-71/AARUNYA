import { supabase } from '../lib/supabaseClient';
import { Package } from '../types';

export interface PackageInput {
  hospital_id: string;
  name: string;
  slug: string;
  category: string;
  description?: string | null;
  included_services: string[];
  estimated_price?: number | null;
  currency?: string;
  duration?: string | null;
  eligibility_info?: string | null;
  status: 'draft' | 'published' | 'archived';
  is_demo?: boolean;
}

export const packagesService = {
  /**
   * Fetch all packages belonging to a specific hospital (draft, published, archived).
   * Used in hospital dashboard.
   */
  async getHospitalPackages(hospitalId: string): Promise<Package[]> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('hospital_id', hospitalId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[packagesService.getHospitalPackages] Error:', error.message);
        return [];
      }

      return (data as Package[]) || [];
    } catch (err) {
      console.error('[packagesService.getHospitalPackages] Unexpected error:', err);
      return [];
    }
  },

  /**
   * Fetch published packages across approved hospitals (for public directory in future phases).
   */
  async getPublishedPackages(filter?: { category?: string; search?: string }): Promise<Package[]> {
    try {
      let query = supabase
        .from('packages')
        .select('*, hospital:hospitals(*)')
        .eq('status', 'published')
        .order('estimated_price', { ascending: true });

      if (filter?.category && filter.category !== 'All') {
        query = query.ilike('category', filter.category.trim());
      }

      if (filter?.search && filter.search.trim()) {
        const term = `%${filter.search.trim()}%`;
        query = query.or(`name.ilike.${term},description.ilike.${term}`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('[packagesService.getPublishedPackages] Error:', error.message);
        return [];
      }

      return (data as Package[]) || [];
    } catch (err) {
      console.error('[packagesService.getPublishedPackages] Unexpected error:', err);
      return [];
    }
  },

  /**
   * Create a new package (scoped to the hospital's hospital_id).
   */
  async createPackage(input: PackageInput): Promise<{ data: Package | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .insert({
          hospital_id: input.hospital_id,
          name: input.name,
          slug: input.slug,
          category: input.category,
          description: input.description || null,
          included_services: input.included_services,
          estimated_price: input.estimated_price !== undefined ? input.estimated_price : null,
          currency: input.currency || 'USD',
          duration: input.duration || null,
          eligibility_info: input.eligibility_info || null,
          status: input.status,
          is_demo: input.is_demo || false,
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Package, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create package';
      return { data: null, error: message };
    }
  },

  /**
   * Update an existing package.
   */
  async updatePackage(id: string, updates: Partial<PackageInput>): Promise<{ data: Package | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as Package, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update package';
      return { data: null, error: message };
    }
  },

  /**
   * Delete a package.
   */
  async deletePackage(id: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete package';
      return { success: false, error: message };
    }
  },
};

