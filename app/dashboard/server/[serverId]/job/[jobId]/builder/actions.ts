
"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateJobSchema(jobId: string, schema: any) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('jobs')
        .update({ form_schema: schema })
        .eq('id', jobId)

    if (error) {
        throw new Error('Failed to update schema')
    }

    revalidatePath(`/dashboard/server`) // Broad revalidation or specific
}
