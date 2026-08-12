import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fetch all tracks with live price + seats-left info
export async function fetchEvents() {
  const { data, error } = await supabase.rpc("get_events_with_availability");
  if (error) throw error;
  return data;
}

// Step 1 — when "Register Now" is clicked, BEFORE navigating to payment
export async function holdSeat(eventId) {
  const { data, error } = await supabase.rpc("hold_seat", { p_event_id: eventId });
  if (error) throw error; // "Event is fully booked"
  return data[0]; // { hold_token, expires_at }
}

// Submit a registration atomically
export async function registerForEvent({
  fullName,
  email,
  phone,
  college,
  teamName,
  teamMembers, // [{ name, email }, ...]
  eventId,
  utrId,
  collegeRegNo,
  holdToken,
  accommodation,
}) {
  const { data, error } = await supabase.rpc("register_team", {
    p_full_name: fullName,
    p_email: email,
    p_phone: phone,
    p_college: college,
    p_team_name: teamName || null,
    p_team_members: teamMembers || [],
    p_event_id: eventId,
    p_utr_id: utrId,
    p_college_reg_no: collegeRegNo || null,
    p_hold_token: holdToken,
    p_accommodation: accommodation || false,
  });
  if (error) throw error;
  return data; // the new registration's id
}
