import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://kxmwcpeuiklblpehddkz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bXdjcGV1aWtsYmxwZWhkZGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5ODgxNjEsImV4cCI6MjA1NDU2NDE2MX0.Z9GBMvwAjAnUoisbeRe5VLuhFuqWQFwsq_2YAnIJ4y4";
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
supabase.from("library_clues").select("count", { count: "exact", head: true }).then(({ error }) => {
  if (error) {
    console.error("Failed to connect to Supabase:", error.message);
  } else {
    console.log("Successfully connected to Supabase");
  }
}).catch((err) => {
  console.error("Unexpected error connecting to Supabase:", err);
});
