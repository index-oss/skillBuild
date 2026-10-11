import { createClient } from "@supabase/supabase-js";

// Build time par crash na ho isliye dummy values fallback mein di gayi hain
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseKey);