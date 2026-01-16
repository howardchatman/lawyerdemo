import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a dummy client for build time when env vars aren't available
let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // During build time or when env vars are missing, create a placeholder
  // This prevents build errors while still allowing the app to compile
  supabase = null as unknown as SupabaseClient;
}

export { supabase };

export interface ContactSubmission {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  practice_area: string;
  message: string;
  created_at?: string;
}

export async function submitContactForm(data: Omit<ContactSubmission, 'id' | 'created_at'>) {
  if (!supabase) {
    // If Supabase is not configured, throw a user-friendly error
    throw new Error('Contact form is temporarily unavailable. Please call us directly.');
  }

  const { data: result, error } = await supabase
    .from('contact_submissions')
    .insert([data])
    .select();

  if (error) {
    throw error;
  }

  return result;
}
