import type { PostgrestError } from "@supabase/supabase-js"

export function handleSupabaseError(error: PostgrestError | null, context: string): void {
  if (error) {
    console.error(`Error in ${context}:`, error.message)
    console.error("Details:", error.details)
    console.error("Hint:", error.hint)

    // Could also send this to an error tracking service like Sentry
  }
}
