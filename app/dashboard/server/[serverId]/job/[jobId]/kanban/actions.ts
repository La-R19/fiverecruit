
"use server"

import { createClient } from "@/utils/supabase/server"

export async function updateApplicationStatus(appId: string, status: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', appId)

    if (error) throw new Error("Update failed")
}

export async function deleteApplication(appId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', appId)

    if (error) throw new Error("Delete failed")
}
