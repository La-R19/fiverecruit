
"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { checkPermission } from "@/utils/permissions"

export async function updateRolePermissions(serverId: string, permissions: any) {
    const supabase = await createClient()

    // Security Check: Only Owner or Admin with 'can_manage_team' (if we allowed admins to edit perms)
    // For safety, let's say only Owner can change permissions of roles for now.
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: server } = await supabase.from('servers').select('owner_id').eq('id', serverId).single();
    if (server?.owner_id !== user.id) {
        throw new Error("Only owner can manage permissions")
    }

    const { error } = await supabase
        .from('servers')
        .update({ role_permissions: { manager: permissions } })
        .eq('id', serverId)

    if (error) {
        throw new Error("Failed to update permissions")
    }

    revalidatePath(`/dashboard/server/${serverId}/settings/roles`)
}
