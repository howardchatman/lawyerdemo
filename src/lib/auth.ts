'use server';

import { createServerComponentClient, createAdminClient } from './supabase-server';
import { redirect } from 'next/navigation';

export async function getSession() {
  const supabase = await createServerComponentClient();
  if (!supabase) return null;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

export async function getUser() {
  const supabase = await createServerComponentClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getProfile() {
  const supabase = await createServerComponentClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('lawyer_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}

export async function requireAdmin() {
  const profile = await getProfile();
  if (!profile || profile.role !== 'admin') {
    redirect('/portal');
  }
  return profile;
}

export async function requireClient() {
  const profile = await getProfile();
  if (!profile) {
    redirect('/login');
  }
  return profile;
}

export async function signUp(email: string, password: string, fullName: string, phone?: string) {
  const supabase = await createServerComponentClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
      },
    },
  });

  if (error) throw error;

  // Create profile
  if (data.user) {
    const adminClient = createAdminClient();
    if (adminClient) {
      await adminClient.from('lawyer_profiles').insert({
        id: data.user.id,
        email: email,
        full_name: fullName,
        phone: phone,
        role: 'client',
      });
    }
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const supabase = await createServerComponentClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = await createServerComponentClient();
  if (!supabase) return;

  await supabase.auth.signOut();
  redirect('/');
}
