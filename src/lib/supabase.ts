import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || "";
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveKeyToDatabase(
  keyString: string,
  provider: string = "polar",
  expiresAt: string | null = null,
  isProductsKey: boolean = false
) {
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
        expires_at: expiresAt,
        is_products_key: isProductsKey,
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

export async function fetchKeysFromDatabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("keys")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Error fetching keys from Supabase:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Failed to fetch keys:", err);
    return [];
  }
}

