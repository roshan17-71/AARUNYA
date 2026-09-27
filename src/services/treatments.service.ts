import { supabase } from '../lib/supabaseClient';
import { Treatment } from '../types';

export interface TreatmentFilters {
  search?: string;
  specialty?: string;
  category?: string;
}

export const treatmentsService = {
  /**
   * Fetch all published treatments with optional filters (search, specialty, category)
   */
  async getTreatments(filters?: TreatmentFilters): Promise<Treatment[]> {
    let query = supabase
      .from('treatments')
      .select('*')
      .eq('is_published', true)
      .order('name', { ascending: true });

    if (filters?.specialty && filters.specialty !== 'All') {
      query = query.eq('specialty', filters.specialty);
    }

    if (filters?.category && filters.category !== 'All') {
      query = query.eq('category', filters.category);
    }

    if (filters?.search && filters.search.trim()) {
      const term = `%${filters.search.trim()}%`;
      query = query.or(`name.ilike.${term},overview.ilike.${term},indications.ilike.${term}`);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('[treatmentsService.getTreatments] Error:', error.message);
      return [];
    }

    return (data as Treatment[]) || [];
  },

  /**
   * Fetch a single treatment by its unique slug
   */
  async getTreatmentBySlug(slug: string): Promise<Treatment | null> {
    const { data, error } = await supabase
      .from('treatments')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) {
      console.warn(`[treatmentsService.getTreatmentBySlug] Error for slug "${slug}":`, error.message);
      return null;
    }

    return data as Treatment;
  },

  /**
   * Fetch distinct specialties for filtering
   */
  async getDistinctSpecialties(): Promise<string[]> {
    const { data, error } = await supabase
      .from('treatments')
      .select('specialty')
      .eq('is_published', true);

    if (error || !data) return [];
    const unique = Array.from(new Set(data.map((item) => item.specialty).filter(Boolean)));
    return unique.sort();
  },

  /**
   * Fetch distinct categories for filtering
   */
  async getDistinctCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('treatments')
      .select('category')
      .eq('is_published', true);

    if (error || !data) return [];
    const unique = Array.from(new Set(data.map((item) => item.category).filter(Boolean)));
    return unique.sort();
  },
};

