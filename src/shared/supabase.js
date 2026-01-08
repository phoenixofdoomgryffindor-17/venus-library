import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://laugukknsvgrtksrwlyh.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdWd1a2tuc3ZncnRrc3J3bHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3ODQzMzEsImV4cCI6MjA4MzM2MDMzMX0.q6BTOi4ZDbK0fJaLoiNS2n0AhFZi0VnvkIfjEvgwNgk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
