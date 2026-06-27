import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Check if credentials are set
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

let supabase = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log("Supabase client initialized successfully (v1 SDK).");
  } catch (error) {
    console.error("Error initializing Supabase client:", error);
  }
} else {
  console.warn("Supabase credentials missing. Falling back to local mock data.");
}

export { supabase, isSupabaseConfigured };
export default supabase;
