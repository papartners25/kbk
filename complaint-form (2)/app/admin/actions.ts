"use server"

import { supabase } from "@/lib/supabase"

export async function createComplaintsTable() {
  try {
    // Try to create the table with a simpler structure
    // First, check if the table exists
    const { error: checkError } = await supabase.from("complaints").select("id", { count: "exact", head: true })

    // If the table exists, we don't need to create it
    if (!checkError) {
      return { success: true, message: "Table already exists" }
    }

    // If we get here, the table doesn't exist, so try to create it
    // We'll use a stored function if it exists
    const { error: rpcError } = await supabase.rpc("create_complaints_table")

    if (!rpcError) {
      return { success: true }
    }

    // If the RPC failed, we'll need to guide the user to create the table manually
    console.error("Error creating complaints table via RPC:", rpcError)
    return {
      success: false,
      error: "Could not automatically create the table. Please follow the instructions to create it manually.",
    }
  } catch (error) {
    console.error("Error in createComplaintsTable:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

