import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || "";
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveKeyToDatabase(keyString: string, provider: string = "polar") {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing");
    return null;
  }

  const { data, error } = await supabase
    .from("keys")
    .insert([
      {
        key_string: keyString,
        provider: provider,
        is_products_key: true,
      },
    ])
    .select()
    .maybeSingle();

  if (error) {
    console.error("Error saving key to Supabase:", error);
    return null;
  }

  return data;
}
