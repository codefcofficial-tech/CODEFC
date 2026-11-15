
// ===================================
// CODEFC SUPABASE CONNECTION
// ===================================

const SUPABASE_URL =
  "https://nooanrlldbgushpflmln.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_awJWAfX4VfQ_lxl1ST0gXw_1NkzbXkH";

window.CODEFC_DB = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("CODEFC Supabase connected successfully");
