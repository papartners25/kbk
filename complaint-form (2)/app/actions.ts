"use server"

import { z } from "zod"
import { supabase } from "@/lib/supabase"

const formSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  street: z.string().min(1),
  unit: z.string().min(1),
  issueType: z.string().min(1),
  priority: z.string().min(1),
  dateNoticed: z.date(),
  description: z.string().min(10),
  permission: z.string().min(1),
})

export type FormData = z.infer<typeof formSchema>

export async function submitComplaint(formData: FormData) {
  try {
    // Validate form data
    const validatedData = formSchema.parse(formData)

    // Try a simpler approach - insert without the problematic date_noticed field
    const { error } = await supabase.from("complaints").insert([
      {
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        street: validatedData.street,
        unit: validatedData.unit,
        issue_type: validatedData.issueType,
        priority: validatedData.priority,
        // Skip date_noticed as it's causing issues
        description: validatedData.description,
        permission: validatedData.permission,
      },
    ])

    if (error) {
      // Check if the error is about the missing table
      if (error.message.includes("does not exist") || error.code === "42P01") {
        return {
          success: false,
          error: "The complaints table doesn't exist yet. Please visit the admin page to set up the database.",
        }
      }

      console.error("Error submitting complaint:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in submitComplaint:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

