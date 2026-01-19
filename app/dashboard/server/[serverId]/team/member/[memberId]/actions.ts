
"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateMember(serverId: string, memberId: string, data: {
    role?: 'admin' | 'manager' | 'viewer',
    job_id?: string | null,
    specific_permissions?: any
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Check ownership
    const { data: server } = await supabase.from('servers').select('owner_id').eq('id', serverId).single()
    if (server?.owner_id !== user.id) throw new Error("Unauthorized")

    const updateData: any = {}
    if (data.role) updateData.role = data.role
    // Allow setting job_id to null explicitly
    if (data.job_id !== undefined) updateData.job_id = data.job_id === 'all' ? null : data.job_id

    // Always update specific_permissions if provided, even if empty object (to clear them)
    // We shouldn't check for truthiness of the object itself if we want to allow {}
    if (data.specific_permissions !== undefined) {
        updateData.specific_permissions = data.specific_permissions
    }

    console.log("Updating member with:", updateData)

    // Use RPC for secure update
    const { data: rpcResult, error } = await supabase.rpc('update_member_permissions', {
        p_member_id: memberId,
        p_role: data.role, // Pass directly assuming form sends it
        p_job_id: data.job_id === 'all' ? null : data.job_id,
        p_specific_permissions: data.specific_permissions
    })

    if (error) {
        console.error("RPC Error:", error)
        if (error.code === '23503') {
            throw new Error("Le poste sélectionné pour la restriction n'existe plus (ou a été supprimé). Veuillez rafraîchir la page.")
        }
        throw new Error("Erreur de sauvegarde : " + error.message)
    }

    if (!rpcResult || !rpcResult.success) {
        console.error("RPC Failed:", rpcResult)
        throw new Error(rpcResult?.error || "Update failed")
    }

    console.log("Member updated successfully via RPC")
    revalidatePath(`/dashboard/server/${serverId}/team`)
}
