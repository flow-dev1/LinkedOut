import { createClient } from '@supabase/supabase-js';

// Vite requires "VITE_" prefix for environment variables exposed to the browser
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);