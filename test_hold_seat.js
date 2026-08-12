import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data: events } = await supabase.rpc("get_events_with_availability");
  console.log("Events:", events);
  
  if (events && events.length > 0) {
    const eventId = events.find(e => e.title.includes('Scaling')).id;
    console.log("Testing with event_id:", eventId, typeof eventId);
    
    const res = await supabase.rpc("hold_seat", { p_event_id: eventId });
    console.log("Result:", res);
  }
}
test();
