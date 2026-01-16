import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// Using lawyer_ prefix for this project's Supabase config
const supabaseUrl = process.env.NEXT_PUBLIC_LAWYER_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_LAWYER_SUPABASE_ANON_KEY;

// Create a dummy client for build time when env vars aren't available
let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  supabase = null as unknown as SupabaseClient;
}

export { supabase };

// Browser client for client components
export function createClientComponentClient() {
  const url = process.env.NEXT_PUBLIC_LAWYER_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_LAWYER_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createBrowserClient(url, key);
}

// Database Types
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'client' | 'attorney' | 'admin';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Case {
  id: string;
  case_number: string;
  title: string;
  description: string;
  practice_area: string;
  status: 'intake' | 'active' | 'pending' | 'closed' | 'won' | 'settled';
  client_id: string;
  attorney_id?: string;
  created_at: string;
  updated_at: string;
  next_hearing_date?: string;
  notes?: string;
}

export interface Document {
  id: string;
  case_id: string;
  name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  created_at: string;
}

export interface Message {
  id: string;
  case_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Appointment {
  id: string;
  case_id?: string;
  client_id: string;
  attorney_id: string;
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  location?: string;
  meeting_link?: string;
  created_at: string;
}

export interface ContactSubmission {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  practice_area: string;
  message: string;
  status?: 'new' | 'contacted' | 'converted' | 'closed';
  created_at?: string;
}

export async function submitContactForm(data: Omit<ContactSubmission, 'id' | 'created_at' | 'status'>) {
  if (!supabase) {
    throw new Error('Contact form is temporarily unavailable. Please call us directly.');
  }

  const { data: result, error } = await supabase
    .from('lawyer_contact_submissions')
    .insert([{ ...data, status: 'new' }])
    .select();

  if (error) {
    throw error;
  }

  return result;
}
