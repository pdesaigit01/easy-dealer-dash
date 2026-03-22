import type { Database } from "@/integrations/supabase/types";

export type Party = Database["public"]["Tables"]["parties"]["Row"];
export type Bill = Database["public"]["Tables"]["bills"]["Row"];
