import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://zttyzogoifqhcxiaxsbi.supabase.co";
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "sb_publishable_XLJlCPbw4WdUS_A1k8KYoA_mpCDI8it";

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
