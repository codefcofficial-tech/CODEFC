// ===================================
// CODEFC SUPABASE CONNECTION
// ===================================

const SUPABASE_URL = "https://nooanrlldbgushpflmln.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_awJWAfX4VfQ_lxl1ST0gXw_1NkzbXkH";

const CODEFC_DB = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Share database client across CODEFC pages
window.CODEFC_DB = CODEFC_DB;

console.log("CODEFC Supabase connected successfully");
