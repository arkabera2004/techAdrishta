const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

const env = fs.readFileSync(".env.local", "utf8").split('\n').reduce((acc, line) => {
  const [key, val] = line.split('=');
  if (key && val) acc[key] = val.trim();
  return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data: events } = await supabase.rpc("get_events_with_availability");
  
  if (events && events.length > 0) {
    const event = events.find(e => e.name && e.name.includes('Scaling'));
    if (!event) return;
    const eventId = event.id;
    console.log("Testing with event_id:", eventId, typeof eventId);
    
    // Pass eventId as string
    let res = await supabase.rpc("hold_seat", { p_event_id: String(eventId) });
    console.log("Result (string ID):", res);

  }
}
test();
