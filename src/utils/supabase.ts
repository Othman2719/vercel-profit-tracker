import { createClient } from "./supabase/client";

// Export a singleton instance of the browser client for all existing components to use
export const supabase = createClient();
