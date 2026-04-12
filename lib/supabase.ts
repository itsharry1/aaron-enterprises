import { createClient } from '@supabase/supabase-js';

// Safe access to environment variables
const getEnv = (key: string) => {
  try {
    // Check if import.meta.env exists
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      return (import.meta as any).env[key];
    }
  } catch (e) {
    console.warn(`Failed to access env var ${key}`, e);
  }
  return undefined;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials missing! Requests will fail until .env is configured.');
}

// Robust fallback to prevent module crash
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key'
);