const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

console.log("Subscribing to events-availability channel...");

const channel = supabase
  .channel("events-availability")
  .on("broadcast", { event: "seats_updated" }, (payload) => {
    console.log("=== BROADCAST RECEIVED ===");
    console.log(JSON.stringify(payload, null, 2));
    
    // Check if it's nested in payload.payload
    if (payload.payload) {
      console.log("Shape confirmed: nested inside payload.payload");
    } else {
      console.log("Shape is flat: payload directly contains data");
    }
    
    process.exit(0); // Exit after receiving one payload
  })
  .subscribe((status) => {
    console.log("Subscription status:", status);
    if (status === 'SUBSCRIBED') {
      console.log("Waiting for a seat hold or registration to trigger the broadcast...");
      
      // Trigger a seat hold to force the broadcast
      setTimeout(async () => {
        console.log("Triggering a dummy seat hold to test...");
        // Use a known event id, assuming one exists or just any event.
        // We'll just fetch the first event to use its ID
        const { data: events } = await supabase.from('events').select('id').limit(1);
        if (events && events.length > 0) {
          const testEventId = events[0].id;
          await supabase.rpc('hold_seat', { p_event_id: testEventId });
          console.log(`Hold triggered for event ${testEventId}. Broadcast should arrive shortly...`);
        } else {
          console.log("No events found to test.");
        }
      }, 2000);
    }
  });
