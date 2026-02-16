import { createClient } from '@supabase/supabase-js';

// Fix: Switched to Vite's standard `import.meta.env` for securely accessing environment variables.
// This requires environment variables to be prefixed with `VITE_`.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fix: Updated the error message to guide the user to prefix their environment variables with `VITE_`.
  throw new Error("VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be provided in environment variables. Please check your Vercel project settings and ensure variables are prefixed with 'VITE_'.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);