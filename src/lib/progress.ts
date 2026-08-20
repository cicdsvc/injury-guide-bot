import { supabase } from "@/integrations/supabase/client";

export type ProgressKey =
  | "faq"
  | "letter:claim"
  | "letter:settlement"
  | "letter:demand"
  | "timeline"
  | "documents"
  | "documents:settlement"
  | "documents:demand";


async function getUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

export async function loadProgress<T>(key: ProgressKey): Promise<T | null> {
  const userId = await getUserId();
  if (!userId) return null;
  const { data, error } = await supabase
    .from("user_progress")
    .select("data")
    .eq("user_id", userId)
    .eq("progress_key", key)
    .maybeSingle();
  if (error || !data) return null;
  return (data.data as T) ?? null;
}

export async function saveProgress(key: ProgressKey, data: unknown): Promise<void> {
  const userId = await getUserId();
  if (!userId) return;
  await supabase
    .from("user_progress")
    .upsert(
      { user_id: userId, progress_key: key, data: data as never },
      { onConflict: "user_id,progress_key" },
    );
}

export async function clearProgress(key: ProgressKey): Promise<void> {
  const userId = await getUserId();
  if (!userId) return;
  await supabase
    .from("user_progress")
    .delete()
    .eq("user_id", userId)
    .eq("progress_key", key);
}
