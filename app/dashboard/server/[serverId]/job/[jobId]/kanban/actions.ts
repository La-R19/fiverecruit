
"use server"

import { createClient } from "@/utils/supabase/server"

export async function updateApplicationStatus(appId: string, status: string) {
    const supabase = await createClient()

    const { error, data } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', appId)
        .select()

    if (error) throw new Error("Update failed")
    if (!data || data.length === 0) throw new Error("Permission denied or not found")
}

export async function deleteApplication(appId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', appId)

    if (error) throw new Error("Delete failed")
}
