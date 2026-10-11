import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getRows(table: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Failed to load ${table}:`, error);
    return [];
  }

  return data ?? [];
}

export async function getRow(table: string, id: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`Failed to load ${table}/${id}:`, error);
    return null;
  }

  return data;
}
