import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-ref')) {
  console.warn(
    '[AARUNYA Supabase] Missing or default VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env. Please configure real Supabase credentials.'
  );
}

// Fallback dummy credentials to prevent createClient from throwing an uncaught constructor error when .env is unconfigured
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

