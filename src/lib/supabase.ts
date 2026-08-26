import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || "";
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "";

// Keep the public access UI mountable in preview environments where database variables are not injected.
// Each database helper below already exits early when the real credentials are unavailable.
export const supabase = createClient(
  supabaseUrl || "https://preview-placeholder.supabase.co",
  supabaseAnonKey || "preview-placeholder-anon-key",
);

export async function saveKeyToDatabase(
  keyString: string,
  provider: string = "Lootlabs",
  expiresAt: string | null = null,
  isProductsKey: boolean = false
) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing");
    return null;
  }

  const { error } = await supabase
    .from("keys")
    .insert([
      {
        key_string: keyString,
        provider: provider,
        expires_at: expiresAt,
        is_products_key: isProductsKey,
      },
    ]);

  if (error) {
    console.error("Error saving key to Supabase:", error);
    return null;
  }

  return {
    key_string: keyString,
    provider,
    expires_at: expiresAt,
    is_products_key: isProductsKey,
  };
}

export async function saveLogToDatabase(
  provider: string = "Lootlabs",
  message: string = "",
  status: "pending" | "success" | "error" | "info" = "pending"
) {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  try {
    const { data, error } = await supabase
      .from("logs")
      .insert([
        {
          provider_name: provider,
          message: message,
          status: status,
        },
      ])
      .select()
      .maybeSingle();

    if (error) {
      console.warn("Could not insert into logs table:", error.message);
    }
    return data;
  } catch (err) {
    console.error("Error saving log to Supabase:", err);
    return null;
  }
}

export async function fetchKeysFromDatabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return [];
  }

  const results: any[] = [];

  try {
    const { data: keysData, error: keysError } = await supabase
      .from("keys")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (!keysError && keysData) {
      results.push(...keysData);
    }
  } catch (err) {
    console.error("Failed to fetch keys:", err);
  }

  try {
    const { data: logsData, error: logsError } = await supabase
      .from("logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (!logsError && logsData) {
      const formattedLogs = logsData.map((l: any) => ({
        id: l.id ? String(l.id) : `log-${Math.random()}`,
        key_string: l.message,
        provider: l.provider_name || "Lootlabs",
        created_at: l.created_at,
        claimed: l.status === "success",
        is_step_log: true,
        log_status: l.status || "pending",
        log_message: l.message,
      }));
      results.push(...formattedLogs);
    }
  } catch (err) {
    // Ignore if logs table is not created yet
  }

  return results;
}
